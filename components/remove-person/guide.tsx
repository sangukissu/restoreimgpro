"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, Camera, ShieldAlert, Sparkles, ArrowRight, UserX, Wand2 } from "lucide-react"
import { FEATURE_CREDIT_COSTS, formatCredits } from "@/lib/pricing"
import { PRIVACY_COPY } from "@/lib/site-copy"

export function RemovePersonGuide() {
  return (
    <section id="remove-person-guide" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Technical Removal Guide <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Two Inpainting Modes. <br />
              <span className="text-gray-400">Zero Smudges or Ghost Outlines.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each run uses {formatCredits(FEATURE_CREDIT_COSTS.removePerson.credits)}. Learn how generative inpainting extrapolates background geometry.
            </p>
          </div>
        </div>

        {/* Main Content: Nested Container Architecture */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem] space-y-3">
          
          {/* Row 1: Removal Modes */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Mode 1 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <UserX size={24} />
                  </div>
                  <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Workflow 1
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Figure &amp; Person Erasure</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Remove specific individuals, photobombers, or background strangers. The AI cuts out the figure mask cleanly and fills the missing area using surrounding scene context.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-brand-orange" />
                Preserves Main Subjects Intact
              </div>
            </div>

            {/* Mode 2 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <Wand2 size={24} />
                  </div>
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Workflow 2
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Background Decluttering</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Remove distracting objects such as telephone poles, trash cans, parked cars, or stray furniture from vintage photos to focus attention on the main subjects.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Sparkles size={14} className="text-brand-orange" />
                Generative Pattern Extrapolation
              </div>
            </div>
          </div>

          {/* Row 2: 3-Column Guidelines Grid */}
          <div className="grid lg:grid-cols-3 gap-3">
            {/* Column 1: Ideal Scenarios */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Ideal Removal Scenarios</h3>
                <ul className="space-y-3 text-gray-600 text-sm font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Distinct figures standing side-by-side
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Backgrounds with clear pattern samples
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Vacation photobombers at landmarks
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Stray background clutter &amp; signs
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: What AI Inpaints */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">What AI Inpaints</h3>
                <div className="space-y-3 text-gray-600 text-sm font-medium leading-relaxed">
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Rebuilds hidden brickwork, wood paneling, foliage, or sky gradients behind the erased subject.
                  </p>
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Harmonizes film grain and lighting so the inpainted area has zero visible seams.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Known Limitations */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Known Limitations</h3>
                <ul className="space-y-2.5 text-gray-600 text-sm font-medium mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Tightly overlapping faces holding hands
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Very dense, moving crowds
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Heavily compressed or low-res images
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                Review the result side-by-side before downloading. Originals are always preserved untouched.
              </p>
            </div>
          </div>

          {/* Row 3: Privacy & Original Preservation */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-black">Privacy &amp; Original Preservation</h3>
                <p className="text-xs text-gray-500 font-medium">Safe digital image editing principles</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 font-medium">
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Original Preserved</span>
                Your original uploaded image is never overwritten.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Private Media Storage</span>
                Files stay in your dashboard until you delete them.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">No AI Training</span>
                Family photos are never used to train external models.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Non-Evidentiary</span>
                Edits are for personal keepsakes and archives.
              </div>
            </div>
            <p className="mt-6 text-xs text-gray-400 border-t border-gray-100 pt-4">{PRIVACY_COPY.short}</p>
          </div>

          {/* Row 4: Related Tools Navigation Cloud */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-brand-black">Explore Related Tools &amp; Guides</h3>
                <p className="text-sm text-gray-500 font-medium">Continue editing or discover specialized workflows</p>
              </div>
              <Link
                href="/examples"
                className="inline-flex items-center gap-2 rounded-full bg-brand-black text-white px-5 py-2.5 text-sm font-bold hover:bg-gray-800 transition-colors self-start sm:self-auto"
              >
                <span>See Example Inpainting</span>
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/old-photo-restoration"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Restore Old Photos
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
                AI Family Portrait
              </Link>
              <Link
                href="/family-memory-book"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Family Memory Book
              </Link>
              <Link
                href="/denoise-photos"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Unblur &amp; Sharpen
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
