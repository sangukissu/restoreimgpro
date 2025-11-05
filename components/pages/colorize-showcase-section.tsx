"use client"

import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"
import { FramerButton } from "@/components/ui/framer-button"
import Link from "next/link"
import { ChevronRight } from "lucide-react" 

export default function ColorizeShowcaseSection() {
  const showcaseItems = [
    {
      title: "Vintage Family Portraits",
      description: "Brings warmth and life to old family photographs",
      beforeImage: "/vintage-family-portraits.webp",
      afterImage: "/vintage-family-portraits-colorized.webp",
      beforeImageAlt: "Before: black and white damaged vintage family portrait",
      afterImageAlt: "After: vintage family portrait colorized with bringback ai",

    },
    {
      title: "Historical Wedding Photos",
      description: "Restores the joy of vintage weddings",
      beforeImage: "/historical-wedding-photo.webp",
      afterImage: "/historical-wedding-photo-colorized.webp",
      beforeImageAlt: "Before: black and white damaged historical wedding photo",
      afterImageAlt: "After: historical wedding photo colorized with bringback ai",

    },
    {
      title: "Old Childhood Memories",
      description: "Makes childhood photos feel fresh and alive",
      beforeImage: "/childhood-memories-black-and-white.webp",
      afterImage: "/childhood-memories-colorized.webp",
      beforeImageAlt: "Before: black and white old childhood photo",
      afterImageAlt: "After: old childhood photo colorized with bringback ai",

    },
    {
      title: "Military & Service Photos",
      description: "Honors service members with uniform colors",
      beforeImage: "/old-military-photo.webp",
      afterImage: "/colorized-military-photo.webp",
      beforeImageAlt: "Before: black and white damaged military photo",
      afterImageAlt: "After: military photo colorized with bringback ai",

    },
    {
      title: "Vintage Street Scenes",
      description: "Brings historical moments and places to life",
      beforeImage: "/vintage-street.webp",
      afterImage: "/colorized-vintage-street-photo.webp",
      beforeImageAlt: "Before: black and white damaged vintage street scene",
      afterImageAlt: "After: vintage street scene colorized with bringback ai",

    },
    {
      title: "Old School & Group Photos",
      description: "Makes class photos and group shots vibrant",
      beforeImage: "/old-school-photo.webp",
      afterImage: "/colorized-school-photo.webp",
      beforeImageAlt: "Before: black and white old school group photo",
      afterImageAlt: "After: old school group photo colorized with bringback ai",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className=" text-4xl lg:text-5xl text-black mb-6">
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
                  <h3 className="text-xl font-bold text-black mb-1">{item.title}</h3>
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
                      className="sm:h-[220px] sm:w-[300px] h-[190px] w-[280px] rounded-lg"
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
              Our AI handles even the most challenging vintage photos. Upload your black and white image and see the
              magic happen.
            </p>
          

            
              <Link href="/login">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden">
            Colorize Your Photo Now
          </FramerButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
