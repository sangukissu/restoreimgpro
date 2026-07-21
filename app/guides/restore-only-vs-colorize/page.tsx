import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { Layers, ScanLine, AlertCircle, CheckCircle2, Palette, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Restore-Only vs AI Colorization: Which Workflow Should You Choose? | BringBack",
  description:
    "Compare Restore-Only vs Restore + Colorize workflows for old photos. Learn when keeping black-and-white or sepia tonality is superior for historical preservation.",
  alternates: { canonical: "/guides/restore-only-vs-colorize" },
}

export default function RestoreVsColorizePage() {
  return (
    <GuideLayout
      title="Restore-Only vs Colorize: How to Choose the Right Workflow"
      description="Color is never forced in BringBack. Understand the technical and historical differences between preserving monochrome chemical tonality and adding AI-synthesized color."
      updated="July 21, 2026"
      crumbs={[{ name: "Restore-only vs colorize" }]}
    >
      <div className="space-y-10">

        {/* Overview Box */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-extrabold text-brand-black mb-3">The Fundamental Rule: Color is an Interpretation</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            Black-and-white photographic silver prints do not contain hidden color signals in their emulsion. When AI colorizes an old photo, it is <strong>estimating likely colors</strong> based on luminance patterns and deep learning datasets—not recovering lost historical dyes.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode 1: Restore-Only */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-surface text-brand-black flex items-center justify-center mb-6">
                <ScanLine size={24} />
              </div>
              <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Mode 1: Historical Preservation
              </span>
              <h3 className="text-2xl font-extrabold text-brand-black mt-3 mb-3">Restore Only (Monochrome)</h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">
                Fixes scratches, tears, fading, water stains, and soft blur while leaving the underlying black-and-white, silver gelatin, or sepia chemical tint untouched.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Best Used When:</h4>
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    Preserving authentic historical feel and chemical character is paramount.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    You plan to archive or frame a faithful version alongside the physical print.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    Family members disagree on eye, hair, or clothing colors.
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/old-photo-restoration"
              className="inline-flex items-center justify-between w-full bg-brand-surface hover:bg-gray-100 px-5 py-3 rounded-2xl text-sm font-bold text-brand-black transition-colors"
            >
              <span>Use Restore-Only Tool</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Mode 2: Restore & Colorize */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6">
                <Palette size={24} />
              </div>
              <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Mode 2: Modern Interpretation
              </span>
              <h3 className="text-2xl font-extrabold text-brand-black mt-3 mb-3">Restore & Colorize</h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mb-4">
                Repairs physical damage and then applies realistic AI color spectrum synthesis over grayscale tones to transform vintage photos into vibrant modern images.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Best Used When:</h4>
                <ul className="space-y-2 text-sm text-gray-700 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    Creating a vivid gift, digital frame display, or social memory book.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    Helping younger family members connect emotionally with ancestors.
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
                    You explicitly label the final print as an AI-assisted colorization.
                  </li>
                </ul>
              </div>
            </div>

            <Link
              href="/colorize-photos"
              className="inline-flex items-center justify-between w-full bg-brand-surface hover:bg-gray-100 px-5 py-3 rounded-2xl text-sm font-bold text-brand-black transition-colors"
            >
              <span>Use Colorize Tool</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Section: What AI Color May Invent */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-brand-black">What AI Colorization May Estimate</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            AI colorizers infer colors from brightness values. For example, dark gray in a 1940s suit could be navy blue, dark brown, or charcoal gray. The AI selects the statistically most common color present in its training dataset.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 text-sm font-medium">
              <span className="block font-bold text-brand-black mb-1">Eye & Hair Color:</span>
              Dark brown vs hazel eyes may map to generic brown shades. Verify with family members when color accuracy matters.
            </div>
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 text-sm font-medium">
              <span className="block font-bold text-brand-black mb-1">Military & Formal Uniforms:</span>
              Historical military uniforms have strict regulated colors that generic AI datasets may misidentify.
            </div>
          </div>
        </div>

        {/* Ethical Tip */}
        <div className="bg-amber-50 p-6 rounded-3xl border border-amber-200 flex items-start gap-4 text-amber-950">
          <AlertCircle size={24} className="text-amber-600 shrink-0 mt-1" />
          <div className="text-sm font-medium space-y-1">
            <h4 className="font-extrabold text-amber-900">Archival Ethics Tip</h4>
            <p>
              Always archive the un-colorized original scan (or a Restore-Only version) alongside any colorized output. This preserves the genuine physical record for future generations.
            </p>
          </div>
        </div>

      </div>
    </GuideLayout>
  )
}
