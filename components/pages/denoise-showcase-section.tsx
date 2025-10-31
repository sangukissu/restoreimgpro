"use client"

import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function DenoiseShowcaseSection() {
  const showcaseItems = [
  
    {
      title: "Low-Light Grain",
      description: "Cleans up noise from dark indoor or nighttime shots",
      beforeImage: "/grainy-photo.webp",
      afterImage: "/grainy-photo-restored.webp",
      beforeImageAlt: "Before: low light grain photo",
      afterImageAlt: "After: low light grain photo denoised with bringback ai",
    },
    {
      title: "Color Noise",
      description: "Eliminates colored speckles and digital artifacts",
      beforeImage: "/color-noise.webp",
      afterImage: "/color-noise-removed.webp",
      beforeImageAlt: "Before: color noise photo",
      afterImageAlt: "After: color noise photo denoised with bringback ai",
    },
    {
      title: "Old Digital Camera",
      description: "Removes noise from older digital camera sensors",
      beforeImage: "/old-digi-camera.webp",
      afterImage: "/restored-old-digi.webp",
      beforeImageAlt: "Before: old digital camera noise photo",
      afterImageAlt: "After: old digital camera noise photo denoised with bringback ai",
    },
    {
      title: "Film Grain Removal",
      description: "Removes unwanted grain while preserving film character",
      beforeImage: "/film-grain.webp",
      afterImage: "/restored-film-grain.webp",
      beforeImageAlt: "Before: film grain photo",
      afterImageAlt: "After: film grain photo cleaned with bringback ai",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className="font-serif text-4xl lg:text-5xl text-black mb-6">
            Every type of noise,
            <br />
            <span className="text-gray-600">
              <Cover>perfectly cleaned</Cover>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From grainy concert photos to noisy night shots, see how our AI removes every type of digital noise with
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
                      firstImageAlt={item.beforeImageAlt}
                      secondImageAlt={item.afterImageAlt}
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
              Our AI handles even the most challenging noise problems. Upload your photo and see the difference.
            </p>
           
             <Link href="/login">
            <Button className="px-8 py-6 group relative overflow-hidden w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Denoise Your Photo Now</span>
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
