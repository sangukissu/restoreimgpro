"use client";

import React from "react";
import { Heart, Shield, Award, Sparkles } from "lucide-react";

const PRINCIPLES = [
  {
    icon: <Heart size={24} />,
    title: "Respectful Realism",
    description:
      "Our first commitment is to honor the person in your photo. We focus on subtle micro-expressions to create a moment of connection, not a deepfake.",
  },
  {
    icon: <Shield size={24} />,
    title: "Absolute Privacy",
    description:
      "Your memories are yours alone. Photos are deleted in minutes, and we never use your family portraits for AI training. Your trust is our foundation.",
  },
  {
    icon: <Award size={24} />,
    title: "Uncompromising Quality",
    description:
      "Every living memory is delivered as a high-resolution MP4 video, ensuring crisp detail and universal compatibility for sharing and saving.",
  },
  {
    icon: <Sparkles size={24} />,
    title: "The Magic of Simplicity",
    description:
      "This complex technology is powered by a single click. No settings to adjust, no learning curve. Just a simple, intuitive way to create something magical.",
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
              <span className="text-brand-orange">//</span> Our Philosophy <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              More Than Motion. <br />
              <span className="text-gray-400">A Living Memory.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-md">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We built our AI with a deep respect for the people in your photos. These are the principles that guide every living portrait we create.
            </p>
          </div>
        </div>

        {/* Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
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