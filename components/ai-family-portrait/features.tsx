"use client";

import { Heart, Users, Globe, Gift, Sparkles } from "lucide-react";
import React from "react";

const USE_CASES = [
  {
    icon: <Heart size={24} />,
    title: "The Memorial Portrait",
    description: "Honor a loved one who has passed away. Create a beautiful portrait that places them together with family.",
    dots: [true, true, true, false]
  },
  {
    icon: <Users size={24} />,
    title: "The Impossible Reunion",
    description: "Unite generations that never met. Place a grandparent in their youth next to their grandchild.",
    dots: [true, true, false, false]
  },
  {
    icon: <Globe size={24} />,
    title: "Long-Distance Family",
    description: "Bring together family members from across the world into a single, perfect group photo.",
    dots: [true, false, false, false]
  },
  {
    icon: <Gift size={24} />,
    title: "Perfect Sentimental Gift",
    description: "Create a one-of-a-kind gift for an anniversary or birthday that is guaranteed to touch their hearts.",
    dots: [true, true, true, true]
  },
];

export default function FamilyPortraitUseCases() {
  return (
    <section id="use-cases" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Use Cases <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Create a Portrait <br />
              <span className="text-gray-400">for Every Story.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Connect your family across time, distance, and memory with a unified portrait.
            </p>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {USE_CASES.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[320px] group hover:shadow-lg transition-all duration-300"
              >
                {/* Top Row */}
                <div className="flex justify-between items-start relative z-10 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>

                  {/* Dots Indicator */}
                  <div className="flex gap-1.5 pt-2">
                    {item.dots.map((isActive, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors duration-500 ${isActive ? 'bg-brand-orange' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-auto relative z-10">
                  <h3 className="text-xl font-bold text-brand-black mb-3 leading-tight">{item.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}