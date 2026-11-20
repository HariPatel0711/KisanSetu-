import React from 'react';
import { Home, UserPlus, Users, UserCheck } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingCount = 0,
}) => {
  const navItems = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'register' as TabType,
      label: 'Register',
      icon: UserPlus,
    },
    {
      id: 'farmers' as TabType,
      label: 'Farmers',
      icon: Users,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: UserCheck,
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,4px)]"
    >
      <div className="max-w-md mx-auto px-2 pt-1.5 pb-1">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
                    try {
                      navigator.vibrate(10);
                    } catch {}
                  }
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative touch-manipulation select-none active:scale-90 ${
                  isActive
                    ? 'text-emerald-700 font-bold bg-emerald-50/90'
                    : 'text-slate-500 hover:text-slate-800 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.5px] text-emerald-700 scale-110' : 'stroke-[1.8px]'
                    }`}
                  />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] mt-1 tracking-tight ${
                    isActive ? 'text-emerald-800 font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar (Mobile Native Touch Notch) */}
        <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1 mb-0.5 opacity-60"></div>
      </div>
    </nav>
  );
};
