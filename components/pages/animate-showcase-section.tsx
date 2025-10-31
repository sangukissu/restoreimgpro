"use client"

import { Play } from "lucide-react"
import Image from "next/image"

export default function AnimateShowcaseSection() {
  const showcaseItems = [
    {
      id: 1,
      title: "Vintage Family Portrait",
      description: "Watch as this 1950s family photo comes to life with gentle movements",
      beforeImage: "/vintage-family-photo.png",
      afterVideo: "/placeholder.svg", // This would be a video in real implementation
    },
    {
      id: 2,
      title: "Old Wedding Photo",
      description: "Bring back the magic of this classic wedding moment",
      beforeImage: "/scratched-childhood-photo.png",
      afterVideo: "/placeholder.svg",
    },
    {
      id: 3,
      title: "Childhood Memory",
      description: "Transform this precious childhood moment into a living memory",
      beforeImage: "/yellowandfaded.webp",
      afterVideo: "/placeholder.svg",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See the Magic in Action
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our AI brings old photos to life with realistic motion and vintage effects
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={item.beforeImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-4">
                    <Play className="w-8 h-8 text-gray-900" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            * Video examples shown are for demonstration purposes
          </p>
        </div>
      </div>
    </section>
  )
}