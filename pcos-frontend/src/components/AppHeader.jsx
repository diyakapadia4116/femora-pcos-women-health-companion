import React from 'react';
import { Bell, Sparkles } from 'lucide-react';

export default function AppHeader({ user, onOpenQuickLog, phase }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div></div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Quick Log Button */}
        <button
          onClick={onOpenQuickLog}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-all shadow-xs active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" /> + Log Daily Stats
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-full text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* User Avatar & Name */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-700 to-teal-600 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-teal-700/20 tracking-wider">
            {user?.full_name 
              ? user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
              : 'U'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-none">
              {user?.full_name || 'User'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
