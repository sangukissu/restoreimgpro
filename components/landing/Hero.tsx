
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Upload, Star, Sparkles, ScanLine, CheckCircle2, Play, Plus } from 'lucide-react';
import Link from 'next/link';

const RestorationDemo: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Image logic:
  const BEFORE_IMAGE_URL = "/ripped.webp";
  const AFTER_IMAGE_URL = "/ripped-restored.webp";

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const { left, width } = containerRef.current.getBoundingClientRect();
    let clientX;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const relativeX = clientX - left;
    const percentage = Math.min(Math.max((relativeX / width) * 100, 0), 100);

    setSliderPosition(percentage);
  };

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl select-none group cursor-ew-resize border-[6px] border-white"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      onMouseEnter={() => setIsDragging(true)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Label Badge */}
      <div className="absolute top-6 left-6 z-30 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
        <ScanLine size={16} className="text-brand-orange animate-pulse" />
        BringBack v2.0
      </div>

      {/* Background Layer (The "After" / Restored Image) */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={AFTER_IMAGE_URL}
          alt="Restored photo with bringback ai"
          className="w-full h-full object-cover"
        />
        {/* AI UI Overlay on Restored Side */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-2 items-end">
          <div className="bg-brand-gray text-black text-xs font-bold px-2 py-1 rounded-lg">
            RESTORED
          </div>

        </div>
      </div>

      {/* Foreground Layer (The "Before" / Damaged Image) - Clipped */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden bg-gray-200"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="relative w-full h-full">
          {/* The Image - Needs to be same size/position as background to line up */}
          <img
            src={BEFORE_IMAGE_URL}
            alt="Damaged photo before restoration"
            className={`absolute top-0 left-0 h-full max-w-none object-cover transition-opacity duration-300 ${containerWidth ? 'opacity-100' : 'opacity-0'}`}
            style={{
              width: containerWidth ? `${containerWidth}px` : '100%'
            }}
          />

          <div className="absolute bottom-6 left-6 bg-brand-black/80 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            Original
          </div>
        </div>
      </div>

      {/* The Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm z-20 cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] flex items-center justify-center text-brand-orange">
          <div className="absolute inset-0 rounded-full border-2 border-brand-orange opacity-20 animate-ping"></div>
          <ScanLine size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* Interaction Hint (Only shows when not interacting) */}
      {!isDragging && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none animate-fade-out opacity-0 lg:opacity-100 transition-opacity duration-1000 delay-1000">
          <div className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
            Hover to compare
          </div>
        </div>
      )}
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 overflow-visible h-auto lg:min-h-screen pt-32 pb-24  lg:pb-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">

        {/* Left Column: Content - Increased to 6 cols */}
        <div className="lg:col-span-6 flex flex-col items-start z-10 justify-center h-full relative">

          {/* Available Badge */}
          <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full mb-8 shadow-lg shadow-black/5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
            <span className="text-sm font-semibold tracking-wide">Premium Photo Restoration</span>
          </div>



          {/* Heading */}
          <h1 className="relative z-10 text-[3.5rem] sm:text-[4rem] md:text-[4.5rem] xl:text-[5.5rem] font-[850] tracking-tighter leading-[0.95] text-[#111111] mb-6">
            Restore Old Photos & <br />
            <span className="text-gray-400 relative">
              Faded Memories.

            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-10 font-medium leading-relaxed">
            Our powerful photo restoration tool automatically repairs scratches, tears, and fading with precision. Restore damaged photos to their former glory in seconds.
          </p>

          {/* CTA Buttons - Matches Formix Design */}
          <div className="flex flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full max-w-full overflow-visible">

            {/* Primary: Orange Button with Black Circle Arrow */}
            <Link href="/dashboard">

              <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
                <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Restore Photos</span>
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
              </button>
            </Link>

            {/* Secondary: Black Button with Orange Circle Play */}
            <Link href="/ai-photo-animation">

              <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-brand-black pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/5 shrink-0">
                <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Animate Photos</span>
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gray-100 rounded-full flex items-center justify-center">
                  <Play className="text-brand-black fill-brand-black ml-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            </Link>

          </div>

          {/* Social Proof - Avatar Stack (Rotated Squircles) */}
          <div className="flex items-center gap-6 pl-2">
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
                122+
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-[#FF4D00] text-[#FF4D00]" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Trusted by 122+ Families</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Demo - Decreased to 6 cols */}
        <div className="lg:col-span-6 flex items-center justify-center w-full lg:h-full pt-12 lg:pt-0">
          <RestorationDemo />
        </div>

      </div>
    </section>
  );
};
