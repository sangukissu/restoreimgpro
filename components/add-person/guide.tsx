"use client"

import React from "react"
import Link from "next/link"
import { CheckCircle2, AlertTriangle, Camera, ShieldAlert, Sparkles, ArrowRight, UserPlus, Image as ImageIcon } from "lucide-react"
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
              <span className="text-brand-orange">//</span> Practical Family Photo Guide <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Two Easy Ways to Combine <br />
              <span className="text-gray-400">Family Photo with AI</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Each run costs {formatCredits(FEATURE_CREDIT_COSTS.addPerson.credits)}. Learn how to pick the best source photos for the most authentic result.
            </p>
          </div>
        </div>

        {/* Main Content: Nested Container Architecture */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2rem] space-y-3">

          {/* Row 1: Plain English Ways to Edit */}
          <div className="grid md:grid-cols-2 gap-3">
            {/* Way 1 */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <UserPlus size={24} />
                  </div>
                  <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Option 1
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Add a Person into an Existing Group Photo</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Place a missing family member directly into an existing gathering shot (like a wedding, holiday dinner, or family reunion). The AI calculates height scaling and ground shadow placement automatically.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-brand-orange" />
                Keeps Original Room &amp; Background Intact
              </div>
            </div>

            {/* Alternative Workflow: AI Family Portrait */}
            <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-gray-200 transition-all duration-300">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface border border-gray-100 text-brand-orange flex items-center justify-center shadow-sm">
                    <ImageIcon size={24} />
                  </div>
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Separate Tool
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Need to Combine Multiple Separate Pictures?</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base mb-4">
                  If you don&apos;t have an existing group scene and want to combine several individual portraits into an entirely new group portrait from scratch, use our dedicated AI Family Portrait generator.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/ai-family-portrait"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:text-brand-black transition-colors"
                >
                  <span>Explore AI Family Portrait</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Row 2: 3-Column Guidelines Grid */}
          <div className="grid lg:grid-cols-3 gap-3">
            {/* Column 1: Best Source Photos */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Best Source Photos to Upload</h3>
                <ul className="space-y-3 text-gray-600 text-sm font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Clear, front-facing portrait of the person to add
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Group photo with a natural gap or space
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Similar lighting direction when possible
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Original high-resolution scans over blurry screenshots
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Automatic Blending Details */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">What Our AI Handles Automatically</h3>
                <div className="space-y-3 text-gray-600 text-sm font-medium leading-relaxed">
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Matches skin color tones and room light brightness across all faces in the group.
                  </p>
                  <p className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    Equalizes photo grain so the added subject looks like they were shot with the exact same camera.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Tips */}
            <div className="bg-white rounded-[1.8rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <Camera size={20} />
                </div>
                <h3 className="text-xl font-extrabold text-brand-black mb-4">Quick Preparation Tips</h3>
                <ul className="space-y-2.5 text-gray-600 text-sm font-medium mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    If the source photo is damaged, restore it first
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Avoid tiny low-res social media thumbnails
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-orange font-bold">•</span>
                    Make sure the face isn't hidden by hands or hats
                  </li>
                </ul>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                Always review the side-by-side result in your private dashboard before downloading.
              </p>
            </div>
          </div>

          {/* Row 3: Adding Someone Who Has Passed Away? (Contextual Memorial Section) */}
          <div className="bg-white rounded-[1.8rem] p-8 lg:p-10 border border-gray-100 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-brand-black">Adding someone who has passed away?</h3>
                  <p className="text-sm text-gray-500 font-medium">Respectful guidelines and dedicated memorial workflows</p>
                </div>
              </div>

            </div>

            <p className="text-gray-600 font-medium leading-relaxed text-base mb-6 max-w-4xl">
              Adding a late parent or grandparent to an existing wedding, holiday, or family photo is one of the most meaningful uses of BringBack. If your source photo is vintage or worn, restore damaged prints first to preserve a true likeness before insertion. For step-by-step guidance on honoring lost relatives with balanced lighting and respectful likeness preservation, learn how to{" "}
              <Link
                href="/features/add-deceased-loved-one-to-photo"
                className="text-brand-orange font-bold hover:underline"
              >
                add a deceased loved one to a photo
              </Link>.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 font-medium">
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Family Consent</span>
                Ensure family members are comfortable with creating memorial keepsakes.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Likeness Check</span>
                Compare results side-by-side in your dashboard before downloading or printing.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Restore Damaged First</span>
                Run torn or blurry old prints through restoration first for sharp facial features.
              </div>
              <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100">
                <span className="block text-brand-orange font-bold text-xs uppercase mb-1">Private &amp; Secure</span>
                Photos remain private to your account and are never used to train public AI models.
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
                <span>See Use Cases</span>
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
                href="/features/add-deceased-loved-one-to-photo"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Add Deceased Loved One
              </Link>
              <Link
                href="/family-memory-book"
                className="rounded-full bg-brand-surface border border-gray-200 px-4 py-2 text-sm font-bold text-brand-black hover:border-brand-orange hover:bg-white transition-all"
              >
                Family Memory Book
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
