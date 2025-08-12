"use client"

import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"
import { ImageSwiper } from "@/components/image-swiper"

export default function MemoryPreservationSection() {
  const imageUrls =
    "/portrait-1.jpg,/portrait-2.jpg,/portrait-3.jpg,https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face,https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face,https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face"

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-amber-100/20"></div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Because some memories
                <br />
                only live in photos
              </h2>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>Old photos fade. Colors wash out. Paper cracks. Every year, the details slip away.
                BringBack doesn't just fix pictures - it brings
                  the moments alive. Because when the photo is gone, the memory feels further away.</p>
              </div>
            </div>

            <div>
              <Button
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-base font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Shield className="mr-2 h-5 w-5" />
                Restore My Photos
              </Button>
              <p className="text-xs text-gray-500 mt-1">Instant natural restoration in seconds</p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
            
              <ImageSwiper images={imageUrls} cardWidth={360} cardHeight={420} className="touch-pan-y" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
