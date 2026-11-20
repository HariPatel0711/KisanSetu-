import React from 'react';
import { User, LogOut, Sprout, ShieldCheck, Search, PlusCircle } from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userEmail: string | null;
  onLogout: () => void;
  onQuickSearch: () => void;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  userEmail,
  onLogout,
  onQuickSearch,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900/40">
      {/* Top micro-bar for official portal presence */}
      <div className="bg-emerald-950/70 px-4 py-1 text-[11px] text-emerald-200 flex items-center justify-between border-b border-emerald-800/50">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ministry of Agriculture & Farmers Welfare | Unified Portal</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure Firebase Cloud Registry
          </span>
          <span>Toll-Free Kisan Helpline: 1800-180-1551</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onSelectTab('home')}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 shadow-inner font-extrabold group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  KisanSetu
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-700/80 text-emerald-200 border border-emerald-600/50">
                  Gov Registry
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/90 hidden sm:block">
                National Farmer Registration & Database Management
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onSelectTab('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-emerald-900 text-amber-300 font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onSelectTab('register')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'register'
                  ? 'bg-emerald-900 text-amber-300 font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              Register Farmer
            </button>
            <button
              onClick={() => onSelectTab('farmers')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                currentTab === 'farmers'
                  ? 'bg-emerald-900 text-amber-300 font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
              }`}
            >
              <span>Farmer List</span>
              {totalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-600 font-bold text-white">
                  {totalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('profile')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'profile'
                  ? 'bg-emerald-900 text-amber-300 font-semibold shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-700/70 hover:text-white'
              }`}
            >
              Profile & Settings
            </button>
          </nav>

          {/* Quick Actions / User badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onQuickSearch}
              title="Search farmer database"
              className="p-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 hover:text-white border border-emerald-600/50 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {userEmail && (
              <div
                onClick={() => onSelectTab('profile')}
                className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/50 cursor-pointer hover:bg-emerald-900 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-amber-400 text-emerald-950 font-bold flex items-center justify-center text-xs">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs max-w-[120px] truncate">
                  <p className="font-semibold text-white leading-tight truncate">{userEmail.split('@')[0]}</p>
                  <p className="text-[10px] text-emerald-300 leading-tight">Field Officer</p>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              title="Sign Out"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
