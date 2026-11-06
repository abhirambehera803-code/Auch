import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { UserProfile, DayLog, NutritionSummary } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  dayLog: DayLog;
  summary: NutritionSummary;
  currentDate: string;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  profile,
  dayLog,
  summary,
  currentDate,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataToExport = {
      app: 'CalorieMate',
      exportDate: new Date().toISOString(),
      user: profile,
      dateTracked: currentDate,
      summary,
      meals: dayLog.meals,
      waterGlasses: dayLog.waterGlasses,
      wearable: dayLog.wearable,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CalorieMate_Report_${profile.name}_${currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shrink-0 relative flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-white">
              Export Nutrition & Calorie Report
            </h3>
            <p className="text-xs text-emerald-200/90 mt-0.5">
              Generate a printable health summary or download structured JSON records
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Report Preview Body (Printable) */}
        <div id="printable-report" className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs">
          
          {/* Brand & Patient info card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-extrabold text-emerald-950 font-heading">
                CalorieMate Daily Nutrition Report Card
              </h2>
              <p className="text-slate-500 text-[11px]">Tracked Date: {formattedDate}</p>
            </div>
            <div className="text-right sm:text-right text-[11px] text-slate-600">
              <p className="font-bold text-slate-900">{profile.name} ({profile.age}y, {profile.gender})</p>
              <p>Height: {profile.heightCm} cm • Weight: {profile.weightKg} kg</p>
              <p className="capitalize">Goal: {profile.goal} • {profile.dietaryPreference}</p>
            </div>
          </div>

          {/* Calorie & Macro Target vs Actual Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Calories</span>
              <span className="text-lg font-bold text-emerald-950 font-heading">{summary.totalCalories}</span>
              <span className="text-[10px] text-emerald-600 block">of {summary.targetCalories} kcal</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-800 block">Protein Intake</span>
              <span className="text-lg font-bold text-blue-950 font-heading">{summary.totalProtein}g</span>
              <span className="text-[10px] text-blue-600 block">of {summary.targetProtein}g goal</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Carbohydrates</span>
              <span className="text-lg font-bold text-amber-950 font-heading">{summary.totalCarbs}g</span>
              <span className="text-[10px] text-amber-600 block">of {summary.targetCarbs}g goal</span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] uppercase font-bold text-rose-800 block">Total Fats</span>
              <span className="text-lg font-bold text-rose-950 font-heading">{summary.totalFat}g</span>
              <span className="text-[10px] text-rose-600 block">of {summary.targetFat}g goal</span>
            </div>
          </div>

          {/* Meals Breakdown Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Detailed Meal Items Logged
            </h4>
            
            {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => {
              const items = dayLog.meals[mealType] || [];
              const totals = summary.mealTotals[mealType];
              return (
                <div key={mealType} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100/80 px-3 py-1.5 flex items-center justify-between font-bold text-slate-700 capitalize">
                    <span>{mealType} ({items.length} items)</span>
                    <span>{totals?.calories || 0} kcal</span>
                  </div>
                  {items.length === 0 ? (
                    <div className="p-2 text-center text-slate-400 italic">No food recorded</div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {items.map((item) => (
                        <div key={item.id} className="px-3 py-1.5 flex items-center justify-between text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            <span className="text-slate-400 ml-1.5">({item.quantity} {item.unit})</span>
                            {item.description && <span className="text-slate-400 ml-1 italic">- {item.description}</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{item.protein}g P</span>
                            <span>•</span>
                            <span className="font-bold text-slate-900">{item.calories} kcal</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Water & Wearable info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
            <span>Water Hydration: <strong>{dayLog.waterGlasses * 250} ml</strong> ({dayLog.waterGlasses} glasses)</span>
            <span>Wearables: <strong>{dayLog.wearable?.steps || 0} steps</strong> (-{dayLog.wearable?.activeCaloriesBurned || 0} kcal)</span>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={handleDownloadJSON}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
