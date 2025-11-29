"use client"

import React from "react"
import { Eye, Palette, Search, Clock, Shield, Lock } from "lucide-react"

export default function ColorizeFeaturesSection() {
  const features = [
    {
      title: "Natural Skin Tones",
      description: "Accurately colorizes faces with realistic skin tones across all ethnicities and ages.",
      icon: <Eye className="h-6 w-6" />,
    },
    {
      title: "Historical Context Aware",
      description: "Applies period-appropriate colors based on the era and style of your vintage photograph.",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      title: "Smart Object Recognition",
      description: "Identifies clothing, backgrounds, and objects to apply contextually accurate colors.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Vibrant Color Palette",
      description: "Uses rich, natural colors that bring life to photos without looking artificial or oversaturated.",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      title: "Detail Preservation",
      description: "Maintains all original details, textures, and contrast while adding beautiful color.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Privacy Protection",
      description: "Uploaded Photos processed securely and deleted in 30 minutes. Your family memories stay private.",
      icon: <Lock className="h-6 w-6" />,
    },
  ]

  return (
    <section className="px-4 sm:px-8 py-24">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> Why It Works <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Advanced AI <br />
              <span className="text-gray-400">Colorization.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-md">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Advanced AI meets art history to bring your vintage photos to life with authentic colors.
            </p>
          </div>
        </div>

        {/* Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-6 flex flex-col gap-6 h-full shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-[#F3F4F6] flex items-center justify-center text-[#FF4D00]">
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-bold text-brand-black leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
