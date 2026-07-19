import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import {
  COMPARE_NICHE_LABELS,
  listComparePages,
  listComparePagesByNiche,
  type CompareNiche,
} from "@/lib/comparedata"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "BringBack vs other photo tools — full comparison hub",
  description:
    "Compare BringBack to Remini, MyHeritage, PixReunion, VanceAI, and more. One-time credits, family photo restoration, animation, and reunite tools — no forced subscription.",
  alternates: { canonical: "/compare" },
  openGraph: {
    title: "Compare BringBack to other photo tools",
    description:
      "Browse every BringBack vs competitor comparison for restoration, animation, and family portrait tools.",
    url: "https://bringback.pro/compare",
    type: "website",
    siteName: "BringBack",
  },
  robots: { index: true, follow: true },
}

const NICHE_ORDER: CompareNiche[] = ["restoration", "animation", "merging"]

export default function CompareHubPage() {
  const byNiche = listComparePagesByNiche()
  const all = listComparePages()

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BringBack comparison hub",
    description:
      "Comparisons of BringBack with other photo restoration, animation, and family portrait tools.",
    url: "https://bringback.pro/compare",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: all.length,
      itemListElement: all.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `BringBack vs ${p.competitor}`,
        url: `https://bringback.pro${p.href}`,
      })),
    },
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8">
          <SiteBreadcrumb items={[{ name: "Compare" }]} />

          <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight leading-[1.05] max-w-3xl">
            BringBack vs other photo tools
          </h1>
          <p className="mt-5 text-lg text-gray-600 font-medium leading-relaxed max-w-2xl">
            Looking for a Remini alternative, a MyHeritage photo tool without a genealogy package,
            or a simpler way to restore and reunite family photos? Browse every comparison below.
            BringBack is pay-once credits — no forced subscription.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/old-photo-restoration"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF4D00] text-white px-5 py-2.5 text-sm font-bold"
            >
              Try restoration <ArrowRight size={16} />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold"
            >
              Pricing
            </Link>
          </div>

          <p className="mt-10 text-sm text-gray-500 font-medium">
            {all.length} comparisons · jump to a section or pick a tool
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {NICHE_ORDER.map((niche) => (
              <a
                key={niche}
                href={`#${niche}`}
                className="rounded-full bg-white border border-black/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 hover:border-brand-orange"
              >
                {COMPARE_NICHE_LABELS[niche]}
              </a>
            ))}
            <a
              href="#all-tools"
              className="rounded-full bg-brand-black text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-black/90"
            >
              A–Z list
            </a>
          </div>

          <div className="mt-10 space-y-14">
            {NICHE_ORDER.map((niche) => {
              const pages = byNiche[niche]
              if (!pages.length) return null
              return (
                <section key={niche} id={niche}>
                  <h2 className="text-2xl font-extrabold tracking-tight text-brand-black mb-2">
                    {COMPARE_NICHE_LABELS[niche]}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mb-5">
                    {pages.length} tool{pages.length === 1 ? "" : "s"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pages.map((page) => (
                      <Link
                        key={page.slug}
                        href={page.href}
                        className="group bg-white rounded-2xl border border-black/5 p-6 shadow-sm hover:border-brand-orange/40 hover:shadow-md transition-all"
                      >
                        <div className="text-xs font-bold uppercase tracking-wide text-brand-orange mb-2">
                          Alternative
                        </div>
                        <h3 className="text-xl font-extrabold text-brand-black group-hover:text-brand-orange transition-colors flex items-center gap-2">
                          BringBack vs {page.competitor}
                          <ArrowRight
                            size={18}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          />
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed line-clamp-3">
                          {page.description}
                        </p>
                        <span className="mt-4 inline-block text-sm font-bold text-brand-black underline underline-offset-4 decoration-brand-orange/40">
                          Read comparison
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          <section id="all-tools" className="mt-16 scroll-mt-24">
            <h2 className="text-2xl font-extrabold tracking-tight mb-4">All tools (A–Z)</h2>
            <div className="flex flex-wrap gap-2">
              {[...all]
                .sort((a, b) => a.competitor.localeCompare(b.competitor))
                .map((page) => (
                  <Link
                    key={page.slug}
                    href={page.href}
                    className="rounded-full bg-white border border-black/10 px-4 py-2 text-sm font-bold text-gray-800 hover:border-brand-orange hover:text-brand-orange"
                  >
                    vs {page.competitor}
                  </Link>
                ))}
            </div>
          </section>

          <div className="mt-16 rounded-3xl bg-brand-surface p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              What makes BringBack different
            </h2>
            <ul className="space-y-2 text-gray-700 font-medium">
              <li>Pay-once credit packs from $4.99 — no forced subscription</li>
              <li>Original-first restore (keep B&amp;W/sepia or colorize only when you choose)</li>
              <li>Side-by-side comparison before download</li>
              <li>Restore → reunite → animate → private Memory Book in one workspace</li>
            </ul>
            <Link
              href="/features"
              className="mt-6 inline-flex items-center gap-2 font-bold text-brand-black hover:text-brand-orange"
            >
              See all features <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
