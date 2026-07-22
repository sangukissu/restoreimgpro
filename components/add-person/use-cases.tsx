"use client"

import React from "react"
import { Heart, Users, Calendar, Award } from "lucide-react"

const USE_CASES = [
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    badge: "Memorial Portraits",
    title: "Honoring Deceased Relatives in Family Gatherings",
    description:
      "When a parent or grandparent passed away before a major milestone—a wedding, graduation, or holiday reunion—you can respectfully combine an existing clear portrait into the family photo so everyone feels included in the keepsake.",
  },
  {
    icon: <Calendar className="w-6 h-6 text-indigo-500" />,
    badge: "Missing Guests",
    title: "Adding Family Members Who Couldn't Attend",
    description:
      "Illness, travel delays, or work obligations often prevent loved ones from attending a major family photo shoot. BringBack allows you to add them into the final group shot with natural scale and lighting.",
  },
  {
    icon: <Users className="w-6 h-6 text-brand-orange" />,
    badge: "Multigenerational Composites",
    title: "Merging Separate Vintage Photos Across Decades",
    description:
      "If you only have individual studio portraits of your ancestors taken years apart, our compositing engine can assemble them into a unified, balanced family portrait from separate source prints.",
  },
  {
    icon: <Award className="w-6 h-6 text-amber-500" />,
    badge: "Family Tree Archives",
    title: "Completing Heritage Keepsakes for Genealogy Projects",
    description:
      "When building family history books or genealogy archives, having complete family snapshots helps future generations connect with their roots.",
  },
]

export function AddPersonUseCases() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Real-World Intent <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              When Families Use <br />
              <span className="text-gray-400">the Add Person Tool.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Designed specifically for meaningful family milestones, heritage preservation, and honoring loved ones.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USE_CASES.map((uc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {uc.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider bg-brand-surface px-3 py-1 rounded-full text-gray-700">
                      {uc.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-brand-black mb-3 leading-snug">
                    {uc.title}
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base">
                    {uc.description}
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
