"use client";

import { Heart, Users, Globe, Gift, Sparkles, Image as ImageIcon } from "lucide-react";
import React from "react";

const USE_CASES = [
  {
    icon: <Heart size={24} />,
    badge: "Memorial Portrait",
    title: "Combine Deceased & Living Relatives",
    description: "Create a respectful, heartwarming memorial portrait placing a loved one who has passed away next to current family members. Upload a vintage or old photo of your relative alongside recent photos. Our AI harmonizes lighting, pose, and texture to unite family members across generations.",
    dots: [true, true, true, false]
  },
  {
    icon: <Users size={24} />,
    badge: "Generational Reunion",
    title: "Merge Different Photos & Vintage Eras",
    description: "Combine black-and-white historical prints with modern smartphone photos into one seamless studio portrait. BringBack automatically balances color palettes, film grain, and scale so the final image looks like everyone stood together in the exact same studio.",
    dots: [true, true, false, false]
  },
  {
    icon: <Globe size={24} />,
    badge: "Global Connection",
    title: "Long-Distance Family Reunions",
    description: "Unite family members living in different countries or states without needing an expensive in-person photoshoot. Simply upload individual selfies or candid portraits, and our generator composes them into a balanced group photo.",
    dots: [true, false, false, false]
  },
  {
    icon: <Gift size={24} />,
    badge: "Custom Keepsake",
    title: "Studio Backdrops & Flexible Canvas Ratios",
    description: "Choose from matte black, warm beige, classic sepia, dark brown vignette, or soft bokeh lighting. Customize canvas ratios (1:1 square, 3:4 portrait, 4:3 classic, or 16:9 widescreen) to fit wall frames or family memory books.",
    dots: [true, true, true, true]
  },
];

export default function FamilyPortraitUseCases() {
  return (
    <section id="use-cases" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Use Cases & Clusters <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Create an AI Family Portrait <br />
              <span className="text-gray-400">for Every Story & Generation.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Combine separate individual photos into one natural portrait with harmonized lighting, color, and scale.
            </p>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2.2rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {USE_CASES.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.8rem] p-8 flex flex-col justify-between border border-gray-100 shadow-sm group hover:border-gray-200 hover:shadow-md transition-all duration-300"
              >
                {/* Top Row */}
                <div>
                  <div className="flex justify-between items-start relative z-10 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300 shadow-sm">
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

                  <span className="inline-block bg-gray-100 text-brand-black text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-extrabold text-brand-black mb-3 leading-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="mt-4 pt-4 border-t border-gray-100 relative z-10">
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