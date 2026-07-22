"use client";

import { Layers, Palette, Users, Camera } from "lucide-react";
import { LIMITATIONS_COPY } from "@/lib/site-copy";

export default function AITechnologySection() {
  return (
    <section id="technology" className="w-full px-4 sm:px-8 py-24 bg-white">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> What the AI Changes <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              A Newly Composed Portrait, <br />
              <span className="text-gray-400">Not a Pasted Collage.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              The model rebuilds the scene around your references. That can unify the image, but it can also alter details that should be checked against the originals.
            </p>
          </div>
        </div>

        {/* Two-Column Explainer Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left Column: The "How" - Visual & Engaging */}
          <div className="bg-brand-surface p-4 rounded-[1.8rem] h-full">
            <div className="bg-white rounded-[1.5rem] p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-brand-black mb-4">How separate references become one scene</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-8">
                BringBack uses the people in your source photos as references, then generates a new arrangement with a shared background, lighting direction, color treatment, and camera perspective.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-black mb-1">Intelligent Composition</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">The model chooses a group arrangement for the selected canvas. Pose and relative height can change, so review them before downloading.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-black mb-1">Harmonized Lighting & Color</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">The generated scene applies a shared light and color treatment rather than preserving each source background.</p>
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
                A memorial portrait is an interpretation created from the references you provide. Use the clearest available image, restore serious damage first, and treat the result as a keepsake rather than a historical record.
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
                Black-and-white and modern color sources can be used together. The older image may be interpreted to fit the selected style, and AI color is not proof of the original historical colors. {LIMITATIONS_COPY.faces}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
