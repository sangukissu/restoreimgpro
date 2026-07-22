"use client"

import React from "react"
import { Upload, Sparkles, Sliders, Download, CheckCircle2 } from "lucide-react"

const RESTORE_STEPS = [
  {
    number: "01",
    stepTitle: "Upload Faded or Damaged Photo",
    icon: <Upload className="w-6 h-6 text-brand-orange" />,
    shortDesc: "Upload your scanned physical photo, wallet print, or smartphone snapshot.",
    detail: "Handles scratches, rips, water stains, mold spots, and heavy yellow fading.",
  },
  {
    number: "02",
    stepTitle: "Choose Restoration Settings",
    icon: <Sliders className="w-6 h-6 text-indigo-500" />,
    shortDesc: "Select restore-only to keep original B&W/sepia, or restore + colorize.",
    detail: "Optionally turn on HD face sharpening for soft or out-of-focus portraits.",
  },
  {
    number: "03",
    stepTitle: "AI Repairs Damage Automatically",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    shortDesc: "Our conservator engine removes scratches and fills missing paper fibers in seconds.",
    detail: "Preserves natural film grain and original character without plastic smoothing.",
  },
  {
    number: "04",
    stepTitle: "Compare & Download High-Res",
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    shortDesc: "Review your photo side-by-side with an interactive slider before downloading.",
    detail: "Download print-ready resolution for wall framing or digital family keepsakes.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Featured-Snippet Target Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> 4 Simple Steps <span className="text-brand-orange">//</span>
            </div>
            
            {/* Snippet-Winning H2 */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              How to Restore Old Photos
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Follow these 4 simple steps to fix scratches, tears, fading, and blur on vintage family prints with AI.
            </p>
          </div>
        </div>

        {/* Semantic Ordered List for Featured Snippets */}
        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 list-none">
            {RESTORE_STEPS.map((step, idx) => (
              <li
                key={idx}
                className="bg-white rounded-[1.8rem] p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-brand-orange/30 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-brand-orange tracking-tight">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-brand-surface border border-gray-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-brand-black mb-3 leading-snug">
                    {step.stepTitle}
                  </h3>

                  <p className="text-gray-700 font-semibold text-sm mb-3 leading-relaxed">
                    {step.shortDesc}
                  </p>

                  <p className="text-gray-500 font-medium text-xs leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-brand-orange" />
                  Step {step.number} Complete
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
