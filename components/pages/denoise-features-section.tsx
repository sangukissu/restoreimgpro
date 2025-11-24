"use client";

import React from 'react';
import { Sparkles, Eye, Zap, Search, Palette, Shield, Lock, ScanLine, CheckCircle2, Play } from 'lucide-react';

// --- Visual Components for Each Card ---

const VisualDetail = () => {
  const rows = 2;
  const cols = 3;
  const totalCells = rows * cols;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-[1.5rem] bg-gray-900 group">
      {/* Base Layer: Noisy Image */}
      <img
        src="/grainy-photo.webp"
        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 filter blur-[0.5px]"
        alt="Original"
      />

      {/* Grid Overlay Layer */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
        {Array.from({ length: totalCells }).map((_, i) => (
          <div key={i} className="relative overflow-hidden border-[0.5px] border-white/10">
            {/* Restored Image Segment */}
            <div
              className="absolute inset-0 w-[300%] h-[200%] opacity-0 animate-[restore-cell_4s_infinite]"
              style={{
                backgroundImage: 'url(/grainy-photo-restored.webp)',
                backgroundSize: '100% 100%',
                left: `-${(i % cols) * 100}%`,
                top: `-${Math.floor(i / cols) * 100}%`,
                animationDelay: `${i * 0.4}s`
              }}
            ></div>

            <div
              className="absolute inset-0 bg-brand-orange/20 animate-[scan-flash_4s_infinite]"
              style={{ animationDelay: `${i * 0.4}s` }}
            ></div>
          </div>
        ))}
      </div>

      {/* UI Overlay */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
          RECOVERING DETAILS
        </div>
      </div>

      <style>{`
        @keyframes restore-cell {
          0% { opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          95% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes scan-flash {
          0% { opacity: 0; }
          5% { opacity: 1; }
          15% { opacity: 0; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const VisualNoiseTypes = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-900 group">
    {/* Base Image */}
    <img
      src="/color-noise.webp"
      className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
      alt="Damaged"
    />

    {/* Noise Overlays - Cycling */}
    <div className="absolute inset-0 animate-[cycle-damage_8s_infinite]">
      {/* Luminance Noise */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_0s]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50"></div>
      </div>
      {/* Color Noise */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_2s]">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 via-green-500/20 to-blue-500/20 mix-blend-overlay"></div>
      </div>
      {/* Artifacts */}
      <div className="absolute inset-0 opacity-0 animate-[show-layer_8s_infinite_4s]">
        <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-white/10 blur-sm rounded-full"></div>
      </div>
    </div>

    {/* Dynamic Label */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-lg p-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center">
          <Zap size={14} className="text-brand-orange animate-pulse" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Detected</span>
          <div className="h-4 overflow-hidden relative w-24">
            <div className="absolute top-0 left-0 flex flex-col animate-[scroll-text_8s_infinite]">
              <span className="text-xs font-bold text-white h-4">Luminance</span>
              <span className="text-xs font-bold text-white h-4">Color Noise</span>
              <span className="text-xs font-bold text-white h-4">Artifacts</span>
              <span className="text-xs font-bold text-brand-orange h-4">Cleaned</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes show-layer {
        0%, 20% { opacity: 1; }
        25%, 100% { opacity: 0; }
      }
      @keyframes scroll-text {
        0%, 20% { transform: translateY(0); }
        25%, 45% { transform: translateY(-1rem); }
        50%, 70% { transform: translateY(-2rem); }
        75%, 95% { transform: translateY(-3rem); }
        100% { transform: translateY(0); }
      }
    `}</style>
  </div>
);

const VisualSmartDetect = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-900">
    <img
      src="/grainy-photo.webp"
      className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
      alt="Scan"
    />
    {/* Radar Overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-[150%] h-[150%] border-2 border-brand-orange/30 rounded-full animate-[spin_4s_linear_infinite] border-t-brand-orange relative">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-orange/20 to-transparent rounded-full"></div>
      </div>
    </div>
    {/* Detected Points */}
    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-orange rounded-full animate-ping"></div>
    <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-brand-orange rounded-full animate-ping delay-700"></div>
    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-brand-orange rounded-full animate-ping delay-300"></div>
  </div>
);

const VisualColorFidelity = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-200">
    {/* Noisy Color Background */}
    <img
      src="/color-noise.webp"
      className="absolute inset-0 w-full h-full object-cover"
      alt="Noisy Color"
    />
    {/* Clean Color Overlay controlled by animation */}
    <div className="absolute inset-0 w-full h-full overflow-hidden animate-[color-wipe_4s_linear_infinite]">
      <img
        src="/color-noise-removed.webp"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Clean Color"
      />
    </div>
    {/* Slider UI */}
    <div className="absolute bottom-3 left-3 right-3 h-1.5 bg-white/30 rounded-full backdrop-blur">
      <div className="h-full bg-brand-orange rounded-full animate-[width-full_4s_linear_infinite]"></div>
    </div>
    <style>{`
      @keyframes color-wipe {
        0% { clip-path: inset(0 100% 0 0); }
        50% { clip-path: inset(0 0 0 0); }
        100% { clip-path: inset(0 0 0 0); }
      }
      @keyframes width-full {
        0% { width: 0%; }
        50% { width: 100%; }
        100% { width: 100%; }
      }
    `}</style>
  </div>
);

const VisualPrivacy = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-50 flex items-center justify-center">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

    <div className="relative w-16 h-16 bg-brand-black rounded-2xl flex items-center justify-center text-white shadow-xl z-10">
      <Lock size={24} />
      <div className="absolute -top-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
        <CheckCircle2 size={14} className="text-white" />
      </div>
    </div>

    {/* Vanishing Photos Animation */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 absolute animate-[file-vanish_3s_infinite] opacity-0"></div>
      <div className="w-12 h-16 bg-gray-200 rounded border border-gray-300 absolute animate-[file-vanish_3s_infinite_0.5s] opacity-0"></div>
    </div>

    <style>{`
        @keyframes file-vanish {
            0% { transform: translate(40px, 40px) scale(1) rotate(10deg); opacity: 1; }
            100% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0; }
        }
     `}</style>
  </div>
);

const VisualEdges = () => (
  <div className="w-full h-full relative overflow-hidden rounded-[1.3rem] bg-gray-900 group">
    {/* Base Image */}
    <img
      src="/old-digi-camera.webp"
      className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[1px]"
      alt="Soft Edges"
    />
    {/* Sharpening Scan */}
    <div className="absolute inset-0 bg-brand-orange/10 animate-[scan-line_3s_linear_infinite] border-b-2 border-brand-orange/50"></div>

    {/* Sharp Overlay */}
    <div className="absolute inset-0 overflow-hidden animate-[height-wipe_3s_linear_infinite]">
      <img
        src="/restored-old-digi.webp"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Sharp Edges"
      />
    </div>

    <style>{`
        @keyframes height-wipe {
            0% { clip-path: inset(0 0 100% 0); }
            100% { clip-path: inset(0 0 0 0); }
        }
    `}</style>
  </div>
);


// --- Main Component Data ---

const BENEFITS = [
  {
    icon: <Eye size={24} />,
    title: 'Preserves Fine Details',
    description: 'Removes noise while keeping hair, fabric textures, and important details perfectly intact.',
    visual: <VisualDetail />
  },
  {
    icon: <Zap size={24} />,
    title: 'Handles Any Noise Type',
    description: 'Color noise, luminance grain, digital artifacts - our AI understands all forms of image noise.',
    visual: <VisualNoiseTypes />
  },
  {
    icon: <Search size={24} />,
    title: 'Smart Area Detection',
    description: 'Applies stronger denoising to backgrounds while preserving detail in faces and subjects.',
    visual: <VisualSmartDetect />
  },
  {
    icon: <Palette size={24} />,
    title: 'Color Accuracy',
    description: 'Maintains original colors and tones while removing color noise and digital artifacts.',
    visual: <VisualColorFidelity />
  },
  {
    icon: <Shield size={24} />,
    title: 'Edge Preservation',
    description: 'Keeps important edges and contours sharp while smoothing out unwanted grain and noise.',
    visual: <VisualEdges />
  },
  {
    icon: <Lock size={24} />,
    title: 'Privacy Protection',
    description: 'Uploaded Photos processed securely and deleted in 30 minutes. Your moments stay private.',
    visual: <VisualPrivacy />
  }
];

export default function DenoiseFeaturesSection() {
  return (
    <section id="features" className="w-full px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Features <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Why our Denoise <br />
              <span className="text-gray-400">works like magic.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Advanced AI meets signal processing to clean your photos without losing what matters.
            </p>
          </div>
        </div>

        {/* Benefits Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {BENEFITS.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-5 flex flex-col gap-6 relative group h-full"
              >

                {/* Visual Micro App Area (Top) */}
                <div className="h-48 w-full rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-inner relative">
                  {item.visual}
                </div>

                {/* Content (Bottom) */}
                <div className="flex flex-col gap-3 px-2 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-black">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-brand-black leading-tight">{item.title}</h3>
                  </div>

                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
