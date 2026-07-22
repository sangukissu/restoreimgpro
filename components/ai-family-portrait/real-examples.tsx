"use client"

import React from "react"
import Link from "next/link"
import { Users, Heart, Calendar, Sparkles, ArrowRight, Layers, UserCheck } from "lucide-react"

const FAMILY_PORTRAIT_CASES = [
  {
    id: "case-1",
    category: "Separate Photos into One",
    badgeKeyword: "Four individual portraits",
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    title: "Combine 4 Separate Individual Portraits into One Family Picture",
    story:
      "When family members live in different places, separate portraits can become one newly composed studio scene. Clear, similarly framed faces give the model better references; always compare the result with every source photo.",
    inputs: [
      { img: "/separate-family-portrait-father.jpg", label: "Input 1: Father" },
      { img: "/separate-family-portrait-mother.jpg", label: "Input 2: Mother" },
      { img: "/separate-family-portrait-daughter.jpg", label: "Input 3: Daughter" },
      { img: "/separate-family-portrait-son.jpg", label: "Input 4: Son" },
    ],
    combinedImg: "/separate-family-portrait-combined.jpg",
    ctaText: "Combine 4 Separate Photos",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-2",
    category: "3-Generation Reunion",
    badgeKeyword: "Three generations",
    icon: <Calendar className="w-5 h-5 text-purple-500" />,
    title: "Combine Grandparents, Parents, and Children into One Portrait",
    story:
      "Bring grandparents, parents, and children into one portrait even when the source photos come from different years. The generated scene balances scale and lighting, but age, pose, and fine details can vary.",
    inputs: [
      { img: "/three-generation-reunion-son.jpg", label: "Input 1: Son" },
      { img: "/three-generation-reunion-daughter.jpg", label: "Input 2: Daughter" },
      { img: "/three-generation-reunion-parents.jpg", label: "Input 3: Parents" },
      { img: "/three-generation-reunion-grandparents.jpg", label: "Input 4: Grandparents" },
    ],
    combinedImg: "/three-generation-reunion-combined.jpg",
    ctaText: "Create Generational Family Portrait",
    href: "/dashboard/family-portrait",
  },
  {
    id: "case-3",
    category: "Memorial Portrait",
    badgeKeyword: "Memorial keepsake",
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    title: "Add a Deceased Grandfather to a Family Portrait",
    story:
      "Create a respectful memorial keepsake with a relative who could not be present for the original photograph. A clear restored portrait usually provides a stronger likeness reference than a damaged or very small face crop.",
    inputs: [
      { img: "/memorial-family-portrait-father.jpg", label: "Input 1: Father" },
      { img: "/memorial-family-portrait-son.jpg", label: "Input 2: Son" },
      { img: "/memorial-family-portrait-daughter.jpg", label: "Input 3: Daughter" },
      { img: "/memorial-family-portrait-grandfather.jpg", label: "Input 4: Late Grandfather" },
    ],
    combinedImg: "/memorial-family-portrait-combined.jpg",
    ctaText: "Create Memorial Family Portrait",
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
              <span className="text-brand-orange">//</span> Source-to-Portrait Examples <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Combine 4 Separate Photos <br />
              <span className="text-gray-400"> into One Family Portrait.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              Each example pairs separate source portraits with a generated group image, so you can see how different ages, settings, and generations may be brought into one scene.
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
                        Step 1: Upload Source Photos
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-brand-surface px-2.5 py-0.5 rounded-md text-gray-500">
                        2–4 Inputs
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
                        Step 2: Generated Family Portrait
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold bg-brand-orange/10 px-2.5 py-0.5 rounded-md text-brand-orange">
                        Shared Studio Style
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
                        New Group Portrait
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/80 backdrop-blur text-white p-2.5 sm:p-3 rounded-xl border border-white/20 text-[11px] sm:text-xs font-semibold text-center z-10">
                        Review faces, pose, scale and fine details against the source photos
                      </div>
                    </div>
                  </div>

                  {/* Bottom Story & CTA Row (Spans Full 12 Cols) */}
                  <div className="lg:col-span-12 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                    <div className="max-w-3xl">
                      <h3 className="text-lg sm:text-xl font-extrabold text-brand-black mb-1.5 sm:mb-2">
                        {ex.title}
                      </h3>
                      <p className="text-gray-600 font-medium text-xs sm:text-sm leading-relaxed">
                        {ex.story}
                      </p>
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
