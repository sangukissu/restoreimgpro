"use client"

import React from "react"
import Link from "next/link"
import { Users, Heart, Gift, Award, Calendar, Sparkles, ArrowRight, Layers, UserCheck } from "lucide-react"

const FAMILY_PORTRAIT_CASES = [
  {
    id: "case-1",
    category: "Separate Photos into One",
    badgeKeyword: "Combine Separate Photos into One Family Portrait",
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    title: "Combine 4 Separate Individual Portraits into One Family Picture",
    story:
      "When family members live in different cities or only have separate selfie portraits, BringBack combines up to 4 individual photos into a single studio family portrait with matched room lighting and skin tones.",
    promptHint: 'Example request: "Combine individual portraits of father, mother, son, and daughter into a warm beige studio portrait."',
    inputs: [
      { img: "/fp-c1-p1.jpg", label: "Input 1: Mother" },
      { img: "/fp-c1-p2.jpg", label: "Input 2: Father" },
      { img: "/fp-c1-p3.jpg", label: "Input 3: Daughter" },
      { img: "/fp-c1-p4.jpg", label: "Input 4: Son" },
    ],
    combinedImg: "/fp-c1-combined.jpg",
    ctaText: "Combine 4 Separate Photos",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-2",
    category: "3-Generation Reunion",
    badgeKeyword: "Generational Family Portrait Generator",
    icon: <Calendar className="w-5 h-5 text-purple-500" />,
    title: "Combine Grandparents, Parents, and Children into One Portrait",
    story:
      "Reunite 3 generations into a single timeless family portrait. Upload individual portraits of grandparents and adult children—our AI harmonizes height scales, lighting angles, and subtle 35mm film texture.",
    promptHint: 'Example request: "Combine grandmother, grandfather, mother, and son into a classic studio portrait."',
    inputs: [
      { img: "/fp-c2-p1.jpg", label: "Input 1: Grandmother" },
      { img: "/fp-c2-p2.jpg", label: "Input 2: Grandfather" },
      { img: "/fp-c3-p3.jpg", label: "Input 3: Mother" },
      { img: "/fp-c2-p4.jpg", label: "Input 4: Son" },
    ],
    combinedImg: "/fp-c2-combined.jpg",
    ctaText: "Create Generational Family Portrait",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-3",
    category: "Memorial Portrait",
    badgeKeyword: "Add Deceased Relative to Family Portrait",
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    title: "Add Deceased Grandparents to Living Room Family Sofa Portraits",
    story:
      "Preserve family legacies by including passed away loved ones with new generations. BringBack matches vintage sepia/B&W tone with modern room lighting so your late grandmother sits naturally beside family.",
    promptHint: 'Example request: "Add late grandmother seated on sofa with mother, father, and child."',
    inputs: [
      { img: "/fp-c3-p1.jpg", label: "Input 1: Late Grandmother" },
      { img: "/fp-c3-p2.jpg", label: "Input 2: Mother" },
      { img: "/fp-c3-p3.jpg", label: "Input 3: Father" },
      { img: "/fp-c3-p4.jpg", label: "Input 4: Child" },
    ],
    combinedImg: "/fp-c3-combined.jpg",
    ctaText: "Create Memorial Family Portrait",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-4",
    category: "Holiday & Christmas",
    badgeKeyword: "Merge Multiple Photos into One Family Picture",
    icon: <Gift className="w-5 h-5 text-emerald-500" />,
    title: "Merge Individual Photos into a Cozy Christmas Tree Family Snapshot",
    story:
      "When distance or travel prevents family members from gathering for Christmas, merge separate individual photos into one holiday portrait with glowing ambient tree lights.",
    promptHint: 'Example request: "Merge grandfather, mother, father, and child around the Christmas tree."',
    inputs: [
      { img: "/fp-c4-p1.jpg", label: "Input 1: Grandfather" },
      { img: "/fp-c4-p2.jpg", label: "Input 2: Mother" },
      { img: "/fp-c4-p3.jpg", label: "Input 3: Father" },
      { img: "/fp-c4-p4.jpg", label: "Input 4: Child" },
    ],
    combinedImg: "/fp-c4-combined.jpg",
    ctaText: "Merge Photos into Christmas Portrait",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-5",
    category: "Wedding & Milestone",
    badgeKeyword: "Combine Photos into Milestone Portrait",
    icon: <Award className="w-5 h-5 text-amber-500" />,
    title: "Combine Separate Photos for Wedding & Milestone Family Keepsakes",
    story:
      "Complete major milestone moments like weddings or graduations so the entire family is represented in formal attire with natural outdoor sunlight and shadow matching.",
    promptHint: 'Example request: "Combine late father, bride, groom, and mother into formal wedding portrait."',
    inputs: [
      { img: "/fp-c5-p1.jpg", label: "Input 1: Late Father" },
      { img: "/fp-c5-p2.jpg", label: "Input 2: Bride" },
      { img: "/fp-c5-p3.jpg", label: "Input 3: Groom" },
      { img: "/fp-c5-p4.jpg", label: "Input 4: Mother" },
    ],
    combinedImg: "/fp-c5-combined.jpg",
    ctaText: "Combine Wedding Family Photos",
    href: "/dashboard/family-portrait",
  },
]

export function FamilyPortraitRealExamples() {
  return (
    <section id="real-examples" className="py-16 sm:py-24 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Split Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1.5 bg-brand-black text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Real 4-Photo Input Workflow <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Combine 4 Separate Photos <br />
              <span className="text-gray-400"> into One Family Portrait.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Every case study below shows the 4 individual portraits uploaded by users and the resulting combined family portrait created by BringBack.
            </p>
          </div>
        </div>

        {/* Visual Cards Suite */}
        <div className="bg-brand-surface p-2 sm:p-4 rounded-[2rem] sm:rounded-[2.4rem]">
          <div className="flex flex-col gap-6 sm:gap-8">
            {FAMILY_PORTRAIT_CASES.map((ex) => (
              <div
                key={ex.id}
                className="bg-white rounded-[1.6rem] sm:rounded-[2rem] p-5 sm:p-8 lg:p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md"
              >
                {/* Category & Keyword Badge Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-surface border border-gray-100 flex items-center justify-center">
                      {ex.icon}
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-brand-surface px-3 py-1 rounded-full text-gray-700">
                      {ex.category}
                    </span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                    {ex.badgeKeyword}
                  </span>
                </div>

                {/* Main Split Grid (Fully Responsive Flex & Grid Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                  {/* Left Column: 4 Individual Input Photos Breakdown (Spans 5 Cols on LG) */}
                  <div className="lg:col-span-5 w-full flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                        <Layers size={14} className="text-brand-orange" />
                        Step 1: Upload 4 Individual Photos
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-brand-surface px-2.5 py-0.5 rounded-md text-gray-500">
                        4 Inputs Required
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {ex.inputs.map((input, i) => (
                        <div
                          key={i}
                          className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-900 shadow-sm group/inp"
                        >
                          <img
                            src={input.img}
                            alt={input.label}
                            className="w-full h-full object-cover group-hover/inp:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                            Photo {i + 1}
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur text-[10px] sm:text-xs font-extrabold text-brand-black px-2 py-1 rounded-lg truncate text-center shadow-sm">
                            {input.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Combined Family Portrait Result (Spans 7 Cols on LG) */}
                  <div className="lg:col-span-7 w-full flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                        <Sparkles size={14} />
                        Step 2: AI Combined Family Portrait
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-brand-orange/10 px-2.5 py-0.5 rounded-md text-brand-orange">
                        Studio Harmonized
                      </span>
                    </div>

                    <div className="relative rounded-2xl sm:rounded-[1.8rem] overflow-hidden border-2 sm:border-4 border-white shadow-lg bg-gray-900 w-full aspect-[4/3] flex flex-col justify-end">
                      <img
                        src={ex.combinedImg}
                        alt={`Combined family portrait - ${ex.title}`}
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-brand-orange text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5 z-10">
                        <UserCheck size={13} />
                        All 4 People Combined
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/80 backdrop-blur text-white p-2.5 sm:p-3 rounded-xl border border-white/20 text-[11px] sm:text-xs font-semibold text-center z-10">
                        Matched Room Sunlight, Skin Tones &amp; Perspective
                      </div>
                    </div>
                  </div>

                  {/* Bottom Story & CTA Row (Spans Full 12 Cols) */}
                  <div className="lg:col-span-12 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                    <div className="max-w-3xl">
                      <h3 className="text-lg sm:text-xl font-extrabold text-brand-black mb-1.5 sm:mb-2">
                        {ex.title}
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed mb-3">
                        {ex.story}
                      </p>
                      <div className="bg-gray-50 p-2.5 sm:p-3 rounded-xl border border-gray-100 text-[11px] sm:text-xs font-medium text-gray-500">
                        {ex.promptHint}
                      </div>
                    </div>

                    <Link href={ex.href} className="w-full md:w-auto shrink-0">
                      <button className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-black text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm hover:bg-brand-orange transition-colors shadow-sm">
                        <span>{ex.ctaText}</span>
                        <ArrowRight size={15} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
