import React, { useState } from 'react';
import { 
  X, 
  Watch, 
  RefreshCw, 
  Check, 
  Flame, 
  Footprints, 
  Heart, 
  Timer,
  Smartphone,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { WearableDeviceData } from '../types';

interface WearableSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  wearable: WearableDeviceData;
  onSaveWearable: (data: Partial<WearableDeviceData>) => void;
}

export const WearableSyncModal: React.FC<WearableSyncModalProps> = ({
  isOpen,
  onClose,
  wearable,
  onSaveWearable,
}) => {
  const [selectedDevice, setSelectedDevice] = useState<WearableDeviceData['deviceName']>(
    wearable.deviceName === 'None' ? 'Apple Health' : wearable.deviceName
  );
  const [steps, setSteps] = useState(wearable.steps || 7500);
  const [activeCaloriesBurned, setActiveCaloriesBurned] = useState(wearable.activeCaloriesBurned || 350);
  const [restingHeartRate, setRestingHeartRate] = useState(wearable.restingHeartRate || 65);
  const [activeMinutes, setActiveMinutes] = useState(wearable.activeMinutes || 45);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connected, setConnected] = useState(wearable.connected);

  if (!isOpen) return null;

  const handleSimulateDeviceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Generate realistic randomized active metrics based on the device
      const randomSteps = Math.floor(6500 + Math.random() * 4500);
      const randomBurn = Math.floor(280 + Math.random() * 220);
      const randomHR = Math.floor(62 + Math.random() * 8);
      const randomMins = Math.floor(35 + Math.random() * 30);

      setSteps(randomSteps);
      setActiveCaloriesBurned(randomBurn);
      setRestingHeartRate(randomHR);
      setActiveMinutes(randomMins);
      setConnected(true);
      setIsSyncing(false);

      onSaveWearable({
        connected: true,
        deviceName: selectedDevice,
        steps: randomSteps,
        activeCaloriesBurned: randomBurn,
        restingHeartRate: randomHR,
        activeMinutes: randomMins,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 900);
  };

  const handleManualSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveWearable({
      connected,
      deviceName: selectedDevice,
      steps: Number(steps) || 0,
      activeCaloriesBurned: Number(activeCaloriesBurned) || 0,
      restingHeartRate: Number(restingHeartRate) || 0,
      activeMinutes: Number(activeMinutes) || 0,
      lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    onClose();
  };

  const devices: { name: WearableDeviceData['deviceName']; description: string }[] = [
    { name: 'Apple Health', description: 'Apple Watch Series & iOS HealthKit sync' },
    { name: 'Fitbit / Google Health', description: 'Fitbit Charge, Sense, Pixel Watch & Health Connect' },
    { name: 'Garmin', description: 'Garmin Forerunner, Fenix & Venu Connect' },
    { name: 'Samsung Health', description: 'Galaxy Watch & Samsung Health API' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-700">
              Wearable Device Sync
            </span>
          </div>

          <h3 className="text-xl font-bold font-heading text-white">
            Health & Fitness Wearable Connect
          </h3>
          <p className="text-xs text-emerald-200/90 mt-0.5">
            Synchronize active calories burned, step counts, and heart rate to automatically compute Net Calories.
          </p>
        </div>

        {/* Content Form */}
        <form onSubmit={handleManualSave} className="p-6 space-y-5">
          
          {/* Select Device */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Connected Device
            </label>
            <div className="grid grid-cols-2 gap-2">
              {devices.map((dev) => {
                const isSelected = selectedDevice === dev.name;
                return (
                  <button
                    key={dev.name}
                    type="button"
                    onClick={() => {
                      setSelectedDevice(dev.name);
                      setConnected(true);
                    }}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/80 ring-1 ring-emerald-500 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Watch className={`w-4 h-4 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{dev.name}</p>
                      <p className="text-[10px] text-slate-500 leading-tight">{dev.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick One-Click Sync Button */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800">
                Live Device Sync Status
              </p>
              <p className="text-[11px] text-slate-500">
                {connected
                  ? `Connected to ${selectedDevice} • Synced: ${wearable.lastSyncedAt || 'Just now'}`
                  : 'No device currently paired'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSimulateDeviceSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Metrics Preview & Adjustment */}
          <div className="space-y-3">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Synchronized Wearable Metrics
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Daily Steps</span>
                </div>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full text-lg font-extrabold text-slate-900 font-heading focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">steps tracked</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Active Burned</span>
                </div>
                <input
                  type="number"
                  value={activeCaloriesBurned}
                  onChange={(e) => setActiveCaloriesBurned(Number(e.target.value))}
                  className="w-full text-lg font-extrabold text-amber-600 font-heading focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">kcal deducted from food</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Resting HR</span>
                </div>
                <input
                  type="number"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                  className="w-full text-lg font-extrabold text-slate-900 font-heading focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">bpm</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                  <Timer className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Active Minutes</span>
                </div>
                <input
                  type="number"
                  value={activeMinutes}
                  onChange={(e) => setActiveMinutes(Number(e.target.value))}
                  className="w-full text-lg font-extrabold text-slate-900 font-heading focus:outline-none"
                />
                <span className="text-[10px] text-slate-400">minutes of activity</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Save Wearable Sync
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
