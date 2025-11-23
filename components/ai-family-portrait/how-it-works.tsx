"use client";

import { Sparkles, UploadCloud, LayoutTemplate, Download } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Upload Photos",
    description: "Select 1 to 4 clear, front-facing photos of your family members. Our AI works with modern, old, and even black-and-white pictures.",
    icon: <UploadCloud size={24} className="text-brand-black" />,
  },
  {
    id: 2,
    title: "Choose Canvas",
    description: "Select the perfect aspect ratio. Choose a wider format for larger groups to ensure a balanced, natural composition.",
    icon: <LayoutTemplate size={24} className="text-brand-black" />,
  },
  {
    id: 3,
    title: "Generate & Cherish",
    description: "In seconds, our AI composes a single, harmonious group photo. Download your high-resolution image, ready for printing.",
    icon: <Download size={24} className="text-brand-black" />,
  }
];

export default function AIAnimationHowItWorks() {
  return (
    <section id="how-it-works" className="w-full px-4 sm:px-8 py-24 ">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Simple Workflow <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[1.1]">
              Your Dream Portrait <br />
              <span className="text-gray-400">in 3 Simple Steps.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Select 1 to 4 clear, front-facing photos. Choose your canvas. In seconds, our AI composes a single, harmonious group photo.
            </p>
          </div>
        </div>

        {/* Steps Grid Container - Gray Background */}
        <div className="bg-brand-surface p-3 rounded-[1.8rem]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-[1.5rem] p-8 min-h-[320px] flex flex-col group relative overflow-hidden"
              >
                {/* Step Number & Icon */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#F2F2F0] flex items-center justify-center transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                    {step.icon}
                  </div>
                  <span className="text-7xl font-[800] text-gray-100 leading-none select-none font-sans group-hover:text-gray-200 transition-colors absolute top-4 right-6">
                    0{step.id}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-auto relative z-10">
                  <h3 className="text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect Decoration */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}