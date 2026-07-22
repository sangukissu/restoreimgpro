"use client"

import React from "react"
import { Upload, UserPlus, Sparkles, Download, CheckCircle2 } from "lucide-react"

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    stepTitle: "Upload Your Group Photo",
    icon: <Upload className="w-6 h-6 text-brand-orange" />,
    shortDesc: "Select the main family, wedding, or reunion snapshot where you want to add someone.",
    detail: "High-resolution prints or digital photos work best. Our AI reads background geometry automatically.",
  },
  {
    number: "02",
    stepTitle: "Upload the Person's Photo",
    icon: <UserPlus className="w-6 h-6 text-indigo-500" />,
    shortDesc: "Choose a clear reference photo of the missing relative or deceased loved one.",
    detail: "Old scanned portraits or smartphone photos are fine. Front-facing faces give the most natural result.",
  },
  {
    number: "03",
    stepTitle: "Position & Adjust (Optional)",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    shortDesc: "Specify where they should stand or sit (e.g. next to the bride or on the living room sofa).",
    detail: "Our AI scales height, body posture, and ground shadows to match surrounding family members.",
  },
  {
    number: "04",
    stepTitle: "Download Your Family Memory",
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    shortDesc: "Review the result side-by-side in your dashboard and download high-res print quality.",
    detail: "Lighting, skin tones, and vintage film grain are color-matched automatically.",
  },
]

export function AddPersonHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Featured-Snippet Target Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> 4 Simple Steps <span className="text-brand-orange">//</span>
            </div>
            
            {/* Direct H2 Heading formatted specifically to win Google's Featured Snippet */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              How to Add a Person to a 
              <br />
              <span className="text-gray-400">Family Photo with AI</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Follow these 4 simple steps to merge a missing relative or deceased loved one into any group photo with natural AI lighting.
            </p>
          </div>
        </div>

        {/* Semantic Ordered List for Search Engine Featured Snippet Parsing */}
        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 list-none">
            {HOW_IT_WORKS_STEPS.map((step, idx) => (
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
