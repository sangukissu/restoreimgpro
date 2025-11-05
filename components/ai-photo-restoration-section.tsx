"use client"

import { Zap, Layers, Heart, Users } from "lucide-react"

export default function AIPhotoRestorationSection() {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "From Hours to Seconds",
      description: "What once took a skilled artist weeks of manual work, our AI accomplishes with greater precision in under 30 seconds.",
    },
    {
      icon: <Layers className="w-6 h-6 text-orange-600" />,
      title: "Intelligent Reconstruction",
      description: "This is not a simple filter. The AI rebuilds missing textures, faces, and details. We run a QC on every restoration to ensure accuracy, if missed you provide another free restoration on top of it.",
    },
    {
      icon: <Heart className="w-6 h-6 text-orange-600" />,
      title: "Authentic & Respectful Animation",
      description: "Our animation AI focuses on subtle, natural movements that preserve the true character and likeness of your loved ones.",
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: "Accessible to Everyone",
      description: "We make professional-grade restoration and animation technology affordable and instantly available to preserve any family's history.",
    },
  ]

  return (
    <section id="what-is-ai" className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-6">
            <span className="mr-2">💡</span>
            The Technology Explained
          </div>
          <h2 className="max-w-4xl mx-auto text-4xl lg:text-5xl text-black leading-tight">
            What is AI Photo Restoration & Animation?
          </h2>
          {/* Torn & Ripped Restoration Demo */}
          <div className="max-w-4xl mx-auto mt-6">
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-black">
              <video
                className="w-full h-auto"
                src="/videos/tear-torn-restoration.mp4"
                controls
                preload="metadata"
                playsInline
                poster="/torn-tear.webp"
                onPlay={() => {
                  if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag("event", "video_play", {
                      feature: "torn_restoration",
                      location: "technology_section",
                    })
                  }
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3">
              Watch BringBack rebuild a photo torn into multiple pieces, preserving faces and reconstructing missing areas.
            </p>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: The Explanation */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl text-black leading-tight">From Faded Pixels to Living People</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              AI photo restoration is the process of using a highly trained artificial intelligence to digitally repair and enhance aged photographs. Traditionally, this was a manual process done by artists, costing hundreds of dollars and taking weeks.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our AI instantly analyzes your photo for common issues like scratches, tears, fading, and discoloration. It then intelligently reconstructs the damaged areas, sharpens focus, and revives original colors. But our AI doesn't stop there.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              For animation, the AI identifies facial landmarks in the restored photo to generate a series of movements. It creates subtle, lifelike animations—like a gentle smile, a blink, or a turn of the head—that are respectful and true to the person's character. The result is not just a fixed picture, but a living memory brought back to life.
            </p>
          </div>

          {/* Right Column: Key Benefits */}
          <div className="space-y-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mr-5">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-black">{benefit.title}</h4>
                  <p className="mt-1 text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}