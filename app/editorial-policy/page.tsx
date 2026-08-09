import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { BRAND } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: "Editorial policy",
  description:
    "How BringBack writes product claims, examples, comparisons, and privacy language. No invented testimonials or unverifiable benchmarks.",
  alternates: { canonical: "/editorial-policy" },
  openGraph: {
    title: "Editorial policy | BringBack",
    description: "Standards for honest product and content claims on bringback.pro.",
    url: "https://bringback.pro/editorial-policy",
    type: "website",
  },
}

export default function EditorialPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[800px] mx-auto px-4 sm:px-8">
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight">Editorial policy</h1>
        <p className="mt-4 text-sm text-gray-500">Last updated: July 19, 2026</p>

        <div className="mt-10 space-y-8 text-gray-700 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Purpose</h2>
            <p>
              This page describes how we write public product and content claims so families can
              trust what they read before uploading irreplaceable photos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">We do not invent</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Customer testimonials, names, or star ratings without a real source</li>
              <li>User counts, revenue figures, or “families served” without a defined metric</li>
              <li>Competitor test scores or “winner” tables without documented methods</li>
              <li>Privacy promises (e.g. “deleted in 30 minutes”) the pipeline does not meet</li>
              <li>Claims of historical color accuracy, “proprietary engines,” or blanket 8K quality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Product claims</h2>
            <p>
              Credit costs, plan prices, and feature availability must match production checkout and
              the shared pricing source of truth. If the Starter pack cannot fund an action, we say so.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Examples &amp; demos</h2>
            <p>
              Demo images are labeled as product examples unless we have consent to publish a real
              customer case with input condition, mode, and limitations. See{" "}
              <Link href="/examples" className="underline font-semibold text-brand-black">
                /examples
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Comparisons</h2>
            <p>
              Competitor pages should only stay indexable when based on genuine hands-on testing with
              dated evidence. Unverified comparison URLs may be noindexed until rebuilt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Corrections</h2>
            <p>
              If you find an outdated price, credit cost, or privacy claim, email{" "}
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
