import React from 'react';
import { 
  Sun, 
  Utensils, 
  Moon, 
  Coffee, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Check, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { MealType, FoodItem, NutritionSummary } from '../types';

interface MealSectionProps {
  meals: Record<MealType, FoodItem[]>;
  summary: NutritionSummary;
  onOpenAddModal: (mealType: MealType) => void;
  onOpenQuickAIModal: (mealType?: MealType) => void;
  onEditItem: (mealType: MealType, item: FoodItem) => void;
  onDeleteItem: (mealType: MealType, itemId: string) => void;
}

interface MealConfig {
  type: MealType;
  title: string;
  timeRange: string;
  recommendedPct: string;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
  borderColor: string;
}

export const MealSection: React.FC<MealSectionProps> = ({
  meals,
  summary,
  onOpenAddModal,
  onOpenQuickAIModal,
  onEditItem,
  onDeleteItem,
}) => {
  const mealConfigs: MealConfig[] = [
    {
      type: 'breakfast',
      title: 'Breakfast',
      timeRange: '07:00 AM - 10:30 AM',
      recommendedPct: '20-25%',
      icon: <Sun className="w-5 h-5 text-amber-600" />,
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-800',
      borderColor: 'border-amber-200/60',
    },
    {
      type: 'lunch',
      title: 'Lunch',
      timeRange: '12:30 PM - 03:00 PM',
      recommendedPct: '35-40%',
      icon: <Utensils className="w-5 h-5 text-emerald-600" />,
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-800',
      borderColor: 'border-emerald-200/60',
    },
    {
      type: 'dinner',
      title: 'Dinner',
      timeRange: '07:00 PM - 09:30 PM',
      recommendedPct: '25-30%',
      icon: <Moon className="w-5 h-5 text-indigo-600" />,
      accentBg: 'bg-indigo-50',
      accentText: 'text-indigo-800',
      borderColor: 'border-indigo-200/60',
    },
    {
      type: 'snacks',
      title: 'Snacks & Evening',
      timeRange: 'Anytime / Tea time',
      recommendedPct: '10-15%',
      icon: <Coffee className="w-5 h-5 text-orange-600" />,
      accentBg: 'bg-orange-50',
      accentText: 'text-orange-800',
      borderColor: 'border-orange-200/60',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900">
            Today's Meals & Logged Foods
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Add multiple foods with exact quantities, portions, or AI natural text
          </p>
        </div>

        <button
          onClick={() => onOpenQuickAIModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-semibold text-xs shadow-md shadow-emerald-900/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Quick Natural AI Food Logger</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mealConfigs.map((config) => {
          const items = meals[config.type] || [];
          const mealTotal = summary.mealTotals[config.type] || { calories: 0, protein: 0, carbs: 0, fat: 0, itemCount: 0 };
          const isHighProtein = summary.highProteinMeals.includes(config.type);
          const isLowProtein = summary.lowProteinMeals.includes(config.type);

          return (
            <div
              key={config.type}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-5 pb-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${config.accentBg} flex items-center justify-center border ${config.borderColor}`}>
                      {config.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base font-heading">
                          {config.title}
                        </h3>
                        {/* High/Low protein indicator badge */}
                        {isHighProtein && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                            High Protein
                          </span>
                        )}
                        {isLowProtein && items.length > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Low Protein
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{config.timeRange}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Total Calories Badge */}
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-slate-900 font-heading">
                      {mealTotal.calories}
                    </span>
                    <span className="text-xs text-slate-500 font-medium ml-1">kcal</span>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-blue-600 font-semibold">{mealTotal.protein}g P</span>
                      <span>•</span>
                      <span className="text-amber-600">{mealTotal.carbs}g C</span>
                      <span>•</span>
                      <span className="text-rose-600">{mealTotal.fat}g F</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-5 flex-1 divide-y divide-slate-100">
                {items.length === 0 ? (
                  <div className="py-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                      <Utensils className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No food logged yet for {config.title}</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                      Add rotis, rice, dal, eggs, snacks or enter your custom dish
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800 truncate">
                              {item.name}
                            </span>
                            
                            {/* Verification Badge */}
                            {item.verifiedBy === 'database' ? (
                              <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200" title="Verified from Nutritional Food Database">
                                Verified
                              </span>
                            ) : item.verifiedBy === 'user' ? (
                              <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded" title="Manually edited by user">
                                Custom
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded border border-purple-200" title="AI Calculated Estimate">
                                AI Estimate
                              </span>
                            )}

                            {item.loggedAt && (
                              <span className="text-[10px] text-slate-400">
                                {item.loggedAt}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-semibold text-slate-700">
                              {item.quantity} {item.unit}
                            </span>
                            {item.description && (
                              <span className="truncate max-w-[150px] sm:max-w-[200px] text-slate-400 italic">
                                ({item.description})
                              </span>
                            )}
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-600 font-medium">{item.protein}g P</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-amber-600 font-medium">{item.carbs}g C</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-rose-600 font-medium">{item.fat}g F</span>
                          </div>
                        </div>

                        {/* Calories & Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold text-slate-900 font-heading">
                            {item.calories} <span className="text-[11px] font-normal text-slate-400">kcal</span>
                          </span>

                          <button
                            onClick={() => onEditItem(config.type, item)}
                            title="Edit Quantity / Nutrients"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition opacity-80 sm:opacity-0 group-hover:opacity-100"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteItem(config.type, item.id)}
                            title="Delete Item"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition opacity-80 sm:opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer: Add Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onOpenAddModal(config.type)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200/90 hover:border-emerald-300 font-semibold text-xs shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add Food Item</span>
                </button>

                <button
                  onClick={() => onOpenQuickAIModal(config.type)}
                  title="Quick AI Voice / Text Log for this meal"
                  className="py-2 px-3 rounded-xl bg-emerald-100/60 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">AI Log</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
