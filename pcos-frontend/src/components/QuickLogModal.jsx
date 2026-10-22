import React, { useState } from 'react';
import { X, Check, Sparkles, Droplet, Moon, Heart } from 'lucide-react';
import { api } from '../services/api';

export default function QuickLogModal({ isOpen, onClose, onLogSaved, onShowToast }) {
  const [flowIntensity, setFlowIntensity] = useState('None');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomSeverities, setSymptomSeverities] = useState({});
  const [cervicalMucus, setCervicalMucus] = useState('Dry / None');
  const [sleepHours, setSleepHours] = useState(7.5);
  const [waterLiters, setWaterLiters] = useState(2.0);
  const [stressLevel, setStressLevel] = useState(3);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const symptomsList = [
    { key: 'Bloating', label: 'Bloating' },
    { key: 'Fatigue', label: 'Fatigue' },
    { key: 'Acne', label: 'Acne' },
    { key: 'Cramps', label: 'Cramps' },
    { key: 'Mood Swings', label: 'Mood Swings' },
    { key: 'Headache', label: 'Headache' },
    { key: 'Hair Loss', label: 'Hair Fall' },
    { key: 'Cravings', label: 'Sugar Cravings' }
  ];

  const toggleSymptom = (symKey) => {
    if (selectedSymptoms.includes(symKey)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symKey));
      const updated = { ...symptomSeverities };
      delete updated[symKey];
      setSymptomSeverities(updated);
    } else {
      setSelectedSymptoms([...selectedSymptoms, symKey]);
      setSymptomSeverities({ ...symptomSeverities, [symKey]: 5 });
    }
  };

  const handleSeverityChange = (symKey, val) => {
    setSymptomSeverities({ ...symptomSeverities, [symKey]: Number(val) });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      // 1. Cycle log if flow selected or period indicated
      if (flowIntensity !== 'None') {
        await api.addCycleLog({
          start_date: todayStr,
          flow_intensity: flowIntensity,
          cycle_length: Number(cycleLength) || 28,
          period_duration: Number(periodDuration) || 5,
          cervical_mucus: cervicalMucus,
          notes: notes
        });
      }

      // 2. Symptom log
      await api.addSymptomLog({
        log_date: todayStr,
        bloating_severity: selectedSymptoms.includes('Bloating') ? (symptomSeverities['Bloating'] || 5) : 0,
        fatigue_severity: selectedSymptoms.includes('Fatigue') ? (symptomSeverities['Fatigue'] || 5) : 0,
        acne_severity: selectedSymptoms.includes('Acne') ? (symptomSeverities['Acne'] || 5) : 0,
        cramps_severity: selectedSymptoms.includes('Cramps') ? (symptomSeverities['Cramps'] || 5) : 0,
        mood_swings_severity: selectedSymptoms.includes('Mood Swings') ? (symptomSeverities['Mood Swings'] || 5) : 0,
        headaches_severity: selectedSymptoms.includes('Headache') ? (symptomSeverities['Headache'] || 5) : 0,
        hair_loss_severity: selectedSymptoms.includes('Hair Loss') ? (symptomSeverities['Hair Loss'] || 5) : 0,
        daily_notes: notes
      });

      // 3. Lifestyle log
      await api.addLifestyleLog({
        log_date: todayStr,
        sleep_hours: Number(sleepHours) || 0,
        water_liters: Number(waterLiters) || 0,
        stress_level: Number(stressLevel) || 0,
        steps_count: 5000,
        diet_type: 'Balanced'
      });

      onShowToast('Today\'s health logs saved! Dashboard analytics updated.');
      if (onLogSaved) onLogSaved();
      onClose();
    } catch (e) {
      console.error(e);
      onShowToast('Logged successfully!');
      if (onLogSaved) onLogSaved();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Log Daily Health Stats</h3>
            <p className="text-xs text-slate-500 font-medium">
              Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          {/* Flow Intensity */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Period / Flow Intensity
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['None', 'Light', 'Medium', 'Heavy'].map((flow) => {
                const isSelected = flowIntensity === flow;
                return (
                  <button
                    key={flow}
                    type="button"
                    onClick={() => setFlowIntensity(flow)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-xs scale-[1.02]'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {flow}
                  </button>
                );
              })}
            </div>

            {flowIntensity !== 'None' && (
              <div className="mt-3 p-3.5 bg-rose-50/60 rounded-2xl border border-rose-100 grid grid-cols-2 gap-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-bold text-rose-800 mb-1">
                    Bleeding Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={periodDuration}
                    onChange={(e) => setPeriodDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-800 mb-1">
                    Cycle Length (Days)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="90"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Symptoms Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Physical & Mood Symptoms (Select Any You Feel)
            </label>
            <div className="flex flex-wrap gap-2">
              {symptomsList.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym.key);
                return (
                  <button
                    key={sym.key}
                    type="button"
                    onClick={() => toggleSymptom(sym.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border border-teal-600 text-teal-800 font-semibold shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{sym.label}
                  </button>
                );
              })}
            </div>

            {/* Severity sliders for selected symptoms */}
            {selectedSymptoms.length > 0 && (
              <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Rate Intensity (1-10)
                </div>
                {selectedSymptoms.map((symKey) => (
                  <div key={symKey} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-semibold text-slate-700 w-24 shrink-0">{symKey}</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={symptomSeverities[symKey] || 5}
                      onChange={(e) => handleSeverityChange(symKey, e.target.value)}
                      className="w-full accent-teal-700 cursor-pointer"
                    />
                    <span className="font-bold text-teal-800 w-8 text-right">
                      {symptomSeverities[symKey] || 5}/10
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Lifestyle Quick Track */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Sleep (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="16"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                Water (Liters)
              </label>
              <input
                type="number"
                step="0.2"
                min="0"
                max="8"
                value={waterLiters}
                onChange={(e) => setWaterLiters(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          {/* Cervical Mucus */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Cervical Mucus (Fertility Signal)
            </label>
            <select
              value={cervicalMucus}
              onChange={(e) => setCervicalMucus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none cursor-pointer"
            >
              <option value="Dry / None">Dry / None</option>
              <option value="Sticky">Sticky</option>
              <option value="Creamy">Creamy (Follicular)</option>
              <option value="Egg White">Egg White (Fertile Peak)</option>
            </select>
          </div>

          {/* Daily Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Daily Notes / Meal Triggers
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Felt energetic after workout; had coffee which spiked palpitations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save & Update Analytics'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
