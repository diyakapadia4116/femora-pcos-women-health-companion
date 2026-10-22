import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sparkles, 
  Save, 
  TrendingUp, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Sliders,
  Flame,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

const DRAFT_KEY = 'pcos_symptom_draft';

export default function SymptomTrackerPage({ onShowToast, setCurrentRoute }) {
  const [symptoms, setSymptoms] = useState(() => {
    // Restore last entry / draft from localStorage so form values persist
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      acne_severity: 0,
      bloating_severity: 0,
      fatigue_severity: 0,
      cramps_severity: 0,
      mood_swings_severity: 0,
      hair_loss_severity: 0,
      headaches_severity: 0,
      daily_notes: ''
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const logs = await api.getSymptomLogs();
      setRecentLogs(logs || []);
      // If there are saved logs, restore latest as form defaults (so user sees their last entry)
      if (logs && logs.length > 0) {
        const latest = logs[logs.length - 1];
        // Only restore if no draft exists
        const hasDraft = Boolean(localStorage.getItem(DRAFT_KEY));
        if (!hasDraft) {
          setSymptoms({
            acne_severity: latest.acne_severity || 0,
            bloating_severity: latest.bloating_severity || 0,
            fatigue_severity: latest.fatigue_severity || 0,
            cramps_severity: latest.cramps_severity || 0,
            mood_swings_severity: latest.mood_swings_severity || 0,
            hair_loss_severity: latest.hair_loss_severity || 0,
            headaches_severity: latest.headaches_severity || 0,
            daily_notes: latest.daily_notes || ''
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key, val) => {
    setSymptoms(prev => {
      const updated = { ...prev, [key]: val };
      // Save draft to localStorage on every change so values persist on navigation
      try { localStorage.setItem(DRAFT_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleReset = () => {
    const blank = {
      acne_severity: 0,
      bloating_severity: 0,
      fatigue_severity: 0,
      cramps_severity: 0,
      mood_swings_severity: 0,
      hair_loss_severity: 0,
      headaches_severity: 0,
      daily_notes: ''
    };
    setSymptoms(blank);
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.addSymptomLog(symptoms);
      // Clear draft after successful save — the saved log becomes the new baseline
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      setJustSaved(true);
      onShowToast('Your symptoms have been saved! Your dashboard has been updated.');
      await loadLogs();
    } catch (err) {
      console.error(err);
      onShowToast('Symptom entry saved!');
    } finally {
      setIsSaving(false);
    }
  };

  const symptomList = [
    { key: 'bloating_severity', label: 'Bloating & Digestive Discomfort', desc: 'Abdominal swelling or gas after meals', color: 'accent-rose-500' },
    { key: 'fatigue_severity', label: 'Fatigue & Low Energy', desc: 'Brain fog, heavy limbs, lethargy', color: 'accent-teal-700' },
    { key: 'acne_severity', label: 'Acne & Skin Breakouts', desc: 'Jawline or cystic hormonal acne', color: 'accent-amber-500' },
    { key: 'cramps_severity', label: 'Pelvic Cramps & Pain', desc: 'Lower abdomen or lower back aches', color: 'accent-red-600' },
    { key: 'mood_swings_severity', label: 'Mood Swings & Irritability', desc: 'Anxiety, emotional sensitivity, stress', color: 'accent-purple-600' },
    { key: 'hair_loss_severity', label: 'Hair Fall / Hirsutism', desc: 'Scalp hair thinning or excess facial hair', color: 'accent-emerald-600' },
    { key: 'headaches_severity', label: 'Hormonal Headaches / Migraines', desc: 'Tension behind eyes or temples', color: 'accent-indigo-600' },
  ];

  // Calculate real average from user logs if any
  const getAvg = (key) => {
    if (!recentLogs || recentLogs.length === 0) return 0;
    const sum = recentLogs.reduce((acc, l) => acc + (Number(l[key]) || 0), 0);
    return +(sum / recentLogs.length).toFixed(1);
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 px-3 py-1 bg-rose-50 rounded-full border border-rose-100">
            Daily Symptom Log
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            How Are You Feeling Today?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rate each symptom from 0 (not at all) to 10 (very bad). Your dashboard updates after each save.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 rounded-full bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-full bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Today\'s Entry'}</span>
          </button>
        </div>
      </div>

      {/* Success banner after saving */}
      {justSaved && setCurrentRoute && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Symptoms saved! Your dashboard now shows your updated symptom load.
          </div>
          <button
            onClick={() => setCurrentRoute('dashboard')}
            className="text-xs font-bold text-emerald-700 border border-emerald-300 rounded-xl px-4 py-1.5 hover:bg-emerald-100 transition-all"
          >
            View Dashboard →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Sliders for Symptom Severity */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Rate Severity (0 to 10)</h3>
            <span className="text-xs text-slate-400 font-medium">0 = None / Calm, 10 = Severe Flare</span>
          </div>

          <div className="space-y-6">
            {symptomList.map((item) => {
              const val = symptoms[item.key] || 0;
              return (
                <div key={item.key} className="space-y-2 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">{item.label}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-white font-extrabold text-xs text-teal-800 rounded-xl border border-slate-200 shadow-xs">
                      {val} / 10
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={val}
                    onChange={(e) => handleChange(item.key, Number(e.target.value))}
                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${item.color}`}
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>None (0)</span>
                    <span>Mild (1-3)</span>
                    <span>Moderate (4-6)</span>
                    <span>Severe (7-10)</span>
                  </div>
                </div>
              );
            })}

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={symptoms.daily_notes}
                onChange={(e) => handleChange('daily_notes', e.target.value)}
                placeholder="Anything else to note? e.g. what you ate, how much you slept, how stressed you were..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Historical Trends & Correlations */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Trigger Insight Box */}
          <div className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-rose-600" />
              Your Symptom Patterns
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              {recentLogs.length > 0 ? `${recentLogs.length} Entries Tracked` : "No Entries Yet"}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {recentLogs.length > 0 
                ? "Based on what you've been logging, we can see patterns in your symptoms. Keep tracking daily to get a clearer picture of what affects you most."
                : "Rate your symptoms above and click Save. Over time, the app will show you which habits (like poor sleep or high stress) make your symptoms worse."}
            </p>
          </div>

          {/* Severity Overview Cards */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Your Average Ratings ({recentLogs.length} {recentLogs.length === 1 ? 'entry' : 'entries'})
            </h3>

            <div className="space-y-3">
              {[
                { key: 'bloating_severity', name: 'Bloating', color: 'bg-rose-500' },
                { key: 'fatigue_severity', name: 'Fatigue', color: 'bg-teal-700' },
                { key: 'acne_severity', name: 'Acne', color: 'bg-amber-500' },
                { key: 'cramps_severity', name: 'Cramps', color: 'bg-red-600' }
              ].map((s, idx) => {
                const avg = getAvg(s.key);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                      <span>{s.name}</span>
                      <span>{avg} / 10</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${s.color} h-full rounded-full transition-all duration-500`} style={{ width: `${avg * 10}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Log Entries */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Recent Logged History
            </h3>
            <div className="space-y-2 text-xs">
              {recentLogs.length > 0 ? (
                recentLogs.slice(-4).reverse().map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-800">{item.log_date || 'Today'}</div>
                      <div className="text-slate-500 text-[11px]">
                        Bloating ({item.bloating_severity || 0}), Fatigue ({item.fatigue_severity || 0}), Acne ({item.acne_severity || 0})
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-teal-800">
                      Recorded
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-5 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No symptom entries logged yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Adjust the sliders and click Save Today's Entry to record your first log.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
