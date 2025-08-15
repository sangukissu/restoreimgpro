"use client"

import { Cover } from "@/components/ui/cover"

export default function DeblurMemoriesSection() {
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-8 relative">
          {/* Floating text */}
          <div className="absolute -top-4 left-0 transform -rotate-12">
            <span className="text-sm font-medium text-gray-400 italic">Crystal Clear</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Because sharp moments
            <br />
            <Cover>deserve sharp photos</Cover>
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Every blurry concert photo, every out-of-focus family portrait, every shaky moment that seemed lost
              forever—they all deserve to be seen in perfect clarity.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              BringBack doesn't just sharpen images. It brings back the details you thought were gone forever. Because
              when the photo is blurry, the memory feels distant.
            </p>

            <p className="text-lg text-gray-600">Don't let blur steal the clarity from your most precious moments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
