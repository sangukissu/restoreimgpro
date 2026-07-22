"use client"

import React from "react"
import { Upload, Sliders, Sparkles, Download, CheckCircle2 } from "lucide-react"

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    stepTitle: "Upload Individual Portraits",
    icon: <Upload className="w-6 h-6 text-brand-orange" />,
    shortDesc: "Upload 2 to 4 separate photos of your family members from smartphone scans or old albums.",
    detail: "Clear, front-facing photos with visible faces work best for face matching.",
  },
  {
    number: "02",
    stepTitle: "Choose Canvas & Background",
    icon: <Sliders className="w-6 h-6 text-indigo-500" />,
    shortDesc: "Select 4:3, 16:9, or 3:4 canvas aspect ratio and choose a studio or natural backdrop.",
    detail: "Options include matte black, beige, ambient living room, warm garden, or bokeh background.",
  },
  {
    number: "03",
    stepTitle: "AI Matches Lighting & Scale",
    icon: <Sparkles className="w-6 h-6 text-amber-500" />,
    shortDesc: "BringBack re-composes everyone into one frame, matching lighting, skin tones, and perspective.",
    detail: "No harsh cutouts or plastic AI smoothing. Natural film grain and depth of field retained.",
  },
  {
    number: "04",
    stepTitle: "Download Family Portrait",
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    shortDesc: "Preview your combined family portrait side-by-side and download high-res print quality.",
    detail: "Download print-ready resolution perfect for wall framing or family keepsakes.",
  },
]

export default function AIAnimationHowItWorks() {
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
              How to Create a Family Photo from Individual Photos
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Follow these 4 simple steps to combine separate photos into one cohesive, studio-quality family portrait.
            </p>
          </div>
        </div>

        {/* Semantic Ordered List for Featured Snippet Parsing */}
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