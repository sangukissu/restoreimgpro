
import React from 'react';
import { RotateCcw, Zap, Lock, Infinity, ShieldCheck } from 'lucide-react';

const GUARANTEES = [
  {
    title: "Satisfaction Guarantee",
    description: "Even after restoration, if we detect any damage (tears, stains, scratches) is still present which costed you one credit, we automatically offer one free re‑restoration.",
    icon: <RotateCcw size={24} strokeWidth={2.5} />
  },
  {
    title: "Lightning Fast",
    description: "Professional results in under 30 seconds. No waiting weeks like traditional restoration services.",
    icon: <Zap size={24} strokeWidth={2.5} />
  },
  {
    title: "100% Secure",
    description: "Your photos are encrypted and uploaded media automatically deleted from our servers within 30 minutes. Complete privacy guaranteed.",
    icon: <Lock size={24} strokeWidth={2.5} />
  },
  {
    title: "No Expiration",
    description: "Your restoration credits never expire. Use them whenever you're ready to restore your memories.",
    icon: <Infinity size={24} strokeWidth={2.5} />
  }
];

export default function Guarantees() {
  return (
    <section id="guarantees" className="w-full  px-4 sm:px-8 py-24 bg-brand-bg">
      
      {/* Header */}
      <div className="max-w-[1320px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
            <span className="text-brand-orange">//</span> Our Promise <span className="text-brand-orange">//</span>
          </div>
          
          {/* Title */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
            Restoration without <br />
            <span className="text-gray-400/80">the risk.</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="max-w-sm">
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            We are committed to quality and privacy. Here is why you can trust us with your memories.
          </p>
        </div>
      </div>

      {/* Guarantees Grid - Gray Surface */}
      <div className="max-w-[1320px] mx-auto bg-brand-surface p-3 rounded-[1.8rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {GUARANTEES.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-10 -translate-y-10"></div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-brand-black group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 relative z-10">
                {item.icon}
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-xl font-[850] text-brand-black mb-3 leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
