"use client"

import React from "react"
import { Upload, Scissors, Wand2, Download } from "lucide-react"

const STEPS = [
  {
    number: "01",
    icon: <Upload className="w-6 h-6 text-brand-orange" />,
    title: "Upload Your Photo",
    description:
      "Select any family photo, vacation shot, or heritage image containing photobombers or unwanted figures.",
  },
  {
    number: "02",
    icon: <Scissors className="w-6 h-6 text-indigo-500" />,
    title: "Select Unwanted Person",
    description:
      "Use our automatic detection tool to select the figure or object you want to erase from the scene.",
  },
  {
    number: "03",
    icon: <Wand2 className="w-6 h-6 text-amber-500" />,
    title: "Context-Aware Inpainting",
    description:
      "BringBack extrapolates surrounding wallpaper, foliage, or brickwork patterns to fill the erased area seamlessly.",
  },
  {
    number: "04",
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    title: "Review & Download",
    description:
      "Compare the original and cleaned photo side-by-side. Save the pristine high-resolution image to My Media.",
  },
]

export function RemovePersonHowItWorks() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Left-Aligned Header System */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Workflow <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Four Simple Steps. <br />
              <span className="text-gray-400">Clean Backgrounds in Seconds.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No manual clone stamping or brush smudging. Our generative inpainting engine reconstructs missing textures automatically.
            </p>
          </div>
        </div>

        {/* 4-Column Step Cards */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 flex items-center justify-center shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-2xl font-black text-gray-300">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm">
                    {step.description}
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
