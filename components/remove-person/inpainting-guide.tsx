"use client"

import React from "react"
import { Scissors, Grid, Layers, Eye } from "lucide-react"

const INPAINTING_PILLARS = [
  {
    icon: <Scissors className="w-6 h-6 text-brand-orange" />,
    title: "Clean Edge & Figure Detection",
    description:
      "Unlike basic lasso tools that cut jagged lines, BringBack automatically detects the outline of hair, clothes, and body contours so the figure is erased cleanly without leaving ghost silhouettes.",
  },
  {
    icon: <Grid className="w-6 h-6 text-indigo-500" />,
    title: "Rebuilding Hidden Background Patterns",
    description:
      "When a person is erased, the AI doesn't just smudge neighboring pixels—it analyzes surrounding wallpaper, brickwork, wood paneling, or foliage to reconstruct authentic background textures in place of the removed subject.",
  },
  {
    icon: <Layers className="w-6 h-6 text-amber-500" />,
    title: "Matching Vintage Film Texture",
    description:
      "Basic eraser tools produce unnaturally smooth patches that stand out against old photos. BringBack measures the surrounding photo grain and reintroduces matching vintage film texture into the cleaned area.",
  },
  {
    icon: <Eye className="w-6 h-6 text-emerald-500" />,
    title: "Matching Exposure & Shadow Direction",
    description:
      "Removing a figure also means recalculating lighting cast. Our AI adjusts background brightness and shadow gradients so the remaining subjects sit naturally within their environment.",
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
              <span className="text-brand-orange">//</span> Clean Object Removal <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              How AI Rebuilds <br />
              <span className="text-gray-400">Erased Backgrounds Without Smudges.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              When a figure or object is erased, AI analyzes surrounding geometry to synthesize authentic background patterns.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INPAINTING_PILLARS.map((pillar, idx) => (
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
