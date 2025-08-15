"use client"

import { Cover } from "@/components/ui/cover"

export default function DenoiseMemoriesSection() {
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-8 relative">
          {/* Floating text */}
          <div className="absolute -top-4 left-0 transform -rotate-12">
            <span className="text-sm font-medium text-gray-400 italic">Noise Free</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Because clean photos
            <br />
            <Cover>tell better stories</Cover>
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Every grainy night shot, every noisy indoor moment, every high-ISO memory that seemed too rough to
              share—they all deserve to look their absolute best.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              BringBack doesn't just remove noise. It reveals the clean, professional photo that was always hiding
              underneath the grain. Because when the photo is noisy, the moment feels less special.
            </p>

            <p className="text-lg text-gray-600">Don't let noise steal the beauty from your most precious moments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
