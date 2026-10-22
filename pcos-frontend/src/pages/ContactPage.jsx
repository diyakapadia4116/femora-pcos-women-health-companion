import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactPage({ onShowToast }) {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Project Feedback', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onShowToast('Thank you! Your message has been sent to the engineering team.');
      setForm({ name: '', email: '', subject: 'Project Feedback', message: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 px-3 py-1 bg-teal-50 rounded-full border border-teal-100">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact the Platform Team
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Have questions regarding the analytics engine, clinical data integrations, or academic collaboration? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Contact Info */}
          <div className="lg:col-span-5 bg-teal-800 text-white p-8 rounded-3xl shadow-lg flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Project Contact Details</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                Focused on Women's Health Intelligence and Machine Learning Analytics.
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span>support@pcoscompanion.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span>Engineering Team & Project Guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>Department of Computer Science & Engineering</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-teal-200/80">
              Open for clinician review, dataset contributions, and academic evaluation.
            </div>
          </div>

          {/* Right Message Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Prof. / Dr. / Student Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@university.edu"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Topic / Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700"
                >

                  <option value="Clinical Inquiry">Clinical & Medical Accuracy</option>
                  <option value="General Support">General Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Write your suggestions or inquiries here..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-teal-700 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3.5 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
