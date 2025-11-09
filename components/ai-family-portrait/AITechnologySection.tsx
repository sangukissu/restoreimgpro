// Filename: AITechnologySection.tsx
"use client"

import { Layers, Palette, Users, Camera } from "lucide-react"

export default function AITechnologySection() {
  return (
    <section id="technology" className="px-4 py-20 bg-white"> {/* Use a subtle contrasting background */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="max-w-3xl mx-auto font-serif text-4xl lg:text-5xl text-black leading-tight">
            The Art and Science of Your AI Portrait
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            This is more than a simple photo merge. Discover the intelligent technology that makes each composite family portrait a work of art.
          </p>
        </div>

        {/* Two-Column Explainer Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: The "How" - Visual & Engaging */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* VISUAL: A simplified diagram showing 3 separate photos on the left, moving through a central "AI Brain" icon, and resulting in one unified portrait on the right. */}
            <h3 className="text-2xl font-bold text-black mb-4">From Individuals to a Unified Whole</h3>
            <p className="text-gray-600 mb-6">
              Our AI acts like a master portrait artist, analyzing each person's unique features, pose, and lighting. It then intelligently composes them in a virtual space to create a natural, balanced group photo that feels authentic.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Layers className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black">Intelligent Composition</h4>
                  <p className="text-gray-500">The AI determines the most pleasing arrangement, ensuring no one looks out of place.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Palette className="w-6 h-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-black">Harmonized Lighting & Color</h4>
                  <p className="text-gray-500">It re-renders the entire scene with a consistent light source, making it look like everyone was photographed together.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The "Why" - Deeper Dive */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl text-black leading-tight">A Solution for Every Family Story</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Combining photos into one picture is a deeply personal request. Our technology is built to handle the most important scenarios with the sensitivity they deserve.
            </p>
            <div>
              <h4 className="text-xl font-bold text-black flex items-center"><Users className="w-5 h-5 mr-2 text-orange-600"/>Adding a Deceased Loved One to a Photo</h4>
              <p className="mt-1 text-gray-600">
                Creating a memorial portrait is a delicate task. Our AI respectfully integrates photos of those who have passed with current family pictures, allowing you to create a beautiful tribute that was never physically possible.
              </p>
            </div>
             <div>
              <h4 className="text-xl font-bold text-black flex items-center"><Camera className="w-5 h-5 mr-2 text-orange-600"/>Blending Old Photos with New</h4>
              <p className="mt-1 text-gray-600">
                Uniting a black-and-white photo of an ancestor with a modern color portrait of a child is a challenge. Our AI is trained to bridge this gap, creating a timeless, artistic style that makes the impossible reunion feel real.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}