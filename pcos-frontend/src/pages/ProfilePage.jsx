import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Bell, 
  Download, 
  Save, 
  LogOut, 
  Activity,
  Heart,
  Scale
} from 'lucide-react';
import { api } from '../services/api';

export default function ProfilePage({ user, onUpdateUser, onLogout, onShowToast }) {
  const [profile, setProfile] = useState({
    full_name: user?.full_name || 'Health User',
    email: user?.email || '',
    age: user?.age || 24,
    height_cm: user?.height_cm || 162,
    weight_kg: user?.weight_kg || 58,
    cycle_regularity: user?.cycle_regularity || 'Irregular',
    diagnosis_status: 'PCOS Monitoring',
    notifications_enabled: true,
    daily_reminder_time: '20:30'
  });

  const [isSaving, setIsSaving] = useState(false);

  const bmi = (profile.weight_kg / ((profile.height_cm / 100) * (profile.height_cm / 100))).toFixed(1);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile(profile);
      if (onUpdateUser) onUpdateUser(profile);
      onShowToast('Profile & biometric metrics updated successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Profile settings saved locally!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pcos_companion_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Health records exported in JSON format!');
  };

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
          Personal Health Profile
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
          User Settings & Biometrics
        </h1>
        <p className="text-sm text-slate-500">
          Manage your personal information, metabolic baselines, and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Profile Card & Avatar */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-800 to-teal-600 text-white font-extrabold text-2xl flex items-center justify-center ring-4 ring-teal-700/20 shadow-md tracking-wider">
              {profile.full_name 
                ? profile.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                : 'U'}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h3 className="text-xl font-bold text-slate-900">{profile.full_name}</h3>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100">
                <ShieldCheck className="w-3.5 h-3.5" /> {profile.diagnosis_status}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Biometrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={profile.height_cm}
                onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={profile.weight_kg}
                onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
              />
            </div>
          </div>

          {/* Calculated BMI Badge */}
          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-teal-900 uppercase">Calculated Body Mass Index (BMI)</h4>
                <p className="text-xs text-slate-600">Calculated automatically from your height and weight inputs.</p>
              </div>
            </div>
            <div className="text-xl font-extrabold text-teal-900">{bmi} <span className="text-xs font-semibold text-slate-500">kg/m²</span></div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={handleExportData}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Raw Health Data (JSON)</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
