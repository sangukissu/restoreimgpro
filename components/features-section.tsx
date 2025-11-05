"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Wrench, Eye, Palette, Heart, Lock, Play, ShieldCheck, Frame } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      title: "Restore & Animate",
      description:
        "First restores your photos to perfect quality, then brings people to life with natural movement and expressions.",
      icon: <Play className="h-6 w-6" />,
    },
    {
      title: "Digital Photo Frames",
      description:
        "Create stunning digital frames with customizable styles, colors, and captions to showcase your restored memories.",
      icon: <Frame className="h-6 w-6" />,
    },
    {
      title: "Handles Any Damage Type",
      description:
        "Scratches, tears, water damage, fading - our AI tackles every type of photo damage before animation.",
      icon: <Wrench className="h-6 w-6" />,
    },
    {
      title: "Natural Face Animation",
      description: "Creates realistic facial movements while preserving the person's authentic likeness and character.",
      icon: <Eye className="h-6 w-6" />,
    },
    {
      title: "Smart Color Revival",
      description:
        "Brings back original colors in photos, then adds lifelike animation that feels natural and authentic.",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      title: "Emotion Recognition",
      description:
        "AI detects facial expressions and creates appropriate animations - gentle smiles, warm eyes, natural movements.",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Complete Privacy",
      description:
        "Uploaded Photos processed securely and deleted in 30 minutes. Your precious memories stay completely private.",
      icon: <Lock className="h-6 w-6" />,
    },
    {
      title: "Smart Damage Check + Free Re‑Restoration",
      description:
        "If we detect heavy damage (tears, stains, scratches), we automatically offer a free second pass. Minor noise/blur doesn't qualify.",
      icon: <ShieldCheck className="h-6 w-6" />,
    },
  ]

  return (
    <section id="features" className="px-4 py-20 bg-[#fff6f0de]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="max-w-3xl mx-auto text-4xl lg:text-5xl text-black mb-6 leading-tight">
            Why Choose Our AI for Old Photo Restoration
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight mb-4">
            Advanced AI technology that restores photos and animates your loved ones with natural, lifelike movement
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
      <div className="text-xl font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-gray-300 group-hover/feature:bg-black transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-black">
          {title}
        </span>
      </div>
      <p className="text-md text-gray-600 max-w-xs relative z-10 px-10">{description}</p>
    </div>
  )
}
