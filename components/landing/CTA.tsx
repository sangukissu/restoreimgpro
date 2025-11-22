
import React from 'react';
import { ArrowRight, Sparkles, UploadCloud } from 'lucide-react';

export const CTA: React.FC = () => {
    return (
        <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-24 bg-brand-bg">

            {/* Main Orange Container */}
            <div className="relative bg-[#FF4D00] rounded-[3rem] p-8 sm:p-16 lg:p-20 overflow-hidden shadow-[0_40px_80px_-20px_rgba(255,77,0,0.4)] group">

                {/* Background Decorations */}
                <div className="absolute -top-[50%] -right-[20%] w-[800px] h-[800px] bg-white/20 blur-[120px] rounded-full pointer-events-none"></div>
                <div className="absolute -bottom-[50%] -left-[20%] w-[600px] h-[600px] bg-black/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Copy */}
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8 shadow-lg">
                            <Sparkles size={14} fill="currentColor" />
                            <span>Free to try</span>
                        </div>

                        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-[850] text-white tracking-tighter leading-[0.95] mb-8">
                            It's time to <br />
                            <span className="text-black/20">bring them back.</span>
                        </h2>

                        <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed mb-10 max-w-md">
                            Every photo holds a story. Don't let discoloration and damage steal your precious moments. Restore them forever in seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group flex items-center justify-between gap-6 bg-white text-[#FF4D00] pl-8 pr-2 py-2.5 rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
                                <span className="font-bold text-lg tracking-tight">Restore Your First Photo</span>
                                <div className="w-12 h-12 bg-[#FF4D00] rounded-full flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300">
                                    <ArrowRight size={20} strokeWidth={3} />
                                </div>
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-3 text-white/80 font-medium text-sm">
                            <UploadCloud size={16} />
                            <span>No credit card required for preview</span>
                        </div>
                    </div>

                    {/* Right: Visual (Floating Memory Stack) */}
                    <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center perspective-[1000px]">

                        {/* Card 3 (Back) */}
                        <div className="absolute w-64 h-80 bg-white p-3 rounded-2xl shadow-2xl transform rotate-12 translate-x-12 scale-90 opacity-60 transition-transform duration-700 group-hover:rotate-[15deg] group-hover:translate-x-20">
                            <div className="w-full h-[85%] bg-gray-200 rounded-xl overflow-hidden grayscale">
                                <img src="/images/cta/1.jpg" className="w-full h-full object-cover" alt="Memory" />
                            </div>
                        </div>

                        {/* Card 2 (Middle) */}
                        <div className="absolute w-64 h-80 bg-white p-3 rounded-2xl shadow-2xl transform -rotate-6 -translate-x-4 scale-95 opacity-80 transition-transform duration-700 group-hover:-rotate-[10deg] group-hover:-translate-x-10 z-10">
                            <div className="w-full h-[85%] bg-gray-200 rounded-xl overflow-hidden sepia-[.5]">
                                <img src="/images/cta/2.jpg" className="w-full h-full object-cover" alt="Memory" />
                            </div>
                        </div>

                        {/* Card 1 (Front - Restored) */}
                        <div className="absolute w-72 h-96 bg-white p-4 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] transform rotate-2 z-20 transition-transform duration-500 hover:scale-105 hover:rotate-0">
                            <div className="w-full h-[85%] bg-gray-900 rounded-2xl overflow-hidden relative group/card">
                                <img src="/images/cta/3.jpg" className="w-full h-full object-cover" alt="Memory" />

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>

                                {/* Label */}
                                <div className="absolute bottom-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Sparkles size={10} /> Restored
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center px-2">
                                <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                                <div className="text-xs font-hand text-gray-400 rotate-[-2deg]">Mom, 1985</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
};
