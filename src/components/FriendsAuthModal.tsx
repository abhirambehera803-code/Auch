import React, { useState, useEffect } from 'react';
import { X, Lock, Users, UserPlus, Check, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { FriendUser } from '../types';

interface FriendsAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFriendId: string;
  onSelectFriend: (friend: FriendUser) => void;
}

export const FriendsAuthModal: React.FC<FriendsAuthModalProps> = ({
  isOpen,
  onClose,
  currentFriendId,
  onSelectFriend,
}) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string>(currentFriendId);
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'select' | 'new_friend'>('select');

  // New friend form states
  const [newFriendName, setNewFriendName] = useState<string>('');
  const [newFriendPin, setNewFriendPin] = useState<string>('1234');
  const [dietaryPreference, setDietaryPreference] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
  const [goal, setGoal] = useState<'maintain' | 'loss' | 'gain'>('maintain');

  const fetchFriends = async () => {
    try {
      const res = await fetch('/api/auth/friends');
      const data = await res.json();
      if (data.success) {
        setFriends(data.friends);
        if (!selectedFriendId && data.friends.length > 0) {
          setSelectedFriendId(data.friends[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFriends();
      setError('');
      setPin('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedFriendId, pin }),
      });
      const data = await res.json();

      if (data.success) {
        onSelectFriend(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed. Please check passcode.');
      }
    } catch (err: any) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) {
      setError('Please provide a name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFriendName,
          pin: newFriendPin || '1234',
          profile: {
            name: newFriendName,
            age: 25,
            gender: 'male',
            heightCm: 172,
            weightKg: 70,
            activityLevel: 'moderate',
            goal,
            dietaryPreference,
            targetCalories: goal === 'loss' ? 1750 : goal === 'gain' ? 2400 : 2050,
            targetProtein: 125,
            targetCarbs: 230,
            targetFat: 55,
            waterGoalGlasses: 10,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchFriends();
        onSelectFriend(data.user);
        onClose();
      } else {
        setError(data.error || 'Failed to create friend profile.');
      }
    } catch (err) {
      setError('Server error creating friend account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden">
        
        {/* Header with Dark Green Theme */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-700/60 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-600/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Friends-Only Circle
            </span>
          </div>

          <h3 className="text-xl font-bold font-heading text-white">
            {mode === 'select' ? 'Friend Profile Authentication' : 'Add New Friend Profile'}
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            {mode === 'select'
              ? 'Our friends can only use this app. Select your profile & enter your PIN.'
              : 'Add your friend to CalorieMate with personalized nutrition metrics.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'select' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Friend Profile
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {friends.map((friend) => (
                    <button
                      type="button"
                      key={friend.id}
                      onClick={() => {
                        setSelectedFriendId(friend.id);
                        setError('');
                      }}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        selectedFriendId === friend.id
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${friend.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{friend.name}</p>
                          <p className="text-xs text-slate-500">
                            {friend.profile?.dietaryPreference || 'Healthy'} • {friend.profile?.targetCalories || 2000} kcal goal
                          </p>
                        </div>
                      </div>
                      {selectedFriendId === friend.id && (
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Friend Passcode / PIN
                  </label>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    Default PIN is 1234
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    maxLength={8}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (1234)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm tracking-widest font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Sign In as Friend'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('new_friend');
                    setError('');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  Invite / Add Another Friend
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateFriend} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Friend's Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahil, Ananya, Kabir"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diet Preference
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e: any) => setDietaryPreference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="maintain">Maintain Weight</option>
                    <option value="loss">Weight Loss</option>
                    <option value="gain">Weight Gain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Passcode / PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newFriendPin}
                  onChange={(e) => setNewFriendPin(e.target.value)}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono tracking-widest"
                />
                <p className="text-[11px] text-slate-400 mt-0.5">They will use this PIN to sign in.</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('select')}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Create Profile'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Encrypted SQLite/JSON storage</span>
            <span>Private group link</span>
          </div>
        </div>

      </div>
    </div>
  );
};
