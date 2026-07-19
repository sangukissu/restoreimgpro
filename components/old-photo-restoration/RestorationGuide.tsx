import React from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Layers, ScanLine } from "lucide-react"
import { FEATURE_CREDIT_COSTS, formatCredits } from "@/lib/pricing"
import { LIMITATIONS_COPY, PRIVACY_COPY } from "@/lib/site-copy"

/**
 * Flagship restoration content: modes, damage coverage, limits, inputs, next steps.
 */
export function RestorationGuide() {
  return (
    <section id="restoration-guide" className="w-full px-4 sm:px-8 py-20 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto space-y-10">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-3">
            How restoration works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-black leading-[1.1]">
            Two clear modes. One credit. Original kept visible.
          </h2>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Each restoration costs {formatCredits(FEATURE_CREDIT_COSTS.restore.credits)}. Choose whether to keep
            the original character or add color — color is never forced.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
              <ScanLine size={22} />
            </div>
            <h3 className="text-xl font-extrabold mb-2">Restore only</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Keep the original black-and-white, sepia, or color look. Best when the memory is the tonality itself —
              not a modern reinterpretation.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
              <Layers size={22} />
            </div>
            <h3 className="text-xl font-extrabold mb-2">Restore and colorize</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              Repair damage, then add AI color as an <strong>interpretation</strong> — not historical proof of
              original dyes. Prefer restore-only when accuracy of character matters more than color.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-brand-surface rounded-3xl p-8">
            <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-brand-orange" size={20} />
              Damage we can improve
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm font-medium">
              <li>Scratches, creases, and tears</li>
              <li>Fading and yellowing</li>
              <li>Water marks and surface stains</li>
              <li>Blur and soft focus (within limits)</li>
              <li>Scan glare and grain (often)</li>
            </ul>
          </div>
          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100">
            <h3 className="text-lg font-extrabold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={20} />
              What AI may change
            </h3>
            <p className="text-gray-800 text-sm font-medium leading-relaxed mb-3">
              {LIMITATIONS_COPY.faces}
            </p>
            <p className="text-gray-700 text-sm font-medium leading-relaxed">
              {LIMITATIONS_COPY.colorize}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-black/5">
            <h3 className="text-lg font-extrabold mb-4">Best inputs</h3>
            <ul className="space-y-2 text-gray-700 text-sm font-medium">
              <li>Flat scan of the print when possible</li>
              <li>Phone scan on a dark mat, even light</li>
              <li>Avoid strong reflections from glass frames</li>
              <li>Higher detail helps; upload the clearest file you have</li>
            </ul>
            <p className="mt-4 text-xs text-gray-500 leading-relaxed">
              Print quality depends on input resolution and damage. Check downloaded pixel dimensions before
              ordering large prints — we do not claim blanket “8K” or universal “300 DPI.”
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-black/5">
          <h3 className="text-lg font-extrabold mb-3">When not to use AI restoration alone</h3>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700 font-medium">
            <li>Unique physical artifacts that need a conservator</li>
            <li>Legal, forensic, or evidentiary images</li>
            <li>Photos where almost no face structure remains</li>
            <li>When you need color that is historically proven</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">{PRIVACY_COPY.short}</p>
        </div>

        <div>
          <h3 className="text-xl font-extrabold mb-4">Optional next steps</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/ai-photo-animation"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Add subtle motion
            </Link>
            <Link
              href="/add-person-to-photo"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Add a person
            </Link>
            <Link
              href="/ai-family-portrait"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Family portrait
            </Link>
            <Link
              href="/family-memory-book"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Memory Book
            </Link>
            <Link
              href="/examples"
              className="rounded-full bg-brand-black text-white px-5 py-2.5 text-sm font-bold"
            >
              See example repairs
            </Link>
            <Link
              href="/guides"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Guides
            </Link>
            <Link
              href="/restoration-benchmark"
              className="rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
            >
              Benchmark method
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
