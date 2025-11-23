import React from 'react';
import { ArrowRight, UploadCloud, Sparkles, ScanLine } from 'lucide-react';

export const CTA: React.FC = () => {
    return (
        <section className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
            <div className="max-w-[1320px] mx-auto">

                {/* Main Surface Wrapper */}
                <div className="bg-brand-surface p-3 rounded-[2.5rem]">

                    {/* Inner Light Container */}
                    <div className="relative bg-white rounded-[2rem] p-6 sm:p-16 lg:p-20 overflow-hidden group shadow-sm">

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap:8 sm:gap-16 items-center">

                            {/* Left: Copy */}
                            <div className="max-w-xl">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
                                    <span className="text-brand-orange">//</span> Premium Quality <span className="text-brand-orange">//</span>
                                </div>

                                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-[850] text-brand-black tracking-tighter leading-[0.95] mb-8">
                                    Ready to restore<br />
                                    <span className="text-gray-300">your memories?</span>
                                </h2>

                                <p className="text-gray-600 text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-md">
                                    Every photo holds a story. Don't let damage steal your precious moments. Restore them forever in seconds.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="group flex items-center justify-between gap-6 bg-brand-orange text-white pl-6 pr-2 py-2 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_20px_40px_-15px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-15px_rgba(255,77,0,0.5)]">
                                        <span className="font-bold text-md tracking-tight">Restore Your First Photo</span>
                                        <div className="w-12 h-12 bg-white text-brand-orange rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                            <ArrowRight size={20} strokeWidth={3} />
                                        </div>
                                    </button>
                                </div>


                            </div>

                            {/* Right: Cinematic Scanning Animation (Optimized) */}
                            <div className="relative h-[500px] w-full flex items-center justify-center lg:justify-end">

                                {/* Card Container */}
                                <div className="relative w-full max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border border-black/5 group/card bg-gray-100 transform-gpu">

                                    {/* Optimized Sliding Door Animation using Transforms */}
                                    <style>
                                        {`
                                            @keyframes slide-reveal {
                                                0%, 100% { transform: translateX(-100%) translateZ(0); }
                                                50% { transform: translateX(0%) translateZ(0); }
                                            }
                                            @keyframes slide-counter {
                                                0%, 100% { transform: translateX(100%) scale(1.05) translateZ(0); }
                                                50% { transform: translateX(0%) scale(1.05) translateZ(0); }
                                            }
                                        `}
                                    </style>

                                    {/* Base Layer: Damaged Image */}
                                    <img
                                        src="/old-image3.webp"
                                        className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 sepia-[0.3] scale-105"
                                        alt="Original"
                                    />

                                    {/* Reveal Wrapper (Sliding Door) */}
                                    <div className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                                        style={{ animation: 'slide-reveal 6s ease-in-out infinite' }}>

                                        {/* Counter-Moving Restored Image */}
                                        <img
                                            src="/old-image3-restored-colorized.webp"
                                            className="absolute inset-0 w-full h-full object-cover will-change-transform"
                                            style={{ animation: 'slide-counter 6s ease-in-out infinite' }}
                                            alt="Restored"
                                        />

                                        {/* Scanner Line (Attached to right edge) */}
                                        <div className="absolute top-0 bottom-0 right-0 w-1 z-10">
                                            {/* The Line */}
                                            <div className="absolute inset-0 bg-white shadow-[0_0_20px_rgba(255,255,255,1)]" />

                                            {/* The Glow Tail */}
                                            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-r from-transparent to-white/40" />

                                            {/* Center Knob */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full border border-white/60 flex items-center justify-center shadow-lg">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Status Badge */}
                                    <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/40 shadow-lg flex items-center justify-between z-20">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-pulse" />
                                                <div className="absolute inset-0 bg-brand-orange rounded-full animate-ping opacity-20" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                                <span className="text-sm font-bold text-brand-black">Restoring Details...</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 bg-brand-bg rounded-full flex items-center justify-center text-brand-black">
                                            <ScanLine size={18} />
                                        </div>
                                    </div>

                                    {/* Top Badge */}
                                    <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest z-20">
                                        AI Processing
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
