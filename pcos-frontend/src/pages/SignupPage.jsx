import React, { useState } from 'react';
import { Activity, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { api } from '../services/api';

export default function SignupPage({ setCurrentRoute, onLoginSuccess, onShowToast }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState(25);
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(64);
  const [cycleRegularity, setCycleRegularity] = useState('Irregular');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMsg('Please agree to the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const data = await api.signup({
        email,
        password,
        full_name: fullName,
        age: Number(age),
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        cycle_regularity: cycleRegularity
      });

      onLoginSuccess(data.user, data.access_token);
      onShowToast(`Account created in PostgreSQL! Welcome to femora, ${data.user.full_name}!`);
      setCurrentRoute('dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Please check your backend connection or credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">

        {/* Left Informational Panel matching Page 3 */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-800 to-teal-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
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
                Start Your Journey Today
              </h2>
              <p className="text-teal-100 text-sm mt-3 leading-relaxed">
                Join a community of women taking control of their PCOS symptoms with science-backed insights and empathetic tracking.
              </p>
            </div>

            {/* Checkpoints */}
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Intelligent cycle & ovulation predictions</h4>
                  <p className="text-[11px] text-teal-200/80">Adaptive forecasting that accounts for long or irregular cycles.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Personalized lifestyle & metabolic correlation</h4>
                  <p className="text-[11px] text-teal-200/80">Discover how sleep, stress, and nutrition impact symptoms.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Clinical Rotterdam risk assessment</h4>
                  <p className="text-[11px] text-teal-200/80">Exportable, doctor-friendly consultation summaries.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-[11px] text-teal-200/80 mt-6">
            100% private, anonymous, and encrypted health data storage.
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create Your Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your health baseline to personalize your platform
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Good Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all"
                  />
                </div>
              </div>

              {/* Health Metrics Grid (Age, Height, Weight) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="65"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="120"
                    max="220"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>

              {/* Cycle Regularity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Cycle Pattern
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Regular (24-35d)', 'Irregular (>35d)', 'Absent / Rare'].map((type) => {
                    const isSelected = cycleRegularity.includes(type.split(' ')[0]);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setCycleRegularity(type.split(' ')[0])}
                        className={`py-2 px-1 text-[11px] rounded-xl font-medium border text-center transition-all ${isSelected
                          ? 'bg-teal-50 border-teal-600 text-teal-800 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-teal-700 border-slate-300 rounded focus:ring-teal-700"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600">
                  I agree to the <span className="text-teal-700 font-semibold underline cursor-pointer">Terms of Service</span> and understand this platform is for educational support.
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md hover:shadow-teal-700/20 active:scale-98 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Setting Up Platform...
                  </span>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Login Link */}
            <p className="text-center text-xs text-slate-500 pt-2">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setCurrentRoute('login')}
                className="font-bold text-teal-700 hover:underline"
              >
                Log In
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
