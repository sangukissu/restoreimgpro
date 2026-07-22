"use client"

import React from "react"
import { Sun, Palette, Film, Smile } from "lucide-react"

const HARMONIZATION_PILLARS = [
  {
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    title: "Matching Natural Light & Shadows",
    description:
      "Simple cutout apps paste a flat figure into a photo, creating an obvious disconnect when key light comes from the left but the added person is lit from the right. BringBack checks where the sun or lamp light comes from in your photo, adding matching highlights and realistic ground shadows.",
  },
  {
    icon: <Palette className="w-6 h-6 text-indigo-500" />,
    title: "Matching Skin Tones & Colors",
    description:
      "Combining a warm vintage Kodachrome portrait with a modern smartphone photo often results in mismatched skin colors. Our engine color-matches skin tones, clothing brightness, and ambient room lighting so everyone looks like they were in the same room.",
  },
  {
    icon: <Film className="w-6 h-6 text-rose-500" />,
    title: "Matching Vintage Film Texture",
    description:
      "Old analog photographs contain natural silver halide film grain, while modern digital photos are smooth and sharp. BringBack measures the grain density of your target photo and adds matching vintage film texture to the new person so they don't look like a smooth modern sticker.",
  },
  {
    icon: <Smile className="w-6 h-6 text-emerald-500" />,
    title: "Preserving Genuine Facial Features",
    description:
      "We never distort facial features or use generic face-swaps. Your loved one's real smile, eyes, and expressions are preserved exactly as they are while adjusting body posture and height perspective to match surrounding family members naturally.",
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
              <span className="text-brand-orange">//</span> Seamless Photo Blending <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Why Cutouts Look Fake. <br />
              <span className="text-gray-400">How BringBack Makes It Natural.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              When combining family photos, the secret isn't just cutting out a face—it's matching lighting, shadows, skin tones, and film texture.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HARMONIZATION_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
