"use client";

import { Sparkles, Upload, Wand2, Download } from "lucide-react";

export default function AIAnimationHowItWorks() {
  return (
    <section id="how-it-works" className="px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-brand-black px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-8">
            <Sparkles size={14} className="text-brand-orange fill-brand-orange" />
            <span>Simple Workflow</span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
            Living Memories <br />
            <span className="text-gray-400">in 3 Steps.</span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            No software to install or complicated settings. Simply upload your photo, choose a style, and our AI does the rest in seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Step 1 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white rounded-[2rem] transform transition-transform duration-300 group-hover:-translate-y-2 border border-gray-100"></div>
            <div className="relative p-8 sm:p-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange mb-8 group-hover:scale-110 transition-transform duration-300">
                <Upload size={32} strokeWidth={1.5} />
              </div>

              <div className="text-6xl font-extrabold text-gray-100 absolute top-6 right-8 select-none">01</div>

              <h3 className="text-2xl font-bold text-brand-black mb-4">Upload Photo</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                Start with any portrait. For the best results, we recommend using a photo that has already been restored to clarity.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-black rounded-[2rem] transform transition-transform duration-300 group-hover:-translate-y-2"></div>
            <div className="relative p-8 sm:p-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-300">
                <Wand2 size={32} strokeWidth={1.5} />
              </div>

              <div className="text-6xl font-extrabold text-white/10 absolute top-6 right-8 select-none">02</div>

              <h3 className="text-2xl font-bold text-white mb-4">Choose Style</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Select the perfect motion from our library. From a gentle smile to a warm gaze, find the style that fits best.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-white rounded-[2rem] transform transition-transform duration-300 group-hover:-translate-y-2 border border-gray-100"></div>
            <div className="relative p-8 sm:p-10 h-full flex flex-col">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform duration-300">
                <Download size={32} strokeWidth={1.5} />
              </div>

              <div className="text-6xl font-extrabold text-gray-100 absolute top-6 right-8 select-none">03</div>

              <h3 className="text-2xl font-bold text-brand-black mb-4">Download & Share</h3>
              <p className="text-gray-600 font-medium leading-relaxed">
                In under 60 seconds, your animated photo is ready. Download the high-res MP4 to share with family and cherish forever.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}