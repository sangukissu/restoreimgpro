import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { POSITIONING, BRAND } from "@/lib/site-copy"

export const metadata: Metadata = {
  title: "About BringBack — family photo preservation",
  description:
    "BringBack is a family-photo preservation workspace: restore damage, reunite people, add subtle motion, and keep stories private. Pay once — no subscription.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About BringBack",
    description: POSITIONING.supportingPromise,
    url: "https://bringback.pro/about",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[800px] mx-auto px-4 sm:px-8">
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight leading-[1.05]">
          About BringBack
        </h1>
        <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed">
          {POSITIONING.category}
        </p>

        <div className="mt-10 space-y-8 text-gray-700 font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">What we build</h2>
            <p>
              {POSITIONING.publicPromise} {POSITIONING.supportingPromise}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Who it is for</h2>
            <p>
              Family archivists and gift-makers: adult children preserving parents&apos; photos,
              genealogy hobbyists, memorial and reunion projects, and anyone with a box of fragile
              prints. The central fear we design for is not megapixels — it is{" "}
              <em>&quot;Will this tool change the person I remember?&quot;</em>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">How we price</h2>
            <p>
              Pay-once credit packs starting at $4.99. No forced subscription. Credits never expire.
              Exact feature costs are listed on{" "}
              <Link href="/pricing" className="underline font-semibold text-brand-black">
                Pricing
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Trust &amp; reviews</h2>
            <p>
              We do not invent star ratings or user counts on marketing pages. Public third-party
              reviews may appear on{" "}
              <a
                href={BRAND.trustpilot}
                className="underline font-semibold text-brand-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trustpilot
              </a>
              . See our{" "}
              <Link href="/editorial-policy" className="underline font-semibold text-brand-black">
                editorial policy
              </Link>
              ,{" "}
              <Link href="/methodology" className="underline font-semibold text-brand-black">
                methodology
              </Link>
              , and{" "}
              <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
                restoration benchmark
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-extrabold text-brand-black mb-3">Contact</h2>
            <p>
              Email{" "}
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
