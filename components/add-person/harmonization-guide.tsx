"use client"

import React from "react"
import { Sun, Palette, Film, Smile } from "lucide-react"

/**
 * One job: explain what has to match for an added person to look natural.
 * Not a dual SEO heading. Not product-engine marketing.
 */
const MATCH_POINTS = [
  {
    icon: <Sun className="w-6 h-6 text-amber-500" />,
    title: "Light and shadows",
    description:
      "If the room light comes from the left and the person you add is lit from the right, they look pasted on. We try to match the direction of light and ground shadows to the rest of the photo.",
  },
  {
    icon: <Palette className="w-6 h-6 text-indigo-500" />,
    title: "Color and skin tone",
    description:
      "A warm old print next to a cool phone photo will never look like one moment. We adjust color so skin, clothes, and room light feel closer to the same place and time.",
  },
  {
    icon: <Film className="w-6 h-6 text-rose-500" />,
    title: "Grain and sharpness",
    description:
      "Old film has grain. New photos are smooth. A sharp modern face on a soft vintage print is an easy giveaway. We soften and texture the added person so they sit closer to the original photo.",
  },
  {
    icon: <Smile className="w-6 h-6 text-emerald-500" />,
    title: "The face you know",
    description:
      "We aim to keep the person’s real face from your reference photo—not a generic face swap. Height and posture still get adjusted so they fit the group. If the result still doesn’t look right, try a clearer face photo or run it again.",
  },
]

export function AddPersonHarmonizationGuide() {
  return (
    <section
      id="why-results-look-natural"
      aria-labelledby="harmonization-heading"
      className="py-20 px-4 sm:px-8 bg-brand-bg"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Header — same layout as other add-person sections */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Looking Natural{" "}
              <span className="text-brand-orange">//</span>
            </div>
            <h2
              id="harmonization-heading"
              className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black"
            >
              What we match when we
              <br />
              <span className="text-gray-400">add someone to a photo</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Cutouts look fake when light, color, or texture don’t match the rest of the picture.
              Adding a person well is less about the cutout and more about those details.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATCH_POINTS.map((point) => (
              <div
                key={point.title}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 px-4 sm:px-6 pb-2 text-sm text-gray-500 font-medium leading-relaxed">
            AI still guesses. Damaged, tiny, or side-facing reference photos are harder. Always compare the result to the original faces before you print or share.
          </p>
        </div>
      </div>
    </section>
  )
}
