"use client"

import React from "react"
import { Brain, Layers, Palette, History } from "lucide-react"

export default function ColorizeHowItWorksDeepDive() {
  const steps = [
    {
      title: "Contextual Image Analysis",
      description: "When you ask 'how does AI photo colorization work?', the first step is analyzing the grayscale values. The AI scans your photo, looking at textures, shapes, and the contrast between light and shadow.",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      title: "Historical Data Matching",
      description: "Our neural network is trained on millions of color and black-and-white image pairs. It compares your vintage photo against this massive dataset to recognize objects—like distinguishing a 1920s dress from a modern suit.",
      icon: <History className="h-6 w-6" />,
    },
    {
      title: "Intelligent Color Mapping",
      description: "Once objects are identified, the AI assigns the most statistically probable colors. It knows skies are blue, grass is green, and it understands complex human skin tones across all ethnicities.",
      icon: <Palette className="h-6 w-6" />,
    },
    {
      title: "Texture and Detail Preservation",
      description: "Instead of just painting flat colors, the AI blends the new hues seamlessly into the original grain and texture of the photo, creating a colorized picture that looks completely authentic.",
      icon: <Layers className="h-6 w-6" />,
    },
  ]

  return (
    <section className="px-4 sm:px-8 py-24 bg-white">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
            <span className="text-[#FF4D00]">//</span> The Technology <span className="text-[#FF4D00]">//</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-black leading-[1.05] mb-6">
            How Does AI Photo <br />
            <span className="text-gray-400">Colorization Work?</span>
          </h2>
          
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Wondering how we can colorize black and white photos automatically with such precision? Our AI doesn't just guess colors—it understands context, history, and lighting. Here is the exact process that brings your photos back to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="bg-brand-surface rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-[#FF4D00] mb-6 shadow-sm">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-4 leading-tight">
                {step.title}
              </h3>
              <p className="text-gray-600 font-medium leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
