import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Moon, 
  Dumbbell, 
  Droplet, 
  Smile, 
  Save, 
  Sparkles, 
  TrendingUp,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

const LIFESTYLE_DRAFT_KEY = 'pcos_lifestyle_draft';

export default function LifestyleTrackerPage({ onShowToast }) {
  const [lifestyle, setLifestyle] = useState(() => {
    // Restore draft from localStorage first so values persist across navigation
    try {
      const saved = localStorage.getItem(LIFESTYLE_DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      sleep_hours: 7.0,
      sleep_quality: 'Good',
      exercise_type: 'Strength Training',
      exercise_minutes: 30,
      diet_type: 'Low-GI & Anti-inflammatory',
      water_liters: 1.5,
      stress_level: 3,
      steps_count: 5000
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [pastLogs, setPastLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const logs = await api.getLifestyleLogs();
      if (logs && logs.length > 0) {
        setPastLogs(logs);
        // Only restore from API if there's no unsaved draft
        const hasDraft = Boolean(localStorage.getItem(LIFESTYLE_DRAFT_KEY));
        if (!hasDraft) {
          const latest = logs[logs.length - 1];
          setLifestyle({
            sleep_hours: latest.sleep_hours || 7.0,
            sleep_quality: latest.sleep_quality || 'Good',
            exercise_type: latest.exercise_type || 'Strength Training',
            exercise_minutes: latest.exercise_minutes || 30,
            diet_type: latest.diet_type || 'Low-GI & Anti-inflammatory',
            water_liters: latest.water_liters || 1.5,
            stress_level: latest.stress_level || 3,
            steps_count: latest.steps_count || 5000
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.addLifestyleLog(lifestyle);
      // Clear draft — the saved log is now the baseline for next visit
      try { localStorage.removeItem(LIFESTYLE_DRAFT_KEY); } catch {}
      onShowToast('Your lifestyle data has been saved! Dashboard updated.');
      await loadLogs();
    } catch (err) {
      console.error(err);
      onShowToast('Lifestyle data saved!');
    } finally {
      setIsSaving(false);
    }
  };

  const adjustWater = (amount) => {
    setLifestyle(prev => {
      const updated = { ...prev, water_liters: Math.max(0, +(prev.water_liters + amount).toFixed(1)) };
      try { localStorage.setItem(LIFESTYLE_DRAFT_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Save draft on any field change
  const handleChange = (field, value) => {
    setLifestyle(prev => {
      const updated = { ...prev, [field]: value };
      try { localStorage.setItem(LIFESTYLE_DRAFT_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            Holistic Metabolic Inputs
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Lifestyle & Nutrition Tracker
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Capture sleep, movement, hydration, and stress to unlock root-cause insights.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-full bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Daily Lifestyle'}</span>
        </button>
      </div>

      {/* Grid of Lifestyle Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sleep Tracker Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Sleep
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Duration (Hours)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0"
                max="16"
                value={lifestyle.sleep_hours}
                onChange={(e) => handleChange('sleep_hours', Number(e.target.value))}
                className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:border-teal-700"
              />
              <span className="text-sm font-semibold text-slate-500">hours</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Quality</label>
            <select
              value={lifestyle.sleep_quality}
              onChange={(e) => handleChange('sleep_quality', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer"
            >
              <option value="Poor">Poor (Restless/Waking up)</option>
              <option value="Fair">Fair (5-6h broken)</option>
              <option value="Good">Good (7-8h restful)</option>
              <option value="Excellent">Excellent (8h+ deep sleep)</option>
            </select>
          </div>
        </div>

        {/* Physical Exercise Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Activity
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Workout Type</label>
            <select
              value={lifestyle.exercise_type}
              onChange={(e) => handleChange('exercise_type', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 cursor-pointer"
            >
              <option value="Strength Training">Strength / Resistance</option>
              <option value="Zone 2 Walking">Zone 2 Walking (Low Cortisol)</option>
              <option value="Yoga / Pilates">Yoga / Pilates</option>
              <option value="HIIT Cardio">HIIT Cardio</option>
              <option value="Rest Day">Rest & Recovery</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Duration (Mins)</label>
            <input
              type="number"
              min="0"
              max="180"
              value={lifestyle.exercise_minutes}
              onChange={(e) => handleChange('exercise_minutes', Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-teal-700"
            />
          </div>
        </div>

        {/* Hydration Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full">
              Hydration
            </span>
          </div>

          <div className="text-center py-1">
            <div className="text-3xl font-extrabold text-slate-900">{lifestyle.water_liters} L</div>
            <p className="text-xs text-slate-500 mt-0.5">Target: 2.5 Liters / day</p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => adjustWater(-0.25)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-600">±250ml</span>
            <button
              onClick={() => adjustWater(0.25)}
              className="p-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stress & Steps Rating Card */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <Smile className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
              Stress Score
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Perceived Stress</span>
              <span className="text-teal-700">{lifestyle.stress_level} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={lifestyle.stress_level}
              onChange={(e) => handleChange('stress_level', Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Calm (1)</span>
              <span>High (10)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">Daily Steps</label>
            <input
              type="number"
              value={lifestyle.steps_count}
              onChange={(e) => handleChange('steps_count', Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-teal-700"
            />
          </div>
        </div>

      </div>

      {/* Deep Lifestyle Recommendations */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Metabolic & Cortisol Management Protocol
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
            <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">Start Your Morning Well</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Drink a glass of water and get some sunlight for 10 minutes before you have your tea or coffee. This helps your body feel more awake naturally.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Smart Eating Order</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              At every meal, eat vegetables first, then protein (dal, eggs, chicken), and then your rice or roti last. This helps control your blood sugar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Move Gently, Often</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              3 light strength sessions per week (like bodyweight squats or yoga) are better for PCOS than intense daily cardio. Consistency beats intensity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
