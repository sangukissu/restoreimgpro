"use client"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"

export default function ShowcaseSection() {
  const showcaseItems = [
    {
      title: "Torn & Ripped Photos",
      description: "Seamlessly repair tears and missing pieces",
      beforeImage: "/ripped.webp",
      afterImage: "/ripped-restored.webp",
    },
    {
      title: "Faded & Yellowed",
      description: "Restore original colors and vibrancy",
      beforeImage: "/yellowandfaded.webp",
      afterImage: "/yellowandfaded-restored.webp",
    },
    {
      title: "Water Damaged",
      description: "Remove stains and water marks completely",
      beforeImage: "/water-damaged.webp",
      afterImage: "/water-damaged-restored.webp",
    },
    {
      title: "Scratched & Cracked",
      description: "Eliminate scratches and surface damage",
      beforeImage: "/scratched.webp",
      afterImage: "/scratched-restored.webp",
    },
    {
      title: "Blurred & Out of Focus",
      description: "Sharpen details and enhance clarity",
      beforeImage: "/blurred.webp",
      afterImage: "/blurred-restored.webp",
    },
    {
      title: "Dark & Underexposed",
      description: "Brighten shadows and recover hidden details",
      beforeImage: "/under-exposed.webp",
      afterImage: "/under-exposed-restored.webp",
    },
  ]

  return (
    <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Real Transformations</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
            Every type of damage,
            <br />
            <span className="text-gray-600"><Cover>perfectly restored</Cover>
</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
            From torn family portraits to faded wedding photos, see how BringBack handles every type of photo damage
            with precision and care.
          </p>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-6 border-7 border-gray-200 bg-transparent background-blur">
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
                      className="sm:h-[220px] sm:w-[300px] h-[190px] w-[280px] rounded-lg"
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
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight mb-4">
              Our AI handles even the most unique photo restoration challenges. Upload your photo and see the magic
              happen.
            </p>
              <Link href="/dashboard">
            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Restore Your Photo</span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
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
