// Filename: AnimationPhilosophySection.tsx
"use client"

import { Heart, Shield, Award, Sparkles } from "lucide-react"
import React from "react"

// An array to hold the data for our principles. This makes the code clean and easy to update.
const principles = [
  {
    icon: <Heart className="w-8 h-8 text-orange-600" />,
    title: "Respectful Realism",
    description:
      "Our first commitment is to honor the person in your photo. We focus on subtle micro-expressions to create a moment of connection, not a deepfake.",
  },
  {
    icon: <Shield className="w-8 h-8 text-orange-600" />,
    title: "Absolute Privacy",
    description:
      "Your memories are yours alone. Photos are deleted in minutes, and we **never** use your family portraits for AI training. Your trust is our foundation.",
  },
  {
    icon: <Award className="w-8 h-8 text-orange-600" />,
    title: "Uncompromising Quality",
    description:
      "Every living memory is delivered as a high-resolution MP4 video, ensuring crisp detail and universal compatibility for sharing and saving.",
  },
  {
    icon: <Sparkles className="w-8 h-8 text-orange-600" />,
    title: "The Magic of Simplicity",
    description:
      "This complex technology is powered by a single click. No settings to adjust, no learning curve. Just a simple, intuitive way to create something magical.",
  },
]

export default function AIAnimationFeatures () {
  return (
    <section id="philosophy" className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Privacy Matters
          </div>
          <h2 className="max-w-3xl mx-auto font-serif text-4xl lg:text-5xl text-black leading-tight">
            More Than Motion. A Living Memory.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We built our AI with a deep respect for the people in your photos. These are the principles that guide every living portrait we create.
          </p>  
         
        </div>

        {/* --- PROFESSIONAL PRINCIPLES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {principles.map((principle) => (
            <div key={principle.title}>
              {/* Icon Container - Small & Tasteful */}
              <div className="bg-gray-100 rounded-lg p-5 inline-block mb-6">
                {principle.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-black mb-3">{principle.title}</h3>
              <p className="text-gray-600 leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}