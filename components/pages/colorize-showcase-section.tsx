"use client"

import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"
import { Button } from "../ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react" 

export default function ColorizeShowcaseSection() {
  const showcaseItems = [
    {
      title: "Vintage Family Portraits",
      description: "Brings warmth and life to old family photographs",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Family+Portrait",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Family+Portrait",
    },
    {
      title: "Historical Wedding Photos",
      description: "Restores the romance and joy of vintage weddings",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Wedding+Photo",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Wedding+Photo",
    },
    {
      title: "Old Childhood Memories",
      description: "Makes childhood photos feel fresh and alive",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Childhood+Photo",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Childhood+Photo",
    },
    {
      title: "Military & Service Photos",
      description: "Honors service members with realistic uniform colors",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Military+Photo",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Military+Photo",
    },
    {
      title: "Vintage Street Scenes",
      description: "Brings historical moments and places to life",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Street+Scene",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Street+Scene",
    },
    {
      title: "Old School & Group Photos",
      description: "Makes class photos and group shots vibrant again",
      beforeImage: "/placeholder.svg?height=300&width=480&text=B%26W+Group+Photo",
      afterImage: "/placeholder.svg?height=300&width=480&text=Colorized+Group+Photo",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Every vintage photo,
            <br />
            <span className="text-gray-600">
              <Cover>beautifully colorized</Cover>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From family portraits to historical moments, see how our AI brings authentic color to every type of vintage
            photograph.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      className="h-[220px] w-[320px] rounded-lg"
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
              Our AI handles even the most challenging vintage photos. Upload your black and white image and see the
              magic happen.
            </p>
             <Link href="/login">
            <Button className="px-8 py-6 group relative overflow-hidden w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Colorize Your Photo Now</span>
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
