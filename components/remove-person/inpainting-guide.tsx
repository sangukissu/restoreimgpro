"use client"

import React from "react"
import { Scissors, Grid, Layers, Eye } from "lucide-react"

const INPAINTING_PILLARS = [
  {
    icon: <Scissors className="w-6 h-6 text-brand-orange" />,
    title: "Edge & Silhouette Segmentation",
    description:
      "Traditional eraser tools blur the edges of the removed person, leaving ghost outlines or halo artifacts. BringBack uses deep segmentation masks to isolate the exact silhouette of the person without clipping adjacent subjects or objects.",
  },
  {
    icon: <Grid className="w-6 h-6 text-indigo-500" />,
    title: "Generative Pattern & Texture Extrapolation",
    description:
      "When a person is erased, the AI must synthesize what was hidden behind them—whether it's a brick wall, wood paneling, wallpaper, or natural foliage. Our inpainting model analyzes surrounding geometric patterns and reconstructs authentic background textures.",
  },
  {
    icon: <Layers className="w-6 h-6 text-amber-500" />,
    title: "Film Noise & Micro-Grain Harmonization",
    description:
      "Modern AI inpainting can sometimes produce unnaturally smooth patches that stand out against vintage film stock. BringBack measures the surrounding ISO noise and reintroduces matching film grain into the inpainted region.",
  },
  {
    icon: <Eye className="w-6 h-6 text-emerald-500" />,
    title: "Lighting & Exposure Consistency",
    description:
      "The newly generated background patch inherits the exact shadow gradient, color cast, and exposure level of the surrounding ambient light, ensuring zero visible seams or patch boundaries.",
  },
]

export function RemovePersonInpaintingGuide() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Inpainting Pillars <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              How Generative Inpainting <br />
              <span className="text-gray-400">Rebuilds Erased Backgrounds.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              When a figure is erased, AI analyzes surrounding geometry to synthesize realistic background textures.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INPAINTING_PILLARS.map((pillar, idx) => (
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
