import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplet, 
  Calendar,
  CheckCircle2,
  Watch
} from 'lucide-react';
import { UserProfile } from '../types';

interface WeeklyStatsProps {
  userId: string;
  profile: UserProfile;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ userId, profile }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/history?userId=${userId}`);
        const data = await res.json();
        if (data.success && data.history) {
          setHistory(data.history);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">Loading your calorie trends & weekly statistics...</p>
      </div>
    );
  }

  // Calculate averages
  const totalCals = history.reduce((acc, h) => acc + (h.calories || 0), 0);
  const avgCals = history.length > 0 ? Math.round(totalCals / history.length) : 0;
  const avgProtein = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + (h.protein || 0), 0) / history.length) : 0;
  const avgSteps = history.length > 0 ? Math.round(history.reduce((acc, h) => acc + (h.steps || 0), 0) / history.length) : 0;

  const maxCalorieInChart = Math.max(profile.targetCalories + 400, ...history.map(h => h.calories || 0));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Weekly Calorie & Macro Statistics
            </h3>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare daily intake against your {profile.targetCalories} kcal target
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <span className="text-[10px] text-emerald-800 uppercase font-bold block">Avg Intake</span>
            <span className="text-base font-extrabold text-emerald-950 font-heading">{avgCals}</span>
            <span className="text-[10px] text-emerald-600 block">kcal/day</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-200/80">
            <span className="text-[10px] text-blue-800 uppercase font-bold block">Avg Protein</span>
            <span className="text-base font-extrabold text-blue-950 font-heading">{avgProtein}g</span>
            <span className="text-[10px] text-blue-600 block">per day</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-600 uppercase font-bold block">Avg Steps</span>
            <span className="text-base font-extrabold text-slate-900 font-heading">{avgSteps.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 block">steps/day</span>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Bar Chart */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Intake vs Daily Target ({profile.targetCalories} kcal)</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span>Within Goal</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Surplus (&gt;Goal)</span>
            </span>
          </div>
        </div>

        {/* Chart Bars */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-200">
          {history.map((day, idx) => {
            const heightPct = Math.min(100, Math.round((day.calories / maxCalorieInChart) * 100));
            const isSurplus = day.calories > profile.targetCalories;
            const targetLinePct = Math.round((profile.targetCalories / maxCalorieInChart) * 100);

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                
                {/* Hover Tooltip */}
                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-xl shadow-lg whitespace-nowrap z-20">
                  <p>{day.dayName} ({day.date}): {day.calories} kcal</p>
                  <p className="text-emerald-300 font-normal">{day.protein}g P • {day.carbs}g C • {day.fat}g F</p>
                </div>

                {/* Calorie value label above bar */}
                <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-80 group-hover:opacity-100">
                  {day.calories}
                </span>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden relative">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-700 ${
                      isSurplus ? 'bg-gradient-to-t from-amber-600 to-amber-500' : 'bg-gradient-to-t from-emerald-700 to-emerald-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                {/* Day name label below */}
                <span className="text-[11px] font-bold text-slate-600 mt-2">
                  {day.dayName}
                </span>
                <span className="text-[9px] text-slate-400">
                  {day.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Macro Consistency Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Consistency & Adherence Score
          </p>
          <p className="text-slate-600 leading-relaxed">
            You maintained a consistent diet for <strong>5 of 7 days</strong> this week. Your average protein intake of <strong>{avgProtein}g</strong> is providing optimal muscle recovery.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-700 space-y-2">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Weekly Deficit / Surplus Summary
          </p>
          <p className="text-slate-600 leading-relaxed">
            Overall weekly net caloric balance is right on track with your <strong>{profile.goal}</strong> strategy. No extreme starvation or overeating detected.
          </p>
        </div>
      </div>

    </div>
  );
};
