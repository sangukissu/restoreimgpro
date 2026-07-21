"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, Camera, ShieldAlert, Sparkles, ArrowRight, Layers, UserPlus } from "lucide-react"
import { FEATURE_CREDIT_COSTS, formatCredits } from "@/lib/pricing"
import { PRIVACY_COPY } from "@/lib/site-copy"

export function AddPersonGuide() {
  return (
    <section id="add-person-guide" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Technical Compositing Guide <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Two Compositing Approaches. <br />
              <span className="text-gray-400">One Seamless Family Result.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each run uses {formatCredits(FEATURE_CREDIT_COSTS.addPerson.credits)}. Understand reference selection, lighting harmonization, and practical limitations.
            </p>
          </div>
        </div>

        {/* Main Content: Nested Container Architecture */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem] space-y-3">
          
          {/* Row 1: Compositing Modes */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Mode 1 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <UserPlus size={24} />
                  </div>
                  <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Workflow 1
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Target Scene Insertion</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Insert a missing person into an existing group photo (such as a wedding, reunion, or holiday snapshot). The AI scales the body, calculates ground shadow placement, and matches surrounding room lighting.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-brand-orange" />
                Preserves Target Background Architecture
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
                    Workflow 2
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Multi-Portrait Synthesis</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Combine separate individual studio portraits taken across different decades into a unified family portrait. Ideal for genealogy archives when no single group photo exists.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Sparkles size={14} className="text-brand-orange" />
                Equalizes Film Noise Across Eras
              </div>
            </div>
          </div>

          {/* Row 2: 3-Column Guidelines & Expectations Grid */}
          <div className="grid lg:grid-cols-3 gap-3">
            {/* Column 1: Best Practice Inputs */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Best Input Practices</h3>
                <ul className="space-y-3 text-gray-600 text-sm font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Clear, front-facing reference face
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Target photo with natural physical gap
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Similar lighting direction when possible
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    High resolution scans over 300 DPI
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: What AI Harmonizes */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">What AI Harmonizes</h3>
                <div className="space-y-3 text-gray-600 text-sm font-medium leading-relaxed">
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Matches skin color spectrum and room lighting cast across all faces in the group.
                  </p>
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Equalizes film noise and digital grain so the added subject does not look unrealistically smooth.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Scan & Resolution Tips */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Reference Prep Tips</h3>
                <ul className="space-y-2.5 text-gray-600 text-sm font-medium mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Restore damaged reference photos first
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Avoid low-resolution social media thumbnails
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Ensure the face is not blocked by hats or hands
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                Always review the result side-by-side in your dashboard. If identity feels wrong, do not force a download.
              </p>
            </div>
          </div>

          {/* Row 3: Ethical & Memorial Guidelines */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-black">Ethical &amp; Memorial Guidelines</h3>
                <p className="text-xs text-gray-500 font-medium">Respectful family photo editing principles</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 font-medium">
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Consent &amp; Family Respect</span>
                Ensure surviving relatives are comfortable with memorial composites.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Non-Evidentiary Use</span>
                Composites are for private family keepsakes—not legal records.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Identity Safeguards</span>
                AI preserves facial landmarks without synthetic face-swapping.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Private Archiving</span>
                Files remain private in your dashboard until you delete them.
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
                <span>See Example Composites</span>
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
                href="/remove-person-from-photo"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Remove Person from Photo
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
                href="/guides/choose-source-photos-for-likeness"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Likeness Selection Guide
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
