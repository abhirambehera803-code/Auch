import React from 'react';
import { 
  Flame, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Watch, 
  User, 
  Download, 
  Sparkles,
  Droplets,
  BarChart3
} from 'lucide-react';
import { UserProfile, WearableDeviceData } from '../types';

interface NavbarProps {
  currentDate: string;
  onDateChange: (newDate: string) => void;
  activeFriend: { id: string; name: string; avatarColor: string };
  onOpenFriendsModal: () => void;
  wearable: WearableDeviceData;
  onOpenWearableModal: () => void;
  onOpenProfileModal: () => void;
  onOpenExportModal: () => void;
  activeTab: 'tracker' | 'insights' | 'history';
  onTabChange: (tab: 'tracker' | 'insights' | 'history') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDate,
  onDateChange,
  activeFriend,
  onOpenFriendsModal,
  wearable,
  onOpenWearableModal,
  onOpenProfileModal,
  onOpenExportModal,
  activeTab,
  onTabChange,
}) => {
  const isToday = currentDate === new Date().toISOString().split('T')[0];

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().split('T')[0]);
  };

  const handleSetToday = () => {
    onDateChange(new Date().toISOString().split('T')[0]);
  };

  const formattedDate = new Date(currentDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
              <Flame className="w-6 h-6 text-emerald-200 fill-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-emerald-950 font-heading">
                  Calorie<span className="text-emerald-600">Mate</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 hidden sm:inline-block">
                  AI Nutrition
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Intelligent Indian & Global Calorie Tracker</p>
            </div>
          </div>

          {/* Date Selector Navigation */}
          <div className="flex items-center bg-slate-100/90 hover:bg-slate-100 transition-colors rounded-xl p-1 border border-slate-200/80 shadow-inner">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-white transition-all"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex items-center gap-1 px-2 sm:px-3 text-xs sm:text-sm font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 hidden xs:inline" />
              <span>{isToday ? 'Today' : formattedDate}</span>
              {isToday && <span className="text-[11px] text-slate-500 font-normal hidden md:inline">({formattedDate})</span>}
            </div>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-white transition-all"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {!isToday && (
              <button
                onClick={handleSetToday}
                className="ml-1 text-[11px] font-medium px-2 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
              >
                Today
              </button>
            )}
          </div>

          {/* Nav Tabs for Desktop/Tablet */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => onTabChange('tracker')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'tracker'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Meal Tracker
            </button>
            <button
              onClick={() => onTabChange('insights')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'insights'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Smart AI Insights
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Trends & Reports
            </button>
          </nav>

          {/* Right Action Icons & Friends Pass */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Friends Access Switcher ("Our friends can only use this") */}
            <button
              onClick={onOpenFriendsModal}
              title="Friends Access & Switch Profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 transition-all text-xs font-medium"
            >
              <div className={`w-5 h-5 rounded-full ${activeFriend.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center text-[11px] font-bold shadow-xs`}>
                {activeFriend.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-emerald-900 max-w-[80px] truncate hidden sm:inline">
                {activeFriend.name}
              </span>
              <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded font-medium hidden md:inline">
                Friends Only
              </span>
              <Users className="w-3.5 h-3.5 text-emerald-700 ml-0.5" />
            </button>

            {/* Wearable Sync Status Button */}
            <button
              onClick={onOpenWearableModal}
              title="Sync Wearable (Apple Health / Fitbit / Garmin)"
              className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 border border-slate-200/80 transition-all flex items-center gap-1"
            >
              <Watch className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wearable.connected && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* Export Report */}
            <button
              onClick={onOpenExportModal}
              title="Export Nutrition Report"
              className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70 border border-slate-200/80 transition-all hidden sm:flex"
            >
              <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* User Profile */}
            <button
              onClick={onOpenProfileModal}
              title="User Profile & Calorie Goals"
              className="p-2 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 border border-slate-200/80 transition-all"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-100 text-xs">
          <button
            onClick={() => onTabChange('tracker')}
            className={`px-3 py-1 font-semibold rounded-lg ${
              activeTab === 'tracker' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600'
            }`}
          >
            Tracker
          </button>
          <button
            onClick={() => onTabChange('insights')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'insights' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Smart AI
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-3 py-1 font-semibold rounded-lg flex items-center gap-1 ${
              activeTab === 'history' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Trends
          </button>
        </div>
      </div>
    </header>
  );
};
