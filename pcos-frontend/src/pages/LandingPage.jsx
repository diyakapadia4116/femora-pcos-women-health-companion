import React from 'react';
import { 
  Activity, 
  CalendarDays, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Heart,
  ChevronRight,
  Zap,
  Users,
  Award
} from 'lucide-react';

export default function LandingPage({ setCurrentRoute, onDemoLogin }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section matching Page 1 */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 hero-gradient border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Your Companion for Holistic Health
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Reclaim Control of Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-rose-400">
                  Wellness Journey
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                The empathetic, data-driven companion designed specifically for women with PCOS. 
                Track your cycle, manage symptoms, and uncover personalized insights to thrive.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => setCurrentRoute('signup')}
                  className="px-8 py-4 rounded-full bg-teal-700 text-white font-bold text-sm sm:text-base hover:bg-teal-800 transition-all shadow-lg hover:shadow-teal-700/25 flex items-center gap-3 group active:scale-98"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentRoute('login')}
                  className="px-8 py-4 rounded-full bg-white text-teal-800 font-bold text-sm sm:text-base border border-teal-200 hover:bg-teal-50 transition-all shadow-sm flex items-center gap-2"
                >
                  <span>Sign In to Account</span>
                  <ChevronRight className="w-4 h-4 text-teal-600" />
                </button>
              </div>

              {/* Social proof avatar stack */}
              <div className="pt-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-teal-700 text-white text-[10px] font-bold">DK</div>
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-rose-500 text-white text-[10px] font-bold">AP</div>
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-emerald-600 text-white text-[10px] font-bold">MS</div>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Joined by <span className="text-teal-800 font-bold">10,000+</span> women tracking wellness
                </p>
              </div>
            </div>

            {/* Right Hero Visual Banner matching Page 1 */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100/80">
                <div className="w-full h-64 rounded-2xl bg-gradient-to-tr from-teal-50 via-roseTint-50 to-emerald-50 flex items-center justify-center p-6 text-center border border-teal-50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
                  <div className="relative z-10 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-teal-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-700/30">
                      <Heart className="w-8 h-8 text-rose-200 fill-rose-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Holistic PCOS Care</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Intelligent tracking + cycle prediction + lifestyle analytics + clinician-ready reports
                    </p>
                  </div>
                </div>

                {/* Floating mini stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100">
                    <div className="text-xs text-teal-800 font-medium">Cycle Regularity</div>
                    <div className="text-lg font-bold text-teal-900">82% <span className="text-xs text-emerald-600">↑ 12%</span></div>
                  </div>
                  <div className="p-3 bg-roseTint-50 rounded-xl border border-rose-100">
                    <div className="text-xs text-rose-800 font-medium">Fatigue Drop</div>
                    <div className="text-lg font-bold text-rose-900">-42% <span className="text-xs text-teal-600">better sleep</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why PCOS Companion / 3 Feature Cards matching Page 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Why femora?</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Comprehensive care, tailored to you.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              We bridge the gap between traditional tracking and functional health insights, 
              helping you understand the "why" behind your symptoms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Smarter Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Predict periods, ovulation, and fertile windows with accuracy that adapts to irregular cycles.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Risk Assessment</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Identify potential health risks early with clinically-informed assessments and data trends.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 card-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-roseTint-100 text-rose-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Lifestyle Coaching</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Get actionable advice on diet, stress, and exercise curated for your unique hormone profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive 1: Cycle Tracking matching Page 1 */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
                Core Feature
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Cycle tracking that understands PCOS.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Most apps assume a regular 28-day cycle. We don't. Our intelligent algorithm learns your body's specific patterns, even if they're unpredictable.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Irregular cycle pattern recognition",
                  "Ovulation window predictions",
                  "Flow intensity & duration logging",
                  "Period-induced symptom forecasting"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-700 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-800">May 2024</div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">Follicular</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-slate-400">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-xs">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const isPeriod = day >= 1 && day <= 5;
                    const isFertile = day >= 12 && day <= 16;
                    const isToday = day === 9;
                    return (
                      <div
                        key={day}
                        className={`h-9 flex items-center justify-center rounded-xl font-medium transition-all ${
                          isToday
                            ? 'bg-teal-700 text-white font-bold ring-2 ring-teal-200'
                            : isPeriod
                            ? 'bg-rose-100 text-rose-800 font-semibold'
                            : isFertile
                            ? 'bg-teal-50 text-teal-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex justify-between">
                  <span>Predicted Ovulation: <strong>May 15</strong></span>
                  <span className="text-teal-700 font-semibold">High Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive 2: Symptom Tracking matching Page 1 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-md p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <div className="text-sm font-bold text-slate-700 uppercase tracking-wide">Daily Symptoms Check-in</div>
                <div className="space-y-3">
                  {[
                    { label: "Acne & Breakouts", val: "Level 4", color: "bg-amber-400", pct: "40%" },
                    { label: "Bloating / Digestive", val: "Level 6", color: "bg-rose-500", pct: "60%" },
                    { label: "Fatigue / Low Energy", val: "Level 7", color: "bg-teal-600", pct: "70%" },
                    { label: "Hair Fall / Thinning", val: "Level 2", color: "bg-emerald-500", pct: "20%" },
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-xs space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{s.label}</span>
                        <span className="text-slate-500">{s.val}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: s.pct }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
                Core Feature
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Log every symptom, gain every insight.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Track energy levels, mood, skin health, and weight. Seeing the data over time helps you and your doctor identify triggers and progress.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Daily mood and energy check-ins",
                  "Physical symptom severity logging",
                  "Pearson correlation engine (Sleep ↔ Fatigue)",
                  "Detailed historical health log export"
                ].map((text, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-700 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials matching Page 1 */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Real journeys from our community.
            </h2>
            <p className="text-slate-600 text-sm">Empowering women with clarity and science.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "The analytics feature changed everything for me. I finally saw how much my sleep was affecting my hirsutism triggers. Now I feel more in control."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">SJ</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Sarah Johnson</h4>
                  <p className="text-xs text-slate-400">User for 18 months</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "I've tried every tracker out there. This is the only one that didn't make me feel 'broken' for having a 45-day cycle. It's truly built for us."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs">EC</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Emily Chen</h4>
                  <p className="text-xs text-slate-400">User for 6 months</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "Showing my symptom reports to my endocrinologist made our appointments so much more productive. No more guessing; just facts."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">JM</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Jessica Miller</h4>
                  <p className="text-xs text-slate-400">User for 2 years</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action bottom banner matching Page 1 */}
      <section className="py-20 bg-teal-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready to transform your health story?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of women who are managing their PCOS symptoms with confidence and clarity. Start your journey today.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentRoute('signup')}
              className="px-8 py-4 rounded-full bg-teal-700 text-white font-bold text-sm sm:text-base hover:bg-teal-800 transition-all shadow-md active:scale-98"
            >
              Get Started Now →
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium">No credit card required. Free to get started.</p>
        </div>
      </section>

      {/* Footer matching Page 1 */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs border border-slate-200 shrink-0">
                <img src="/logo.jpg" alt="femora logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-teal-800 text-lg">femora.</span>
            </div>
            <div className="flex gap-6 text-xs text-slate-500 font-medium">
              <button onClick={() => setCurrentRoute('landing')} className="hover:text-teal-700">Features</button>
              <button onClick={() => setCurrentRoute('about')} className="hover:text-teal-700">About Mission</button>
              <button onClick={() => setCurrentRoute('contact')} className="hover:text-teal-700">Contact Team</button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-xs text-slate-400">
            <p>© 2026 femora.</p>
            <p>Made with care for women everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
