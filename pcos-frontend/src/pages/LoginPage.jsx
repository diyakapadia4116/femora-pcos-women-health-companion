import React, { useState } from 'react';
import { Activity, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ setCurrentRoute, onLoginSuccess, onShowToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const data = await api.login(email, password);
      onLoginSuccess(data.user, data.access_token);
      onShowToast(`Welcome back, ${data.user.full_name}!`);
      setCurrentRoute('dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Invalid email or password. Please verify your credentials or create a new account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">

        {/* Left Informational Panel matching Page 2 */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-800 to-teal-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-600/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-white/20 shrink-0">
                <img src="/logo.jpg" alt="femora logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block">femora.</span>
                <span className="text-[10px] text-teal-200 lowercase tracking-wide block">your cycle, your rhythm</span>
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Welcome Back!
              </h2>
              <p className="text-teal-100 text-sm mt-3 leading-relaxed">
                Your daily wellness tracking and personalized insights are just a step away.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel matching Page 2 */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Log In to Your Account
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your credentials to access your personal dashboard
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abc@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-teal-700 border-slate-300 rounded focus:ring-teal-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 font-medium">
                  Remember me on this device for 30 days
                </label>
              </div>

              {/* Submit Button matching Teal CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md hover:shadow-teal-700/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Register Link */}
            <p className="text-center text-xs text-slate-500 pt-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentRoute('signup')}
                className="font-bold text-teal-700 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
