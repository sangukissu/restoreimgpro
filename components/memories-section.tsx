"use client"

import { Cover } from "@/components/ui/cover"

export default function MemoriesSection() {
  return (
    <section className="px-6 py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Main Message */}
        <div className="space-y-8 relative">
          {/* Floating "We Exists" text */}
          <div className="absolute -top-4 left-0 transform -rotate-12">
            <span className="text-sm font-medium text-gray-400 italic">We Exists</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight">
            Because some memories
            <br />
            <Cover>only live in photos</Cover>
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-xl text-gray-700 leading-relaxed">
              Every faded family photo, every damaged childhood memory, every precious moment trapped in poor
              quality—they all tell a story worth preserving perfectly.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              BringBack doesn't just fix pictures. It keeps the moments alive. Because when the photo is gone, the
              memory feels further away.
            </p>

            <p className="text-lg text-gray-600">
              Don't let another day pass with your memories trapped in damaged photos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
