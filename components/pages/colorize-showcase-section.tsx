"use client"

import { Compare } from "@/components/ui/compare"
import { FramerButton } from "@/components/ui/framer-button"
import Link from "next/link"
import { ChevronRight, Users, Heart, Baby, Medal, MapPin, GraduationCap } from "lucide-react"

export default function ColorizeShowcaseSection() {
  const showcaseItems = [
    {
      title: "Vintage Family Portraits",
      description: "Brings warmth and life to old family photographs",
      beforeImage: "/vintage-family-portraits.webp",
      afterImage: "/vintage-family-portraits-colorized.webp",
      beforeImageAlt: "Before: black and white damaged vintage family portrait",
      afterImageAlt: "After: vintage family portrait colorized with bringback ai",
      icon: <Users size={24} />,
    },
    {
      title: "Historical Wedding Photos",
      description: "Restores the joy of vintage weddings",
      beforeImage: "/historical-wedding-photo.webp",
      afterImage: "/historical-wedding-photo-colorized.webp",
      beforeImageAlt: "Before: black and white damaged historical wedding photo",
      afterImageAlt: "After: historical wedding photo colorized with bringback ai",
      icon: <Heart size={24} />,
    },
    {
      title: "Old Childhood Memories",
      description: "Makes childhood photos feel fresh and alive",
      beforeImage: "/childhood-memories-black-and-white.webp",
      afterImage: "/childhood-memories-colorized.webp",
      beforeImageAlt: "Before: black and white old childhood photo",
      afterImageAlt: "After: old childhood photo colorized with bringback ai",
      icon: <Baby size={24} />,
    },
    {
      title: "Military & Service Photos",
      description: "Honors service members with uniform colors",
      beforeImage: "/old-military-photo.webp",
      afterImage: "/colorized-military-photo.webp",
      beforeImageAlt: "Before: black and white damaged military photo",
      afterImageAlt: "After: military photo colorized with bringback ai",
      icon: <Medal size={24} />,
    },
    {
      title: "Vintage Street Scenes",
      description: "Brings historical moments and places to life",
      beforeImage: "/vintage-street.webp",
      afterImage: "/colorized-vintage-street-photo.webp",
      beforeImageAlt: "Before: black and white damaged vintage street scene",
      afterImageAlt: "After: vintage street scene colorized with bringback ai",
      icon: <MapPin size={24} />,
    },
    {
      title: "Old School & Group Photos",
      description: "Makes class photos and group shots vibrant",
      beforeImage: "/old-school-photo.webp",
      afterImage: "/colorized-school-photo.webp",
      beforeImageAlt: "Before: black and white old school group photo",
      afterImageAlt: "After: old school group photo colorized with bringback ai",
      icon: <GraduationCap size={24} />,
    },
  ]

  return (
    <section className="w-full px-4 sm:px-8 py-24 bg-white">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> Real Results <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              See the magic <br />
              <span className="text-gray-400">in every detail.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              From family portraits to historical moments, see how our AI brings authentic color to every type of vintage photograph.
            </p>
          </div>
        </div>

        {/* Showcase Grid Container - Gray Background */}
        <div className="bg-[#F3F4F6] p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {showcaseItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[1.5rem] p-5 flex flex-col gap-6 relative group h-full"
              >
                {/* Visual Area (Compare Slider) */}
                <div className="h-64 w-full rounded-[1.5rem] overflow-hidden border border-gray-100 shadow-inner relative">
                  <Compare
                    firstImage={item.beforeImage}
                    secondImage={item.afterImage}
                    firstImageClassName="object-cover w-full h-full"
                    secondImageClassname="object-cover w-full h-full"
                    className="w-full h-full"
                    slideMode="hover"
                    showHandlebar={true}
                    firstImageAlt={item.beforeImageAlt}
                    secondImageAlt={item.afterImageAlt}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 px-2 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-brand-black shrink-0">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-brand-black leading-tight">{item.title}</h3>
                  </div>

                  <p className="text-gray-500 font-medium leading-relaxed text-sm pl-[3.25rem]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  )
}
