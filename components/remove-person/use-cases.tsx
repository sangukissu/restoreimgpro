"use client"

import React from "react"
import { Camera, UserX, Image, Sparkles } from "lucide-react"

const REMOVE_USE_CASES = [
  {
    icon: <Camera className="w-6 h-6 text-brand-orange" />,
    badge: "Vacation & Landmark Photos",
    title: "Erasing Background Strangers & Photobombers",
    description:
      "When a pristine family vacation photo is spoiled by passersby, tourists, or photobombers in the background, BringBack clean-erases them while seamlessly restoring the landmark architecture behind them.",
  },
  {
    icon: <UserX className="w-6 h-6 text-rose-500" />,
    badge: "Heritage Archives",
    title: "Removing Ex-Partners or Unwanted Individuals",
    description:
      "For family genealogy projects, historical album cleanups, or personal archives, you can remove unwanted figures from group photos without destroying the surrounding family members.",
  },
  {
    icon: <Image className="w-6 h-6 text-indigo-500" />,
    badge: "Background Decluttering",
    title: "Cleaning Up Distracting Background Objects",
    description:
      "Remove stray trash cans, cars, utility poles, or clutter that distract from the main subject in vintage family snapshots.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    badge: "Portrait Focus",
    title: "Isolating Core Subjects for Printing & Framing",
    description:
      "Clean up busy surroundings to turn a casual group photo into a focused portrait ready for wall frames or memory books.",
  },
]

export function RemovePersonUseCases() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Real-World Applications <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Common Reasons Families <br />
              <span className="text-gray-400">Remove Objects &amp; People.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Whether for clean photo prints, heritage archives, or removing unwanted photobombers.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REMOVE_USE_CASES.map((uc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {uc.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-brand-surface px-3 py-1 rounded-full text-gray-700">
                      {uc.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug">
                    {uc.title}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base">
                    {uc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
