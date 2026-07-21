"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, ShieldCheck, BookOpen, Lock, Share2 } from "lucide-react"
import { DASHBOARD_CTA } from "@/lib/site-copy"

export function MemoryBookHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-brand-bg overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <BookOpen className="w-4 h-4 text-brand-orange" />
              <span>Digital Heritage Preservation</span>
            </div>

            <h1 className="text-[2.75rem] sm:text-[3.75rem] lg:text-[4.25rem] font-extrabold text-brand-black leading-[1.02] tracking-tight mb-6">
              Digital Family Memory Book <br />
              <span className="text-gray-400 font-extrabold">Preserve Photos, Names &amp; Stories</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed mb-8 max-w-2xl">
              Don't let restored family photos sit as uncaptioned files on a hard drive. Organize your heritage into a private digital keepsake with names, dates, locations, and oral family stories.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <Link
                href={DASHBOARD_CTA.memoryBook}
                className="inline-flex items-center justify-center gap-3 bg-brand-black text-white rounded-full font-bold px-8 py-4 text-lg hover:bg-black/90 transition-transform active:scale-95 shadow-xl"
              >
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <span>Open Memory Book</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center bg-white text-brand-black border border-gray-200 rounded-full font-bold px-8 py-4 text-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Included in Family Plan
              </Link>
            </div>

            {/* Trust Tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Private by Default</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <Share2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Revocable Link Sharing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Originals &amp; Restored Paired</span>
              </div>
            </div>
          </div>

          {/* Right Visual Keepsake Mockup */}
          <div className="flex-1 w-full max-w-xl">
            <div className="bg-brand-surface p-4 sm:p-5 rounded-[2.2rem] shadow-2xl border border-white/80">
              <div className="bg-white rounded-[1.8rem] p-6 shadow-inner border border-gray-100 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-orange" />
                    <span className="font-bold text-sm text-brand-black">The Miller Family Heritage (1912 - 1965)</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">Private</span>
                </div>

                <div className="aspect-[16/9] rounded-[1.2rem] overflow-hidden relative bg-gray-100 border border-gray-100">
                  <img src="/digital-frame.webp" alt="Memory Book Keepsake Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-xs px-3 py-1 rounded-md font-semibold">
                    Grandpa Arthur &amp; Grandma Clara · Chicago, 1948
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[1.2rem] p-4 text-xs text-gray-600 font-medium leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1">Family Note:</p>
                  "Restored from an old damaged 3x5 print found in the attic. Clara wore her mother's lace veil. Photo scanned at 600 DPI."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
