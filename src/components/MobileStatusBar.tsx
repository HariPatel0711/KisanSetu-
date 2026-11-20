import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-emerald-950 text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-[12px] font-semibold tracking-tight select-none z-50">
      {/* Time */}
      <span className="font-bold">{time || '09:41'}</span>

      {/* Dynamic Notch / Camera Island placeholder */}
      <div className="w-20 h-4 bg-black/60 rounded-full flex items-center justify-center space-x-1">
        <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
      </div>

      {/* System Icons: Signal, WiFi, Battery */}
      <div className="flex items-center space-x-1.5 text-slate-200">
        <Signal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-mono font-bold">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px] font-bold">98%</span>
          <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
        </div>
      </div>
    </div>
  );
};
