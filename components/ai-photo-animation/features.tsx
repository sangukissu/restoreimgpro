"use client";

import React from "react";
import { Heart, Shield, Award, Sparkles } from "lucide-react";
import { PRIVACY_COPY } from "@/lib/site-copy";

const PRINCIPLES = [
  {
    icon: <Sparkles size={24} />,
    title: "Natural Animation Styles",
    description:
      "Choose from presets such as Gentle Smile, Smile + Wave, Blink + Head Tilt, Warm Gaze, and Soft Nod. Preview the result because motion and likeness can vary.",
  },
  {
    icon: <Heart size={24} />,
    title: "Built for Family Memories",
    description:
      "Use a restored portrait in a family slideshow, memorial keepsake, genealogy project, or private Memory Book when a short motion clip suits the story.",
  },
  {
    icon: <Award size={24} />,
    title: "High-Resolution MP4 Output",
    description:
      "Download the generated five-second MP4 for personal slideshows, compatible digital displays, or family storytelling projects.",
  },
  {
    icon: <Shield size={24} />,
    title: "Private by Default",
    description:
      PRIVACY_COPY.short,
  },
];

export default function AIAnimationFeatures() {
  return (
    <section id="features" className="px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Why BringBack <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              AI Photo Animation <br />
              <span className="text-gray-400">Made for Real Memories.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-md">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Choose a motion style, understand where results can vary, and keep control of the generated video through your My Media account.
            </p>
          </div>
        </div>

        {/* Grid Container - Gray Background */}
        <div className="bg-brand-surface p-2 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRINCIPLES.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-6 flex flex-col gap-6 h-full shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-brand-surface flex items-center justify-center text-brand-orange">
                  {item.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-brand-black leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
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
