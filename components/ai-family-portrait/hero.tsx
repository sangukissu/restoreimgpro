"use client";

import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import Image from "next/image";

export default function AIAnimationHero() {
  return (
    <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 pt-32 sm:pt-36 pb-12 overflow-visible">

      <div className="flex flex-col items-center text-center z-10 relative">

        {/* Badge */}
        <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
          <span className="text-brand-orange">//</span> Studio Family Portrait <span className="text-brand-orange">//</span>
        </div>

        {/* Heading */}
        <h1 className="max-w-5xl text-[3.2rem] sm:text-[4rem] xl:text-[4.5rem] font-extrabold tracking-tight leading-[0.95] text-brand-black mb-8">
          AI Family Portrait Generator <br />
          <span className="text-gray-400">Combine Separate Photos into One.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mb-12 font-medium leading-relaxed">
          Upload 2–4 portraits of family members photographed at different times or places. BringBack creates a new group portrait with a shared backdrop, then lets you review likeness, pose, and scale before downloading.
        </p>

        {/* CTA Buttons - Exact Match */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-16 w-full justify-center">

          {/* Primary Button */}
          <Link href="/dashboard/family-portrait">
            <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
              <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Create Family Photo</span>
              <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
            </button>
          </Link>

          {/* Secondary Button */}
          <Link href="#how-it-works">
            <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-brand-black pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/5 shrink-0">
              <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">See How It Works</span>
              <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="text-brand-black fill-brand-black ml-0.5 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </button>
          </Link>
        </div>

        {/* Visual - Professional Container */}
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white bg-gray-100 aspect-[3/2]">
            <Image
              src="/family-portrait.png"
              alt="Professional family portrait"
              fill
              className="object-cover"
              priority
            />
            {/* Professional Badge Overlay */}
            <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Created from 4 separate photos
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 text-center max-w-lg mx-auto">
          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">2 credits · clear face references work best</span>
          <p className="text-sm text-gray-500 font-medium">
            Always compare likeness to your source photos. AI may adjust pose, lighting, and scale to form one portrait.
          </p>
        </div>

      </div>
    </section>
  );
}
