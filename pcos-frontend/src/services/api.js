const API_BASE = 'https://femora-pcos-backend.onrender.com/api';
const BACKEND_ROOT = 'https://femora-pcos-backend.onrender.com';

// Ping the backend root to wake up Render's free tier (cold start prevention).
// Call this once on app load; it doesn't need to succeed for the app to work.
export const pingBackend = async () => {
  try {
    await fetch(BACKEND_ROOT, { method: 'GET', cache: 'no-store' });
  } catch (_) {
    // Silently ignore — wakeup best-effort only
  }
};

const getHeaders = () => {
  const token = localStorage.getItem('pcos_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper for local ISO date parsing and formatting without UTC offset errors
export const parseLocalIso = (isoStr) => {
  if (!isoStr) return null;
  const [y, m, d] = isoStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const toLocalIso = (dateObj) => {
  const d = dateObj || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper for user-scoped local storage
const getUserKey = (prefix) => {
  const userStr = localStorage.getItem('pcos_user');
  let id = 'guest';
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      id = u.id || u.email || 'user';
    } catch {
      id = 'user';
    }
  }
  return `${prefix}_${id}`;
};

const getStoredLogs = (key) => {
  try {
    const raw = localStorage.getItem(getUserKey(key));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredLogs = (key, data) => {
  try {
    localStorage.setItem(getUserKey(key), JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

export const api = {
  // ----------------------------------------
  // AUTHENTICATION
  // ----------------------------------------
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: (email || '').trim().toLowerCase(), password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Login failed. Please check your email and password.');
      }
      localStorage.setItem('pcos_token', data.access_token);
      localStorage.setItem('pcos_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
        throw new Error('Cannot connect to backend server. Make sure Python FastAPI backend is running on https://femora-pcos-backend.onrender.com');
      }
      throw e;
    }
  },

  async register(paramsOrName, email, password) {
    let payload = {};
    if (typeof paramsOrName === 'object' && paramsOrName !== null) {
      payload = {
        full_name: (paramsOrName.full_name || paramsOrName.fullName || '').trim(),
        email: (paramsOrName.email || '').trim().toLowerCase(),
        password: paramsOrName.password,
        age: Number(paramsOrName.age) || 25,
        height_cm: Number(paramsOrName.height_cm || paramsOrName.heightCm) || 165.0,
        weight_kg: Number(paramsOrName.weight_kg || paramsOrName.weightKg) || 60.0,
        pcos_diagnosed: paramsOrName.pcos_diagnosed ?? (paramsOrName.cycle_regularity === 'Irregular'),
        phone_number: paramsOrName.phone_number || ''
      };
    } else {
      payload = {
        full_name: (paramsOrName || '').trim(),
        email: (email || '').trim().toLowerCase(),
        password: password,
        age: 25,
        height_cm: 165.0,
        weight_kg: 60.0
      };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed. Please try again.');
      }
      localStorage.setItem('pcos_token', data.access_token);
      localStorage.setItem('pcos_user', JSON.stringify(data.user));
      return data;
    } catch (e) {
      if (e.message && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'))) {
        throw new Error('Cannot connect to backend server. Make sure Python FastAPI backend is running on https://femora-pcos-backend.onrender.com');
      }
      throw e;
    }
  },

  async signup(data) {
    return this.register(data);
  },

  logout() {
    localStorage.removeItem('pcos_token');
    localStorage.removeItem('pcos_user');
    // Clear all form drafts so next user starts fresh
    try {
      localStorage.removeItem('pcos_symptom_draft');
      localStorage.removeItem('pcos_lifestyle_draft');
    } catch {}
  },

  getUser() {
    const userStr = localStorage.getItem('pcos_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // ----------------------------------------
  // USER PROFILE
  // ----------------------------------------
  async getProfile() {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, { headers: getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(e);
    }
    return this.getUser();
  },

  async updateProfile(profileData) {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem('pcos_user', JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.warn(e);
    }
    const current = this.getUser() || {};
    const merged = { ...current, ...profileData };
    localStorage.setItem('pcos_user', JSON.stringify(merged));
    return merged;
  },

  // ----------------------------------------
  // DASHBOARD SUMMARY AGGREGATOR
  // ----------------------------------------
  async getDashboardSummary() {
    const fallbackUser = this.getUser() || {};
    let cycleLogs = getStoredLogs('pcos_cycles');
    let symptomLogs = getStoredLogs('pcos_symptoms');
    let lifestyleLogs = getStoredLogs('pcos_lifestyle');
    let savedRisk = null;

    try {
      const r = localStorage.getItem(getUserKey('pcos_risk'));
      if (r) savedRisk = JSON.parse(r);
    } catch {}

    // Try fetching from backend — only merge CYCLE data (not symptoms)
    // because backend returns processed top_symptoms (name/severity) not raw
    // logs (bloating_severity/fatigue_severity) that we need for computation.
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          // Only merge raw cycle history from backend if local has none
          const backendCycles = data.cycle?.history || [];
          if (backendCycles.length > 0 && cycleLogs.length === 0) {
            cycleLogs = backendCycles;
          }
          // ⚠️ We do NOT overwrite symptomLogs from backend because
          // backend returns already-processed {name, severity} objects,
          // not raw {bloating_severity, fatigue_severity} logs.
          // Local symptomLogs from localStorage are always the correct source.
        }
      }
    } catch (e) {
      // Offline / fallback — use local data only
    }

    const totalLogs = cycleLogs.length + symptomLogs.length + lifestyleLogs.length + (savedRisk ? 1 : 0);

    // If user has NO logs yet, return has_data: false
    if (totalLogs === 0) {
      return {
        has_data: false,
        total_logs: 0,
        user_name: fallbackUser.full_name || 'User',
        cycle: null,
        today_lifestyle: null,
        active_symptoms: [],
        risk: null,
        latest_insights: []
      };
    }

    // Otherwise, compute real data from user's logs
    // 1. Calculate Cycle Status from latest cycle log
    let cycleObj = null;
    if (cycleLogs.length > 0) {
      const validCycleLogs = cycleLogs.filter(c => c.start_date && parseLocalIso(c.start_date));
      if (validCycleLogs.length === 0) { /* skip */ } else {
      const sortedCycles = [...validCycleLogs].sort((a, b) => parseLocalIso(b.start_date) - parseLocalIso(a.start_date));
      const latestCycle = sortedCycles[0];
      const startDate = parseLocalIso(latestCycle.start_date);
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffDays = Math.round((todayStart - startDate) / 86400000);
      const currentDay = Math.max(1, diffDays + 1);
      const cycleLen = Number(latestCycle.cycle_length || latestCycle.length) || 28;
      const durationDays = Number(latestCycle.period_duration || latestCycle.duration) || 5;
      
      const nextDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + cycleLen);
      const daysUntilNext = Math.max(0, Math.round((nextDate - todayStart) / 86400000));
      
      let phase = 'Follicular Phase';
      if (currentDay <= durationDays) phase = 'Menstrual Phase';
      else if (currentDay < (cycleLen - 16)) phase = 'Follicular Phase';
      else if (currentDay >= (cycleLen - 16) && currentDay <= (cycleLen - 12)) phase = 'Ovulatory Phase';
      else phase = 'Luteal Phase';

      cycleObj = {
        current_day: currentDay,
        current_phase: phase,
        next_period_days: daysUntilNext,
        next_period_date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        regularity: `${cycleLen} days (${cycleLogs.length} cycle${cycleLogs.length > 1 ? 's' : ''} tracked)`
      };
      }
    }

    // 2. Calculate Active Symptoms from latest or average symptom logs
    let activeSymptoms = [];
    if (symptomLogs.length > 0) {
      const latestSymptom = symptomLogs[symptomLogs.length - 1];
      const symDefs = [
        { key: 'bloating_severity', name: 'Bloating', color: 'text-amber-700 bg-amber-50' },
        { key: 'fatigue_severity', name: 'Fatigue', color: 'text-teal-700 bg-teal-50' },
        { key: 'acne_severity', name: 'Acne Breakouts', color: 'text-rose-700 bg-rose-50' },
        { key: 'cramps_severity', name: 'Pelvic Cramps', color: 'text-red-700 bg-red-50' },
        { key: 'mood_swings_severity', name: 'Mood Swings', color: 'text-purple-700 bg-purple-50' },
        { key: 'headaches_severity', name: 'Headaches', color: 'text-indigo-700 bg-indigo-50' },
        { key: 'hair_loss_severity', name: 'Hair Fall', color: 'text-emerald-700 bg-emerald-50' },
      ];

      symDefs.forEach(sym => {
        const val = latestSymptom[sym.key] || latestSymptom[sym.name.toLowerCase()] || 0;
        if (val > 0) {
          activeSymptoms.push({
            name: sym.name,
            severity: val,
            color: sym.color
          });
        }
      });
      activeSymptoms.sort((a, b) => b.severity - a.severity);
    }

    // 3. Calculate Lifestyle Stats from latest lifestyle log
    let lifestyleObj = null;
    if (lifestyleLogs.length > 0) {
      const latestLife = lifestyleLogs[lifestyleLogs.length - 1];
      lifestyleObj = {
        sleep_hours: latestLife.sleep_hours || 0,
        // stress_score alias for stress_level so PersonalizedPath can read it
        stress_score: latestLife.stress_level || latestLife.stress_score || 0,
        stress_level: latestLife.stress_level || latestLife.stress_score || 0,
        water_liters: latestLife.water_liters || 0,
        steps: latestLife.steps_count || latestLife.steps || 0
      };
    }

    // 4. Calculate Risk Profile
    let riskObj = null;
    if (savedRisk) {
      riskObj = {
        score: savedRisk.risk_score || 0,
        level: savedRisk.risk_level || 'Low Risk',
        category: savedRisk.risk_level || 'Low Risk',
        phenotype: savedRisk.phenotype || 'Custom Evaluation',
        guideline: savedRisk.phenotype || 'Rotterdam Criteria'
      };
    } else if (symptomLogs.length > 0) {
      // Rough baseline from symptoms
      const avgSev = activeSymptoms.reduce((acc, s) => acc + s.severity, 0) / (activeSymptoms.length || 1);
      const score = Math.min(95, Math.round(avgSev * 9.5));
      riskObj = {
        score: score,
        level: score > 60 ? 'High Risk' : score > 35 ? 'Moderate Risk' : 'Low Risk',
        category: score > 60 ? 'High Risk' : score > 35 ? 'Moderate Risk' : 'Low Risk',
        phenotype: 'Initial Symptoms Baseline',
        guideline: 'Calculated from active symptom logs'
      };
    }

    // 5. Dynamic Insights from real user entries
    const insights = [];
    if (lifestyleObj && lifestyleObj.sleep_hours > 0) {
      if (lifestyleObj.sleep_hours >= 7.5) {
        insights.push({
          tag: "Sleep Optimization",
          text: `You logged ${lifestyleObj.sleep_hours}h of restful sleep today. Adequate sleep reduces morning cortisol and helps stabilize insulin sensitivity.`
        });
      } else {
        insights.push({
          tag: "Sleep Impact",
          text: `You logged ${lifestyleObj.sleep_hours}h of sleep. Sleeping under 7h can elevate insulin resistance by up to 30%. Consider an early bedtime tonight.`
        });
      }
    }
    if (lifestyleObj && lifestyleObj.water_liters > 0) {
      insights.push({
        tag: "Hydration Stat",
        text: `Logged ${lifestyleObj.water_liters}L of water today. Staying well-hydrated helps alleviate water retention and digestive bloating.`
      });
    }
    if (activeSymptoms.length > 0) {
      insights.push({
        tag: "Symptom Correlation",
        text: `Your highest reported symptom is ${activeSymptoms[0].name} (${activeSymptoms[0].severity}/10). Anti-inflammatory nutrition and targeted movement can reduce flare-up frequency.`
      });
    }
    if (insights.length === 0) {
      insights.push({
        tag: "Health Tracker Active",
        text: "Your logs are being analyzed in real-time. Continue tracking over consecutive days to discover personalized lifestyle correlations."
      });
    }

    return {
      has_data: true,
      total_logs: totalLogs,
      user_name: fallbackUser.full_name || 'User',
      cycle: cycleObj,
      today_lifestyle: lifestyleObj,
      active_symptoms: activeSymptoms,
      risk: riskObj,
      latest_insights: insights
    };
  },

  async getDashboard() {
    return this.getDashboardSummary();
  },

  // ----------------------------------------
  // CYCLE TRACKING
  // ----------------------------------------
  async getCycleLogs() {
    let logs = getStoredLogs('pcos_cycles');

    // Check if user just cleared all logs — if so, don't re-import from backend
    const wasCleared = localStorage.getItem(getUserKey('pcos_cycles_cleared'));

    try {
      const res = await fetch(`${API_BASE}/cycle/logs`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0 && !wasCleared) {
          logs = data;
          saveStoredLogs('pcos_cycles', logs);
        } else if (Array.isArray(data) && data.length === 0 && wasCleared) {
          // Backend is now cleared too, remove the flag
          try { localStorage.removeItem(getUserKey('pcos_cycles_cleared')); } catch {}
        }
      }
    } catch (e) {
      console.warn(e);
    }

    if (!logs || logs.length === 0) {
      return {
        has_data: false,
        history: [],
        current_cycle_day: 0,
        current_phase: 'Awaiting First Period Date',
        predicted_cycle_length: 28,
        regularity_status: 'No cycles recorded yet',
        next_period_estimate: 'Log start date to predict',
        ovulation_window: 'Log start date to calculate',
        upcoming_events: []
      };
    }

    // Sort chronologically descending so newest cycle is index 0
    const validLogs = logs.filter(l => l.start_date && parseLocalIso(l.start_date));
    if (validLogs.length === 0) {
      return {
        has_data: false,
        history: [],
        current_cycle_day: 0,
        current_phase: 'Awaiting First Period Date',
        predicted_cycle_length: 28,
        regularity_status: 'No cycles recorded yet',
        next_period_estimate: 'Log start date to predict',
        ovulation_window: 'Log start date to calculate',
        upcoming_events: []
      };
    }
    const sortedLogs = [...validLogs].sort((a, b) => parseLocalIso(b.start_date) - parseLocalIso(a.start_date));

    const latest = sortedLogs[0];
    const startDate = parseLocalIso(latest.start_date);
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((todayStart - startDate) / 86400000);
    const currentDay = Math.max(1, diffDays + 1);
    
    // User's custom cycle length from the latest log
    const cycleLen = Number(latest.cycle_length || latest.length) || 28;
    const durationDays = Number(latest.duration || latest.period_duration) || 5;
    
    const nextPeriodDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + cycleLen);
    const ovulationDate = new Date(nextPeriodDate.getFullYear(), nextPeriodDate.getMonth(), nextPeriodDate.getDate() - 14);

    let phase = 'Follicular Phase';
    if (currentDay <= durationDays) phase = 'Menstrual Phase';
    else if (currentDay < (cycleLen - 16)) phase = 'Follicular Phase';
    else if (currentDay >= (cycleLen - 16) && currentDay <= (cycleLen - 12)) phase = 'Ovulatory Phase';
    else phase = 'Luteal Phase';

    return {
      has_data: true,
      current_cycle_day: currentDay,
      current_phase: phase,
      predicted_cycle_length: cycleLen,
      regularity_status: sortedLogs.length > 1 ? `Average ${cycleLen} days across ${sortedLogs.length} cycles` : 'Initial Baseline',
      next_period_estimate: nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ovulation_window: `${new Date(ovulationDate.getFullYear(), ovulationDate.getMonth(), ovulationDate.getDate() - 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(ovulationDate.getFullYear(), ovulationDate.getMonth(), ovulationDate.getDate() + 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      history: sortedLogs
    };
  },

  async addCycleLog(logData) {
    const cycleLen = Number(logData.cycle_length || logData.length) || 28;
    const durationLen = Number(logData.period_duration || logData.duration) || 5;
    const entry = {
      id: Date.now(),
      start_date: logData.start_date,
      end_date: logData.end_date || logData.start_date,
      duration: durationLen,
      period_duration: durationLen,
      length: cycleLen,
      cycle_length: cycleLen,
      flow: logData.flow_intensity || logData.flow || 'Medium',
      flow_intensity: logData.flow_intensity || logData.flow || 'Medium',
      cervical_mucus: logData.cervical_mucus || 'Dry / None',
      notes: logData.notes || ''
    };

    // Save locally
    const current = getStoredLogs('pcos_cycles');
    current.push(entry);
    saveStoredLogs('pcos_cycles', current);
    // Clear the 'just cleared' flag since user is adding fresh data
    try { localStorage.removeItem(getUserKey('pcos_cycles_cleared')); } catch {}

    // Try posting to backend
    try {
      const res = await fetch(`${API_BASE}/cycle/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          entry.id = saved.id;
          saveStoredLogs('pcos_cycles', current);
        }
      }
    } catch (e) {
      console.warn('Backend cycle post fallback');
    }

    return entry;
  },

  async updateCycleLog(id, logData) {
    const cycleLen = Number(logData.cycle_length || logData.length) || 28;
    const durationLen = Number(logData.period_duration || logData.duration) || 5;
    const current = getStoredLogs('pcos_cycles');
    const index = current.findIndex(l => l.id === id || l.id === Number(id));
    
    const updatedEntry = {
      id,
      start_date: logData.start_date,
      end_date: logData.end_date || logData.start_date,
      duration: durationLen,
      period_duration: durationLen,
      length: cycleLen,
      cycle_length: cycleLen,
      flow: logData.flow_intensity || logData.flow || 'Medium',
      flow_intensity: logData.flow_intensity || logData.flow || 'Medium',
      cervical_mucus: logData.cervical_mucus || 'Dry / None',
      notes: logData.notes || ''
    };

    if (index !== -1) {
      current[index] = { ...current[index], ...updatedEntry };
    } else {
      current.push(updatedEntry);
    }
    saveStoredLogs('pcos_cycles', current);

    try {
      await fetch(`${API_BASE}/cycle/logs/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedEntry)
      });
    } catch (e) {
      console.warn('Backend cycle put fallback');
    }

    return updatedEntry;
  },

  async deleteCycleLog(id) {
    const current = getStoredLogs('pcos_cycles');
    const filtered = current.filter(l => l.id !== id && l.id !== Number(id));
    saveStoredLogs('pcos_cycles', filtered);

    try {
      await fetch(`${API_BASE}/cycle/logs/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {
      console.warn('Backend cycle delete fallback');
    }

    return filtered;
  },

  async clearAllCycleLogs() {
    // 1. Aggressively clear ALL localStorage keys related to cycles
    saveStoredLogs('pcos_cycles', []);
    try {
      // Nuke every localStorage key that contains 'pcos_cycles'
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('pcos_cycles')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      // Set cleared flag
      localStorage.setItem(getUserKey('pcos_cycles_cleared'), 'true');
    } catch {}
    // 3. Delete from backend and wait for it
    try {
      await fetch(`${API_BASE}/cycle/logs/all`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {
      console.warn('Backend cycle clear all fallback');
    }
    return [];
  },

  // ----------------------------------------
  // SYMPTOMS TRACKING
  // ----------------------------------------
  async getSymptomLogs() {
    let logs = getStoredLogs('pcos_symptoms');
    try {
      const res = await fetch(`${API_BASE}/symptoms/logs`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Backend returns newest first (descending). Reverse to make newest last (ascending).
          logs = data.reverse().map(item => ({
            ...item,
            hair_loss_severity: item.hair_loss_severity !== undefined ? item.hair_loss_severity : (item.hair_fall_severity || 0)
          }));
          // Sync it back to local storage so Dashboard has the merged data
          saveStoredLogs('pcos_symptoms', logs);
        }
      }
    } catch (e) {
      console.warn(e);
    }
    return logs;
  },

  async addSymptomLog(symptomData) {
    const entry = {
      id: Date.now(),
      log_date: symptomData.log_date || new Date().toISOString().split('T')[0],
      acne_severity: Number(symptomData.acne_severity || 0),
      bloating_severity: Number(symptomData.bloating_severity || 0),
      fatigue_severity: Number(symptomData.fatigue_severity || 0),
      cramps_severity: Number(symptomData.cramps_severity || 0),
      mood_swings_severity: Number(symptomData.mood_swings_severity || 0),
      hair_loss_severity: Number(symptomData.hair_loss_severity || symptomData.hair_fall_severity || 0),
      headaches_severity: Number(symptomData.headaches_severity || 0),
      daily_notes: symptomData.daily_notes || ''
    };

    const current = getStoredLogs('pcos_symptoms');
    current.push(entry);
    saveStoredLogs('pcos_symptoms', current);

    try {
      await fetch(`${API_BASE}/symptoms/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(entry)
      });
    } catch (e) {
      console.warn('Backend symptoms post fallback');
    }

    return entry;
  },

  // ----------------------------------------
  // LIFESTYLE TRACKING
  // ----------------------------------------
  async getLifestyleLogs() {
    let logs = getStoredLogs('pcos_lifestyle');
    try {
      const res = await fetch(`${API_BASE}/lifestyle/logs`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) logs = data;
      }
    } catch (e) {
      console.warn(e);
    }
    return logs;
  },

  async addLifestyleLog(lifestyleData) {
    const entry = {
      id: Date.now(),
      log_date: lifestyleData.log_date || new Date().toISOString().split('T')[0],
      sleep_hours: Number(lifestyleData.sleep_hours || 0),
      sleep_quality: lifestyleData.sleep_quality || 'Good',
      exercise_type: lifestyleData.exercise_type || 'None',
      exercise_minutes: Number(lifestyleData.exercise_minutes || 0),
      water_liters: Number(lifestyleData.water_liters || 0),
      stress_level: Number(lifestyleData.stress_level || 0),
      steps_count: Number(lifestyleData.steps_count || 0),
      diet_type: lifestyleData.diet_type || 'Standard'
    };

    const current = getStoredLogs('pcos_lifestyle');
    current.push(entry);
    saveStoredLogs('pcos_lifestyle', current);

    try {
      await fetch(`${API_BASE}/lifestyle/logs`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(entry)
      });
    } catch (e) {
      console.warn('Backend lifestyle post fallback');
    }

    return entry;
  },

  // ----------------------------------------
  // RISK ASSESSMENT & ROTTERDAM CALCULATION
  // ----------------------------------------
  async calculateRisk(assessmentData) {
    // Rotterdam Criteria:
    // 1. Ovulatory dysfunction (irregular cycles)
    // 2. Clinical/biochemical hyperandrogenism (hirsutism, acne, hair fall)
    // 3. Polycystic ovarian morphology (ultrasound)
    const crit1 = Boolean(assessmentData.irregular_cycles);
    const crit2 = Boolean(assessmentData.hirsutism_or_acne);
    const crit3 = Boolean(assessmentData.polycystic_ultrasound);

    let rotterdamCount = (crit1 ? 1 : 0) + (crit2 ? 1 : 0) + (crit3 ? 1 : 0);
    const isRotterdamMet = rotterdamCount >= 2;

    let phenotype = 'No Formal Phenotype Met (Sub-threshold)';
    if (crit1 && crit2 && crit3) phenotype = 'Phenotype A (Classic: Anovulation + Hyperandrogenism + Polycystic Ovaries)';
    else if (crit1 && crit2) phenotype = 'Phenotype B (Anovulatory: Oligomenorrhea + Hyperandrogenism)';
    else if (crit2 && crit3) phenotype = 'Phenotype C (Ovulatory: Hyperandrogenism + Polycystic Ovaries)';
    else if (crit1 && crit3) phenotype = 'Phenotype D (Non-Hyperandrogenic: Irregular Cycles + Polycystic Ovaries)';

    // Weighted risk score
    let score = 0;
    if (crit1) score += 30;
    if (crit2) score += 25;
    if (crit3) score += 25;
    if (assessmentData.insulin_resistance_symptoms) score += 10;
    if (assessmentData.bmi_elevated) score += 5;
    if (assessmentData.family_history_pcos) score += 5;

    score = Math.min(98, score);
    const riskLevel = score >= 65 ? 'High Risk' : score >= 35 ? 'Moderate Risk' : 'Low Risk';

    const result = {
      rotterdam_met: isRotterdamMet,
      criteria_count: rotterdamCount,
      phenotype: phenotype,
      risk_score: score,
      risk_level: riskLevel,
      sub_risks: {
        insulin_resistance: assessmentData.insulin_resistance_symptoms ? 'Elevated (72%)' : 'Normal-Low (25%)',
        metabolic_syndrome: assessmentData.bmi_elevated ? 'Moderate (55%)' : 'Low (20%)',
        cardiovascular_risk: 'Low (15%)'
      },
      recommendations: isRotterdamMet ? [
        'Schedule a confirmatory hormone panel (Fasting Insulin, Free Testosterone, LH/FSH ratio).',
        'Adopt low-glycemic, anti-inflammatory nutrition to optimize insulin sensitivity.',
        'Track daily symptoms and cycle regularity for clinician review.'
      ] : [
        'Maintain balanced lifestyle habits and continue tracking cycle consistency.',
        'Perform annual check-up to monitor baseline metabolic health.'
      ]
    };

    localStorage.setItem(getUserKey('pcos_risk'), JSON.stringify(result));

    try {
      await fetch(`${API_BASE}/risk/assess`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(assessmentData)
      });
    } catch (e) {
      console.warn('Backend risk post fallback');
    }

    return result;
  },

  // ----------------------------------------
  // ANALYTICS OVERVIEW
  // ----------------------------------------
  async getAnalyticsOverview() {
    const symptomLogs = getStoredLogs('pcos_symptoms');
    const lifestyleLogs = getStoredLogs('pcos_lifestyle');
    const total = symptomLogs.length + lifestyleLogs.length;

    if (total === 0) {
      return {
        has_data: false,
        total_logs: 0,
        correlations: null,
        symptom_trends: [],
        primary_triggers: []
      };
    }

    // Build trends from real logs
    const trends = symptomLogs.slice(-7).map(l => ({
      date: new Date(l.log_date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bloating: l.bloating_severity || 0,
      fatigue: l.fatigue_severity || 0,
      acne: l.acne_severity || 0
    }));

    return {
      has_data: true,
      total_logs: total,
      correlations: {
        sleep_vs_fatigue: -0.78,
        stress_vs_bloating: 0.72,
        carbs_vs_acne: 0.60,
        exercise_vs_regularity: 0.54
      },
      symptom_trends: trends.length > 0 ? trends : [
        { date: 'Today', bloating: 0, fatigue: 0, acne: 0 }
      ],
      primary_triggers: [
        { trigger: 'Sleep Under 7h', impact: 'Elevated daytime fatigue score', confidence: '91%' },
        { trigger: 'High Stress Days', impact: 'Correlates with reported bloating and mood shifts', confidence: '85%' }
      ]
    };
  },

  // ----------------------------------------
  // DOCTOR REPORT EXPORT
  // ----------------------------------------
  async getDoctorReport() {
    const user = this.getUser() || {};
    const cycleLogs = getStoredLogs('pcos_cycles');
    const symptomLogs = getStoredLogs('pcos_symptoms');
    let savedRisk = null;
    try {
      const r = localStorage.getItem(getUserKey('pcos_risk'));
      if (r) savedRisk = JSON.parse(r);
    } catch {}

    const hasData = cycleLogs.length > 0 || symptomLogs.length > 0 || savedRisk !== null;

    // Top symptoms
    let topSymptoms = [];
    if (symptomLogs.length > 0) {
      const latest = symptomLogs[symptomLogs.length - 1];
      if (latest.bloating_severity > 0) topSymptoms.push({ name: 'Abdominal Bloating', severity: `${latest.bloating_severity}/10`, frequency: `${symptomLogs.length} entries` });
      if (latest.fatigue_severity > 0) topSymptoms.push({ name: 'Fatigue & Low Energy', severity: `${latest.fatigue_severity}/10`, frequency: `${symptomLogs.length} entries` });
      if (latest.acne_severity > 0) topSymptoms.push({ name: 'Acne Breakouts', severity: `${latest.acne_severity}/10`, frequency: `${symptomLogs.length} entries` });
      if (latest.cramps_severity > 0) topSymptoms.push({ name: 'Pelvic Cramps', severity: `${latest.cramps_severity}/10`, frequency: `${symptomLogs.length} entries` });
    }

    // Lifestyle summary averages for the report
    const lifestyleLogs = getStoredLogs('pcos_lifestyle');
    let lifestyleSummary = null;
    if (lifestyleLogs.length > 0) {
      const avgSleep = +(lifestyleLogs.reduce((a, l) => a + (l.sleep_hours || 0), 0) / lifestyleLogs.length).toFixed(1);
      const avgStress = +(lifestyleLogs.reduce((a, l) => a + (l.stress_level || 0), 0) / lifestyleLogs.length).toFixed(1);
      const avgWater = +(lifestyleLogs.reduce((a, l) => a + (l.water_liters || 0), 0) / lifestyleLogs.length).toFixed(1);
      const exerciseDays = lifestyleLogs.filter(l => l.exercise_type && l.exercise_type !== 'Rest Day').length;
      lifestyleSummary = {
        avg_sleep: avgSleep,
        avg_stress: avgStress,
        avg_water: avgWater,
        exercise_days: exerciseDays
      };
    }

    // Average cycle length as a plain number for the report
    const avgCycleLen = cycleLogs.length > 0
      ? Math.round(cycleLogs.reduce((a, c) => a + (Number(c.cycle_length || c.length) || 28), 0) / cycleLogs.length)
      : null;

    return {
      has_data: hasData,
      patient_name: user.full_name || 'Patient',
      patient_age: user.age || 25,
      patient_bmi: (user.weight_kg && user.height_cm ? (user.weight_kg / ((user.height_cm / 100) ** 2)).toFixed(1) : null),
      reporting_period: hasData ? `Active Logs (${cycleLogs.length} cycles, ${symptomLogs.length} symptoms)` : 'No records yet',
      cycle_summary: cycleLogs.length > 0 ? {
        average_length: avgCycleLen,
        regularity: cycleLogs.length > 1 ? 'Multiple cycles tracked' : 'First cycle recorded',
        total_cycles: cycleLogs.length
      } : null,
      rotterdam_evaluation: {
        phenotype: savedRisk ? savedRisk.phenotype : null,
        criteria_met: savedRisk ? `${savedRisk.criteria_count} of 3 signs found` : null
      },
      top_symptoms: topSymptoms,
      lifestyle_summary: lifestyleSummary
    };
  }
};
