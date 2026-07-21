"use client"

import React from "react"
import { Upload, UserCheck, Wand2, Download } from "lucide-react"

const STEPS = [
  {
    number: "01",
    icon: <Upload className="w-6 h-6 text-brand-orange" />,
    title: "Upload Target Family Scene",
    description:
      "Select the primary family gathering photo where you want to add the missing person. Ensure there is natural physical space in the group.",
  },
  {
    number: "02",
    icon: <UserCheck className="w-6 h-6 text-indigo-500" />,
    title: "Provide Reference Portrait",
    description:
      "Upload a clear portrait of the person to add. For best results, use a front-facing face with clear features and similar lighting direction.",
  },
  {
    number: "03",
    icon: <Wand2 className="w-6 h-6 text-amber-500" />,
    title: "AI Harmonization Engine",
    description:
      "BringBack synthesizes color temperature, shadow vectors, skin tones, and film noise so the added figure blends seamlessly.",
  },
  {
    number: "04",
    icon: <Download className="w-6 h-6 text-emerald-500" />,
    title: "Review & Download",
    description:
      "Compare the original and composited result side-by-side. Inspect facial likeness before saving the final high-res image.",
  },
]

export function AddPersonHowItWorks() {
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
              <span className="text-gray-400">Harmonized in Seconds.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No complex Photoshop masking or manual layer editing needed. Our AI handles lighting and grain matching automatically.
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
