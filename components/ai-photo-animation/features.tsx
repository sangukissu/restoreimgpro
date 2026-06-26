"use client";

import React from "react";
import { Heart, Shield, Award, Sparkles } from "lucide-react";

const PRINCIPLES = [
  {
    icon: <Sparkles size={24} />,
    title: "Natural Animation Styles",
    description:
      "Pick from subtle styles like Gentle Smile, Smile + Wave, Blink + Head Tilt, and Warm Gaze to keep movement realistic and identity-safe.",
  },
  {
    icon: <Heart size={24} />,
    title: "Built for Family Memories",
    description:
      "Designed for old portraits, memorial tributes, genealogy storytelling, and family keepsakes where authentic expression matters most.",
  },
  {
    icon: <Award size={24} />,
    title: "High-Resolution MP4 Output",
    description:
      "Export clean, share-ready animation videos you can use in slideshows, social posts, digital frames, and family documentaries.",
  },
  {
    icon: <Shield size={24} />,
    title: "Private by Default",
    description:
      "Uploaded photos are auto-deleted after processing, generated animations are auto-deleted after 24 hours, and personal photos are never used for AI training.",
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
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              AI Photo Animation <br />
              <span className="text-gray-400">Made for Real Memories.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-md">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Everything is focused on practical outcomes: realistic motion, easy workflow, clean exports, and strong privacy controls for family photos.
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
