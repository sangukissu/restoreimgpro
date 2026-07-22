"use client"

import React from "react"
import { Layers, FileText, Lock, ShieldAlert } from "lucide-react"

const ARCHIVAL_PILLARS = [
  {
    icon: <Layers className="w-6 h-6 text-brand-orange" />,
    title: "Side-by-Side Historical Integrity",
    description:
      "Future generations should always know what is original film history versus what was enhanced with AI. Memory Book stores your raw scanned original alongside restored or colorized versions, keeping historical truth distinct.",
  },
  {
    icon: <FileText className="w-6 h-6 text-indigo-500" />,
    title: "Contextual Storytelling & Metadata Cards",
    description:
      "A photo without names or dates loses its meaning over time. Attach names, birth/death years, locations, and oral anecdotes directly to each photo card so family lineage stays intact.",
  },
  {
    icon: <Lock className="w-6 h-6 text-emerald-500" />,
    title: "Private Revocable Link Sharing",
    description:
      "Your family album belongs to your family—not public search engine indexers. Keepsakes are 100% private by default. Generate secure share links for siblings or grandchildren, with full ability to revoke access anytime.",
  },
  {
    icon: <ShieldAlert className="w-6 h-6 text-rose-500" />,
    title: "Uncertainty & Verification Marking",
    description:
      "Not sure about an exact date or location? Memory Book lets you tag details as 'approximate' or 'unverified' so future genealogists can differentiate documented facts from family lore.",
  },
]

export function MemoryBookArchivalPillars() {
  return (
    <section className="py-20 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Archival Principles <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              The 4 Pillars of Digital <br />
              <span className="text-gray-400">Heritage Preservation.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Why loose scans on hard drives fail—and how structured keepsakes safeguard family history.
            </p>
          </div>
        </div>

        <div className="bg-brand-surface p-3 sm:p-4 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ARCHIVAL_PILLARS.map((pillar, idx) => (
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
