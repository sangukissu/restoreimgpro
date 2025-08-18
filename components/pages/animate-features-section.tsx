"use client"

import { Zap, Clock, Video, Sparkles, Shield, Download } from "lucide-react"

export default function AnimateFeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Animation",
      description: "Advanced AI analyzes your photos and creates natural, lifelike movements that bring memories to life."
    },
    {
      icon: Clock,
      title: "Quick Processing",
      description: "Generate stunning animated videos in just a few minutes with our optimized AI pipeline."
    },
    {
      icon: Video,
      title: "High-Quality Output",
      description: "Export your animated photos in HD quality, perfect for sharing or preserving precious memories."
    },
    {
      icon: Zap,
      title: "Old Photo Revival",
      description: "Specialized template designed specifically for vintage and old photos with authentic period effects."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your photos are processed securely and never stored permanently on our servers."
    },
    {
      icon: Download,
      title: "Easy Download",
      description: "Download your animated videos instantly in popular formats compatible with all devices."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to transform static photos into captivating animated videos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Template ID: 346384996936128
          </h3>
          <p className="text-gray-600">
            Our specialized Old Photo Revival template brings vintage photos to life with authentic period-appropriate animations and effects.
          </p>
        </div>
      </div>
    </section>
  )
}