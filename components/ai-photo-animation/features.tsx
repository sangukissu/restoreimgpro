"use client";

import { Heart, Shield, Award, Sparkles } from "lucide-react";
import React from "react";

const principles = [
  {
    icon: <Heart className="w-6 h-6 text-brand-orange" />,
    title: "Respectful Realism",
    description:
      "Our first commitment is to honor the person in your photo. We focus on subtle micro-expressions to create a moment of connection, not a deepfake.",
  },
  {
    icon: <Shield className="w-6 h-6 text-brand-orange" />,
    title: "Absolute Privacy",
    description:
      "Your memories are yours alone. Photos are deleted in minutes, and we never use your family portraits for AI training. Your trust is our foundation.",
  },
  {
    icon: <Award className="w-6 h-6 text-brand-orange" />,
    title: "Uncompromising Quality",
    description:
      "Every living memory is delivered as a high-resolution MP4 video, ensuring crisp detail and universal compatibility for sharing and saving.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-brand-orange" />,
    title: "The Magic of Simplicity",
    description:
      "This complex technology is powered by a single click. No settings to adjust, no learning curve. Just a simple, intuitive way to create something magical.",
  },
];

export default function AIAnimationFeatures() {
  return (
    <section id="features" className="px-4 sm:px-8 py-24 bg-white">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-surface border border-gray-200 text-brand-black px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8">
              <Shield size={14} className="text-brand-orange fill-brand-orange" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              More Than Motion. <br />
              <span className="text-gray-400">A Living Memory.</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We built our AI with a deep respect for the people in your photos. These are the principles that guide every living portrait we create.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {principles.map((principle) => (
            <div key={principle.title} className="bg-brand-surface p-8 rounded-[2rem] border border-gray-100 transition-shadow duration-300">
              {/* Icon */}
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                {principle.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-brand-black mb-4">{principle.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                {principle.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}