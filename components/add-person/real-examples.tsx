"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { Heart, Calendar, Users, Award, ArrowRight, Sparkles, ScanLine, Gift } from "lucide-react"

const REAL_EXAMPLES = [
  {
    id: "wedding",
    category: "Wedding Memorial",
    icon: <Heart className="w-5 h-5 text-rose-500" />,
    title: "Add a Passed Parent or Grandparent to Your Wedding Album",
    story:
      "When a parent or grandparent passes away before your wedding day, BringBack places them beside the bride or groom in their formal attire. We match outdoor sunlight, shadows, and camera angles so the memory feels complete.",
    beforeImg: "/wedding-before-exact.jpg",
    afterImg: "/wedding-composite.jpg",
    personToAddLabel: "Late Father's Photo",
    ctaText: "Add Loved One to Wedding Photo",
    href: "/dashboard/add-person",
  },
  {
    id: "reunion",
    category: "Family Reunion",
    icon: <Calendar className="w-5 h-5 text-amber-500" />,
    title: "Add Relatives Who Couldn't Attend the Family Gathering",
    story:
      "Work, travel, or distance shouldn't leave family members out of reunion group pictures. Upload their individual portrait and your porch snapshot—our AI integrates them seamlessly into the group shot.",
    beforeImg: "/reunion-before-exact.jpg",
    afterImg: "/reunion-after-exact.jpg",
    personToAddLabel: "Absent Sibling Photo",
    ctaText: "Add Relative to Reunion Photo",
    href: "/dashboard/add-person",
  },
  {
    id: "memorial",
    category: "Generational Keepsake",
    icon: <Users className="w-5 h-5 text-indigo-500" />,
    title: "Place Grandparents on the Living Room Sofa with Great-Grandchildren",
    story:
      "Reunite multi-generational families in a warm indoor setting. Place a late grandparent on the sofa alongside new family members, matching soft lamp lighting, skin tones, and natural seated postures.",
    beforeImg: "/memorial-before-exact.jpg",
    afterImg: "/memorial-composite.jpg",
    personToAddLabel: "Grandmother's Portrait",
    ctaText: "Create Family Sofa Portrait",
    href: "/dashboard/add-person",
  },
  {
    id: "christmas",
    category: "Holiday Snapshot",
    icon: <Gift className="w-5 h-5 text-emerald-500" />,
    title: "Merge Loved Ones into Christmas & Holiday Family Snapshots",
    story:
      "Holidays are when missing family members are remembered most. BringBack seamlessly places loved ones into Christmas tree snapshots, harmonizing warm ambient holiday lighting.",
    beforeImg: "/christmas-before-exact.jpg",
    afterImg: "/christmas-composite.jpg",
    personToAddLabel: "Grandfather's Photo",
    ctaText: "Add Loved One to Holiday Photo",
    href: "/dashboard/add-person",
  },
  {
    id: "milestone",
    category: "Graduation & Milestone",
    icon: <Award className="w-5 h-5 text-blue-500" />,
    title: "Complete Graduation & Milestone Photos with Both Parents Present",
    story:
      "Ensure major milestones like graduations feature both parents together. Our AI balances skin tones, clothing exposure, and shoulder angles automatically.",
    beforeImg: "/graduation-before-exact.jpg",
    afterImg: "/graduation-after-exact.jpg",
    personToAddLabel: "Parent's Photo",
    ctaText: "Combine Photos for Graduation",
    href: "/dashboard/add-person",
  },
]

interface AddPersonSliderProps {
  beforeImg: string
  afterImg: string
  personToAddLabel: string
  title: string
}

function AddPersonSlider({
  beforeImg,
  afterImg,
  title,
}: AddPersonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const relativeX = clientX - left
    setSliderPosition(Math.min(Math.max((relativeX / width) * 100, 0), 100))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.8rem] cursor-ew-resize select-none group border-4 border-white shadow-xl bg-gray-900"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* AFTER Image (Background - Result with added loved one) */}
      <img
        src={afterImg}
        alt={`Result photo with ${title}`}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* BEFORE Image (Foreground clipped by slider - Base photo without loved one) */}
      <img
        src={beforeImg}
        alt={`Original base photo before adding person for ${title}`}
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      />

      {/* Slider Divider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-brand-orange transform group-hover:scale-110 transition-transform pointer-events-auto">
          <ScanLine size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-md text-xs `tracking-widest uppercase z-20">
        Original Base Photo
      </div>

      <div className="absolute top-4 right-4 bg-brand-orange backdrop-blur text-white px-3 py-1 rounded-md text-xs tracking-widest uppercase z-20 flex items-center gap-1.5">
        Loved One Added
      </div>


      {/* Interactive Hint */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-xs uppercase tracking-wider z-20 pointer-events-none">
        Drag slider to compare
      </div>
    </div>
  )
}

export function AddPersonRealExamples() {
  return (
    <section id="real-examples" className="py-24 px-4 sm:px-8 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Split Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> USE CASES <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
             Common Uses of BringBack AI <br />
              <span className="text-gray-400"> to Add People</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Drag the interactive slider on each photo to see how BringBack seamlessly inserts missing relatives into family memories.
            </p>
          </div>
        </div>

        {/* Visual Cards Suite with Interactive Comparison Sliders */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2.2rem]">
          <div className="flex flex-col gap-4">
            {REAL_EXAMPLES.map((ex, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-[1.8rem] p-6 lg:p-10 border border-gray-100 shadow-sm transition-all hover:shadow-md"
                >
                  

                  <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}>
                    {/* Visual Interactive Comparison Slider - Spans Half Width */}
                    <div className="flex-1 w-full">
                      <AddPersonSlider
                        beforeImg={ex.beforeImg}
                        afterImg={ex.afterImg}
                        personToAddLabel={ex.personToAddLabel}
                        title={ex.title}
                      />
                    </div>

                    {/* Story & CTA Content - Spans Half Width */}
                    <div className="flex-1 w-full text-left flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-brand-surface border border-gray-100 flex items-center justify-center">
                        {ex.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider bg-brand-surface px-3 py-1 rounded-full text-gray-700">
                        {ex.category}
                      </span>
                    </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-brand-black mb-3 leading-tight">
                          {ex.title}
                        </h3>

                        <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base mb-4">
                          {ex.story}
                        </p>
                      </div>

                      <Link href={ex.href}>
                        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-black text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange transition-colors shadow-sm">
                          <span>{ex.ctaText}</span>
                          <ArrowRight size={16} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
