import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardSummary } from './components/DashboardSummary';
import { MealSection } from './components/MealSection';
import { AddFoodModal } from './components/AddFoodModal';
import { EditFoodModal } from './components/EditFoodModal';
import { SmartAiPanel } from './components/SmartAiPanel';
import { WaterTracker } from './components/WaterTracker';
import { WeeklyStats } from './components/WeeklyStats';
import { WearableSyncModal } from './components/WearableSyncModal';
import { UserProfileModal } from './components/UserProfileModal';
import { FriendsAuthModal } from './components/FriendsAuthModal';
import { ExportReportModal } from './components/ExportReportModal';
import { 
  MealType, 
  FoodItem, 
  UserProfile, 
  WearableDeviceData, 
  DayLog, 
  FriendUser 
} from './types';
import { calculateDailySummary } from './utils/calculator';
import { Sparkles, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_abhiram',
  name: 'Abhiram',
  age: 26,
  gender: 'male',
  heightCm: 175,
  weightKg: 72,
  activityLevel: 'moderate',
  goal: 'maintain',
  dietaryPreference: 'non-veg',
  targetCalories: 2150,
  targetProtein: 130,
  targetCarbs: 240,
  targetFat: 60,
  waterGoalGlasses: 12,
};

export default function App() {
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'tracker' | 'insights' | 'history'>('tracker');

  // Active friend / user state
  const [activeFriend, setActiveFriend] = useState<{ id: string; name: string; avatarColor: string }>({
    id: 'user_abhiram',
    name: 'Abhiram',
    avatarColor: 'bg-emerald-600',
  });

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const [meals, setMeals] = useState<Record<MealType, FoodItem[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const [waterGlasses, setWaterGlasses] = useState<number>(0);

  const [wearable, setWearable] = useState<WearableDeviceData>({
    connected: true,
    deviceName: 'Apple Health',
    lastSyncedAt: 'Today',
    steps: 7420,
    activeCaloriesBurned: 340,
    restingHeartRate: 64,
    activeMinutes: 42,
  });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Modals
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [addFoodMealType, setAddFoodMealType] = useState<MealType>('breakfast');

  const [isEditFoodOpen, setIsEditFoodOpen] = useState(false);
  const [editFoodMealType, setEditFoodMealType] = useState<MealType>('breakfast');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isWearableOpen, setIsWearableOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load User Profile
  const loadProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/user/profile?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  // Load Meals for active user and date
  const loadDayMeals = async (userId: string, date: string) => {
    try {
      const res = await fetch(`/api/meals?userId=${userId}&date=${date}`);
      const data = await res.json();
      if (data.success && data.log) {
        setMeals(data.log.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] });
        setWaterGlasses(data.log.waterGlasses || 0);
        if (data.log.wearable) {
          setWearable(data.log.wearable);
        }
      }
    } catch (err) {
      console.error('Failed to load day meals:', err);
    }
  };

  useEffect(() => {
    loadProfile(activeFriend.id);
  }, [activeFriend.id]);

  useEffect(() => {
    loadDayMeals(activeFriend.id, currentDate);
  }, [activeFriend.id, currentDate]);

  // Reactive summary calculation
  const summary = calculateDailySummary(meals, profile, wearable.connected ? wearable.activeCaloriesBurned : 0);

  // Check if daily calorie goal was reached nicely
  useEffect(() => {
    if (
      summary.totalCalories >= profile.targetCalories - 100 &&
      summary.totalCalories <= profile.targetCalories + 100 &&
      summary.totalCalories > 0
    ) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#047857', '#10b981', '#34d399', '#f59e0b'],
      });
    }
  }, [summary.totalCalories, profile.targetCalories]);

  // Handlers for food items
  const handleAddFood = async (mealType: MealType, item: Omit<FoodItem, 'id'>) => {
    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const newItem: FoodItem = {
      ...item,
      id: tempId,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMeals((prev) => ({
      ...prev,
      [mealType]: [...prev[mealType], newItem],
    }));

    showToast(`Added ${item.name} to ${mealType}`);

    try {
      const res = await fetch('/api/meals/item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          date: currentDate,
          mealType,
          item: newItem,
        }),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setMeals((prev) => ({
          ...prev,
          [mealType]: prev[mealType].map((i) => (i.id === tempId ? data.item : i)),
        }));
      }
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleEditItem = (mealType: MealType, item: FoodItem) => {
    setEditFoodMealType(mealType);
    setEditingItem(item);
    setIsEditFoodOpen(true);
  };

  const handleSaveEditedItem = async (mealType: MealType, updatedItem: FoodItem) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: prev[mealType].map((i) => (i.id === updatedItem.id ? updatedItem : i)),
    }));

    showToast(`Updated ${updatedItem.name}`);

    try {
      await fetch('/api/meals/item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          date: currentDate,
          mealType,
          item: updatedItem,
        }),
      });
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const handleDeleteItem = async (mealType: MealType, itemId: string) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((i) => i.id !== itemId),
    }));

    showToast('Food item removed');

    try {
      await fetch('/api/meals/item', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          date: currentDate,
          mealType,
          itemId,
        }),
      });
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleUpdateWater = async (newCount: number) => {
    setWaterGlasses(newCount);
    try {
      await fetch('/api/water', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          date: currentDate,
          glasses: newCount,
        }),
      });
    } catch (err) {
      console.error('Error updating water:', err);
    }
  };

  const handleSaveWearable = async (wearableData: Partial<WearableDeviceData>) => {
    const updated = { ...wearable, ...wearableData };
    setWearable(updated);
    showToast(`Synced ${updated.deviceName} metrics`);

    try {
      await fetch('/api/wearables/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          date: currentDate,
          ...updated,
        }),
      });
    } catch (err) {
      console.error('Error syncing wearable:', err);
    }
  };

  const handleSaveProfile = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    showToast('Nutrition profile updated!');

    try {
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeFriend.id,
          profile: updatedProfile,
        }),
      });
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleSelectFriend = (friend: FriendUser) => {
    setActiveFriend({
      id: friend.id,
      name: friend.name,
      avatarColor: friend.avatarColor || 'bg-emerald-600',
    });
    if (friend.profile) {
      setProfile(friend.profile);
    }
    showToast(`Signed in as ${friend.name}`);
  };

  const currentDayLog: DayLog = {
    date: currentDate,
    userId: activeFriend.id,
    meals,
    waterGlasses,
    wearable,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-emerald-950 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-emerald-700/80 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        activeFriend={activeFriend}
        onOpenFriendsModal={() => setIsFriendsOpen(true)}
        wearable={wearable}
        onOpenWearableModal={() => setIsWearableOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenExportModal={() => setIsExportOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Application Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Friends-Only Notice Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-emerald-950">
                CalorieMate Friends Circle Active
              </p>
              <p className="text-emerald-800/80 text-[11px]">
                Currently logging for <strong>{activeFriend.name}</strong> • Only invited friends can access & track meals.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFriendsOpen(true)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs transition shrink-0 cursor-pointer"
          >
            Switch Profile
          </button>
        </div>

        {/* Tab 1: Meal Tracker & Dashboard */}
        {activeTab === 'tracker' && (
          <div className="space-y-8">
            {/* Dashboard Summary (Hero Card with Progress Ring and 3 Macro Cards) */}
            <DashboardSummary
              summary={summary}
              wearable={wearable}
              profile={profile}
              onOpenQuickAI={() => {
                setAddFoodMealType('breakfast');
                setIsAddFoodOpen(true);
              }}
              onOpenWearableSync={() => setIsWearableOpen(true)}
            />

            {/* Daily Water Intake Tracker */}
            <WaterTracker
              glasses={waterGlasses}
              goalGlasses={profile.waterGoalGlasses || 12}
              onUpdateGlasses={handleUpdateWater}
            />

            {/* Meal Sections (Breakfast, Lunch, Dinner, Snacks) */}
            <MealSection
              meals={meals}
              summary={summary}
              onOpenAddModal={(mealType) => {
                setAddFoodMealType(mealType);
                setIsAddFoodOpen(true);
              }}
              onOpenQuickAIModal={(mealType) => {
                setAddFoodMealType(mealType || 'breakfast');
                setIsAddFoodOpen(true);
              }}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />

            {/* Smart AI Quick Summary at the bottom of tracker */}
            <SmartAiPanel
              profile={profile}
              summary={summary}
              dayLog={currentDayLog}
            />
          </div>
        )}

        {/* Tab 2: Smart AI Features */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <SmartAiPanel
              profile={profile}
              summary={summary}
              dayLog={currentDayLog}
            />
          </div>
        )}

        {/* Tab 3: Weekly Statistics & Trends */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <WeeklyStats userId={activeFriend.id} profile={profile} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 font-heading">CalorieMate</span>
            <span>•</span>
            <span>Intelligent AI Calorie & Nutrition Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Clinical Mifflin-St Jeor Formulas</span>
            <span>•</span>
            <span>Wearables Synchronized</span>
            <span>•</span>
            <span>Friends Only Access</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddFoodModal
        isOpen={isAddFoodOpen}
        mealType={addFoodMealType}
        onClose={() => setIsAddFoodOpen(false)}
        onAddFood={handleAddFood}
      />

      <EditFoodModal
        isOpen={isEditFoodOpen}
        mealType={editFoodMealType}
        item={editingItem}
        onClose={() => setIsEditFoodOpen(false)}
        onSave={handleSaveEditedItem}
      />

      <FriendsAuthModal
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
        currentFriendId={activeFriend.id}
        onSelectFriend={handleSelectFriend}
      />

      <WearableSyncModal
        isOpen={isWearableOpen}
        onClose={() => setIsWearableOpen(false)}
        wearable={wearable}
        onSaveWearable={handleSaveWearable}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        profile={profile}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        profile={profile}
        dayLog={currentDayLog}
        summary={summary}
        currentDate={currentDate}
      />
    </div>
  );
}
