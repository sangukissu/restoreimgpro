import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { BRAND } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How BringBack evaluates product quality, writes public claims, and sources preservation guidance. Links to benchmark, editorial policy, and primary archives.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Methodology | BringBack",
    description: "Evaluation, claims standards, and preservation sources.",
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
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight">Methodology</h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: July 19, 2026</p>

        <div className="mt-10 space-y-10 text-gray-700 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Product evaluation</h2>
            <p>
              Restoration quality is discussed using explicit dimensions (identity drift, damage
              repair, texture, unwanted colorization, artifacts). See the{" "}
              <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
                restoration benchmark
              </Link>{" "}
              for demo cases and scoring definitions. We show failures and limitations, not only
              polished winners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Public claims</h2>
            <p>
              Credit costs and plan prices must match production checkout. Privacy language must match
              actual retention. Marketing does not invent testimonials or aggregate ratings. Full
              rules:{" "}
              <Link href="/editorial-policy" className="underline font-semibold text-brand-black">
                editorial policy
              </Link>
              .
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
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Updates</h2>
            <p>
              Model or pipeline changes that affect public demos will be dated on the benchmark page.
              Corrections:{" "}
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
