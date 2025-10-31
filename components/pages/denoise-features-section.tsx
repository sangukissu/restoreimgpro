"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import { Eye, Zap, Search, Palette, Shield, Lock } from "lucide-react"

export default function DenoiseFeaturesSection() {
  const features = [
    {
      title: "Preserves Fine Details",
      description: "Removes noise while keeping hair, fabric textures, and important details perfectly intact.",
      icon: <Eye className="h-6 w-6" />,
    },
    {
      title: "Handles Any Noise Type",
      description: "Color noise, luminance grain, digital artifacts - our AI understands all forms of image noise.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Smart Area Detection",
      description: "Applies stronger denoising to backgrounds while preserving detail in faces and subjects.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Color Accuracy",
      description: "Maintains original colors and tones while removing color noise and digital artifacts.",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      title: "Edge Preservation",
      description: "Keeps important edges and contours sharp while smoothing out unwanted grain and noise.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Privacy Protection",
      description: "Uploaded Photos processed securely and deleted in 30 minutes. Your moments stay private.",
      icon: <Lock className="h-6 w-6" />,
    },
  ]

  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-black mb-4">Why our Denoise works like magic</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Advanced AI meets signal processing to clean your photos without losing what matters
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-gray-200",
        (index === 0 || index === 3) && "lg:border-l border-gray-200",
        index < 3 && "lg:border-b border-gray-200",
      )}
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-gray-600">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-300 group-hover/feature:bg-black transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-black">
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-600 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  )
}
