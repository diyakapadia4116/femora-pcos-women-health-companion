import React from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, Brain, Award, Users, ArrowRight } from 'lucide-react';

export default function AboutPage({ setCurrentRoute }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            About Our Mission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Transforming PCOS Care through <br />
            <span className="text-teal-700">Data-Driven Empathy</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Polycystic Ovary Syndrome (PCOS) affects 1 in 5 women of reproductive age, yet most tracking solutions treat menstrual health as a rigid 28-day cycle. We built a platform designed to embrace irregularity, identify lifestyle triggers, and empower women with objective clinical data.
          </p>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Machine Learning Intelligence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Moving beyond calendars. We employ Pearson correlation matrices and Random Forest forecasting to discover the real root-causes behind fatigue, bloating, and irregular cycles.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Rotterdam Consensus Standards</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aligned with global international guidelines (ESHRE / ASRM), helping patients categorize their specific phenotype (A, B, C, or D) for tailored medical discussions.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-roseTint-100 text-rose-700 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Empathetic UI & Actionable Paths</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed with soothing blush-pink and medical-grade emerald-teal palettes to foster an inviting, non-judgmental tracking habit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
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
