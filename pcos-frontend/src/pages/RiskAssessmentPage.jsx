import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Activity,
  Heart,
  AlertTriangle,
  Info
} from "lucide-react";
import { api } from "../services/api";

export default function RiskAssessmentPage({ setCurrentRoute, onShowToast }) {
  const [assessment, setAssessment] = useState({
    irregular_cycles: false,
    hirsutism_or_acne: false,
    polycystic_ultrasound: false,
    insulin_resistance_symptoms: false,
    family_history_pcos: false
  });

  const [result, setResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    loadSavedRisk();
  }, []);

  const loadSavedRisk = async () => {
    try {
      const data = await api.getRiskAssessment();
      if (data && data.has_assessed) {
        setResult(data);
        if (data.criteria_inputs) {
          setAssessment(data.criteria_inputs);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (key) => {
    setAssessment(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runRiskCalculation = async () => {
    setIsEvaluating(true);
    try {
      const res = await api.calculateRisk(assessment);
      setResult(res);
      if (onShowToast) {
        onShowToast("Your health check is done and saved!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const criteria = [
    {
      key: "irregular_cycles",
      group: "Sign 1 of 3",
      title: "My periods are very irregular or I often skip them",
      desc: "For example, your period comes every 35 days or more, or sometimes does not come at all for months."
    },
    {
      key: "hirsutism_or_acne",
      group: "Sign 2 of 3",
      title: "I have extra hair growth on my face or body, or severe acne",
      desc: "This includes thick or dark hair on the chin, upper lip, chest, or stomach, or adult acne that does not go away easily."
    },
    {
      key: "polycystic_ultrasound",
      group: "Sign 3 of 3",
      title: "A doctor told me I have small cysts on my ovaries (on ultrasound)",
      desc: "This means a scan showed many small fluid-filled sacs in your ovaries. You do not need to have symptoms to have this."
    },
    {
      key: "insulin_resistance_symptoms",
      group: "Extra Sign",
      title: "I feel very tired after eating, or have dark patches on my skin",
      desc: "Dark skin on your neck, underarms, or groin, or feeling extremely sleepy and craving sugar after meals, are signs your body may struggle with sugar."
    },
    {
      key: "family_history_pcos",
      group: "Family History",
      title: "My mother, sister, or aunt has PCOS or Type 2 Diabetes",
      desc: "PCOS and blood sugar problems can run in families. Having a close relative with these conditions increases your chances slightly."
    }
  ];

  const checkedCount = Object.values(assessment).filter(Boolean).length;
  const mainCriteriaCount = [assessment.irregular_cycles, assessment.hirsutism_or_acne, assessment.polycystic_ultrasound].filter(Boolean).length;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            PCOS Health Check
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          How Are You Feeling? Let Us Check Together
        </h1>
        <p className="text-sm text-slate-500">
          Answer a few simple questions about how you have been feeling. We will use your answers to help you understand your health better. This is not a medical test, but it can be a helpful starting point to talk to your doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Questions */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pick What Applies to You</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tick the ones that sound familiar. You can change your answers any time.</p>
            </div>
            <button
              onClick={runRiskCalculation}
              disabled={isEvaluating}
              className="px-4 py-2 rounded-full bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{isEvaluating ? "Checking..." : "Check My Health"}</span>
            </button>
          </div>

          <div className="space-y-4">
            {criteria.map((item) => {
              const isChecked = assessment[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                    isChecked
                      ? "bg-teal-50/50 border-teal-500 shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-5 h-5 mt-0.5 text-teal-700 rounded border-slate-300 focus:ring-teal-700 shrink-0 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-full">
                      {item.group}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar showing how many ticked */}
          <div className="pt-2 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>{checkedCount} of 5 signs ticked</span>
              <span className="font-semibold text-teal-700">{mainCriteriaCount} main signs selected</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${(checkedCount / 5) * 100}%` }}
              ></div>
            </div>
            <button
              onClick={runRiskCalculation}
              disabled={isEvaluating}
              className="w-full py-3.5 rounded-2xl bg-teal-700 text-white font-extrabold text-sm hover:bg-teal-800 transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? "Checking your answers..." : "See My Health Check Results"}</span>
            </button>
          </div>
        </div>

        {/* Right: Result */}
        <div className="lg:col-span-5 space-y-6">

          {result ? (
            <div className="p-6 sm:p-8 bg-gradient-to-br from-teal-800 to-teal-900 text-white rounded-3xl shadow-xl space-y-6 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Your Result</span>
                  <h3 className="text-2xl font-extrabold mt-1">{result.risk_level || "Checked"}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300 font-extrabold text-lg border border-white/20">
                  {result.risk_score || 0}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                <div className="text-xs font-bold text-teal-200 uppercase tracking-wider">What This Means</div>
                <div className="text-sm font-bold text-white">
                  {result.criteria_count || 0} out of 3 main signs found
                  {result.rotterdam_met
                    ? <span className="text-emerald-300"> — worth discussing with a doctor</span>
                    : <span className="text-teal-200"> — below the main threshold</span>}
                </div>
                <div className="text-xs text-teal-100 font-medium">{result.phenotype || "Your personal health pattern"}</div>
              </div>

              {result.sub_risks && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-200">Other Things to Watch</div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-teal-100">
                      <span>Blood sugar sensitivity</span>
                      <span className="font-bold text-white">{result.sub_risks.insulin_resistance || "Low"}</span>
                    </div>
                    <div className="w-full bg-teal-950/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-500"
                        style={{ width: result.sub_risks.insulin_resistance === "High" ? "85%" : result.sub_risks.insulin_resistance === "Moderate" ? "50%" : "20%" }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-teal-200">How well your body handles sugar and carbs</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-teal-100">
                      <span>Overall body health</span>
                      <span className="font-bold text-white">{result.sub_risks.metabolic_syndrome || "Low"}</span>
                    </div>
                    <div className="w-full bg-teal-950/60 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: result.sub_risks.metabolic_syndrome === "High" ? "80%" : result.sub_risks.metabolic_syndrome === "Moderate" ? "45%" : "15%" }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-teal-200">A general check of things like weight, blood pressure, and energy levels</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setCurrentRoute("reports")}
                className="w-full py-3 rounded-xl bg-white text-teal-900 font-bold text-xs hover:bg-teal-50 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Save a Summary to Show My Doctor</span>
              </button>
            </div>
          ) : (
            <div className="p-8 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-3xl shadow-xl space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-800/40 border border-teal-500/30 flex items-center justify-center text-teal-300">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Your results will show here</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Tick the signs that apply to you on the left, then tap <strong>See My Health Check Results</strong>. We will give you a simple, clear summary.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs text-slate-300">
                <div className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">You will see:</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /><span>How many signs of PCOS you may have</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /><span>A simple score for blood sugar and body health</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /><span>Easy steps you can take and what to ask your doctor</span></div>
              </div>
            </div>
          )}

          {result && result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">What You Can Do Next</h4>
              <div className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}