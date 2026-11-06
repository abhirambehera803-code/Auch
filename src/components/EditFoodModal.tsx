import React, { useState, useEffect } from 'react';
import { X, Check, Edit2, Sliders, ShieldCheck } from 'lucide-react';
import { MealType, FoodItem, FoodUnit } from '../types';

interface EditFoodModalProps {
  isOpen: boolean;
  mealType: MealType;
  item: FoodItem | null;
  onClose: () => void;
  onSave: (mealType: MealType, updatedItem: FoodItem) => void;
}

export const EditFoodModal: React.FC<EditFoodModalProps> = ({
  isOpen,
  mealType,
  item,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<FoodUnit>('piece');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(item.quantity);
      setUnit(item.unit);
      setDescription(item.description || '');
      setCalories(item.calories);
      setProtein(item.protein);
      setCarbs(item.carbs);
      setFat(item.fat);
      setFiber(item.fiber || 0);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(mealType, {
      ...item,
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit,
      description: description.trim() || undefined,
      calories: Math.max(0, Number(calories) || 0),
      protein: Math.max(0, Number(protein) || 0),
      carbs: Math.max(0, Number(carbs) || 0),
      fat: Math.max(0, Number(fat) || 0),
      fiber: Math.max(0, Number(fiber) || 0),
      verifiedBy: 'user', // user custom verified
      isEstimated: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base font-heading text-white">
                Edit Food & Nutrition Values
              </h3>
              <p className="text-xs text-emerald-200">
                Correct serving or custom recipe nutrients
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Food Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Serving Unit
              </label>
              <select
                value={unit}
                onChange={(e: any) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="piece">Pieces (pcs)</option>
                <option value="roti">Rotis / Chapatis</option>
                <option value="bowl">Bowls / Katoris</option>
                <option value="plate">Plates</option>
                <option value="cup">Cups / Glasses</option>
                <option value="g">Grams (g)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="tbsp">Tablespoons (tbsp)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Less oil, with curd"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Nutrition values grid */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="block text-xs font-bold text-slate-700 mb-2">
              Exact Nutrition Values
            </span>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Calories</span>
                <input
                  type="number"
                  min="0"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-emerald-300 focus:outline-none"
                />
                <span className="text-[10px] text-emerald-600">kcal</span>
              </div>

              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Protein</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-blue-300 focus:outline-none"
                />
                <span className="text-[10px] text-blue-600">g</span>
              </div>

              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Carbs</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-amber-300 focus:outline-none"
                />
                <span className="text-[10px] text-amber-600">g</span>
              </div>

              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-800 uppercase block">Fat</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full text-center font-bold text-sm bg-transparent border-b border-rose-300 focus:outline-none"
                />
                <span className="text-[10px] text-rose-600">g</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
