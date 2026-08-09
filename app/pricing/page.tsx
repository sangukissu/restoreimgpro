import type { Metadata } from "next"
import Script from "next/script"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { Pricing } from "@/components/landing/Pricing"
import { FeatureDirectory } from "@/components/landing/FeatureDirectory"
import { Comparison } from "@/components/landing/Comparison"
import { FAQ } from "@/components/landing/FAQ"
import { CTA } from "@/components/landing/CTA"
import Guarantees from "@/components/Guarantee"
import { PUBLIC_PLANS, schemaOffers, FEATURE_CREDIT_COSTS } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Pricing — Credit packs for family photo tools",
  description:
    "Pay once, no subscription. Restoration Starter $4.99 (4 credits), Value Pack $9.99 (20), Family Pack $21.99 (60 + Memory Book). Exact credit costs per feature.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing | BringBack",
    description:
      "Pay-once credit packs with clear feature equivalents. Starter cannot fund animation; Value and Family can.",
    type: "website",
    url: "https://bringback.pro/pricing",
    siteName: "BringBack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BringBack pricing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | BringBack",
    description:
      "Pay-once credit packs with clear feature equivalents for restore, reunite, and animate.",
    images: ["/og-image.png"],
  },
}

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "BringBack Pricing",
  url: "https://bringback.pro/pricing",
  provider: {
    "@type": "Organization",
    name: "BringBack",
    url: "https://bringback.pro",
  },
  itemListElement: schemaOffers().map((offer, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: offer,
  })),
  description: `Credit costs: restore ${FEATURE_CREDIT_COSTS.restore.credits}, family portrait/add/remove ${FEATURE_CREDIT_COSTS.familyPortrait.credits}, animation/hug ${FEATURE_CREDIT_COSTS.animate.credits}. Plans: ${PUBLIC_PLANS.map((p) => `${p.name} ${p.priceDisplay}/${p.credits} credits`).join("; ")}.`,
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-4">
        <Script
          id="pricing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pricingJsonLd),
          }}
        />

        <Pricing />
        <FeatureDirectory />
        <Guarantees />
        <Comparison />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
