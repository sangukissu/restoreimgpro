"use client"

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ScanLine, Sparkles } from 'lucide-react'

export const CTA: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const relativeX = clientX - left
    setSliderPosition(Math.min(Math.max((relativeX / width) * 100, 0), 100))
  }

  return (
    <section className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Main Surface Wrapper */}
        <div className="bg-brand-surface p-2 rounded-[2.5rem]">
          {/* Inner Light Container */}
          <div className="relative bg-white rounded-[2rem] p-6 sm:p-10 lg:p-12 overflow-hidden group shadow-sm">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* Left: Copy & CTA */}
              <div className="max-w-xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
                  <span className="text-brand-orange">//</span> Premium Quality <span className="text-brand-orange">//</span>
                </div>

                <h2 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-[850] text-brand-black tracking-tighter leading-[0.95] mb-6">
                  Ready to restore<br />
                  <span className="text-gray-300">your memories?</span>
                </h2>

                <p className="text-gray-600 text-base sm:text-lg lg:text-xl font-medium leading-relaxed mb-8 max-w-md">
                  Every photo holds a story. Don't let damage steal your precious moments. Restore them forever in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Link href="/dashboard">
                    <button className="group flex items-center justify-between gap-6 bg-brand-orange text-white pl-6 pr-2 py-2.5 rounded-full shadow-[0_20px_40px_-15px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-15px_rgba(255,77,0,0.5)] transition-all">
                      <span className="font-bold text-base tracking-tight">Restore Your First Photo</span>
                      <div className="w-11 h-11 bg-white text-brand-orange rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight size={20} strokeWidth={3} />
                      </div>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right: Interactive Comparison Slider */}
              <div className="relative h-full w-full flex items-center justify-center lg:justify-end">
                <div
                  ref={containerRef}
                  className="relative w-full max-w-md aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white cursor-ew-resize select-none group/slider bg-gray-900 transform-gpu"
                  onMouseMove={handleMove}
                  onTouchMove={handleMove}
                >
                  {/* AFTER Image (Restored & Colorized - Background) */}
                  <img
                    src="/old-image3-restored-colorized.webp"
                    alt="Restored and colorized photo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* BEFORE Image (Original Damaged - Foreground clipped by slider) */}
                  <img
                    src="/old-image3.webp"
                    alt="Original damaged photo"
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 sepia-[0.3] z-10"
                    style={{
                      clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    }}
                  />

                  {/* Slider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-brand-orange transform group-hover/slider:scale-110 transition-transform pointer-events-auto">
                      <ScanLine size={18} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-20">
                    Original
                  </div>

                  <div className="absolute top-4 right-4 bg-brand-orange backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-20 flex items-center gap-1.5 shadow-md">
                    <Sparkles size={13} />
                    Restored
                  </div>

                  {/* Interactive Hint */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-center z-20 pointer-events-none opacity-90 group-hover/slider:opacity-0 transition-opacity">
                    Drag slider to compare before &amp; after
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
