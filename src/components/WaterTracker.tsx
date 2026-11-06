import React from 'react';
import { Droplet, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaterTrackerProps {
  glasses: number;
  goalGlasses: number;
  onUpdateGlasses: (newCount: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  glasses,
  goalGlasses,
  onUpdateGlasses,
}) => {
  const handleAdd = () => {
    const next = glasses + 1;
    onUpdateGlasses(next);
    if (next === goalGlasses) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#065f46', '#10b981', '#38bdf8', '#6ee7b7'],
      });
    }
  };

  const handleMinus = () => {
    if (glasses > 0) {
      onUpdateGlasses(glasses - 1);
    }
  };

  const totalMl = glasses * 250;
  const targetMl = goalGlasses * 250;
  const pct = Math.min(100, Math.round((glasses / goalGlasses) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold border border-cyan-100">
            <Droplet className="w-6 h-6 fill-cyan-400 text-cyan-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base font-heading">
                Daily Water Intake Tracker
              </h3>
              {glasses >= goalGlasses && (
                <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Target Met!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Each glass is 250ml • Recommended {goalGlasses} glasses ({targetMl}ml)
            </p>
          </div>
        </div>

        {/* Counter and controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 font-heading">
              {totalMl}
            </span>
            <span className="text-xs text-slate-400 ml-1">/ {targetMl} ml</span>
            <p className="text-[11px] text-cyan-600 font-semibold">
              {glasses} of {goalGlasses} glasses ({pct}%)
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={handleMinus}
              disabled={glasses <= 0}
              title="Remove 1 glass"
              className="w-8 h-8 rounded-xl bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={handleAdd}
              title="Add 1 glass (+250ml)"
              className="px-3 h-8 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+250 ml</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Glasses Row */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {Array.from({ length: Math.max(goalGlasses, glasses) }).map((_, idx) => {
            const isFilled = idx < glasses;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onUpdateGlasses(idx + 1)}
                title={`Log glass ${idx + 1} (${(idx + 1) * 250}ml)`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition cursor-pointer ${
                  isFilled
                    ? 'bg-cyan-50 border border-cyan-300 text-cyan-700 shadow-2xs'
                    : 'bg-slate-50 border border-slate-200 text-slate-300 hover:border-cyan-200'
                }`}
              >
                <Droplet
                  className={`w-5 h-5 transition-transform ${
                    isFilled ? 'fill-cyan-500 text-cyan-600 scale-110' : 'text-slate-300'
                  }`}
                />
                <span className="text-[10px] font-bold mt-1">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
