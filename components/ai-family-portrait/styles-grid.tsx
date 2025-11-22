"use client";

import Image from "next/image";
import { Wand2, SunMedium, Palette, LayoutList, Camera, ArrowRight } from "lucide-react";

function InputMosaic() {
  return (
    <div className="bg-white rounded-[1.5rem] p-8 h-full flex flex-col min-h-[420px] md:min-h-[500px] shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-brand-black">Input References</h3>
        <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">4 photos</span>
      </div>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {[
          { src: "/family-photo1.png", label: "Photo 1" },
          { src: "/family-photo2.jpg", label: "Photo 2" },
          { src: "/family-photo3.png", label: "Photo 3" },
          { src: "/family-photo4.png", label: "Photo 4" },
        ].map((item, idx) => (
          <figure key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group/img">
            <Image
              src={item.src}
              alt={item.label}
              fill
              className="object-cover transition-transform duration-500 group-hover/img:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 480px"
            />
            <figcaption className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-1 rounded-md bg-white/90 backdrop-blur text-gray-800 shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
              {item.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-6 font-medium leading-relaxed">
        We harmonize lighting, style, and composition — preserving the true likeness of every family member.
      </p>
    </div>
  );
}

function ProcessStrip() {
  const items = [
    { icon: <SunMedium className="w-5 h-5" />, title: "Match Lighting", desc: "Balance exposure and tone" },
    { icon: <Palette className="w-5 h-5" />, title: "Unify Style", desc: "Align color and art style" },
    { icon: <LayoutList className="w-5 h-5" />, title: "Compose Naturally", desc: "Respectful arrangement" },
    { icon: <Camera className="w-5 h-5" />, title: "Print Ready", desc: "High-res output" },
  ];
  return (
    <div className="bg-white rounded-[1.5rem] p-8 border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold text-brand-black mb-6 flex items-center gap-2">
        <Wand2 size={18} className="text-brand-orange" />
        How We Harmonize
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl bg-gray-50 p-4 border border-gray-100 hover:border-brand-orange/20 transition-colors group">
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
}

function ResultPanel() {
  return (
    <div className="bg-white rounded-[1.5rem] p-8 h-full flex flex-col min-h-[420px] md:min-h-[500px] shadow-sm border border-gray-100 group hover:shadow-md transition-all duration-300 relative overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-brand-black">Final Composite</h3>
        <span className="text-sm font-medium text-white bg-brand-black px-3 py-1 rounded-full flex items-center gap-1">
          <Wand2 size={12} /> Result
        </span>
      </div>

      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-inner flex-grow group/result">
        <Image
          src="/family-portrait.png"
          alt="Unified family portrait result"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 600px"
        />

        {/* Floating Tags */}
        <span className="absolute top-4 left-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-brand-black shadow-sm flex items-center gap-1 transform -translate-y-2 opacity-0 group-hover/result:translate-y-0 group-hover/result:opacity-100 transition-all duration-300">
          <SunMedium size={10} /> Subtle re‑lighting
        </span>
        <span className="absolute bottom-4 right-4 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-brand-black shadow-sm flex items-center gap-1 transform translate-y-2 opacity-0 group-hover/result:translate-y-0 group-hover/result:opacity-100 transition-all duration-300 delay-75">
          <Palette size={10} /> Color harmonized
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-500 font-medium">Print‑ready, respectful composite.</p>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-brand-black group-hover:bg-brand-orange group-hover:text-white transition-colors">
          <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
}

export default function FamilyPortraitShowcase() {
  return (
    <section className="px-4 sm:px-8 py-24 bg-[#F2F2F0]">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 text-brand-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
            <Wand2 size={14} className="text-brand-orange" />
            <span>The Magic</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] text-brand-black mb-6 leading-[0.95] tracking-tight">
            From Separate Photos to <br />
            <span className="text-gray-400">One Cherished Portrait.</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Upload up to four references. We harmonize lighting, color, and composition to create a realistic family photo — no gimmicks.
          </p>
        </div>

        {/* Split: Inputs and Result */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-6">
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
}