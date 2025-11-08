"use client"

import { Heart, Users, Globe, Gift, Sparkles } from "lucide-react"
import React from "react"

const useCases = [
  {
    icon: <Heart className="w-8 h-8 text-orange-600" />,
    title: "The Memorial Portrait",
    description:
      "Honor a loved one who has passed away. Create a beautiful portrait that places them together with family, creating a treasured keepsake of remembrance.",
  },
  {
    icon: <Users className="w-8 h-8 text-orange-600" />,
    title: "The Impossible Reunion",
    description:
      "Unite generations that never had the chance to meet. Place a grandparent in their youth next to their grandchild, creating a powerful image of your family's legacy.",
  },
  {
    icon: <Globe className="w-8 h-8 text-orange-600" />,
    title: "The Long-Distance Family",
    description:
      "Bridge the miles. Bring together family members from across the country or around the world into a single, perfect group photo, no travel required.",
  },
  {
    icon: <Gift className="w-8 h-8 text-orange-600" />,
    title: "The Perfect Sentimental Gift",
    description:
      "Create a one-of-a-kind gift for an anniversary, holiday, or birthday that is guaranteed to touch their hearts. A portrait of shared history and love.",
  },
]

export default function FamilyPortraitUseCases() {
  return (
    <section id="use-cases" className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Use Cases
          </div>
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black leading-tight">
            Create a Portrait for Every Story
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect your family across time, distance, and memory with a unified portrait.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {useCases.map((item) => (
            <div key={item.title}>
              <div className="bg-gray-100 rounded-lg p-5 inline-block mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}