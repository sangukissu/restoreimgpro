import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { FEATURE_CREDIT_COSTS, formatCredits } from "@/lib/pricing"
import { DASHBOARD_CTA, POSITIONING } from "@/lib/site-copy"
import { ArrowRight } from "lucide-react"
import urlPolicy from "@/config/url-policy.json"

export const metadata: Metadata = {
  title: "Features — Family Photo Preservation Tools",
  description:
    "Restore damage, reunite people, add subtle motion, and preserve stories. See credit costs and open each BringBack tool.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "BringBack Features",
    description: POSITIONING.publicPromise,
    url: "https://bringback.pro/features",
  },
}

const FEATURES = [
  {
    title: "Old photo restoration",
    href: "/old-photo-restoration",
    dashboard: DASHBOARD_CTA.restore,
    cost: FEATURE_CREDIT_COSTS.restore.credits,
    blurb: "Repair scratches, tears, fading, and blur while choosing restore-only or restore + colorize.",
  },
  {
    title: "AI photo animation",
    href: "/ai-photo-animation",
    dashboard: DASHBOARD_CTA.animate,
    cost: FEATURE_CREDIT_COSTS.animate.credits,
    blurb: "Add a subtle smile or gentle movement to a clear portrait.",
  },
  {
    title: "AI family portrait",
    href: "/ai-family-portrait",
    dashboard: DASHBOARD_CTA.familyPortrait,
    cost: FEATURE_CREDIT_COSTS.familyPortrait.credits,
    blurb: "Combine separate photos into one natural group portrait.",
  },
  {
    title: "Add person to photo",
    href: "/add-person-to-photo",
    dashboard: DASHBOARD_CTA.addPerson,
    cost: FEATURE_CREDIT_COSTS.addPerson.credits,
    blurb: "Insert a loved one into an existing family photo.",
  },
  {
    title: "Remove person from photo",
    href: "/remove-person-from-photo",
    dashboard: DASHBOARD_CTA.removePerson,
    cost: FEATURE_CREDIT_COSTS.removePerson.credits,
    blurb: "Remove an unwanted person and rebuild the background.",
  },
  {
    title: "Family Memory Book",
    href: "/family-memory-book",
    dashboard: DASHBOARD_CTA.memoryBook,
    cost: FEATURE_CREDIT_COSTS.memoryBook.credits,
    blurb: "Private keepsake for restored photos, names, and stories (Family pack).",
  },
  {
    title: "Colorize photos",
    href: "/colorize-photos",
    dashboard: DASHBOARD_CTA.restore,
    cost: FEATURE_CREDIT_COSTS.colorize.credits,
    blurb: "Optional colorization when you explicitly want color, not for every restore.",
  },
  {
    title: "Denoise photos",
    href: "/denoise-photos",
    dashboard: DASHBOARD_CTA.restore,
    cost: FEATURE_CREDIT_COSTS.denoise.credits,
    blurb: "Reduce grain and scan noise on old or digital photos.",
  },
]

/**
 * Keyword-specific landing pages, re-linked 2026-08-09.
 *
 * These were orphaned on 2026-07-19 when they were 301'd to the money pages
 * above. The redirects are now reverted (see next.config.js), so the hub links
 * to them again — without internal links they would be sitemap-only, which
 * starves them of crawl priority and internal PageRank. Anchor text matches
 * each page's target query on purpose.
 */
const USE_CASE_PAGES = [
  {
    href: "/features/add-deceased-loved-one-to-photo",
    label: "Add a deceased loved one to a photo",
  },
  { href: "/features/photo-joiner", label: "Join old photos together online" },
  { href: "/app/back-to-life-photo-app", label: "Back to life photo app" },
  // Retired paths are filtered out below so this list can never link to a
  // redirect. Adding a path to config/url-policy.json removes it from here
  // automatically.
].filter((p) => !(p.href in urlPolicy.retiredKeywordPaths))

export default function FeaturesHubPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[1320px] mx-auto px-4 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-3">
          Product
        </p>
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight max-w-3xl leading-[1.05]">
          Family-photo tools in one workspace
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl font-medium">
          {POSITIONING.supportingPromise} Credits never expire. Pay once—no subscription required.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
          >
            Compare BringBack to other tools <ArrowRight size={14} />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold hover:border-brand-orange"
          >
            Pricing
          </Link>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <article
              key={f.href}
              className="bg-white rounded-3xl p-6 border border-black/5 flex flex-col shadow-sm"
            >
              <div className="text-xs font-bold uppercase tracking-wide text-brand-orange mb-3">
                {f.cost === 0 ? "Family pack · free to edit" : formatCredits(f.cost)}
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mb-2">{f.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{f.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={f.href}
                  className="inline-flex items-center gap-1 text-sm font-bold text-brand-black hover:text-brand-orange"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
                <Link
                  href={f.dashboard}
                  className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-brand-orange ml-auto"
                >
                  Open tool
                </Link>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-[850] tracking-tight">
            Specific use cases
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl font-medium">
            Detailed walkthroughs for the situations people ask about most.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
            {USE_CASE_PAGES.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-black hover:text-brand-orange"
                >
                  {p.label}
                  <ArrowRight size={13} className="shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}
