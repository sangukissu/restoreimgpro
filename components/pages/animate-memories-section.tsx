"use client"

import { Heart, Users, Camera, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AnimateMemoriesSection() {
  const memoryTypes = [
    {
      icon: Users,
      title: "Family Portraits",
      description: "Bring your family history to life with animated vintage portraits",
      image: "/vintage-family-photo.png"
    },
    {
      icon: Heart,
      title: "Wedding Photos",
      description: "Relive precious wedding moments with gentle, romantic animations",
      image: "/scratched-childhood-photo.png"
    },
    {
      icon: Camera,
      title: "Childhood Memories",
      description: "Watch your childhood photos come alive with playful movements",
      image: "/yellowandfaded.webp"
    },
    {
      icon: Clock,
      title: "Historical Moments",
      description: "Transform historical photographs into captivating animated stories",
      image: "/under-exposed.webp"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Preserve Your Precious Memories
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transform static photographs into living memories that tell your family's story across generations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {memoryTypes.map((memory, index) => {
            const IconComponent = memory.icon
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <Image
                    src={memory.image}
                    alt={memory.title}
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {memory.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {memory.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Bring Your Photos to Life?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have already transformed their precious memories into captivating animated videos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/animate">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                Start Animating Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
              <div className="text-gray-600">Photos Animated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
              <div className="text-gray-600">Happy Families</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}