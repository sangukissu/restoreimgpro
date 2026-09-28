"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import { HeroFilm, HeroFilmHandle } from "./HeroFilm";
import { trackEvent } from "@/lib/analytics";

export const Hero: React.FC = () => {
  const filmRef = useRef<HeroFilmHandle>(null);

  return (
    <section className="relative w-full overflow-hidden pt-28 sm:pt-36 pb-20 sm:pb-28">
      {/* Top Header Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-3 py-1.5 rounded-full mb-8 shadow-sm shadow-black/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
          <span className="text-xs font-semibold tracking-wide">Family photo preservation</span>
        </div>

        {/* Centered Heading */}
        <h1 className="relative z-10 text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-[#111111] mb-6">
          Restore Damaged Photos, <br className="hidden sm:inline" />
          Combine Relatives <br className="hidden sm:inline" />
          <span className="text-gray-400">&amp; Animate Faces.</span>
        </h1>

        {/* Centered Subtitle */}
        <p className="max-w-2xl mx-auto mb-9 text-lg text-gray-600 font-medium leading-normal">
          Repair scratches, tears, fading, and water stains with AI. Combine separate photos into unified family portraits, bring ancestral faces to life with subtle motion, and preserve stories in a private digital keepsake. Pay once &amp; own forever. No subscription.
        </p>

        {/* Centered Dual CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          {/* Primary CTA */}
          <Link
            href="/login"
            onClick={() => trackEvent("cta_click", { section: "hero", label: "restore_photos" })}
          >
            <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-6 pr-2 py-2 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_0px_1px_rgba(255,255,255,0.3),0_8px_25px_-6px_rgba(255,77,0,0.55)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_45px_-10px_rgba(255,77,0,0.65)] shrink-0">
              <span className="font-bold text-sm sm:text-base tracking-tight whitespace-nowrap">Restore Photos</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </div>
            </button>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/ai-family-portrait"
            className="group relative flex items-center justify-between gap-3 sm:gap-5 bg-white text-brand-black pl-5 pr-2 py-2 sm:pl-6 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_10px_25px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_35px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/8 shrink-0"
          >
            <span className="font-bold text-sm sm:text-base tracking-tight whitespace-nowrap">Create Family Portrait</span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-orange/10 rounded-full flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
              <Play className="text-[#FF4D00] fill-[#FF4D00] ml-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </Link>
        </div>

        {/* Social Proof - Avatar Stack (Rotated Squircles) */}
        <div className="flex items-center justify-center gap-6 pl-2 mb-8">
          <div className="flex items-center relative h-12 w-[140px]">
            {[1, 2, 3].map((i, index) => (
              <div
                key={i}
                className={`absolute top-0 w-12 h-12 rounded-2xl border-2 border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                    ${index === 0 ? "left-0 z-30 -rotate-6" : ""}
                    ${index === 1 ? "left-8 z-20 rotate-6" : ""}
                    ${index === 2 ? "left-16 z-10 -rotate-3" : ""}
                  `}
              >
                <img
                  src={["/avatar1.webp", "/avatar2.webp", "/avatar3.webp"][index]}
                  alt="Real BringBack restoration result"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  width={48}
                  height={48}
                />
              </div>
            ))}
            <div className="absolute left-24 top-0 w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-xs font-bold border-2 border-[#F2F2F0] shadow-sm z-40 rotate-12 hover:rotate-0 transition-transform">
              3.1K+
            </div>
          </div>

          <div className="flex flex-col justify-center text-left">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className="fill-[#FF4D00] text-[#FF4D00]" />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              Trusted by 3.1K+ Families
            </span>
          </div>
        </div>
      </div>

      {/* Hero Showcase with Brand-Themed Dither Canvas */}
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] sm:rounded-[2.75rem] p-3 sm:p-6 lg:p-10 overflow-hidden shadow-[0_40px_100px_-25px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
          {/* Brand Themed Dark Dither Backdrop */}
          <div className="absolute inset-0 bg-[#0E0E0D] overflow-hidden">
            {/* Deep Warm Carbon Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#181817] via-[#111110] to-[#0A0A09]" />

            {/* Glowing Brand Orange & Amber Backlight Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_48%,rgba(255,77,0,0.24)_0%,rgba(245,158,11,0.12)_35%,rgba(14,14,13,0)_72%)] pointer-events-none" />

            {/* Soft Edge Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(10,10,10,0.75)_100%)] pointer-events-none" />

            {/* SVG Bayer Dither Pattern Matrix */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-45 mix-blend-screen"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* 10x10 Bayer Dither Pattern */}
                <pattern
                  id="brand-bayer-dither"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="0" cy="0" r="1.1" fill="#FF4D00" fillOpacity="0.85" />
                  <circle cx="5" cy="5" r="1.1" fill="#FF4D00" fillOpacity="0.85" />
                  <circle cx="5" cy="0" r="0.8" fill="#F59E0B" fillOpacity="0.6" />
                  <circle cx="0" cy="5" r="0.8" fill="#F59E0B" fillOpacity="0.6" />
                  <circle cx="2.5" cy="2.5" r="0.6" fill="#F2F2F0" fillOpacity="0.4" />
                  <circle cx="7.5" cy="7.5" r="0.6" fill="#F2F2F0" fillOpacity="0.4" />
                  <circle cx="2.5" cy="7.5" r="0.5" fill="#F2F2F0" fillOpacity="0.25" />
                  <circle cx="7.5" cy="2.5" r="0.5" fill="#F2F2F0" fillOpacity="0.25" />
                </pattern>
              </defs>

              {/* Repeating Dither Field */}
              <rect width="100%" height="100%" fill="url(#brand-bayer-dither)" />

              {/* Dithered Light Aperture Rings */}
              <circle
                cx="50%"
                cy="50%"
                r="300"
                fill="none"
                stroke="#FF4D00"
                strokeWidth="1"
                strokeDasharray="2 6"
                opacity="0.3"
              />
              <circle
                cx="50%"
                cy="50%"
                r="440"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="3 9"
                opacity="0.2"
              />
              <circle
                cx="50%"
                cy="50%"
                r="600"
                fill="none"
                stroke="#F2F2F0"
                strokeWidth="1"
                strokeDasharray="2 12"
                opacity="0.12"
              />
            </svg>
          </div>

          {/* Floating Studio Application Window */}
          <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.65)] ring-1 ring-white/70 p-2 sm:p-4 text-left transition-all">
            {/* Video Player Display */}
            <div className="overflow-hidden rounded-xl sm:rounded-2xl">
              <HeroFilm ref={filmRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
