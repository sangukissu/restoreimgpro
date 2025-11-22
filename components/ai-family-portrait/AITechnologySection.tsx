"use client";

import { Layers, Palette, Users, Camera, Sparkles } from "lucide-react";

export default function AITechnologySection() {
  return (
    <section id="technology" className="w-full px-4 sm:px-8 py-24 bg-white">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Technology <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
              The Art & Science <br />
              <span className="text-gray-400">of AI Portraits.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              More than a simple photo merge. Discover the intelligent technology that makes each composite family portrait a work of art.
            </p>
          </div>
        </div>

        {/* Two-Column Explainer Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left Column: The "How" - Visual & Engaging */}
          <div className="bg-brand-surface p-8 rounded-[1.8rem] h-full">
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-brand-black mb-4">From Individuals to a Unified Whole</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                Our AI acts like a master portrait artist, analyzing each person's unique features, pose, and lighting. It then intelligently composes them in a virtual space to create a natural, balanced group photo that feels authentic.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-black mb-1">Intelligent Composition</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">The AI determines the most pleasing arrangement, ensuring no one looks out of place.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-black mb-1">Harmonized Lighting & Color</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">It re-renders the entire scene with a consistent light source, making it look like everyone was photographed together.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The "Why" - Deeper Dive */}
          <div className="flex flex-col gap-6 h-full">
            <div className="bg-brand-black text-white p-8 rounded-[1.8rem] flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-brand-orange">
                  <Users size={20} />
                </div>
                <h3 className="text-xl font-bold">Adding a Deceased Loved One</h3>
              </div>
              <p className="text-gray-300 font-medium leading-relaxed">
                Creating a memorial portrait is a delicate task. Our AI respectfully integrates photos of those who have passed with current family pictures, allowing you to create a beautiful tribute that was never physically possible.
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-[1.8rem] flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-orange shadow-sm">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-bold text-brand-black">Blending Old Photos with New</h3>
              </div>
              <p className="text-gray-600 font-medium leading-relaxed">
                Uniting a black-and-white photo of an ancestor with a modern color portrait of a child is a challenge. Our AI is trained to bridge this gap, creating a timeless, artistic style that makes the impossible reunion feel real.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}