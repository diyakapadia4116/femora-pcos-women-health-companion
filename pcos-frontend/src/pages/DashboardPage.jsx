import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  Activity, 
  Heart, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Droplet, 
  Flame, 
  Moon, 
  ArrowUpRight,
  Smile,
  AlertCircle,
  PlusCircle,
  ClipboardList
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ user, onOpenQuickLog, setCurrentRoute, onShowToast }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardSummary();
      if (data) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const d = dashboardData || {};
  const displayName = user?.full_name || d.user_name || 'User';
  const hasData = Boolean(d.has_data && (d.total_logs > 0 || d.cycle || (d.active_symptoms && d.active_symptoms.length > 0) || d.today_lifestyle));

  // Dynamic values when data exists
  const cycleDay = d?.cycle?.current_day || null;
  const cyclePhase = d?.cycle?.current_phase || 'Awaiting Cycle Log';
  const nextDays = d?.cycle?.next_period_days || null;
  const sleepHours = d?.today_lifestyle?.sleep_hours ?? null;
  const stepsCount = d?.today_lifestyle?.steps ? Number(d.today_lifestyle.steps).toLocaleString() : null;
  const waterLiters = d?.today_lifestyle?.water_liters ?? null;
  const symptomsList = Array.isArray(d?.active_symptoms) ? d.active_symptoms : [];
  const riskScore = d?.risk?.score ?? null;
  const riskLevel = d?.risk?.level || d?.risk?.category || 'Not Calculated';
  const phenotypeText = d?.risk?.phenotype ? d.risk.phenotype.split('(')[0] : (d?.risk?.guideline || 'Pending Assessment');
  const insightsList = Array.isArray(d?.latest_insights) ? d.latest_insights : [];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {displayName}! 👋
            </h1>
            {hasData && cyclePhase && (
              <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100 hidden sm:inline-block">
                {cyclePhase}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {hasData 
              ? "Here is your real-time health snapshot, predicted cycle window, and actionable lifestyle triggers."
              : "Welcome to your personal health companion. Start by logging your cycle, symptoms, or lifestyle habits to unlock real-time analytics."}
          </p>
        </div>

        <button
          onClick={onOpenQuickLog}
          className="px-6 py-3 rounded-full bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md hover:shadow-teal-700/20 active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>+ Log Today's Symptoms</span>
        </button>
      </div>

      {/* Onboarding Banner when NO data entered yet */}
      {!hasData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-teal-50 via-rose-50/40 to-slate-50 border border-teal-100/80 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-teal-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-full">
                Step 1: Record Your Health Data
              </span>
              <span className="text-xs font-semibold text-teal-800">
                0 logs recorded yet
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Your Analytics Will Automatically Generate From Your Logs
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              No pre-filled fake data is shown. As you log your period dates, daily physical symptoms, sleep, and lifestyle factors, our machine learning engine will calculate your cycle phases, identify personal flare-up triggers, and determine your clinical Rotterdam PCOS phenotype.
            </p>
          </div>

          {/* Direct Onboarding Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={onOpenQuickLog}
              className="p-5 bg-white rounded-2xl border border-teal-200/80 shadow-xs hover:shadow-md hover:border-teal-400 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  1. Log Daily Symptoms
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Rate bloating, acne, fatigue, or mood signals today.
                </p>
              </div>
              <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                Quick Log Now →
              </span>
            </button>

            <button
              onClick={() => setCurrentRoute('cycle')}
              className="p-5 bg-white rounded-2xl border border-rose-200/80 shadow-xs hover:shadow-md hover:border-rose-400 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                  2. Set Period Start Date
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Input your last menstrual start to predict ovulation.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                Open Cycle Tracker →
              </span>
            </button>

            <button
              onClick={() => setCurrentRoute('lifestyle')}
              className="p-5 bg-white rounded-2xl border border-emerald-200/80 shadow-xs hover:shadow-md hover:border-emerald-400 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  3. Track Lifestyle Habits
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Log sleep hours, water intake, stress, and activity.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                Log Lifestyle →
              </span>
            </button>

            <button
              onClick={() => setCurrentRoute('risk')}
              className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all text-left group cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  4. PCOS Risk Profiler
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Answer 5 clinical questions for Rotterdam Phenotype.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                Take Assessment →
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Cycle Status */}
        <div 
          onClick={() => setCurrentRoute('cycle')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs card-hover cursor-pointer space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 px-2.5 py-0.5 rounded-full bg-teal-50">
              Cycle Status
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {cycleDay ? `Day ${cycleDay}` : 'Not Logged'}
            </div>
            <div className="text-xs font-semibold text-teal-700 mt-0.5">
              {cyclePhase}
            </div>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-teal-700 h-full rounded-full transition-all duration-1000"
              style={{ width: cycleDay ? `${Math.min(100, (cycleDay / 38) * 100)}%` : '0%' }}
            ></div>
          </div>

          <p className="text-xs text-slate-500">
            {nextDays 
              ? <>Next period expected in <strong className="text-slate-700">~{nextDays} days</strong></>
              : "Click to log last period start date"}
          </p>
        </div>

        {/* Card 2: Today's Lifestyle */}
        <div 
          onClick={() => setCurrentRoute('lifestyle')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs card-hover cursor-pointer space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 px-2.5 py-0.5 rounded-full bg-emerald-50">
              Lifestyle Today
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {sleepHours !== null ? `${sleepHours} hrs` : 'No Log Today'}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-0.5">
              {sleepHours !== null ? 'Restful Sleep Score' : 'Awaiting Sleep Log'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-slate-600">
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Steps</span>
              <strong>{stepsCount ? stepsCount : '—'}</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Water</span>
              <strong>{waterLiters !== null ? `${waterLiters}L` : '—'}</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Active Symptoms */}
        <div 
          onClick={() => setCurrentRoute('symptoms')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs card-hover cursor-pointer space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-roseTint-100 text-rose-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 px-2.5 py-0.5 rounded-full bg-roseTint-100">
              Symptom Load
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {symptomsList.length > 0 ? `${symptomsList.length} Active` : '0 Active'}
            </div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">
              {symptomsList.length > 0 ? 'Logged Intensity' : 'No symptoms logged'}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {symptomsList.length > 0 ? (
              symptomsList.map((s, idx) => (
                <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg font-medium ${s.color || 'text-teal-700 bg-teal-50'}`}>
                  {s.name} ({s.severity}/10)
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">
                Tap + Log Symptoms to rate daily intensity
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Clinical Risk Score */}
        <div 
          onClick={() => setCurrentRoute('risk')}
          className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs card-hover cursor-pointer space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 px-2.5 py-0.5 rounded-full bg-amber-50">
              Risk Profile
            </span>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {riskScore !== null ? `${riskScore}%` : 'Pending'}
            </div>
            <div className="text-xs font-semibold text-amber-700 mt-0.5">
              {riskLevel}
            </div>
          </div>

          <div className="p-2 bg-amber-50/60 rounded-xl text-[11px] text-amber-900 leading-tight">
            <strong>Rotterdam:</strong> {phenotypeText}
          </div>
        </div>

      </div>

      {/* Main Content Grid: AI Insights & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Latest Analytics & Insights */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Intelligence & Correlations</h3>
                  <p className="text-xs text-slate-500">
                    {hasData 
                      ? "Multivariate lifestyle-symptom findings derived from your logged data"
                      : "Awaiting data logs to compute personal trigger correlations"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentRoute('analytics')}
                className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Full Analytics <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {insightsList.length > 0 ? (
                insightsList.map((insight, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4 hover:bg-teal-50/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 rounded-full bg-teal-100/60">
                        {insight.tag}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed pt-1">
                        {insight.text}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-xs shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-700 mx-auto flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">No correlation data generated yet</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Log at least 1-3 daily entries of sleep, hydration, and symptoms so our Pearson correlation engine can detect your unique metabolic triggers.
                    </p>
                  </div>
                  <button
                    onClick={onOpenQuickLog}
                    className="px-5 py-2 rounded-full bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Log First Entry Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Phase Guidance Card */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
            <div className="relative z-10 space-y-2 max-w-lg">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Phase Nutrition & Workout Guidance
              </span>
              <h4 className="text-xl font-bold">
                {hasData ? "Metabolic Support for Your Current Phase" : "Personalized Hormone Phase Recommendations"}
              </h4>
              <p className="text-xs text-teal-100 leading-relaxed">
                {hasData 
                  ? "Take advantage of your current hormonal window. Prioritize whole-food complex carbs, anti-inflammatory greens, and consistent strength training to stabilize insulin sensitivity."
                  : "Once you log your period dates, this card will automatically adapt each week to provide targeted nutrition and workout guidance synchronized to your menstrual phase."}
              </p>
            </div>
            <button
              onClick={() => setCurrentRoute(hasData ? 'personalized' : 'cycle')}
              className="relative z-10 px-6 py-3 rounded-full bg-white text-teal-900 text-xs font-bold hover:bg-teal-50 transition-all shrink-0 shadow-md cursor-pointer"
            >
              {hasData ? "Explore Guidance →" : "Set Cycle Date →"}
            </button>
          </div>
        </div>

        {/* Right 4 Cols: Quick Access & Clinical Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Hub Navigation */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Clinical & Module Hub
            </h3>

            <div className="space-y-2">
              {[
                { id: 'cycle', title: 'Cycle Calendar', sub: 'Ovulation & phase tracking', icon: CalendarDays, color: 'text-teal-700 bg-teal-50' },
                { id: 'symptoms', title: 'Symptom Logger', sub: 'Bloating, acne & fatigue rates', icon: Activity, color: 'text-rose-600 bg-rose-50' },
                { id: 'lifestyle', title: 'Lifestyle Track', sub: 'Sleep, stress, water & diet', icon: Heart, color: 'text-emerald-700 bg-emerald-50' },
                { id: 'risk', title: 'Risk Calculator', sub: 'Rotterdam Phenotype diagnosis', icon: ShieldAlert, color: 'text-amber-700 bg-amber-50' },
                { id: 'reports', title: 'Doctor Export', sub: 'Clinician consultation summary', icon: ArrowUpRight, color: 'text-indigo-700 bg-indigo-50' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentRoute(item.id)}
                    className="w-full p-3 rounded-2xl border border-slate-100 hover:border-teal-200 bg-slate-50/50 hover:bg-teal-50/30 flex items-center justify-between transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 group-hover:text-teal-800 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>


        </div>

      </div>
    </div>
  );
}
