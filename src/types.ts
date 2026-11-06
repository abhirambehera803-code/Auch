export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodUnit = 'g' | 'ml' | 'piece' | 'bowl' | 'cup' | 'plate' | 'roti' | 'tbsp';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: FoodUnit;
  description?: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;   // in grams
  isEstimated?: boolean; // true if estimated by AI/formula
  verifiedBy?: 'database' | 'ai' | 'user';
  suggestedAlternative?: string;
  loggedAt?: string;
}

export interface MealRecord {
  id: MealType;
  title: string;
  items: FoodItem[];
  targetCalories?: number;
}

export type FitnessGoal = 'maintain' | 'loss' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
export type DietaryPreference = 'veg' | 'non-veg' | 'vegan' | 'eggetarian';
export type Gender = 'male' | 'female' | 'other';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: FitnessGoal;
  dietaryPreference: DietaryPreference;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  waterGoalGlasses: number; // 250ml per glass
}

export interface WearableDeviceData {
  connected: boolean;
  deviceName: 'Apple Health' | 'Fitbit / Google Health' | 'Garmin' | 'Samsung Health' | 'None';
  lastSyncedAt?: string;
  steps: number;
  activeCaloriesBurned: number;
  restingHeartRate: number;
  activeMinutes: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  userId: string;
  meals: Record<MealType, FoodItem[]>;
  waterGlasses: number;
  wearable: WearableDeviceData;
  aiNotes?: string;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  netCalories: number; // totalCalories - activeCaloriesBurned
  caloriesRemaining: number;
  percentGoalReached: number;
  mealTotals: Record<MealType, { calories: number; protein: number; carbs: number; fat: number; itemCount: number }>;
  highProteinMeals: MealType[];
  lowProteinMeals: MealType[];
}

export interface FoodAlternative {
  originalFood: string;
  betterOption: string;
  caloriesSaved: number;
  proteinBoost: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface FriendUser {
  id: string;
  name: string;
  email?: string;
  pin: string;
  avatarColor: string;
  profile: UserProfile;
}
