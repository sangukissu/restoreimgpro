import React from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Layers, ScanLine, Camera, ShieldAlert, Sparkles, ArrowRight } from "lucide-react"
import { FEATURE_CREDIT_COSTS, formatCredits } from "@/lib/pricing"
import { LIMITATIONS_COPY, PRIVACY_COPY } from "@/lib/site-copy"

/**
 * Flagship restoration content: modes, damage coverage, limits, inputs, next steps.
 * Designed with the premium nested container system (split header, bg-brand-surface container, white cards).
 */
export function RestorationGuide() {
  return (
    <section id="restoration-guide" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Restoration Guide <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Two Clear Modes. <br />
              <span className="text-gray-400">One Transparent Approach.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each restoration costs {formatCredits(FEATURE_CREDIT_COSTS.restore.credits)}. Choose whether to keep the authentic character or add color — color is never forced.
            </p>
          </div>
        </div>

        {/* Main Content: Nested Container Architecture */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem] space-y-3">
          
          {/* Row 1: Restoration Modes */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Mode 1 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <ScanLine size={24} />
                  </div>
                  <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Mode 1
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Restore Only</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Repair visible damage while keeping the source photo black-and-white, sepia, or in its existing color treatment. Choose this when preserving the familiar look matters more than adding color.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-brand-orange" />
                Keeps the Source Color Treatment
              </div>
            </div>

            {/* Mode 2 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <Layers size={24} />
                  </div>
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Mode 2
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Restore & Colorize</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Repair visible damage, then add AI-generated color as an interpretation—not historical proof of the original clothing, skin, or background colors.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Sparkles size={14} className="text-brand-orange" />
                Optional Interpreted Color
              </div>
            </div>
          </div>

          {/* Row 2: 3-Column Guidelines & Expectations Grid */}
          <div className="grid lg:grid-cols-3 gap-3">
            {/* Column 1: Coverage */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Damage the Tool Can Address</h3>
                <ul className="space-y-3 text-gray-600 text-sm font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Scratches, creases, and folding cracks
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Fading and sepia yellowing
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Water marks and mold spots
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Soft focus and motion blur
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Scan glare and heavy film grain
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Limitations */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">What AI May Change</h3>
                <div className="space-y-3 text-gray-600 text-sm font-medium leading-relaxed">
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {LIMITATIONS_COPY.faces}
                  </p>
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    {LIMITATIONS_COPY.colorize}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Best Inputs */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Best Scan Practices</h3>
                <ul className="space-y-2.5 text-gray-600 text-sm font-medium mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Flat scan of the print when possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Phone scan on a dark background with even light
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Avoid strong glass frame reflections
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Upload the highest resolution file available
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                Print quality depends on input resolution. Check downloaded pixel dimensions before ordering large prints.
              </p>
            </div>
          </div>

          {/* Row 3: Ethical & Practical Constraints */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-black">When Not to Use AI Restoration</h3>
                <p className="text-xs text-gray-500 font-medium">Know when professional physical conservation is required</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 font-medium">
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Physical Artifacts</span>
                Fragile prints requiring museum conservators
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Legal Evidentiary</span>
                Forensic or court evidentiary images
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Destroyed Details</span>
                Photos where facial structures are completely lost
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Historical Records</span>
                When exact chemical dye proof is required
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-4">{PRIVACY_COPY.short}</p>
          </div>

          {/* Row 4: Related Tools & Navigation Cloud */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-brand-black">Explore Related Tools & Guides</h3>
                <p className="text-sm text-gray-500 font-medium">Continue editing or discover specialized workflows</p>
              </div>
              <Link
                href="/examples"
                className="inline-flex items-center gap-2 rounded-full bg-brand-black text-white px-5 py-2.5 text-sm font-bold hover:bg-gray-800 transition-colors self-start sm:self-auto"
              >
                <span>See Example Repairs</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/colorize-photos"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Colorize Photos
              </Link>
              <Link
                href="/denoise-photos"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Denoise & Unblur
              </Link>
              <Link
                href="/ai-photo-animation"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Add Subtle Motion
              </Link>
              <Link
                href="/add-person-to-photo"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Add Person to Photo
              </Link>
              <Link
                href="/ai-family-portrait"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Family Portrait AI
              </Link>
              <Link
                href="/family-memory-book"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Family Memory Book
              </Link>
              <Link
                href="/guides"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Restoration Guides
              </Link>
              <Link
                href="/restoration-benchmark"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Benchmark Method
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
