import React, { useState, useEffect } from "react";
import {
  Sparkles, Utensils, Dumbbell, Moon, Leaf,
  Clock, CheckCircle2, AlertTriangle, TrendingUp, Heart, Droplet, Zap
} from "lucide-react";
import { api } from "../services/api";

// ── meal data ─────────────────────────────────────────────────────────────────
const MEALS = {
  veg: [
    {
      meal: "Breakfast", time: "8:00 – 9:00 AM",
      title: "Vegetable Oats Upma or Moong Dal Chilla",
      desc: "A bowl of oats cooked with vegetables (carrots, peas, tomato) OR 2-3 moong dal chillas with mint chutney. Add a cup of spearmint tea.",
      benefit: "Keeps your blood sugar steady in the morning and gives you energy without a crash."
    },
    {
      meal: "Lunch", time: "12:30 – 1:30 PM",
      title: "Dal, Sabzi, and Brown Rice or Roti",
      desc: "1-2 small rotis or a small bowl of brown rice with any dal (masoor, moong, or chana) and a green sabzi like palak or bhindi.",
      benefit: "Dal gives your body the protein it needs for healthy hormones. Green vegetables reduce bloating."
    },
    {
      meal: "Afternoon Snack", time: "4:00 – 5:00 PM",
      title: "Roasted Chana or Fruit with Seeds",
      desc: "A small bowl of roasted chana (chickpeas) OR an apple or pear with a tablespoon of pumpkin seeds or walnuts.",
      benefit: "Keeps energy up between meals and stops sugar cravings before dinner."
    },
    {
      meal: "Dinner", time: "7:00 – 8:00 PM",
      title: "Paneer Sabzi or Rajma with Salad",
      desc: "Grilled or lightly cooked paneer with mixed vegetables OR a small bowl of rajma (kidney beans) curry. Add a fresh salad on the side.",
      benefit: "Light but filling. Paneer and rajma are great for protein without spiking blood sugar."
    }
  ],
  nonveg: [
    {
      meal: "Breakfast", time: "8:00 – 9:00 AM",
      title: "Boiled or Scrambled Eggs with Vegetables",
      desc: "2 boiled or scrambled eggs with a handful of spinach, tomatoes, and half an avocado. Add a cup of spearmint tea on the side.",
      benefit: "Eggs in the morning keep you full for hours and do not spike your blood sugar."
    },
    {
      meal: "Lunch", time: "12:30 – 1:30 PM",
      title: "Grilled Chicken or Fish with Dal and Salad",
      desc: "A palm-sized piece of grilled chicken breast or fish with a small bowl of dal and a green salad with olive oil dressing.",
      benefit: "Gives your body the good protein and healthy fats it needs to make balanced hormones."
    },
    {
      meal: "Afternoon Snack", time: "4:00 – 5:00 PM",
      title: "Boiled Egg or Nuts and Berries",
      desc: "1 boiled egg OR a handful of mixed nuts (almonds, walnuts) with half a cup of blueberries or strawberries.",
      benefit: "Great for keeping energy up without a sugar crash before dinner."
    },
    {
      meal: "Dinner", time: "7:00 – 8:00 PM",
      title: "Grilled Fish or Chicken with Roasted Vegetables",
      desc: "Grilled fish or chicken with roasted vegetables (broccoli, capsicum, sweet potato). Add a pinch of cinnamon to your meal or drink.",
      benefit: "Cinnamon helps your body use sugar better, which is especially good for PCOS."
    }
  ]
};

// ── fitness data ──────────────────────────────────────────────────────────────
const getWorkoutSuggestion = (steps, stress, fatigue) => {
  if (fatigue >= 7 || stress >= 7) return "gentle";
  if (steps >= 8000) return "strength";
  return "walking";
};

// ── PersonalizedPathPage ──────────────────────────────────────────────────────
export default function PersonalizedPathPage({ user, onShowToast }) {
  const [activeTab, setActiveTab] = useState("nutrition");
  const [dietPref, setDietPref] = useState(
    () => localStorage.getItem("pcos_diet_pref") || "veg"
  );
  const [dashboard, setDashboard] = useState(null);
  const [lifestyle, setLifestyle] = useState(null);

  // fetch user data
  useEffect(() => {
    const load = async () => {
      try {
        const d = await api.getDashboardSummary();
        setDashboard(d);
        if (d?.today_lifestyle) setLifestyle(d.today_lifestyle);
      } catch (e) { /* no data yet */ }
    };
    load();
  }, []);

  const saveDietPref = (pref) => {
    setDietPref(pref);
    localStorage.setItem("pcos_diet_pref", pref);
    if (onShowToast) onShowToast(`Diet preference saved: ${pref === "veg" ? "Vegetarian" : "Non-Vegetarian"}`);
  };

  // derive personalized signals from daily data
  const sleepHrs = lifestyle?.sleep_hours ?? null;
  const stressScore = lifestyle?.stress_score ?? null;
  const waterL = lifestyle?.water_liters ?? null;
  const steps = lifestyle?.steps ? Number(lifestyle.steps) : null;
  const activeSymptoms = Array.isArray(dashboard?.active_symptoms) ? dashboard.active_symptoms : [];
  const hasBloating = activeSymptoms.some(s => s.name?.toLowerCase().includes("bloat"));
  const hasFatigue = activeSymptoms.some(s => s.name?.toLowerCase().includes("fatig") || s.name?.toLowerCase().includes("tired"));
  const hasAcne = activeSymptoms.some(s => s.name?.toLowerCase().includes("acne") || s.name?.toLowerCase().includes("skin"));
  const cyclePhase = dashboard?.cycle?.current_phase || null;
  const cycleDay = dashboard?.cycle?.current_day || null;

  const workoutType = getWorkoutSuggestion(steps, stressScore, hasFatigue ? 8 : 3);
  const meals = MEALS[dietPref];

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
          Just For You
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          Your Personal Wellness Plan
        </h1>
        <p className="text-sm text-slate-500">
          Tips for food, movement, rest, and supplements — updated based on what you logged today.
          {cyclePhase && <span className="ml-1 font-semibold text-teal-700">You are in your <span className="underline underline-offset-2">{cyclePhase}</span>{cycleDay ? ` (Day ${cycleDay})` : ""}.</span>}
        </p>

        {/* Personalized insight banner from today's data */}
        {dashboard?.has_data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {sleepHrs !== null && (
              <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-medium ${sleepHrs < 6 ? "bg-rose-50 border border-rose-100 text-rose-800" : "bg-emerald-50 border border-emerald-100 text-emerald-800"}`}>
                <Moon className="w-4 h-4 shrink-0" />
                <span>{sleepHrs < 6 ? `You only slept ${sleepHrs} hrs last night. Rest more today.` : `Good! You slept ${sleepHrs} hrs last night.`}</span>
              </div>
            )}
            {stressScore !== null && (
              <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-medium ${stressScore >= 7 ? "bg-amber-50 border border-amber-100 text-amber-800" : "bg-teal-50 border border-teal-100 text-teal-800"}`}>
                <Zap className="w-4 h-4 shrink-0" />
                <span>{stressScore >= 7 ? "High stress today. Take it easy and try the breathing exercise." : "Your stress is manageable today. Great!"}</span>
              </div>
            )}
            {waterL !== null && (
              <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-medium ${waterL < 2 ? "bg-sky-50 border border-sky-100 text-sky-800" : "bg-teal-50 border border-teal-100 text-teal-800"}`}>
                <Droplet className="w-4 h-4 shrink-0" />
                <span>{waterL < 2 ? `Only ${waterL}L water so far. Try to reach 2.5L today.` : `Great hydration! ${waterL}L water today.`}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3">
        {[
          { id: "nutrition", label: "What to Eat", icon: Utensils },
          { id: "fitness", label: "How to Move", icon: Dumbbell },
          { id: "stress", label: "Rest & Stress", icon: Moon },
          { id: "supplements", label: "Helpful Supplements", icon: Leaf },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${isActive ? "bg-teal-700 text-white shadow-md shadow-teal-700/20" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── WHAT TO EAT ────────────────────────────────────────────────────── */}
      {activeTab === "nutrition" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">

            {/* Veg / Non-Veg toggle */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">A Simple Meal Guide for Today</h3>
              <p className="text-xs text-slate-500 mt-1">These foods are gentle on your hormones and help keep your energy steady. Choose your food preference below:</p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => saveDietPref("veg")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${dietPref === "veg" ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"}`}
                >
                  🥦 Vegetarian
                </button>
                <button
                  onClick={() => saveDietPref("nonveg")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${dietPref === "nonveg" ? "bg-rose-600 text-white border-rose-600 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-rose-400"}`}
                >
                  🍗 Non-Vegetarian
                </button>
              </div>
            </div>

            {/* Symptom-based food note */}
            {(hasBloating || hasAcne) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-800 space-y-1">
                <div className="font-bold">&#x26A0;&#xFE0F; Based on your symptoms today:</div>
                {hasBloating && <div>&#x2022; You have bloating — avoid raw onion, beans, and fizzy drinks today. Eat smaller meals.</div>}
                {hasAcne && <div>&#x2022; You have skin breakouts — stay away from fried food, dairy, and sweets today.</div>}
              </div>
            )}

            {/* Meals list */}
            <div className="space-y-4">
              {meals.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 hover:border-teal-200 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">{item.meal}</span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  <p className="text-[11px] text-teal-800 font-medium pt-1">&#x2728; {item.benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Seed Cycling Guide */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Seed Cycling: A Simple Natural Tip</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Eating certain seeds at different parts of your cycle may help balance your hormones gently:
              </p>
              <div className={`p-4 rounded-2xl space-y-2 ${!cycleDay || cycleDay <= 14 ? "bg-teal-50/70 border border-teal-200/80" : "bg-slate-50 border border-slate-200"}`}>
                <span className="text-[11px] font-bold text-teal-800 uppercase">Days 1 to 14 {(!cycleDay || cycleDay <= 14) && cycleDay ? "← You are here" : ""}</span>
                <h5 className="text-xs font-bold text-slate-900">Flaxseeds + Pumpkin Seeds</h5>
                <p className="text-xs text-slate-600 leading-relaxed">1 tablespoon of each daily — add to yogurt, smoothie, or sprinkle on food. Helps balance estrogen.</p>
              </div>
              <div className={`p-4 rounded-2xl space-y-2 ${cycleDay && cycleDay > 14 ? "bg-rose-50/70 border border-rose-200/80" : "bg-slate-50 border border-slate-200"}`}>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Days 15 onwards {cycleDay && cycleDay > 14 ? "← You are here" : ""}</span>
                <h5 className="text-xs font-bold text-slate-800">Sesame Seeds + Sunflower Seeds</h5>
                <p className="text-xs text-slate-500 leading-relaxed">Switch to 1 tablespoon of each per day. Supports progesterone for better mood and cycle regularity.</p>
              </div>
              <p className="text-[11px] text-slate-400 italic">This is a gentle natural approach, not a replacement for medical advice.</p>
            </div>

            {/* What to avoid card */}
            <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-rose-800">Foods to Avoid with PCOS</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {["Sugary drinks and juices", "White bread, maida, and refined flour", "Packaged and processed snacks", "Fried food (samosa, chips, etc.)", "Too much dairy (especially full-fat)", "Alcohol"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── HOW TO MOVE ─────────────────────────────────────────────────────── */}
      {activeTab === "fitness" && (
        <div className="space-y-6">
          {/* Personalized workout tip */}
          {dashboard?.has_data ? (
            <div className={`p-5 rounded-2xl border text-sm font-medium ${workoutType === "gentle"
              ? "bg-indigo-50 border-indigo-100 text-indigo-800"
              : workoutType === "strength"
                ? "bg-teal-50 border-teal-100 text-teal-800"
                : "bg-emerald-50 border-emerald-100 text-emerald-800"
              }`}>
              {workoutType === "gentle" && "Based on your logs today (high stress or tiredness), we suggest gentle movement like yoga or a slow walk — not a hard workout. Rest is also progress!"}
              {workoutType === "strength" && "You are already moving well (high step count)! Today is a great day to add some light strength exercises to build on your momentum."}
              {workoutType === "walking" && "Based on your step count today, a 30-minute walk would be a great addition. It is one of the most helpful exercises for PCOS."}
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-teal-50 border border-teal-100">
              <p className="text-sm text-teal-800 font-medium">&#x1F4AA; Exercise is one of the best things you can do for PCOS. Gentle and consistent movement is better than intense workouts. Start small!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 bg-white rounded-3xl border shadow-xs space-y-4 ${workoutType === "strength" ? "border-teal-300 ring-2 ring-teal-100" : "border-slate-200/80"}`}>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Option 1: Strength</div>
                {workoutType === "strength" && <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Recommended Today</span>}
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bodyweight Exercises at Home</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Squats, lunges, glute bridges, and push-ups. Do 3 sets of 10 each. You do not need a gym — a mat at home is enough.</p>
              <div className="p-3 bg-teal-50 rounded-xl text-xs text-teal-800 font-medium">&#x1F525; Best in the first two weeks of your cycle when energy is higher.</div>
            </div>

            <div className={`p-6 bg-white rounded-3xl border shadow-xs space-y-4 ${workoutType === "walking" ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200/80"}`}>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Option 2: Walking</div>
                {workoutType === "walking" && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Recommended Today</span>}
              </div>
              <h3 className="text-lg font-bold text-slate-900">A 30-Minute Walk Every Day</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Walking at a comfortable pace for 30 minutes helps your hormones, reduces bloating, and makes your periods more regular. Try after lunch or dinner.</p>
              <div className="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 font-medium">&#x1F33F; Walking after meals helps your body process food and keeps blood sugar steady.</div>
            </div>

            <div className={`p-6 bg-white rounded-3xl border shadow-xs space-y-4 ${workoutType === "gentle" ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-200/80"}`}>
              <div className="flex justify-between items-center">
                <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Option 3: Gentle Yoga</div>
                {workoutType === "gentle" && <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">Recommended Today</span>}
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gentle Yoga or Stretching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Simple yoga poses or a 15-minute stretch. Great on low-energy or high-stress days, and around your period. Helps with bloating and back pain.</p>
              <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-800 font-medium">&#x1F9D8; Yoga lowers stress hormones, which is very helpful for PCOS.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── REST AND STRESS ──────────────────────────────────────────────────── */}
      {activeTab === "stress" && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">How to Rest Better and Stress Less</h3>
            <p className="text-xs text-slate-500 mt-1">Stress and poor sleep make PCOS symptoms much worse. These small daily habits can make a big difference.</p>
          </div>

          {stressScore !== null && stressScore >= 7 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
              &#x26A0;&#xFE0F; Your stress score today is {stressScore}/10. Please try the breathing exercise below before bed tonight. High stress raises hormones that worsen PCOS.
            </div>
          )}

          {sleepHrs !== null && sleepHrs < 6 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              &#x1F6CF;&#xFE0F; You only slept {sleepHrs} hours last night. PCOS symptoms like acne and bloating get worse with poor sleep. Try to be in bed by 10:30 PM tonight.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">A Breathing Exercise for Calm</h4>
              <p className="text-xs text-slate-700 leading-relaxed">Try this before bed: breathe in through your nose for 4 seconds, hold for 7 seconds, then breathe out slowly for 8 seconds. Repeat 4 times. Simple but very effective.</p>
              <p className="text-[11px] text-indigo-600 font-medium">&#x1F4A4; Do this every night before sleeping</p>
            </div>
            <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-100 space-y-2">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Be Careful with Coffee</h4>
              <p className="text-xs text-slate-700 leading-relaxed">Never drink coffee on an empty stomach. It raises your stress hormones and makes PCOS worse. Always eat something small first — even just a handful of nuts. Limit to 1 cup per day.</p>
              <p className="text-[11px] text-teal-600 font-medium">&#x2615; Eat before your first coffee of the day</p>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-100 space-y-2">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Protect Your Sleep</h4>
              <p className="text-xs text-slate-700 leading-relaxed">Put away your phone and dim the lights at least 1 hour before bed. Bright screens at night stop your brain from getting sleepy. A dark, cool, quiet room helps you sleep deeply.</p>
              <p className="text-[11px] text-rose-600 font-medium">&#x1F319; Try to be in bed by 10:30 PM</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">&#x2B50; One Small Habit That Helps</h4>
            <p className="text-xs text-slate-700 leading-relaxed">Spend 5 minutes each morning writing 3 things you are grateful for. This simple habit has been shown to lower stress and even help with hormone balance over time. Keep a notebook by your bed.</p>
          </div>
        </div>
      )}

      {/* ── SUPPLEMENTS ─────────────────────────────────────────────────────── */}
      {activeTab === "supplements" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 leading-relaxed">
              &#x26A0;&#xFE0F; <strong>Please note:</strong> Always check with your doctor before starting any supplement. These are general suggestions that research shows can help with PCOS, but every person is different.
            </p>
          </div>

          {/* Symptom-based supplement note */}
          {(hasFatigue || hasAcne || hasBloating) && (
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 text-xs text-teal-800 space-y-1">
              <div className="font-bold">&#x1F4A1; Based on your symptoms today, pay extra attention to:</div>
              {hasFatigue && <div>&#x2022; Magnesium — helps with tiredness and sleep quality</div>}
              {hasAcne && <div>&#x2022; Spearmint Tea — shown to gently reduce the hormones that cause acne and hair growth</div>}
              {hasBloating && <div>&#x2022; Vitamin D3 — low levels are linked to more bloating and irregular periods</div>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Inositol (Myo-Inositol)", dose: "2,000 to 4,000 mg per day with food", why: "The most studied supplement for PCOS. It helps your body respond better to blood sugar hormones, which can make your periods more regular and reduce acne and unwanted hair growth.", badge: "Most Helpful" },
              { name: "Magnesium", dose: "300 to 400 mg before bedtime", why: "Many women with PCOS are low in magnesium. Taking it before bed helps you sleep better, feel less anxious, and manage blood sugar more easily.", badge: "Good for Sleep" },
              { name: "Spearmint Tea", dose: "2 cups of freshly brewed tea per day", why: "Studies show spearmint tea can gently reduce the extra male hormones that PCOS causes. This helps with facial hair and acne over time. It is calming and easy to add to your daily routine.", badge: "Natural Option" },
              { name: "Vitamin D3", dose: "1,000 to 2,000 IU per day with your main meal", why: "Most women with PCOS have low Vitamin D. Getting enough helps with mood, blood sugar, and more regular periods. A simple blood test from your doctor can check your current levels.", badge: "Check Your Levels" },
            ].map((supp, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-slate-900">{supp.name}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full shrink-0 ml-2">{supp.badge}</span>
                </div>
                <p className="text-xs font-semibold text-teal-800">How much: {supp.dose}</p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">{supp.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}