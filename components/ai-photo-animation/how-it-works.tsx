"use client";

import React from "react";
import { UploadCloud, MousePointer2, Wand2, Play, Pause, Sparkles, Upload, Download, CheckCircle2, Film } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Upload Photo",
    description: "Start with any portrait. For the best results, we recommend using a photo that has already been restored to clarity using our restoration tool.",
    icon: <Upload size={24} />,
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
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-60" alt="file" />
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
    title: "Choose Style",
    description: "Select the perfect motion from our library. From a gentle smile to a warm gaze, find the style that fits best.",
    icon: <Wand2 size={24} />,
    visual: (
      <div className="w-full h-full relative bg-gray-50 overflow-hidden group/style">
        {/* Background Image - Light & Clean */}
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale-[0.2]"
          alt="Style Selection"
        />

        {/* Light Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/20 to-transparent"></div>

        {/* Style Menu UI - Floating White Card */}
        <div className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-3 flex flex-col gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Animation Style</div>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          {/* Option 1 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                <span className="text-sm">😊</span>
              </div>
              <span className="text-sm font-bold text-gray-600">Natural Smile</span>
            </div>
          </div>

          {/* Option 2 (Active) */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-brand-orange/5 border border-brand-orange/20 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shadow-sm">
                <Sparkles size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-brand-black">Subtle Blink</span>
            </div>
            <div className="absolute right-2 z-10">
              <CheckCircle2 size={16} className="text-brand-orange fill-brand-orange/10" />
            </div>
          </div>
        </div>

        {/* Cursor Animation */}
        <div className="absolute top-[75%] left-[70%] z-20 animate-[cursor-click_3s_infinite] pointer-events-none">
          <MousePointer2 className="w-6 h-6 text-brand-black fill-black drop-shadow-xl" />
        </div>

        <style>{`
            @keyframes cursor-click {
                0%, 100% { transform: translate(0, 0) scale(1); }
                35% { transform: translate(-20px, -20px) scale(1); } /* Move to button */
                45% { transform: translate(-20px, -20px) scale(0.9); } /* Click */
                55% { transform: translate(-20px, -20px) scale(1); } /* Release */
            }
        `}</style>
      </div>
    )
  },
  {
    id: 3,
    title: "Download & Share",
    description: "In under 60 seconds, your animated photo is ready. Download the high-res MP4 to share with family and cherish forever.",
    icon: <Download size={24} />,
    visual: (
      <div className="w-full h-full relative bg-[#F5F5F5] overflow-hidden flex flex-col group/video">
        {/* Video Player Container */}
        <div className="flex-grow relative overflow-hidden bg-black">
          <video
            className="w-full h-full object-cover opacity-90"
            autoPlay
            loop
            muted
            playsInline
            src="/videos/blink-tilt-animation.mp4"
          ></video>

          {/* Overlay Gradient for controls */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>

        {/* Player Controls */}
        <div className="h-12 bg-white border-t border-gray-100 flex items-center px-4 justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <button className="w-6 h-6 bg-brand-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
              <Pause size={10} className="text-white fill-white" />
            </button>
            <div className="text-[10px] font-bold text-gray-400 font-mono">00:05 / 00:12</div>
          </div>

          <div className="flex-grow mx-4 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-brand-orange rounded-full relative animate-[shimmer_2s_linear_infinite]">
              {/* Progress Handle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-brand-orange rounded-full shadow-sm scale-150"></div>
            </div>
          </div>

          <div className="flex gap-1 items-end h-3">
            <div className="w-1 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="w-1 h-3 bg-brand-black rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-1.5 bg-gray-300 rounded-full animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    )
  }
];

export default function AIAnimationHowItWorks() {
  return (
    <section id="how-it-works" className="px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Simple Workflow <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[1.1]">
              Living Memories <br />
              <span className="text-gray-400">in 3 Steps.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No software to install or complicated settings. Simply upload your photo, choose a style, and our AI does the rest in seconds.
            </p>
          </div>
        </div>

        {/* Steps Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-[1.5rem] p-8 min-h-[480px] flex flex-col group"
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
                <div className="mb-6 relative z-10">
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