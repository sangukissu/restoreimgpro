
import React from 'react';
import Image from "next/image"; // Note: In standard React without Next.js, we use <img>. Adapting to standard <img> for this project environment.
import { Wand2, SunMedium, Palette, LayoutList, Camera, ArrowRight, Sparkles } from "lucide-react";

const InputMosaic = () => {
  const images = [
    { src: "/family-photo1.png", label: "Father" },
    { src: "/family-photo2.jpg", label: "Mother" },
    { src: "/family-photo3.png", label: "Son" },
    { src: "/family-photo4.png", label: "Daughter" },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 h-full flex flex-col min-h-[420px] md:min-h-[500px] shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-[850] text-brand-black tracking-tight">Input References</h3>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">4 photos</span>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        {images.map((item, idx) => (
          <figure key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-100 group/img bg-gray-50">
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
            />
            <figcaption className="absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-white/90 backdrop-blur text-brand-black shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity translate-y-2 group-hover/img:translate-y-0 duration-300">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>

      <p className="text-sm text-gray-500 mt-8 font-medium leading-relaxed max-w-sm">
        We harmonize lighting, style, and composition — preserving the true likeness of every family member.
      </p>
    </div>
  );
};

const ProcessStrip = () => {
  const items = [
    { icon: <SunMedium className="w-5 h-5" />, title: "Match Lighting", desc: "Balance exposure and tone" },
    { icon: <Palette className="w-5 h-5" />, title: "Unify Style", desc: "Align color and art style" },
    { icon: <LayoutList className="w-5 h-5" />, title: "Compose Naturally", desc: "Respectful arrangement" },
    { icon: <Camera className="w-5 h-5" />, title: "Print Ready", desc: "High-res output" },
  ];
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm mt-3">
      <h3 className="text-lg font-[850] text-brand-black mb-6 flex items-center gap-2">
        <div className="bg-brand-orange/10 p-1.5 rounded-lg">
          <Wand2 size={16} className="text-brand-orange" />
        </div>
        How We Harmonize
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl bg-gray-50 p-5 border border-gray-100 hover:border-brand-orange/20 hover:bg-white hover:shadow-sm transition-all duration-300 group cursor-default">
            <div className="flex items-center gap-3 text-brand-black mb-2 group-hover:text-brand-orange transition-colors">
              {item.icon}
              <span className="text-sm font-bold">{item.title}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResultPanel = () => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 h-full flex flex-col min-h-[420px] md:min-h-[500px] shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 relative overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-[850] text-brand-black tracking-tight">Final Composite</h3>
        <span className="text-xs font-bold text-white bg-brand-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-wide">
          <Wand2 size={12} /> Result
        </span>
      </div>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-inner flex-grow group/result bg-gray-100">
        <img
          src="/family-portrait.png"
          alt="Unified family portrait result"
          className="w-full h-full object-cover"
        />

        {/* Floating Tags */}
        <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-brand-black shadow-sm flex items-center gap-1.5 transform -translate-y-2 opacity-0 group-hover/result:translate-y-0 group-hover/result:opacity-100 transition-all duration-300">
          <SunMedium size={10} /> Subtle re‑lighting
        </span>
        <span className="absolute bottom-4 right-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-brand-black shadow-sm flex items-center gap-1.5 transform translate-y-2 opacity-0 group-hover/result:translate-y-0 group-hover/result:opacity-100 transition-all duration-300 delay-75">
          <Palette size={10} /> Color harmonized
        </span>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500 font-medium">Print‑ready, respectful composite.</p>
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-brand-black group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 hover:scale-105">
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export const FamilyPortrait: React.FC = () => {
  return (
    <section id="family-portrait" className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-24 ">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
            <span className="text-brand-orange">//</span> The Magic <span className="text-brand-orange">//</span>
          </div>

          {/* Title */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
            Separate photos? <br />
            <span className="text-gray-400/80">One Family Portrait.</span>
          </h2>
        </div>

        {/* Subtitle */}
        <div className="max-w-sm">
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Upload up to four references. We harmonize lighting, color, and composition to create a realistic family photo — no gimmicks.
          </p>
        </div>
      </div>

      {/* Main Content: Gray Surface Container */}
      <div className="bg-brand-surface p-3 rounded-[3rem]">

        {/* Split: Inputs and Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch mb-3">
          <div className="h-full">
            <InputMosaic />
          </div>
          <div className="h-full">
            <ResultPanel />
          </div>
        </div>

        {/* Process */}
        <ProcessStrip />

      </div>
    </section>
  );
};
