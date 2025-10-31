"use client"

import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react" 

export default function DeblurShowcaseSection() {
  const showcaseItems = [
    {
      title: "Motion Blur",
      description: "Corrects blur from shaky hands or moving subjects",
      beforeImage: "/blurred-lady.webp",
      afterImage: "/unblurred-lady.webp",
    },
    {
      title: "Out of Focus",
      description: "Brings missed-focus images into sharp clarity",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Out+of+Focus+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Focus+After",
    },

    {
      title: "Camera Shake",
      description: "Eliminates blur from unsteady camera movement",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Shaky+Photo+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Stable+Photo+After",
    },

    {
      title: "Subject Blur",
      description: "Sharpens moving subjects while preserving background",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Subject+Blur+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Subject+After",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-black mb-6">
            Every type of blur,
            <br />
            <span className="text-gray-600">
              <Cover>perfectly corrected</Cover>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From shaky concert photos to blurry family portraits, see how our AI handles every type of focus issue with
            precision.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {showcaseItems.map((item, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-6 border-6 border-gray-200 bg-transparent">
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>

                {/* Compare Slider */}
                <div className="flex justify-center">
                  <div className="border rounded-xl bg-gray-50 border-gray-200 p-3">
                    <Compare
                      firstImage={item.beforeImage}
                      secondImage={item.afterImage}
                      firstImageClassName="object-cover"
                      secondImageClassname="object-cover"
                      className="h-[220px] w-[320px] md:h-[280px] md:w-[400px] rounded-lg"
                      slideMode="hover"
                      showHandlebar={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6">
              Our AI handles even the most challenging focus problems. Upload your photo and see the difference.
            </p>
            
             <Link href="/login">
            <Button className="px-8 py-6 group relative overflow-hidden w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Unblur Your Photo Now</span>
              <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
