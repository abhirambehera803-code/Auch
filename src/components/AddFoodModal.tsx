import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Plus, 
  Check, 
  Calculator, 
  Utensils, 
  HelpCircle,
  Loader2,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { MealType, FoodItem, FoodUnit } from '../types';
import { 
  INDIAN_FOOD_DATABASE, 
  FoodDatabaseEntry, 
  searchFoodDatabase, 
  calculateEntryNutrition 
} from '../data/indianFoods';

interface AddFoodModalProps {
  isOpen: boolean;
  mealType: MealType;
  onClose: () => void;
  onAddFood: (mealType: MealType, item: Omit<FoodItem, 'id'>) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  mealType,
  onClose,
  onAddFood,
}) => {
  const [activeTab, setActiveTab] = useState<'database' | 'quick_ai' | 'custom'>('database');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<FoodDatabaseEntry | null>(null);

  // Form Fields
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<FoodUnit>('piece');
  const [description, setDescription] = useState('');
  
  // Calculated Nutrients
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);
  const [isEstimated, setIsEstimated] = useState<boolean>(false);
  const [verifiedBy, setVerifiedBy] = useState<'database' | 'ai' | 'user'>('database');

  // AI Natural Language input
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Quick Preset Categories
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    if (isOpen) {
      // Reset form
      setSearchQuery('');
      setAiText('');
      setAiError('');
      setSelectedEntry(null);
      setFoodName('');
      setQuantity(1);
      setUnit('piece');
      setDescription('');
      setCalories(0);
      setProtein(0);
      setCarbs(0);
      setFat(0);
      setFiber(0);
      setIsEstimated(false);
      setVerifiedBy('database');
    }
  }, [isOpen]);

  // Recalculate when selectedEntry, quantity, or unit changes
  useEffect(() => {
    if (selectedEntry) {
      const calculated = calculateEntryNutrition(selectedEntry, Number(quantity) || 1, unit);
      setCalories(calculated.calories);
      setProtein(calculated.protein);
      setCarbs(calculated.carbs);
      setFat(calculated.fat);
      setFiber(calculated.fiber);
      setIsEstimated(false);
      setVerifiedBy('database');
    }
  }, [selectedEntry, quantity, unit]);

  if (!isOpen) return null;

  const handleSelectEntry = (entry: FoodDatabaseEntry) => {
    setSelectedEntry(entry);
    setFoodName(entry.name);
    setUnit(entry.defaultUnit);
    setQuantity(entry.defaultServingSize);
    setDescription(entry.notes || '');

    const initial = calculateEntryNutrition(entry, entry.defaultServingSize, entry.defaultUnit);
    setCalories(initial.calories);
    setProtein(initial.protein);
    setCarbs(initial.carbs);
    setFat(initial.fat);
    setFiber(initial.fiber);
    setVerifiedBy('database');
    setIsEstimated(false);
  };

  const handleManualNutritionChange = () => {
    setVerifiedBy('user');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    onAddFood(mealType, {
      name: foodName.trim(),
      quantity: Number(quantity) || 1,
      unit,
      description: description.trim() || undefined,
      calories: Math.max(0, Number(calories) || 0),
      protein: Math.max(0, Number(protein) || 0),
      carbs: Math.max(0, Number(carbs) || 0),
      fat: Math.max(0, Number(fat) || 0),
      fiber: Math.max(0, Number(fiber) || 0),
      isEstimated,
      verifiedBy,
      suggestedAlternative: selectedEntry?.healthierAlternative,
    });

    onClose();
  };

  // Quick AI Natural Language Parser Call
  const handleAiParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiText.trim()) return;

    setAiLoading(true);
    setAiError('');

    try {
      const res = await fetch('/api/meals/quick-ai-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiText, mealType }),
      });

      const data = await res.json();
      if (data.success && data.items?.length > 0) {
        // Add all parsed items
        for (const item of data.items) {
          onAddFood(mealType, item);
        }
        onClose();
      } else {
        setAiError(data.error || 'Could not parse meal. Try describing items separately.');
      }
    } catch (err: any) {
      setAiError('Network error connecting to CalorieMate AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const filteredDatabase = searchQuery
    ? searchFoodDatabase(searchQuery)
    : categoryFilter === 'All'
    ? INDIAN_FOOD_DATABASE
    : INDIAN_FOOD_DATABASE.filter(f => f.category === categoryFilter);

  const categories = ['All', 'Grains & Breads', 'Lentils & Dals', 'Dairy & Eggs', 'Meat & Poultry', 'Breakfast & Snacks', 'Fruits & Veg', 'Beverages'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
              Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Log Food Item & Calculate Calories
          </h3>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            Choose from Indian food database or type natural meal details for instant calculation.
          </p>

          {/* Mode Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              Food Database
            </button>
            <button
              onClick={() => setActiveTab('quick_ai')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'quick_ai'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Natural Text
            </button>
            <button
              onClick={() => {
                setActiveTab('custom');
                setSelectedEntry(null);
                setVerifiedBy('user');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-900/70 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Custom Dish
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {activeTab === 'quick_ai' ? (
            /* AI Natural Text Mode */
            <form onSubmit={handleAiParse} className="space-y-4">
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Natural AI Food Recognition (Gemini 3.8 Flash)
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  Describe what you had like speaking to a friend. For example: <span className="font-semibold italic">"2 rotis with 1 bowl moong dal, 100g grilled paneer, and 1 cucumber"</span>.
                </p>
              </div>

              {aiError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {aiError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  What did you eat?
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. 2 whole wheat rotis brushed with light ghee, 1 katori dal tadka, 1 plate salad, and 1 small cup curd"
                  value={aiText}
                  onChange={(e) => setAiText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="text-slate-400 py-1">Quick prompts:</span>
                {[
                  '2 rotis + 1 bowl dal + 1 boiled egg',
                  '1 plate chicken biryani + cucumber raita',
                  '2 idlis with sambar & coconut chutney',
                  '1 bowl poha with peanuts and hot chai',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setAiText(sample)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 text-[11px] transition"
                  >
                    {sample}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Indian Foods & Nutrients...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Calculate & Add to {mealType}
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Database / Custom Mode Form */
            <form onSubmit={handleSave} className="space-y-5">
              
              {activeTab === 'database' && (
                <div>
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Roti, Dal, Paneer, Rice, Eggs, Idli, Dosa, Chicken, Samosa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 focus:bg-white"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(cat);
                          setSearchQuery('');
                        }}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                          categoryFilter === cat && !searchQuery
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Food items quick-selection grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                    {filteredDatabase.map((entry) => {
                      const isSelected = selectedEntry?.id === entry.id;
                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => handleSelectEntry(entry)}
                          className={`flex items-start justify-between p-2.5 rounded-xl border text-left transition cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50/90 border-emerald-600 ring-1 ring-emerald-500 shadow-2xs'
                              : 'bg-white border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{entry.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {entry.defaultServingSize} {entry.defaultUnit} • {entry.proteinPerServing}g P • {entry.carbsPerServing}g C
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-800 font-heading shrink-0">
                            {entry.caloriesPerServing} kcal
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Meal Food Inputs */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                    Food Details & Quantity
                  </h4>
                  {verifiedBy === 'database' ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      Standard Indian DB Verified
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                      Custom / Manual
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      What food did you eat? *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roti, Moong Dal, Grilled Chicken"
                      value={foodName}
                      onChange={(e) => {
                        setFoodName(e.target.value);
                        if (selectedEntry && selectedEntry.name !== e.target.value) {
                          setSelectedEntry(null);
                          setVerifiedBy('user');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="any"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Serving Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e: any) => setUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="piece">Pieces (e.g. 1 pc, 2 pcs)</option>
                      <option value="roti">Rotis / Chapatis</option>
                      <option value="bowl">Bowls / Katoris (~150-180g)</option>
                      <option value="plate">Plates</option>
                      <option value="cup">Cups / Glasses (~250ml)</option>
                      <option value="g">Grams (g)</option>
                      <option value="ml">Milliliters (ml)</option>
                      <option value="tbsp">Tablespoons (tbsp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Optional Description / Cooking Style
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Cooked in 1 tsp ghee, no sugar, spicy"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Auto Calculated Nutrition Card with editable inputs */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Nutritional Breakdown (Auto Calculated)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      You can manually correct these values
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">Calories</span>
                      <input
                        type="number"
                        min="0"
                        value={calories}
                        onChange={(e) => {
                          setCalories(Number(e.target.value));
                          handleManualNutritionChange();
                        }}
                        className="w-full text-center font-extrabold text-emerald-950 font-heading text-sm bg-transparent border-b border-emerald-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-emerald-700">kcal</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-[10px] font-bold uppercase text-blue-800 block">Protein</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={protein}
                        onChange={(e) => {
                          setProtein(Number(e.target.value));
                          handleManualNutritionChange();
                        }}
                        className="w-full text-center font-extrabold text-blue-950 font-heading text-sm bg-transparent border-b border-blue-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-blue-700">grams</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold uppercase text-amber-800 block">Carbs</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={carbs}
                        onChange={(e) => {
                          setCarbs(Number(e.target.value));
                          handleManualNutritionChange();
                        }}
                        className="w-full text-center font-extrabold text-amber-950 font-heading text-sm bg-transparent border-b border-amber-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-amber-700">grams</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                      <span className="text-[10px] font-bold uppercase text-rose-800 block">Fat</span>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={fat}
                        onChange={(e) => {
                          setFat(Number(e.target.value));
                          handleManualNutritionChange();
                        }}
                        className="w-full text-center font-extrabold text-rose-950 font-heading text-sm bg-transparent border-b border-rose-300 focus:outline-none"
                      />
                      <span className="text-[10px] text-rose-700">grams</span>
                    </div>
                  </div>

                  {selectedEntry?.healthierAlternative && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>AI Health Swap:</strong> {selectedEntry.healthierAlternative}</span>
                    </div>
                  )}
                </div>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!foodName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Save Food to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
