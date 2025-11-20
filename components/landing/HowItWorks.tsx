
import React from 'react';
import { ImagePlus, Wand2, Film, MousePointer2, FileImage, Play, Pause, UploadCloud } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: "Upload Your Photo",
    description: "Drag & drop your damaged, blurred, or old black-and-white photos securely into our platform.",
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
    title: "AI Restoration",
    description: "Our deep learning models automatically remove scratches, sharpen details, and colorize faces.",
    icon: <Wand2 size={24} className="text-brand-black" />,
    visual: (
      <div className="w-full h-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-lg bg-white ring-4 ring-white">
          {/* Base Image (Damaged) */}
          <img
            src="/childhood-memories-black-and-white.webp"
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-40 mix-blend-overlay"></div>

          {/* Restored Image (Revealed by width animation) */}
          <div className="absolute inset-0 w-full h-full animate-[width-scan_4s_ease-in-out_infinite] overflow-hidden border-r-2 border-brand-orange bg-white/0 z-10">
            <img
              src="/childhood-memories-colorized.webp"
              alt="Restored"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '192px' }} // 48 * 4 = 192px (w-48)
            />
            {/* Scanner Glow */}
            <div className="absolute top-0 right-0 w-1 h-full bg-brand-orange/50 shadow-[0_0_15px_#FF4D00]"></div>
          </div>
        </div>

        {/* Clean Status Badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-sm border border-gray-200 text-[10px] font-bold text-gray-600 px-3 py-1.5 rounded-full flex items-center gap-2 whitespace-nowrap z-20">
          <div className="w-2 h-2 rounded-full border-2 border-brand-orange border-t-transparent animate-spin"></div>
          Processing...
        </div>

        <style>{`
            @keyframes width-scan {
                0%, 100% { width: 0%; }
                50% { width: 100%; }
            }
         `}</style>
      </div>
    )
  },
  {
    id: 3,
    title: "Animate Memories",
    description: "Bring portraits to life with our 'Live Portrait' technology that adds subtle, realistic motion.",
    icon: <Film size={24} className="text-brand-black" />,
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

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> How It Works <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Restore memories <br />
              <span className="text-gray-400/80">in 3 simple steps.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No complex editing skills required. Our AI handles the restoration process completely automatically.
            </p>
          </div>
        </div>

        {/* Steps Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[3rem]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-[2.5rem] p-8 min-h-[420px] flex flex-col group hover:shadow-lg transition-all duration-300"
              >
                {/* Step Number & Icon */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#F2F2F0] flex items-center justify-center transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                    {step.icon}
                  </div>
                  <span className="text-6xl font-[800] text-gray-100 leading-none select-none font-sans group-hover:text-gray-200 transition-colors">
                    0{step.id}
                  </span>
                </div>

                {/* Content */}
                <div className="mb-10 relative z-10">
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
};
