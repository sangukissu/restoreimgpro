
import React from 'react';
import { Check, X, Minus, Sparkles, ShieldCheck, Zap, Coins, Film, Maximize2, MousePointer2 } from 'lucide-react';

// Data Structure
const FEATURES = [
  {
    label: "Restoration Quality",
    icon: <Sparkles size={18} />,
    bringback: "Natural, AI-powered",
    manual: "High (Artist dependent)",
    free: "Unnatural / Plastic"
  },
  {
    label: "Privacy & Security",
    icon: <ShieldCheck size={18} />,
    bringback: "100% Private (Auto-delete)",
    manual: "Generally Private",
    free: "Data Mining Risk"
  },
  {
    label: "Turnaround Time",
    icon: <Zap size={18} />,
    bringback: "< 30 Seconds",
    manual: "Days or Weeks",
    free: "Fast"
  },
  {
    label: "Cost Per Photo",
    icon: <Coins size={18} />,
    bringback: "~$0.50 (Affordable)",
    manual: "$50 - $200+",
    free: "Free (Low Quality)"
  },
  {
    label: "Photo Animation",
    icon: <Film size={18} />,
    bringback: "Yes, Lifelike Motion",
    manual: "Not possible",
    free: "Limited / Glitchy"
  },
  {
    label: "High-Res Output",
    icon: <Maximize2 size={18} />,
    bringback: "Yes, Enhanced HD",
    manual: "Yes",
    free: "Low Res / Watermarked"
  },
  {
    label: "Ease of Use",
    icon: <MousePointer2 size={18} />,
    bringback: "1-Click Automatic",
    manual: "Consultation needed",
    free: "Manual Upload"
  }
];

// Fixed heights for alignment across columns
const HEADER_HEIGHT = "h-40";
const ROW_HEIGHT = "h-24";
const FOOTER_HEIGHT = "h-32";

export const Comparison: React.FC = () => {
  return (
    <section id="comparison" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
            <span className="text-brand-orange">//</span> Benchmark <span className="text-brand-orange">//</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-brand-black leading-[0.95] mb-6">
            Why BringBack is the <br />
            <span className="text-gray-400">smartest choice.</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            We compared the top restoration methods so you don't have to.
          </p>
        </div>

        {/* DESKTOP: Column-Based Layout (Guaranteed Alignment) */}
        <div className="hidden lg:flex items-end justify-center gap-0 max-w-6xl mx-auto">

          {/* --- COL 1: Feature Labels (25%) --- */}
          <div className="w-[25%] flex flex-col">
            {/* Header Placeholder */}
            <div className={`${HEADER_HEIGHT} flex items-end pb-8 pl-8 border-b border-transparent`}>
              <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest">Features</h4>
            </div>

            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center gap-3 pl-8 border-b border-gray-200/50`}>
                <div className="text-gray-400">{f.icon}</div>
                <span className="font-bold text-brand-black text-lg">{f.label}</span>
              </div>
            ))}

            {/* Footer Placeholder */}
            <div className={`${FOOTER_HEIGHT} flex items-center pl-8`}>
              <span className="font-extrabold text-xl text-gray-900">Final Verdict</span>
            </div>
          </div>

          {/* --- COL 2: BringBack AI (The Spotlight Card) (30%) --- */}
          <div className="w-[30%] bg-white rounded-[2.5rem] shadow-xl border border-gray-100 relative z-20 transform -translate-y-4 pb-4">
            {/* Highlight Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-brand-orange rounded-b-full"></div>

            {/* Header */}
            <div className={`${HEADER_HEIGHT} flex flex-col items-start justify-end pb-8 border-b border-gray-100 pl-8`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white">
                  <Sparkles size={16} fill="currentColor" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-brand-black">BringBack</span>
              </div>
              <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Recommended
              </div>
            </div>

            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-100 pl-8 text-left`}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="font-bold text-brand-black text-lg">{f.bringback}</span>
                </div>
              </div>
            ))}

            {/* Footer */}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-8`}>
              <span className="font-extrabold text-xl text-brand-orange">Best Overall Value</span>
            </div>
          </div>

          {/* --- COL 3: Manual Pros (22.5%) --- */}
          <div className="w-[22.5%] flex flex-col opacity-60">
            {/* Header */}
            <div className={`${HEADER_HEIGHT} flex items-end justify-start pb-8 border-b border-transparent pl-6`}>
              <h4 className="font-bold text-lg text-brand-black">Manual Pros</h4>
            </div>

            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-200/50 text-left pl-6 px-2`}>
                <span className="text-gray-600 font-medium">{f.manual}</span>
              </div>
            ))}

            {/* Footer */}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-6`}>
              <span className="font-bold text-sm text-gray-500">Too Expensive</span>
            </div>
          </div>

          {/* --- COL 4: Free Tools (22.5%) --- */}
          <div className="w-[22.5%] flex flex-col opacity-60">
            {/* Header */}
            <div className={`${HEADER_HEIGHT} flex items-end justify-start pb-8 border-b border-transparent pl-6`}>
              <h4 className="font-bold text-lg text-brand-black">Free Tools</h4>
            </div>

            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-200/50 text-left pl-6 px-2`}>
                <span className="text-gray-600 font-medium">{f.free}</span>
              </div>
            ))}

            {/* Footer */}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-6`}>
              <span className="font-bold text-sm text-gray-500">Low Quality</span>
            </div>
          </div>

        </div>

        {/* MOBILE: Card Layout (Unchanged as it works well for small screens) */}
        <div className="lg:hidden flex flex-col gap-6">

          {/* BringBack Card (Featured) */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border-2 border-brand-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-orange"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-black rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-brand-black leading-none">BringBack AI</h3>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Winner</span>
              </div>
            </div>
            <div className="space-y-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                  <span className="text-gray-500 font-medium text-sm">{f.label}</span>
                  <span className="font-bold text-brand-black text-right text-sm">{f.bringback}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Others (Collapsed) */}
          <div className="bg-brand-surface rounded-[2rem] p-8 opacity-80 grayscale">
            <h3 className="font-bold text-xl text-gray-500 mb-6 text-center">Manual Services</h3>
            <div className="space-y-3 text-center">
              <div className="text-sm text-gray-400">Expensive ($50+)</div>
              <div className="text-sm text-gray-400">Slow Turnaround</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
