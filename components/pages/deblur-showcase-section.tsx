"use client"

import { Compare } from "@/components/ui/compare"
import { Cover } from "@/components/ui/cover"

export default function DeblurShowcaseSection() {
  const showcaseItems = [
    {
      title: "Motion Blur",
      description: "Corrects blur from shaky hands or moving subjects",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Motion+Blur+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Photo+After",
    },
    {
      title: "Out of Focus",
      description: "Brings missed-focus images into sharp clarity",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Out+of+Focus+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Focus+After",
    },
    {
      title: "Low-Light Softness",
      description: "Removes the softness from photos taken in the dark",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Soft+Photo+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Photo+After",
    },
    {
      title: "Camera Shake",
      description: "Eliminates blur from unsteady camera movement",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Shaky+Photo+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Stable+Photo+After",
    },
    {
      title: "General Blurriness",
      description: "Enhances overall image sharpness and detail",
      beforeImage: "/placeholder.svg?height=300&width=480&text=Blurry+Photo+Before",
      afterImage: "/placeholder.svg?height=300&width=480&text=Sharp+Photo+After",
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
          <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
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
              Our AI handles even the most challenging focus problems. Upload your photo and see the difference.
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 shadow-sm hover:shadow-md">
              Unblur Your Photo Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
