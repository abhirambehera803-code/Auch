import React from 'react';
import { 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplet, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle,
  Watch,
  Sparkles,
  Zap
} from 'lucide-react';
import { NutritionSummary, WearableDeviceData, UserProfile } from '../types';

interface DashboardSummaryProps {
  summary: NutritionSummary;
  wearable: WearableDeviceData;
  profile: UserProfile;
  onOpenQuickAI: () => void;
  onOpenWearableSync: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  summary,
  wearable,
  profile,
  onOpenQuickAI,
  onOpenWearableSync,
}) => {
  const {
    totalCalories,
    targetCalories,
    caloriesRemaining,
    percentGoalReached,
    totalProtein,
    targetProtein,
    totalCarbs,
    targetCarbs,
    totalFat,
    targetFat,
    highProteinMeals,
    lowProteinMeals,
  } = summary;

  // Calorie SVG circle calculations
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, percentGoalReached) / 100) * circumference;

  const isOverGoal = caloriesRemaining < 0;

  // Macro percentages
  const proteinPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / targetFat) * 100));

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Dark Green Theme Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-xl shadow-emerald-950/20 border border-emerald-800/40 p-6 sm:p-8">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Column: Greeting & Status */}
          <div className="flex-1 text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60 text-emerald-200 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Goal: {profile.goal === 'loss' ? 'Healthy Fat Loss' : profile.goal === 'gain' ? 'Lean Muscle Gain' : 'Weight Maintenance'}</span>
              <span className="text-emerald-400">•</span>
              <span className="capitalize">{profile.dietaryPreference}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-heading text-white">
              Daily Calorie & Macro Dashboard
            </h1>

            <p className="text-emerald-200/80 text-sm max-w-xl">
              Track your authentic meals, auto-calculate nutrients, and hit your macro targets with AI assistance.
            </p>

            {/* Wearable Net Calorie integration pill */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <button
                onClick={onOpenWearableSync}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 text-xs text-emerald-100 border border-emerald-700/50 transition cursor-pointer"
              >
                <Watch className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {wearable.connected
                    ? `${wearable.deviceName}: ${wearable.steps.toLocaleString()} steps • -${wearable.activeCaloriesBurned} kcal burned`
                    : 'Connect Apple Watch / Fitbit'}
                </span>
                <span className="text-emerald-400 text-[10px] font-semibold underline">Sync</span>
              </button>

              <button
                onClick={onOpenQuickAI}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-200 text-xs font-semibold border border-amber-400/30 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Quick AI Food Log</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Circular Progress Ring & Numbers */}
          <div className="flex items-center gap-6 sm:gap-8 bg-emerald-900/40 p-4 sm:p-5 rounded-3xl border border-emerald-700/40 backdrop-blur-sm">
            
            {/* SVG Ring */}
            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 sm:w-40 sm:h-40 transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="11"
                  fill="transparent"
                  className="text-emerald-950/80"
                />
                {/* Active Progress */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#calorie-gradient)"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="calorie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Inner Center Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <Flame className="w-5 h-5 text-emerald-400 mb-0.5 animate-pulse-subtle" />
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
                  {totalCalories}
                </span>
                <span className="text-[11px] text-emerald-300 font-medium">
                  of {targetCalories} kcal
                </span>
              </div>
            </div>

            {/* Calorie Stats Breakdown */}
            <div className="space-y-3 min-w-[130px]">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-semibold">
                  {isOverGoal ? 'Calorie Surplus' : 'Remaining Budget'}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className={`text-2xl font-bold font-heading ${isOverGoal ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {Math.abs(caloriesRemaining)}
                  </span>
                  <span className="text-xs text-emerald-200">kcal</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] mt-0.5 text-emerald-300/90 font-medium">
                  {isOverGoal ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{percentGoalReached}% consumed</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{100 - percentGoalReached}% remaining</span>
                    </>
                  )}
                </div>
              </div>

              {wearable.activeCaloriesBurned > 0 && (
                <div className="pt-2 border-t border-emerald-800/80">
                  <p className="text-[10px] uppercase text-emerald-300/70 font-semibold">
                    Net Calories (Burn Adjusted)
                  </p>
                  <p className="text-sm font-bold text-white">
                    {summary.netCalories} <span className="text-xs text-emerald-300 font-normal">kcal</span>
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 3 Macro Cards: Protein, Carbs, Fats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Protein Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Protein</h3>
                <p className="text-xs text-slate-500">Muscle recovery & satiety</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              proteinPercent >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'
            }`}>
              {proteinPercent}%
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-heading">{totalProtein}</span>
              <span className="text-xs text-slate-500">/ {targetProtein} g</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {Math.max(0, Math.round(targetProtein - totalProtein))}g left
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>

          {/* High/Low protein status */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>High protein meals:</span>
            <span className="font-semibold text-emerald-700">
              {highProteinMeals.length > 0 ? highProteinMeals.map(m => m.charAt(0).toUpperCase() + m.slice(1)).join(', ') : 'None yet'}
            </span>
          </div>
        </div>

        {/* Carbohydrates Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Wheat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Carbohydrates</h3>
                <p className="text-xs text-slate-500">Daily energy & endurance</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              carbsPercent > 100 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {carbsPercent}%
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-heading">{totalCarbs}</span>
              <span className="text-xs text-slate-500">/ {targetCarbs} g</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {Math.max(0, Math.round(targetCarbs - totalCarbs))}g left
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Energy share:</span>
            <span className="font-semibold text-slate-800">
              {totalCalories > 0 ? Math.round(((totalCarbs * 4) / totalCalories) * 100) : 0}% of kcal
            </span>
          </div>
        </div>

        {/* Fats Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Fats</h3>
                <p className="text-xs text-slate-500">Hormones & nutrient absorption</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              fatPercent > 100 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {fatPercent}%
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-heading">{totalFat}</span>
              <span className="text-xs text-slate-500">/ {targetFat} g</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {Math.max(0, Math.round(targetFat - totalFat))}g left
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${fatPercent}%` }}
            />
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Essential lipids:</span>
            <span className="font-semibold text-slate-800">
              {totalCalories > 0 ? Math.round(((totalFat * 9) / totalCalories) * 100) : 0}% of kcal
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
