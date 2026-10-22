import React from 'react';
import { Activity, ShieldCheck, Heart, Menu, X } from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentRoute(user ? 'dashboard' : 'landing')}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-slate-200 group-hover:scale-105 transition-transform shrink-0">
              <img src="/logo.jpg" alt="femora logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-teal-800 tracking-tight flex items-center gap-1.5">
                femora.
              </span>
              <p className="text-[11px] font-semibold text-slate-500 lowercase tracking-wide">your cycle, your rhythm</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setCurrentRoute('landing')}
              className={`text-sm font-medium transition-colors ${currentRoute === 'landing' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'}`}
            >
              Features
            </button>
            <button 
              onClick={() => setCurrentRoute('about')}
              className={`text-sm font-medium transition-colors ${currentRoute === 'about' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'}`}
            >
              About Platform
            </button>
            <button 
              onClick={() => setCurrentRoute('contact')}
              className={`text-sm font-medium transition-colors ${currentRoute === 'contact' ? 'text-teal-700 font-semibold' : 'text-slate-600 hover:text-teal-700'}`}
            >
              Contact Us
            </button>
          </div>

          {/* Action CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentRoute('dashboard')}
                  className="px-5 py-2.5 rounded-full bg-teal-700 text-white text-sm font-medium hover:bg-teal-800 transition-all shadow-sm flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" /> Go to Dashboard
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setCurrentRoute('login')}
                  className="text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors px-4 py-2"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentRoute('signup')}
                  className="px-6 py-2.5 rounded-full bg-teal-700 text-white text-sm font-semibold hover:bg-teal-800 transition-all shadow-md hover:shadow-teal-700/20 active:scale-95"
                >
                  Join Now
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <button 
            onClick={() => { setCurrentRoute('landing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 font-medium hover:text-teal-700"
          >
            Features
          </button>
          <button 
            onClick={() => { setCurrentRoute('about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 font-medium hover:text-teal-700"
          >
            About Platform
          </button>
          <button 
            onClick={() => { setCurrentRoute('contact'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-slate-700 font-medium hover:text-teal-700"
          >
            Contact Us
          </button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => { setCurrentRoute('dashboard'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-medium text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setCurrentRoute('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2 text-center text-slate-700 font-medium"
                >
                  Log In
                </button>
                <button
                  onClick={() => { setCurrentRoute('signup'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-medium text-center"
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
