import React from 'react';
import {
  Sprout,
  Search,
  Download,
  Share2,
  ShieldCheck,
  ArrowLeft,
  WifiOff,
  Bell,
} from 'lucide-react';
import { TabType } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface MobileHeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userEmail: string | null;
  onQuickSearch: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentTab,
  onSelectTab,
  userEmail,
  onQuickSearch,
  title,
  showBack = false,
  onBack,
}) => {
  const { isInstallable, install, isIOS } = usePWAInstall();
  const isOnline = useOnlineStatus();

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900/50">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-3 py-1 text-[11px] font-bold flex items-center justify-center gap-1.5 animate-pulse">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode — Storing records in device cache</span>
        </div>
      )}

      {/* Main Mobile App Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between">
        {/* Left: Back button or App Brand Logo */}
        <div className="flex items-center space-x-2.5">
          {showBack ? (
            <button
              onClick={onBack}
              className="p-1.5 -ml-1 rounded-xl bg-emerald-700/80 active:bg-emerald-900 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div
              onClick={() => onSelectTab('home')}
              className="flex items-center space-x-2 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 font-extrabold shadow-sm">
                <Sprout className="w-5 h-5 text-emerald-950" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                    KisanSetu
                  </span>
                  <span className="text-[9px] uppercase font-extrabold px-1 py-0.2 rounded bg-emerald-950/80 text-amber-300 border border-emerald-700/50">
                    App
                  </span>
                </div>
                <p className="text-[9px] text-emerald-200">National Farmer Registry</p>
              </div>
            </div>
          )}

          {title && showBack && (
            <span className="font-bold text-sm text-white truncate max-w-[170px]">
              {title}
            </span>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5">
          {/* PWA Install Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-emerald-950 text-[11px] font-extrabold flex items-center gap-1 shadow-sm transition-all"
            >
              <Download className="w-3 h-3 text-emerald-950" />
              <span>Install</span>
            </button>
          )}

          {/* Quick Search */}
          <button
            onClick={onQuickSearch}
            title="Search records"
            className="p-2 rounded-xl bg-emerald-700/60 active:bg-emerald-900 text-white border border-emerald-600/40 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Officer Avatar badge -> opens Profile tab */}
          {userEmail && (
            <button
              onClick={() => onSelectTab('profile')}
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm transition-all border ${
                currentTab === 'profile'
                  ? 'bg-amber-400 text-emerald-950 border-amber-300 ring-2 ring-amber-400/50'
                  : 'bg-emerald-900 text-emerald-100 border-emerald-700'
              }`}
            >
              {userEmail.charAt(0).toUpperCase()}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
