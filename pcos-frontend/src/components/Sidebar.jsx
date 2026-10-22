import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Activity, 
  Heart, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  User, 
  LogOut,
  Sparkles,
  Award
} from 'lucide-react';

export default function Sidebar({ currentRoute, setCurrentRoute, onLogout, user }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cycle', label: 'Cycle Tracker', icon: CalendarDays },
    { id: 'symptoms', label: 'Symptoms', icon: Activity },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'risk', label: 'Risk Prediction', icon: ShieldAlert },
    { id: 'personalized', label: 'Personalized Path', icon: Sparkles },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => setCurrentRoute('dashboard')}
          className="p-6 flex items-center gap-3 border-b border-slate-100 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-200 group-hover:scale-105 transition-transform shrink-0">
            <img src="/logo.jpg" alt="femora logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-teal-800 text-lg leading-tight tracking-tight">
              femora.
            </div>
            <div className="text-[10px] font-semibold text-slate-500">
              your cycle, your rhythm
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentRoute(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold shadow-xs border-l-4 border-teal-700'
                    : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Area */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        {/* Logout Button matching prototype */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
