"use client";

import React from 'react';
import { ImagePlus, Wand2, Download, MousePointer2, UploadCloud, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: "Upload Your Grainy Photo",
    description: "Drag & drop your noisy, grainy, or low-light photos securely into our platform. Our AI instantly analyzes the noise patterns.",
    icon: <ImagePlus size={24} className="text-brand-black" />,
    visual: (
      <div className="w-full h-full relative bg-gray-50 overflow-hidden group/visual">
        {/* Dot Pattern Background */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* Upload UI */}
        <div className="absolute inset-5 rounded-2xl border-2 border-dashed border-gray-300 bg-white shadow-sm flex flex-col items-center justify-center gap-3 transition-colors duration-300 group-hover/visual:border-brand-orange/50 group-hover/visual:bg-brand-orange/5">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover/visual:bg-white group-hover/visual:text-brand-orange transition-colors">
            <UploadCloud size={24} />
          </div>
          <div className="space-y-1 text-center">
            <div className="text-xs font-bold text-gray-400 group-hover/visual:text-brand-orange/80 uppercase tracking-wide">Click to upload</div>
            <div className="text-[10px] text-gray-300 font-medium">JPG, PNG, WEBP</div>
          </div>
        </div>

        {/* Animated Cursor & File */}
        <div className="absolute top-1/2 left-1/2 z-20 animate-cursor-drop pointer-events-none">
          <div className="relative">
            <MousePointer2 className="w-6 h-6 text-brand-black fill-black absolute -right-1 -bottom-3 z-20 drop-shadow-md" />

            <div className="w-14 h-16 bg-white rounded-lg shadow-xl border border-gray-100 flex items-center justify-center transform -rotate-6 origin-bottom-right">
              <div className="w-full h-full p-1.5 flex flex-col gap-1">
                <div className="w-full h-2/3 bg-gray-100 rounded-md overflow-hidden">
                  <img src="/noise-removed.webp" className="w-full h-full object-cover grayscale opacity-60" alt="file" />
                </div>
                <div className="space-y-1">
                  <div className="w-2/3 h-1.5 bg-gray-200 rounded-full"></div>
                  <div className="w-1/2 h-1.5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "AI Noise Reduction",
    description: "Our advanced algorithms identify and remove digital noise while intelligently preserving important details and textures.",
    icon: <Wand2 size={24} className="text-brand-black" />,
    visual: (
      <div className="w-full h-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Base Image (Noisy) */}
          <img
            src="/noise-removed.webp"
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Restored Image (Revealed by clip-path animation) */}
          <div className="absolute inset-0 w-full h-full animate-[clip-scan_4s_ease-in-out_infinite] overflow-hidden z-10">
            <img
              src="/after-noise-removal.webp"
              alt="Restored"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Scanner Line & Glow */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-brand-orange animate-[scan-line_4s_ease-in-out_infinite] z-20 shadow-[0_0_15px_#FF4D00]"></div>
        </div>

        {/* Clean Status Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap z-20">
          <div className="w-2 h-2 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"></div>
          Denoising...
        </div>

        <style>{`
            @keyframes clip-scan {
                0%, 100% { clip-path: inset(0 100% 0 0); }
                50% { clip-path: inset(0 0 0 0); }
            }
            @keyframes scan-line {
                0%, 100% { left: 0%; }
                50% { left: 100%; }
            }
         `}</style>
      </div>
    )
  },
  {
    id: 3,
    title: "Get Clean Results",
    description: "Download your crystal-clear image. No more grain, just sharp, professional-looking photos ready for use.",
    icon: <Download size={24} className="text-brand-black" />,
    visual: (
      <div className="w-full h-full relative bg-[#F5F5F5] overflow-hidden flex flex-col group/result">
        {/* Result Image */}
        <div className="flex-grow relative overflow-hidden">
          <img
            src="/after-noise-removal.webp"
            alt="Clean Result"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/result:scale-105"
          />

          {/* Success Overlay */}
          <div className="absolute inset-0 bg-black/10 group-hover/result:bg-black/0 transition-colors duration-300"></div>

          {/* Success Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md shadow-lg border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 transform scale-90 opacity-0 group-hover/result:scale-100 group-hover/result:opacity-100 transition-all duration-500 delay-100">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-xs font-bold text-gray-800">Noise Removed</span>
          </div>
        </div>

        {/* Fake Download Bar */}
        <div className="h-12 bg-white border-t border-gray-100 flex items-center px-4 justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500">JPG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-800">clean_photo.jpg</span>
              <span className="text-[9px] text-gray-400">2.4 MB • High Res</span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-brand-black flex items-center justify-center text-white shadow-sm group-hover/result:scale-110 transition-transform">
            <Download size={14} />
          </div>
        </div>
      </div>
    )
  }
];

export default function DenoiseHowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> How It Works <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Remove noise <br />
              <span className="text-gray-400">in 3 simple steps.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No complex editing skills required. Our AI handles the denoising process completely automatically.
            </p>
          </div>
        </div>

        {/* Steps Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-[1.5rem] p-8 min-h-[420px] flex flex-col group"
              >
                {/* Step Number & Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2F2F0] flex items-center justify-center transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                    {step.icon}
                  </div>
                  <span className="text-6xl font-[800] text-gray-100 leading-none select-none font-sans group-hover:text-gray-200 transition-colors">
                    0{step.id}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-4 relative z-10">
                  <h3 className="text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual "Mini App" Area */}
                <div className="mt-auto h-[200px] rounded-3xl overflow-hidden border border-gray-100 relative shadow-inner transform group-hover:translate-y-[-5px] transition-transform duration-300">
                  {step.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
