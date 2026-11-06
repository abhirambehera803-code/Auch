import { UserProfile, MealType, FoodItem, NutritionSummary, ActivityLevel, FitnessGoal } from '../types';

/**
 * Calculates BMR using the Mifflin-St Jeor Equation
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female' | 'other'): number {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  // Default to male / standard formula
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

/**
 * Activity Multipliers
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,       // little or no exercise
  light: 1.375,         // exercise 1-3 times/week
  moderate: 1.55,       // exercise 4-5 times/week
  very: 1.725,          // intense exercise 6-7 times/week
  extra: 1.9,           // very hard exercise or physical job
};

/**
 * Calculates recommended daily targets based on profile
 */
export function calculateRecommendedTargets(profile: Partial<UserProfile>): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterGlasses: number;
} {
  const weight = profile.weightKg || 70;
  const height = profile.heightCm || 172;
  const age = profile.age || 25;
  const gender = profile.gender || 'male';
  const activity = profile.activityLevel || 'moderate';
  const goal: FitnessGoal = profile.goal || 'maintain';

  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity] || 1.55));

  let targetCalories = tdee;
  if (goal === 'loss') {
    // Safe healthy deficit (approx. 400-500 kcal, minimum 1400 kcal)
    targetCalories = Math.max(1400, tdee - 400);
  } else if (goal === 'gain') {
    // Safe lean surplus (approx. 300-400 kcal)
    targetCalories = tdee + 350;
  }

  // Protein targets: 1.6g to 2.2g per kg depending on goal
  let proteinFactor = 1.8;
  if (goal === 'loss') proteinFactor = 2.0; // Higher protein preserves muscle in a deficit
  if (goal === 'gain') proteinFactor = 2.0;
  if (goal === 'maintain') proteinFactor = 1.7;

  const targetProtein = Math.round(weight * proteinFactor);
  
  // Fat target: ~25-28% of total calories (9 kcal/g)
  const targetFat = Math.round((targetCalories * 0.25) / 9);

  // Carbs target: remaining calories (4 kcal/g)
  const remainingCalories = targetCalories - (targetProtein * 4 + targetFat * 9);
  const targetCarbs = Math.max(80, Math.round(remainingCalories / 4));

  // Water goal: ~35ml per kg of weight -> in 250ml glasses
  const waterGlasses = Math.min(16, Math.max(8, Math.round((weight * 35) / 250)));

  return {
    calories: targetCalories,
    protein: targetProtein,
    carbs: targetCarbs,
    fat: targetFat,
    waterGlasses,
  };
}

/**
 * Calculates full daily nutrition summary
 */
export function calculateDailySummary(
  meals: Record<MealType, FoodItem[]>,
  profile: UserProfile,
  activeBurned: number = 0
): NutritionSummary {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  const mealTotals: Record<MealType, { calories: number; protein: number; carbs: number; fat: number; itemCount: number }> = {
    breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0, itemCount: 0 },
    lunch: { calories: 0, protein: 0, carbs: 0, fat: 0, itemCount: 0 },
    dinner: { calories: 0, protein: 0, carbs: 0, fat: 0, itemCount: 0 },
    snacks: { calories: 0, protein: 0, carbs: 0, fat: 0, itemCount: 0 },
  };

  const highProteinMeals: MealType[] = [];
  const lowProteinMeals: MealType[] = [];

  const mealKeys: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];

  for (const m of mealKeys) {
    const items = meals[m] || [];
    let mCals = 0;
    let mProt = 0;
    let mCarbs = 0;
    let mFat = 0;

    for (const item of items) {
      mCals += item.calories || 0;
      mProt += item.protein || 0;
      mCarbs += item.carbs || 0;
      mFat += item.fat || 0;
    }

    mealTotals[m] = {
      calories: Math.round(mCals),
      protein: Math.round(mProt * 10) / 10,
      carbs: Math.round(mCarbs * 10) / 10,
      fat: Math.round(mFat * 10) / 10,
      itemCount: items.length,
    };

    totalCalories += mCals;
    totalProtein += mProt;
    totalCarbs += mCarbs;
    totalFat += mFat;

    // High protein criterion: >= 20g protein in a meal, or >25% of calories from protein
    if (items.length > 0) {
      if (mProt >= 20 || (mCals > 150 && (mProt * 4) / mCals >= 0.25)) {
        highProteinMeals.push(m);
      } else if (mCals > 150 && mProt < 10) {
        lowProteinMeals.push(m);
      }
    }
  }

  const targetCalories = profile.targetCalories || 2000;
  const netCalories = Math.max(0, totalCalories - activeBurned);
  const caloriesRemaining = targetCalories - totalCalories;
  const percentGoalReached = Math.min(200, Math.round((totalCalories / targetCalories) * 100));

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    targetCalories,
    targetProtein: profile.targetProtein || 120,
    targetCarbs: profile.targetCarbs || 220,
    targetFat: profile.targetFat || 55,
    netCalories: Math.round(netCalories),
    caloriesRemaining: Math.round(caloriesRemaining),
    percentGoalReached,
    mealTotals,
    highProteinMeals,
    lowProteinMeals,
  };
}
