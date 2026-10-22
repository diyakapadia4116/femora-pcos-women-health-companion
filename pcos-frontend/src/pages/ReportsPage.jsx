import React, { useState, useEffect } from "react";
import {
  FileText, Printer, Download, CheckCircle2,
  Activity, Sparkles, Heart, AlertCircle, Moon, Droplet, Zap, Scale
} from "lucide-react";
import { api } from "../services/api";

export default function ReportsPage({ user, onShowToast }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReport(); }, [user]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await api.getDoctorReport();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasData = report?.has_data;
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            Health Summary
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Your Report for the Doctor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            This is a simple summary of your health that you can show to your doctor at your next visit.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={() => onShowToast && onShowToast("Report saved! You can print it to share with your doctor.")}
            className="px-5 py-2.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Save Report
          </button>
        </div>
      </div>

      {/* The Report Document */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-lg space-y-8 print:border-none print:shadow-none">

        {/* Report Header */}
        <div className="flex justify-between items-start pb-5 border-b-2 border-teal-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-slate-200 shrink-0">
              <img src="/logo.jpg" alt="femora logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-teal-800 font-extrabold text-lg tracking-tight">
                femora.
              </div>
              <p className="text-[10px] font-semibold text-slate-500 lowercase tracking-wide">your cycle, your rhythm</p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-800">{today}</p>
            <p>{hasData ? "Active Records Available" : "Baseline Profile"}</p>
          </div>
        </div>

        {/* Report Picture */}
        <div className="w-full h-48 rounded-2xl overflow-hidden shadow-sm border border-slate-100 my-6">
          <img src="/report_pic.jpg" alt="Report Illustration" className="w-full h-full object-cover" />
        </div>

        {/* Section 1: About You */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center">1</span>
            About You
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Name", value: user?.full_name || report?.patient_name || "User" },
              { label: "Age", value: user?.age ? `${user.age} years` : report?.patient_age ? `${report.patient_age} years` : "Not set" },
              { label: "Weight", value: user?.weight_kg ? `${user.weight_kg} kg` : "Not set" },
              { label: "Height", value: user?.height_cm ? `${user.height_cm} cm` : "Not set" },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">{item.label}</span>
                <strong className="text-slate-900 text-sm font-bold">{item.value}</strong>
              </div>
            ))}
          </div>
          {user?.weight_kg && user?.height_cm && (
            <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-900">Your BMI (Body Mass Index)</span>
                <p className="text-[11px] text-slate-500 mt-0.5">Calculated from your height and weight</p>
              </div>
              <div className="text-2xl font-extrabold text-teal-900">
                {(user.weight_kg / ((user.height_cm / 100) ** 2)).toFixed(1)}
                <span className="text-xs font-medium text-slate-500 ml-1">kg/m²</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Your Cycle */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">2</span>
            Your Period &amp; Cycle
          </h2>
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3 text-sm text-slate-700">
            {report?.cycle_summary ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <span className="text-slate-400 block font-medium">Average Cycle Length</span>
                  <strong className="text-slate-900">{report.cycle_summary.average_length ? `${report.cycle_summary.average_length} days` : "Not enough data yet"}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <span className="text-slate-400 block font-medium">Regularity</span>
                  <strong className="text-slate-900">{report.cycle_summary.regularity || "Being tracked"}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100">
                  <span className="text-slate-400 block font-medium">Total Cycles Logged</span>
                  <strong className="text-slate-900">{report.cycle_summary.total_cycles ?? "—"}</strong>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                No cycle data logged yet. Start tracking your period in the Cycle Tracker to see this section filled in.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Your Symptoms */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">3</span>
            Symptoms You Have Been Experiencing
          </h2>
          {report?.top_symptoms && report.top_symptoms.length > 0 ? (
            <div className="space-y-2">
              {report.top_symptoms.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500">
                    <span>How bad: <strong className="text-slate-800">{s.severity ?? "—"}</strong></span>
                    <span>How often: <strong className="text-slate-800">{s.frequency ?? "—"}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No symptoms logged yet. Track your daily symptoms in the Symptom Tracker to see them here.
            </div>
          )}
        </div>

        {/* Section 4: Lifestyle Summary */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">4</span>
            Your Daily Habits (from recent logs)
          </h2>
          {report?.lifestyle_summary ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Moon, label: "Average Sleep", value: report.lifestyle_summary.avg_sleep ? `${report.lifestyle_summary.avg_sleep} hrs/night` : "Not enough data", color: "indigo" },
                { icon: Zap, label: "Average Stress", value: report.lifestyle_summary.avg_stress ? `${report.lifestyle_summary.avg_stress}/10` : "Not enough data", color: "amber" },
                { icon: Droplet, label: "Average Water", value: report.lifestyle_summary.avg_water ? `${report.lifestyle_summary.avg_water}L/day` : "Not enough data", color: "sky" },
                { icon: Activity, label: "Exercise Days", value: report.lifestyle_summary.exercise_days ? `${report.lifestyle_summary.exercise_days} days logged` : "Not enough data", color: "emerald" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`p-4 rounded-2xl bg-${item.color}-50/60 border border-${item.color}-100 space-y-1`}>
                    <Icon className={`w-4 h-4 text-${item.color}-600`} />
                    <span className="text-[11px] text-slate-500 font-medium block">{item.label}</span>
                    <strong className="text-sm text-slate-900">{item.value}</strong>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
              No lifestyle data yet. Log sleep, water, and exercise in the Lifestyle Tracker to fill this section.
            </div>
          )}
        </div>

        {/* Section 5: PCOS Risk Check */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">5</span>
            PCOS Risk Check Result
          </h2>
          <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-slate-700 space-y-2">
            {report?.rotterdam_evaluation?.phenotype ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Result from your last check:</span>
                  <span className="font-bold text-purple-800 text-sm">{report.rotterdam_evaluation.phenotype}</span>
                </div>
                <p className="text-slate-500 leading-relaxed pt-1">
                  {report.rotterdam_evaluation.criteria_met
                    ? `Signs noticed: ${report.rotterdam_evaluation.criteria_met}`
                    : "Please complete the PCOS Risk Check inside the app to get a full result to show your doctor."}
                </p>
              </>
            ) : (
              <p className="text-slate-400 text-center py-3">
                You have not completed the PCOS Risk Check yet. Go to the Risk Check section and answer the questions to fill this in.
              </p>
            )}
          </div>
        </div>

        {/* Section 6: Tests to Ask Your Doctor About */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">6</span>
            Tests to Ask Your Doctor About
          </h2>
          <p className="text-xs text-slate-500">These are common blood tests that help doctors understand PCOS better. You can show this list to your doctor and ask which ones are right for you:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { test: "Blood Sugar Test (Fasting)", why: "Checks how well your body handles sugar" },
              { test: "Hormone Test (Testosterone, LH, FSH)", why: "Looks at hormones that affect your cycle" },
              { test: "Thyroid Test (TSH)", why: "Rules out thyroid problems which mimic PCOS" },
              { test: "Vitamin D Level", why: "Low Vitamin D is very common in PCOS" },
              { test: "Cholesterol Test", why: "PCOS can affect your heart health over time" },
              { test: "Ultrasound of Ovaries", why: "Checks for small cysts on ovaries" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">{item.test}</strong>
                  <p className="text-slate-500 mt-0.5">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-5 border-t border-slate-100 text-[11px] text-slate-400 leading-relaxed text-center">
          This report was created by the femora app using information that you entered yourself. It is meant to help you talk to your doctor — it is not a medical diagnosis. Always speak with a qualified doctor for proper medical advice.
        </div>
      </div>
    </div>
  );
}