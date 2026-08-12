import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { BRAND } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: "How We Compare Photo Restoration Tools & Write Public Claims | Methodology",
  description:
    "How BringBack researches photo-tool comparisons, verifies pricing and privacy claims, records updates, and separates editorial research from restoration output testing.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Comparison & claims methodology | BringBack",
    description:
      "How we research competitors, verify pricing, and write public claims for AI photo restoration comparisons.",
    url: "https://bringback.pro/methodology",
    type: "website",
  },
}

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[800px] mx-auto px-4 sm:px-8">
        <SiteBreadcrumb items={[{ name: "About", href: "/about" }, { name: "Methodology" }]} />
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight">
          How we research comparisons and write public claims
        </h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: August 12, 2026</p>
        <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed">
          This page explains how we research tools, verify public facts, write comparisons, and
          correct outdated information. Restoration output is evaluated separately on the{" "}
          <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
            restoration benchmark
          </Link>
          , which defines identity drift, damage repair, and demo rows on owned assets.
        </p>

        <div className="mt-10 space-y-10 text-gray-700 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              What this methodology covers
            </h2>
            <p>
              It covers competitor research, pricing checks, privacy language, evidence standards,
              review dates, and corrections. Product output scoring and before/after demo notes are
              maintained on the benchmark page so factual research and visual evaluation remain distinct.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              Comparison research protocol
            </h2>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Define the user&apos;s task.</strong> File repair vs visual restore,
                multi-tool suite vs specialist, API platform vs consumer studio, generator vs
                photoreal portrait—state the job first.
              </li>
              <li>
                <strong>Read primary public sources.</strong> Pricing pages, FAQs, tool docs, privacy
                policies. Prefer operator-published numbers over third-party blogs.
              </li>
              <li>
                <strong>Date the review.</strong> Comparison pages show a last-updated date. Competitor
                prices change; readers are told to verify before buying.
              </li>
              <li>
                <strong>Admit competitor wins.</strong> Every serious comparison includes when the
                other product is the better pick (API, corrupt files, style packs, etc.).
              </li>
              <li>
                <strong>Describe the evidence accurately.</strong> A review of public pages is not a
                controlled product test. Hands-on notes use owned images and state the limits of the sample.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              How we handle public claims
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5">
                <h3 className="font-extrabold text-brand-black mb-2">Claims we can publish</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  <li>Published pricing and credit rules (with “verify live”)</li>
                  <li>Product shape / intended user differences</li>
                  <li>Observable outcomes (plastic skin, identity drift, openable vs corrupt file)</li>
                  <li>BringBack production costs from{" "}
                    <Link href="/pricing" className="underline font-semibold">pricing</Link>
                  </li>
                  <li>Links to methodology, benchmark, privacy, editorial policy</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
                <h3 className="font-extrabold text-brand-black mb-2">Claims we do not publish</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm">
                  <li>Star ratings, user counts, or test volumes without a verifiable source</li>
                  <li>Privacy promises the pipeline does not meet (e.g. blanket “deleted in 30 minutes”)</li>
                  <li>Per-use prices that cannot be reproduced from the current public packs</li>
                  <li>Unsourced “users often complain” as evidence</li>
                  <li>Claiming competitor model architectures we cannot verify</li>
                  <li>Implying a competitor is “unsafe” without their published policy language</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm">
              Full marketing rules:{" "}
              <Link href="/editorial-policy" className="underline font-semibold text-brand-black">
                editorial policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              Pricing verification rules
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                BringBack packs must match production: Starter $4.99 / 4 credits, Value $9.99 / 20,
                Family $21.99 / 60; restore = 1 credit; family portrait = 2; animation = 10.
              </li>
              <li>
                When unit pricing is useful, show the calculation. The Family Pack currently works
                out to about <strong>$0.37 per one-credit restoration</strong> ($21.99 ÷ 60).
              </li>
              <li>
                Competitor prices are quoted as “publicly listed as of [date]” with currency caveats
                when locales differ.
              </li>
              <li>If a competitor price is not public, we write “we could not verify.”</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              Privacy language rules
            </h2>
            <p>
              Public copy must match{" "}
              <Link href="/privacy" className="underline font-semibold text-brand-black">
                Privacy Policy
              </Link>
              : processing for the requested feature; generated media in the user account until
              deleted; temporary staging cleaned when processing completes; no general-purpose model
              training on family photos. We do not claim zero retention or auto-delete of My Media
              outputs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              Product evaluation (pointer only)
            </h2>
            <p>
              Restoration quality dimensions—identity drift, damage repair, texture, unwanted
              colorization, artifacts—and owned demo rows are defined on the{" "}
              <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
                restoration benchmark
              </Link>
              . Comparison pages may link there; they should not restate the full rubric.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">
              Preservation guidance sources
            </h2>
            <p className="mb-3">
              When we mention safe digitization or physical handling, we stick to safety-first
              guidance and primary sources such as:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <a
                  href="https://www.archives.gov/preservation/family-archives/digitizing"
                  className="underline font-semibold text-brand-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  US National Archives — digitizing family papers and photographs
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitizationguidelines.gov/guidelines/digitize-technical.html"
                  className="underline font-semibold text-brand-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  FADGI technical guidelines
                </a>
              </li>
            </ul>
            <p className="mt-3">
              We do not offer professional paper conservation advice beyond those safety-first
              references.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Update cadence</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Frequently visited comparison pages: review when competitor pricing or our packs change, and schedule a periodic check at least quarterly.</li>
              <li>Guides: update when product credit costs, workflow, or safety guidance changes.</li>
              <li>Benchmark demos: date the page when production models change.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Using this work as a source</h2>
            <p>
              This methodology can support statements about our research standards. The{" "}
              <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
                restoration benchmark
              </Link>{" "}
              contains scoring definitions and owned demos, while dated comparison pages record
              product and pricing observations. When referencing a page, include BringBack, the page
              URL, and an access date. Corrections:{" "}
              <a href={`mailto:${BRAND.supportEmail}`} className="underline font-semibold text-brand-black">
                {BRAND.supportEmail}
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
