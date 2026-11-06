import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Check, 
  Calculator, 
  HeartHandshake, 
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile, ActivityLevel, FitnessGoal, DietaryPreference, Gender } from '../types';
import { calculateRecommendedTargets, calculateBMR, ACTIVITY_MULTIPLIERS } from '../utils/calculator';

interface UserProfileModalProps {
  isOpen: boolean;
  profile: UserProfile;
  onClose: () => void;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState<Gender>(profile.gender || 'male');
  const [heightCm, setHeightCm] = useState(profile.heightCm);
  const [weightKg, setWeightKg] = useState(profile.weightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [goal, setGoal] = useState<FitnessGoal>(profile.goal);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(profile.dietaryPreference);
  
  // Targets
  const [targetCalories, setTargetCalories] = useState(profile.targetCalories);
  const [targetProtein, setTargetProtein] = useState(profile.targetProtein);
  const [targetCarbs, setTargetCarbs] = useState(profile.targetCarbs);
  const [targetFat, setTargetFat] = useState(profile.targetFat);
  const [waterGoalGlasses, setWaterGoalGlasses] = useState(profile.waterGoalGlasses || 10);

  // Recalculate targets dynamically when metrics change
  const handleRecalculateAuto = () => {
    const rec = calculateRecommendedTargets({
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      goal,
    });
    setTargetCalories(rec.calories);
    setTargetProtein(rec.protein);
    setTargetCarbs(rec.carbs);
    setTargetFat(rec.fat);
    setWaterGoalGlasses(rec.waterGlasses);
  };

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setAge(profile.age);
      setGender(profile.gender || 'male');
      setHeightCm(profile.heightCm);
      setWeightKg(profile.weightKg);
      setActivityLevel(profile.activityLevel);
      setGoal(profile.goal);
      setDietaryPreference(profile.dietaryPreference);
      setTargetCalories(profile.targetCalories);
      setTargetProtein(profile.targetProtein);
      setTargetCarbs(profile.targetCarbs);
      setTargetFat(profile.targetFat);
      setWaterGoalGlasses(profile.waterGoalGlasses || 10);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const currentBMR = calculateBMR(weightKg, heightCm, age, gender);
  const currentTDEE = Math.round(currentBMR * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Friend',
      age: Number(age) || 25,
      gender,
      heightCm: Number(heightCm) || 170,
      weightKg: Number(weightKg) || 70,
      activityLevel,
      goal,
      dietaryPreference,
      targetCalories: Number(targetCalories) || 2000,
      targetProtein: Number(targetProtein) || 120,
      targetCarbs: Number(targetCarbs) || 220,
      targetFat: Number(targetFat) || 55,
      waterGoalGlasses: Number(waterGoalGlasses) || 10,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
              Personalized Nutrition Formula
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            User Profile & Calorie Goals
          </h3>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            CalorieMate avoids extreme deficits and uses Mifflin-St Jeor clinical equations for safe, sustainable results.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Personal Stats */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Physical Metrics & Demographics
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="12"
                  max="100"
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biological Gender
                </label>
                <select
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Standard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  step="0.5"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 70)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dietary Preference
                </label>
                <select
                  value={dietaryPreference}
                  onChange={(e: any) => setDietaryPreference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fitness Goal
                </label>
                <select
                  value={goal}
                  onChange={(e: any) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  <option value="maintain">Maintain Weight</option>
                  <option value="loss">Healthy Weight Loss</option>
                  <option value="gain">Lean Muscle Gain</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Daily Physical Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e: any) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="sedentary">Sedentary (Desk job, little or no exercise)</option>
                <option value="light">Lightly Active (Walking, light workouts 1-3 days/week)</option>
                <option value="moderate">Moderately Active (Gym or sports 3-5 days/week)</option>
                <option value="very">Very Active (Intense training 6-7 days/week)</option>
                <option value="extra">Extra Active (Athlete or heavy manual physical labor)</option>
              </select>
            </div>
          </div>

          {/* Clinical Calculation Preview Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-emerald-950 space-y-0.5">
              <p className="font-bold">Calculated Basal Metabolic Rate (BMR): {currentBMR} kcal</p>
              <p className="text-emerald-800">
                Total Daily Energy Expenditure (TDEE): <strong>{currentTDEE} kcal</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={handleRecalculateAuto}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Recalculate Macros</span>
            </button>
          </div>

          {/* Daily Goals / Targets */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Daily Calorie & Macro Target Allocation
              </h4>
              <span className="text-[11px] text-slate-500">Editable targets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Daily Goal</span>
                <input
                  type="number"
                  min="1200"
                  max="5000"
                  required
                  value={targetCalories}
                  onChange={(e) => setTargetCalories(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-emerald-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">kcal/day</span>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold uppercase text-blue-800 block">Target Protein</span>
                <input
                  type="number"
                  min="30"
                  max="350"
                  required
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-blue-400 focus:outline-none"
                />
                <span className="text-[10px] text-blue-600">grams</span>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Target Carbs</span>
                <input
                  type="number"
                  min="30"
                  max="600"
                  required
                  value={targetCarbs}
                  onChange={(e) => setTargetCarbs(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-amber-600">grams</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold uppercase text-rose-800 block">Target Fat</span>
                <input
                  type="number"
                  min="20"
                  max="200"
                  required
                  value={targetFat}
                  onChange={(e) => setTargetFat(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-rose-400 focus:outline-none"
                />
                <span className="text-[10px] text-rose-600">grams</span>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase text-cyan-800 block">Water Goal</span>
                <input
                  type="number"
                  min="4"
                  max="20"
                  required
                  value={waterGoalGlasses}
                  onChange={(e) => setWaterGoalGlasses(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-cyan-600">glasses (250ml)</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Profile & Goals
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
