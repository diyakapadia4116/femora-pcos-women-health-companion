import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Sparkles, 
  Activity, 
  Brain, 
  PlusCircle,
  Moon,
  Zap,
  Wind,
  Heart,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { api } from "../services/api";

export default function AnalyticsPage({ setCurrentRoute, onShowToast }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalyticsOverview();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasData = analytics?.has_data && analytics?.symptom_trends && analytics.symptom_trends.length > 0;

  const insightCards = [
    {
      icon: Moon,
      color: "text-emerald-700 bg-emerald-50",
      badgeColor: "text-emerald-700 bg-emerald-50",
      badge: "Sleep & Energy",
      title: "Sleep affects how you feel every day",
      description: analytics?.correlations?.sleep_vs_fatigue
        ? "On the days you slept less, your tiredness was noticeably higher. Getting even 30 more minutes of sleep each night can make a big difference to how you feel."
        : "When you log your sleep, we will tell you how it is affecting your energy and mood.",
      barColor: "bg-emerald-500",
      barWidth: "82%",
      tip: "Aim for 7 to 8 hours of sleep tonight"
    },
    {
      icon: Zap,
      color: "text-rose-700 bg-rose-50",
      badgeColor: "text-rose-700 bg-rose-50",
      badge: "Stress & Bloating",
      title: "Stress makes bloating worse",
      description: analytics?.correlations?.stress_vs_bloating
        ? "Your logs show that on high-stress days, your belly bloating also goes up. Finding ways to relax, even a 10-minute walk, can help reduce this."
        : "Once you log your stress levels, we will show you how stress is affecting your tummy.",
      barColor: "bg-rose-500",
      barWidth: "74%",
      tip: "Try a short walk or deep breathing on stressful days"
    },
    {
      icon: Wind,
      color: "text-amber-700 bg-amber-50",
      badgeColor: "text-amber-700 bg-amber-50",
      badge: "Food & Skin",
      title: "Sugary food can trigger acne",
      description: analytics?.correlations?.carbs_vs_acne
        ? "Your entries show that on days you ate more sugary or processed food, your skin tended to break out more. Swapping to whole grains and fruits can help."
        : "Log what you eat and we will show you which foods are affecting your skin.",
      barColor: "bg-amber-500",
      barWidth: "65%",
      tip: "Try replacing sugary snacks with fruits or nuts"
    },
    {
      icon: Heart,
      color: "text-teal-700 bg-teal-50",
      badgeColor: "text-teal-700 bg-teal-50",
      badge: "Exercise & Cycle",
      title: "Moving your body helps your cycle",
      description: analytics?.correlations?.exercise_vs_regularity
        ? "On weeks when you walked or exercised more, your cycle was more regular. Even a 20-minute daily walk can make your periods more predictable."
        : "Start logging your steps or workouts and we will track how movement helps your cycle.",
      barColor: "bg-teal-600",
      barWidth: "58%",
      tip: "A daily 20-minute walk is a great place to start"
    }
  ];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
          Your Personal Health Patterns
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          What Your Logs Are Telling You
        </h1>
        <p className="text-sm text-slate-500">
          Based on your daily entries, here is what we found about how your habits and symptoms are connected.
        </p>
      </div>

      {!hasData ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
            <Brain className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Nothing to show yet, let us get started!</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              We need a few days of your logs to find patterns. It is easy, just tell us how you are feeling, how you slept, and what you ate each day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-xs font-bold text-teal-800">Step 1: Log How You Feel</div>
              <p className="text-[11px] text-slate-500">Tell us about bloating, tiredness, skin, and mood on a simple 0 to 10 scale.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-xs font-bold text-emerald-800">Step 2: Track Your Day</div>
              <p className="text-[11px] text-slate-500">Add how many hours you slept, how much water you drank, and how stressed you felt.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-xs font-bold text-indigo-800">Step 3: See Your Patterns</div>
              <p className="text-[11px] text-slate-500">After a few entries, we will show you exactly what is helping and what is making your symptoms worse.</p>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setCurrentRoute("symptoms")}
              className="px-6 py-3 rounded-full bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log How I Feel Today</span>
            </button>
            <button
              onClick={() => setCurrentRoute("lifestyle")}
              className="px-6 py-3 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
            >
              <span>Log Today&#39;s Habits</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Habit-Symptom Connection Cards */}
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-4">How Your Habits Affect Your Symptoms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {insightCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${card.badgeColor}`}>
                        {card.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{card.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.description}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${card.barColor} h-full rounded-full`} style={{ width: card.barWidth }}></div>
                    </div>
                    <p className="text-[11px] text-teal-700 font-medium">&#128161; {card.tip}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart + Triggers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Your Symptoms Over Time</h3>
                  <p className="text-xs text-slate-500">How your bloating, tiredness, and skin have been each day</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span><span>Bloating</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-teal-700"></span><span>Tiredness</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span><span>Skin / Acne</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 pb-2">
                <div className="h-64 w-full flex items-end justify-between gap-2 border-b border-slate-200 pb-2 px-2">
                  {analytics.symptom_trends.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1 h-48">
                        <div className="w-2.5 bg-rose-500 rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${((item.bloating || 0) / 10) * 100}%` }} title={`Bloating: ${item.bloating}/10`}></div>
                        <div className="w-2.5 bg-teal-700 rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${((item.fatigue || 0) / 10) * 100}%` }} title={`Tiredness: ${item.fatigue}/10`}></div>
                        <div className="w-2.5 bg-amber-400 rounded-t-md transition-all group-hover:opacity-80" style={{ height: `${((item.acne || 0) / 10) * 100}%` }} title={`Skin: ${item.acne}/10`}></div>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-2">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                &#128161; <strong>Keep logging:</strong> The more days you log, the more clearly we can see what is helping and what is making things harder for you.
              </p>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-teal-700" />
                  <h3 className="text-sm font-bold text-slate-800">What Is Triggering Your Symptoms</h3>
                </div>
                <div className="space-y-3">
                  {analytics.primary_triggers && analytics.primary_triggers.length > 0 ? (
                    analytics.primary_triggers.map((t, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-slate-900">{t.trigger}</span>
                          <span className="text-[10px] font-extrabold text-teal-700 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-100">{t.confidence} likely</span>
                        </div>
                        <p className="text-xs text-slate-600">{t.impact}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-500 bg-slate-50 rounded-xl">
                      Log at least 3 days in a row and we will start showing you exactly which habits or foods are making your symptoms better or worse.
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-teal-50/70 border border-teal-200/80 space-y-2">
                <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider">You are doing great! &#127800;</span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Every entry you make helps us learn more about your body. Small changes like drinking more water or sleeping earlier can add up to big improvements over time.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
