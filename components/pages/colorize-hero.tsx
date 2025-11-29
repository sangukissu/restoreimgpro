"use client";

import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";

export default function ColorizeHero() {
    return (
        <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 pt-12 pb-24 overflow-visible">

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF4D00]/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

            <div className="flex flex-col items-center text-center z-10 relative">

                {/* Badge */}
                <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> AI Photo Colorization <span className="text-[#FF4D00]">//</span>
                </div>

                {/* Heading */}
                <h1 className="max-w-5xl text-[3.5rem] sm:text-[4rem] md:text-[4.5rem] xl:text-[5.5rem] font-[850] tracking-tighter leading-[0.95] text-brand-black mb-8">
                    Bring Black & White<br />
                    <span className="text-gray-400">
                        Photos to Life
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-12 font-medium leading-relaxed">
                    Transform your vintage black and white photos into stunning color images. Intelligent colorization, simple process, and a lifetime of colorful memories.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-16 w-full justify-center">

                    {/* Primary Button */}
                    <Link href="/dashboard/colorize">
                        <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shrink-0 shadow-xl shadow-[#FF4D00]/20 hover:shadow-[#FF4D00]/40">
                            <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Colorize Photo</span>
                            <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                            </div>
                        </button>
                    </Link>

                    {/* Secondary Button */}
                    <Link href="#how-it-works">
                        <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-brand-black pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ring-1 ring-black/5 shrink-0 hover:shadow-lg">
                            <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">How it Works</span>
                            <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#FF4D00]/10 group-hover:text-[#FF4D00] transition-colors">
                                <Play className="text-brand-black fill-brand-black ml-0.5 w-4 h-4 sm:w-5 sm:h-5 group-hover:text-[#FF4D00] group-hover:fill-[#FF4D00] transition-colors" />
                            </div>
                        </button>
                    </Link>
                </div>

                {/* Visual - Professional Container */}
                <div className="relative w-full max-w-5xl mx-auto">
                    <div className="relative rounded-[1.8rem] overflow-hidden  bg-brand-surface p-3 aspect-[4/3] md:aspect-[3/2]">
                        <HeroVideoDialog
                            animationStyle="from-center"
                            videoSrc="https://youtu.be/YcexFcxi2xY"
                            thumbnailSrc="/bw-to-colorize.webp"
                            thumbnailAlt="Photo restoration demo video"
                            priority
                            className="w-full h-full object-cover"
                        />
                        {/* Professional Badge Overlay */}
                        <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            Colorized by BringBack AI
                        </div>
                    </div>
                </div>

                {/* Social Proof - Avatar Stack */}
                <div className="mt-16 flex flex-col items-center gap-4">
                    <div className="flex items-center relative h-12 w-[140px]">
                        {[1, 2, 3].map((i, index) => (
                            <div
                                key={i}
                                className={`absolute top-0 w-12 h-12 rounded-2xl border-2 border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                    ${index === 0 ? 'left-0 z-30 -rotate-6' : ''}
                    ${index === 1 ? 'left-8 z-20 rotate-6' : ''}
                    ${index === 2 ? 'left-16 z-10 -rotate-3' : ''}
                  `}
                            >
                                <img
                                    src={`https://randomuser.me/api/portraits/thumb/men/${i * 12 + 8}.jpg`}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                        <div className="absolute left-24 top-0 w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-xs font-bold border-2 border-[#F2F2F0] shadow-sm z-40 rotate-12 hover:rotate-0 transition-transform">
                            190+
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={14} className="fill-[#FF4D00] text-[#FF4D00]" />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Trusted by 190+ Families</span>
                    </div>
                </div>


            </div>
        </section>
    );
}
