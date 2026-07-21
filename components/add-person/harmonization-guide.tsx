"use client"

import React from "react"
import { Sun, Palette, Film, Smile } from "lucide-react"

const PILLARS = [
  {
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    title: "Directional Shadow & Lighting Vector Alignment",
    description:
      "Basic cutout tools paste a flat figure into a photo, creating an obvious disconnect when key light comes from the left but the inserted person is illuminated from the right. BringBack analyzes the primary light source of the target scene, synthesizing matching highlights and ground shadow vectors so the subject sits naturally within the environment.",
  },
  {
    icon: <Palette className="w-6 h-6 text-brand-orange" />,
    title: "Color Temperature & Exposure Equalization",
    description:
      "Combining a warm vintage kodachrome portrait with a modern smartphone photo often yields mismatched skin tones. Our harmonization engine recalibrates the white balance, luminance curve, and color spectrum of the added subject to align seamlessly with the ambient room light.",
  },
  {
    icon: <Film className="w-6 h-6 text-indigo-500" />,
    title: "Film Grain Structure & ISO Noise Harmonization",
    description:
      "Old analog photographs contain organic silver halide film grain, while modern digital photos are smooth and sharp. BringBack measures the grain density of the target photo and applies proportional noise synthesis to the added figure so texture remains uniform across the entire frame.",
  },
  {
    icon: <Smile className="w-6 h-6 text-emerald-500" />,
    title: "Facial Landmark & Perspective Preservation",
    description:
      "Rather than distorting facial features to fit a template, BringBack preserves the authentic identity geometry of your loved one while adjusting body tilt and camera angle perspective to match the surrounding family members.",
  },
]

export function AddPersonHarmonizationGuide() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Technical Architecture <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Why Cutouts Look Fake. <br />
              <span className="text-gray-400">How AI Harmonization Fixes It.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              When combining photos, the challenge isn't cutting out a face—it's matching lighting, shadows, and resolution.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
