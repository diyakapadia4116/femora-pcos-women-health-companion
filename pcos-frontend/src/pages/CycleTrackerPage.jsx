import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Droplet, 
  Heart, 
  Plus, 
  CheckCircle2,
  Info,
  Clock,
  Save,
  Trash2,
  Edit3,
  Calendar as CalendarIcon,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

// Timezone-safe local ISO string formatting (YYYY-MM-DD)
const toLocalIso = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalIso = (isoStr) => {
  if (!isoStr) return null;
  const parts = isoStr.split('-');
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
};

export default function CycleTrackerPage({ onOpenQuickLog, onShowToast }) {
  const [cycleData, setCycleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState(null);

  // Month navigation state
  const [viewDate, setViewDate] = useState(() => new Date());

// Form state
  const [newLog, setNewLog] = useState({
    start_date: '',
    period_duration: 5,
    cycle_length: 28,
    flow_intensity: 'Medium',
    cervical_mucus: 'Dry / None',
    notes: ''
  });

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      setLoading(true);
      const data = await api.getCycleLogs();
      setCycleData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewLog = (prefillDate = null) => {
    setEditingId(null);
    setNewLog({
      start_date: prefillDate || '',
      period_duration: 5,
      cycle_length: 28,
      flow_intensity: 'Medium',
      cervical_mucus: 'Dry / None',
      notes: ''
    });
    setShowLogForm(true);
    if (prefillDate) {
      const d = parseLocalIso(prefillDate);
      setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  };

  const handleStartEditLog = (log) => {
    setEditingId(log.id);
    setNewLog({
      start_date: log.start_date,
      period_duration: Number(log.period_duration || log.duration) || 5,
      cycle_length: Number(log.cycle_length || log.length) || 28,
      flow_intensity: log.flow_intensity || log.flow || 'Medium',
      cervical_mucus: log.cervical_mucus || 'Dry / None',
      notes: log.notes || ''
    });
    setShowLogForm(true);
    const d = parseLocalIso(log.start_date);
    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const handleSaveCycle = async (e) => {
    e.preventDefault();
    if (!newLog.start_date) {
      onShowToast('Please select your period start date.');
      return;
    }
    setIsSaving(true);
    try {
      if (editingId) {
        await api.updateCycleLog(editingId, {
          ...newLog,
          cycle_length: Number(newLog.cycle_length) || 28,
          period_duration: Number(newLog.period_duration) || 5
        });
        onShowToast('Cycle entry updated! Calendar and predictions refreshed.');
      } else {
        await api.addCycleLog({
          ...newLog,
          cycle_length: Number(newLog.cycle_length) || 28,
          period_duration: Number(newLog.period_duration) || 5
        });
        onShowToast('Period log saved! Calendar generated and highlighted.');
      }
      setShowLogForm(false);
      setEditingId(null);
      await loadCycleData();
      setSelectedDayInfo(null);
    } catch (err) {
      console.error(err);
      onShowToast('Saved cycle entry!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCycle = async (id) => {
    if (window.confirm('Are you sure you want to delete this period entry?')) {
      try {
        await api.deleteCycleLog(id);
        onShowToast('Period entry removed. Calendar refreshed.');
        if (editingId === id) {
          setShowLogForm(false);
          setEditingId(null);
        }
        await loadCycleData();
        setSelectedDayInfo(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClearAllLogs = async () => {
    if (window.confirm('Clear all recorded period history logs? This will reset your calendar to a clean slate.')) {
      try {
        await api.clearAllCycleLogs();
        // Directly set empty state — do NOT re-fetch from backend
        setCycleData({
          has_data: false,
          history: [],
          current_cycle_day: 0,
          current_phase: 'Awaiting First Period Date',
          predicted_cycle_length: 28,
          regularity_status: 'No cycles recorded yet',
          next_period_estimate: 'Log start date to predict',
          ovulation_window: 'Log start date to calculate',
          upcoming_events: []
        });
        setShowLogForm(false);
        setEditingId(null);
        setSelectedDayInfo(null);
        onShowToast('All period history logs cleared! Calendar reset.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const c = cycleData || {
    has_data: false,
    current_cycle_day: 0,
    current_phase: 'Awaiting First Period Date',
    predicted_cycle_length: 28,
    regularity_status: 'No cycles recorded yet',
    next_period_estimate: 'Log start date to predict',
    ovulation_window: 'Log start date to calculate',
    history: []
  };

  const historyList = c.history || [];
  const hasData = Boolean(c.has_data && historyList.length > 0);

  // Month navigation helpers
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  const jumpToToday = () => {
    setViewDate(new Date());
  };

  // Calendar calculations for viewDate & active logs
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Map of local ISO dates -> period/forecast status
    const dateMap = {};

    // 1. Logs to consider (including live form preview if active)
    let activeLogs = [...historyList];
    if (showLogForm && newLog.start_date) {
      const previewEntry = {
        id: editingId || 'preview',
        start_date: newLog.start_date,
        period_duration: Number(newLog.period_duration) || 5,
        cycle_length: Number(newLog.cycle_length) || 28,
        flow: newLog.flow_intensity || 'Medium',
        cervical_mucus: newLog.cervical_mucus,
        notes: newLog.notes,
        isPreview: !editingId
      };
      if (editingId) {
        activeLogs = activeLogs.map(l => (l.id === editingId ? { ...l, ...previewEntry } : l));
      } else {
        activeLogs = [previewEntry, ...activeLogs];
      }
    }

    // 2. Map ONLY the actual logged period days
    activeLogs.forEach((log) => {
      if (!log.start_date) return;
      const start = parseLocalIso(log.start_date);
      if (!start) return; // skip if date is invalid/empty
      const duration = Number(log.period_duration || log.duration) || 5;
      for (let i = 0; i < duration; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const iso = toLocalIso(d);
        dateMap[iso] = {
          type: 'period',
          isPeriodStart: i === 0,
          periodDay: i + 1,
          flow: log.flow || log.flow_intensity || 'Medium',
          mucus: log.cervical_mucus,
          notes: log.notes,
          logId: log.id,
          isPreview: log.isPreview,
          rawLog: log
        };
      }
    });

    // 3. Project the next 10 predicted cycles from the latest logged start date
    const validLogs = activeLogs.filter(l => l.start_date && parseLocalIso(l.start_date));
    if (validLogs.length > 0) {
      const sorted = [...validLogs].sort((a, b) => parseLocalIso(b.start_date) - parseLocalIso(a.start_date));
      const latest = sorted[0];
      const latestStart = parseLocalIso(latest.start_date);
      const cycleLen = Number(latest.cycle_length || latest.length) || 28;
      const duration = Number(latest.period_duration || latest.duration) || 5;

      for (let cycleNum = 1; cycleNum <= 10; cycleNum++) {
        const futureStart = new Date(
          latestStart.getFullYear(),
          latestStart.getMonth(),
          latestStart.getDate() + (cycleNum * cycleLen)
        );
        for (let i = 0; i < duration; i++) {
          const d = new Date(futureStart.getFullYear(), futureStart.getMonth(), futureStart.getDate() + i);
          const iso = toLocalIso(d);
          if (!dateMap[iso]) {
            dateMap[iso] = {
              type: 'predicted_period',
              isPeriodStart: i === 0,
              periodDay: i + 1,
              cycleNumber: cycleNum
            };
          }
        }
      }
    }

    return { year, month, firstDayIndex, totalDays, dateMap };
  }, [viewDate, historyList, showLogForm, newLog, editingId]);

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const todayIso = toLocalIso(new Date());

  const handleDayClick = (dayNumber) => {
    const d = new Date(calendarData.year, calendarData.month, dayNumber);
    const iso = toLocalIso(d);
    const info = calendarData.dateMap[iso];

    setSelectedDayInfo({
      dayNumber,
      dateObj: d,
      iso,
      formatted: d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      status: info || { type: 'normal' }
    });
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            Intelligent Cycle Forecast & Visual Calendar
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Cycle Tracker & Period Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Visual period marking, live-updating forecasts, and personalized hormonal phase insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleStartNewLog()}
            className="px-6 py-3 rounded-full bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showLogForm && !editingId ? 'Close Form' : '+ Log Period Dates'}</span>
          </button>
        </div>
      </div>

      {/* In-Page Period Logger / Editor Form */}
      {showLogForm && (
        <form onSubmit={handleSaveCycle} className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-teal-500/80 shadow-xl space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                {editingId ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingId ? 'Edit Menstrual Cycle Entry' : 'Record Menstrual Cycle Entry'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingId 
                    ? 'Updating details immediately recalculates your calendar predictions.' 
                    : 'Provide period start date and cycle length to mark dates on your calendar.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Live Calendar Preview Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Period Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={newLog.start_date}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewLog({ ...newLog, start_date: val });
                  if (val) {
                    const d = parseLocalIso(val);
                    setViewDate(new Date(d.getFullYear(), d.getMonth(), 1));
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
              />
              {!newLog.start_date && (
                <span className="text-[11px] text-rose-500 font-medium block mt-1">
                  Please pick your start date
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Bleeding Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="14"
                value={newLog.period_duration}
                onChange={(e) => setNewLog({ ...newLog, period_duration: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Cycle Length (Days)</label>
              <input
                type="number"
                min="20"
                max="90"
                value={newLog.cycle_length}
                onChange={(e) => setNewLog({ ...newLog, cycle_length: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Flow Intensity</label>
              <select
                value={newLog.flow_intensity}
                onChange={(e) => setNewLog({ ...newLog, flow_intensity: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-700 cursor-pointer"
              >
                <option value="Light">Light / Spotting</option>
                <option value="Medium">Medium Flow</option>
                <option value="Heavy">Heavy Flow</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            {editingId ? (
              <button
                type="button"
                onClick={() => handleDeleteCycle(editingId)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this entry</span>
              </button>
            ) : <div />}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLogForm(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !newLog.start_date}
                className="px-7 py-2.5 rounded-full bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : (editingId ? 'Update & Refresh Calendar' : 'Save & Update Calendar')}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 3 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Current Cycle Day</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {hasData ? `Day ${c.current_cycle_day}` : 'Not Logged'}
          </div>
          <div className="text-xs font-semibold text-teal-600">
            {c.current_phase}
          </div>
          <p className="text-[11px] text-slate-400">
            {hasData ? "Hormonal shifts tracked based on your period start date." : "Log your period to calculate your active cycle day."}
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-pink-700 uppercase tracking-wider">Period Duration</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {hasData ? `${historyList[0]?.period_duration || historyList[0]?.duration || 5} Days` : 'Not Logged'}
          </div>
          <div className="text-xs font-semibold text-pink-600">
            {hasData ? 'Bleeding days from latest log' : 'Awaiting your period date'}
          </div>
          <p className="text-[11px] text-slate-400">
            {hasData ? "These days are highlighted in light pink on your calendar." : "Enter your period date to mark bleeding days."}
          </p>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Average Cycle Length</div>
          <div className="text-3xl font-extrabold text-slate-900">
            {hasData ? `${c.predicted_cycle_length || 28} Days` : '28 Days'}
          </div>
          <div className="text-xs font-semibold text-slate-600">
            {c.regularity_status}
          </div>
          <p className="text-[11px] text-slate-400">
            {hasData ? `Calculated across ${historyList.length} recorded cycle(s).` : "Customizable baseline for irregular cycles."}
          </p>
        </div>
      </div>

      {/* Main Interactive Calendar Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Full Interactive Calendar */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Calendar Header with Controls */}
          <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                <CalendarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{monthName}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  Click on any day to view details, edit, or log period
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={jumpToToday}
                className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} className="py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Blank leading placeholders */}
            {Array.from({ length: calendarData.firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 sm:h-16 rounded-2xl bg-slate-50/50 border border-transparent"></div>
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: calendarData.totalDays }, (_, i) => i + 1).map((day) => {
              const d = new Date(calendarData.year, calendarData.month, day);
              const iso = toLocalIso(d);
              const isToday = iso === todayIso;
              const info = calendarData.dateMap[iso];
              const isSelected = selectedDayInfo && selectedDayInfo.iso === iso;

              const isPeriod = info && info.type === 'period';
              const isPredicted = info && info.type === 'predicted_period';
              const isPreview = info && info.isPreview;

              // Light pink pastel for period days, dashed pink for predicted
              let cellStyle = 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-700';
              let badge = null;

              if (isPeriod) {
                // Logged Period Day: Light Pink Pastel
                cellStyle = isPreview 
                  ? 'bg-pink-100 text-pink-900 font-bold border-2 border-pink-300 shadow-sm ring-2 ring-teal-400 ring-offset-1'
                  : 'bg-pink-100 text-pink-900 font-bold border border-pink-300 shadow-sm hover:bg-pink-200/80';
                badge = (
                  <div className="flex items-center gap-0.5 text-[9px] font-bold text-pink-700">
                    <Droplet className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
                    <span>{isPreview ? 'Preview' : 'Period'}</span>
                  </div>
                );
              } else if (isPredicted) {
                // Predicted Future Period: Dashed Pink Pastel
                cellStyle = 'bg-pink-50 text-pink-700 font-semibold border-2 border-dashed border-pink-300 hover:bg-pink-100/60';
                badge = (
                  <span className="text-[8px] font-bold text-pink-500">
                    Predicted
                  </span>
                );
              }

              if (isToday) {
                cellStyle += ' ring-2 ring-teal-600 ring-offset-1 font-extrabold';
              }

              if (isSelected) {
                cellStyle += ' ring-2 ring-slate-900 ring-offset-2 scale-105 z-10';
              }

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`h-14 sm:h-16 flex flex-col items-center justify-between p-1.5 rounded-2xl text-xs transition-all cursor-pointer relative ${cellStyle}`}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs font-bold leading-none">{day}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600" title="Today"></span>
                    )}
                  </div>
                  <div className="w-full flex justify-center pb-0.5">
                    {badge}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Selected Day Inspector */}
          {selectedDayInfo && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Selected Date Inspection
                  </h4>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {selectedDayInfo.formatted}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDayInfo(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {selectedDayInfo.status.type === 'period' ? (
                <div className="p-3 bg-pink-50 rounded-xl border border-pink-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-pink-800 font-bold">
                      <Droplet className="w-4 h-4 fill-pink-500 text-pink-500" />
                      <span>Logged Period Day {selectedDayInfo.status.periodDay}</span>
                    </div>
                    {selectedDayInfo.status.rawLog && (
                      <button
                        onClick={() => handleStartEditLog(selectedDayInfo.status.rawLog)}
                        className="px-3 py-1 bg-white hover:bg-pink-100 text-pink-800 font-bold border border-pink-300 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Entry</span>
                      </button>
                    )}
                  </div>
                  <p className="text-pink-700">
                    Flow: <strong className="font-semibold">{selectedDayInfo.status.flow}</strong>
                    {selectedDayInfo.status.mucus ? ` • Mucus: ${selectedDayInfo.status.mucus}` : ''}
                  </p>
                  {selectedDayInfo.status.notes && (
                    <p className="text-slate-600 italic">Notes: "{selectedDayInfo.status.notes}"</p>
                  )}
                </div>
              ) : selectedDayInfo.status.type === 'predicted_period' ? (
                <div className="p-3 bg-pink-50/80 rounded-xl border border-dashed border-pink-300 text-xs">
                  <div className="font-bold text-pink-800">🌸 Predicted Period (Cycle {selectedDayInfo.status.cycleNumber}, Day {selectedDayInfo.status.periodDay})</div>
                  <p className="text-pink-700 mt-0.5">
                    Forecasted based on your entered cycle length. Update your data to recalculate.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Regular cycle day. No period logged.</span>
                  <button
                    onClick={() => handleStartNewLog(selectedDayInfo.iso)}
                    className="px-3 py-1.5 bg-teal-700 text-white font-bold rounded-lg hover:bg-teal-800 transition-all cursor-pointer shrink-0"
                  >
                    + Log Period Starting Here
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Calendar Visual Legend */}
          <div className="flex flex-wrap items-center gap-5 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-pink-100 border border-pink-300 shadow-xs"></span>
              <span className="text-slate-700 font-semibold">Logged Period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg bg-pink-50 border-2 border-dashed border-pink-300"></span>
              <span className="text-slate-700 font-semibold">Predicted Period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-lg border-2 border-teal-600 bg-teal-50"></span>
              <span className="text-slate-700 font-semibold">Today</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Hormonal Phase Guides & Recorded Periods */}
        <div className="lg:col-span-5 space-y-6">
          {/* Phase Explainers */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Hormonal Phases Overview</span>
            </h3>

            <div className="space-y-3">
              {[
                { 
                  name: '1. Menstrual Phase', 
                  desc: 'Progesterone & estrogen drop. Uterine lining sheds. Prioritize rest, iron-rich foods, and gentle walking.', 
                  active: hasData && c.current_phase === 'Menstrual Phase', 
                  color: 'border-l-rose-500 bg-rose-50/40' 
                },
                { 
                  name: '2. Follicular Phase', 
                  desc: 'Estrogen rises, boosting brain clarity & insulin sensitivity. Optimal for strength training & complex work.', 
                  active: hasData && c.current_phase === 'Follicular Phase', 
                  color: 'border-l-teal-600 bg-teal-50/40' 
                },
                { 
                  name: '3. Ovulatory Phase', 
                  desc: 'LH surge triggers egg release. Peak fertility, highest energy, and highest communication drive.', 
                  active: hasData && c.current_phase === 'Ovulatory Phase', 
                  color: 'border-l-rose-400 bg-rose-50/40' 
                },
                { 
                  name: '4. Luteal Phase', 
                  desc: 'Progesterone dominance. Metabolism increases by 100-300 kcal. Focus on complex carbs and magnesium to curb PMS.', 
                  active: hasData && c.current_phase === 'Luteal Phase', 
                  color: 'border-l-purple-500 bg-purple-50/40' 
                }
              ].map((phase, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl border border-slate-100 border-l-4 ${phase.color} ${phase.active ? 'ring-2 ring-teal-600/30' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{phase.name}</span>
                    {phase.active && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-700 text-white rounded-full">
                        Active Phase
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Period Logs Table with Edit and Delete Ability */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Recorded Period History
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  ({historyList.length} logs)
                </span>
              </div>

              {historyList.length > 0 && (
                <button
                  onClick={handleClearAllLogs}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                  title="Clear all recorded period logs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {historyList.length > 0 ? (
                historyList.map((h, idx) => (
                  <div key={h.id || idx} className="p-3 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-2xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                        <Droplet className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{h.start_date}</div>
                        <span className="text-slate-500 text-[11px]">
                          {h.duration || h.period_duration || 5} days bleeding ({h.flow || h.flow_intensity || 'Medium'})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-white font-bold rounded-lg border border-slate-200 text-slate-700">
                        {h.length || h.cycle_length || 28}d cycle
                      </span>
                      <button
                        onClick={() => handleStartEditLog(h)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit log"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCycle(h.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
                  <p className="text-xs text-slate-500">No period dates recorded yet.</p>
                  <button
                    onClick={() => handleStartNewLog()}
                    className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                  >
                    + Log Period Start Date
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
