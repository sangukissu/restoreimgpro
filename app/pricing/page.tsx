import type { Metadata } from "next"
import Script from "next/script"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { FeatureDirectory } from '@/components/landing/FeatureDirectory';
import { Comparison } from '@/components/landing/Comparison'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'
import Guarantees from '@/components/Guarantee'



export const metadata: Metadata = {
  title: "Pricing - BringBack AI | AI Photo Restoration & Animation",
  description:
    "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $21.99 plans, no subscriptions.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing - BringBack AI | AI Photo Restoration & Animation",
    description:
      "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $21.99 plans, no subscriptions.",
    type: "website",
    url: "https://bringback.pro/pricing",
    siteName: "BringBack AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BringBack AI Photo Restoration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - BringBack AI | AI Photo Restoration & Animation",
    description:
      "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $21.99 plans, no subscriptions.",
    images: ["/og-image.png"],
  },
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-4">
        {/* SEO Schema to reflect pricing offers */}
        <Script
          id="pricing-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OfferCatalog",
              name: "BringBack Pricing",
              provider: { "@type": "Organization", name: "BringBack" },
              itemListElement: [
                {
                  "@type": "Offer",
                  price: "4.99",
                  priceCurrency: "USD",
                  itemOffered: { "@type": "Service", name: "Starter - AI Photo Restoration" },
                },
                {
                  "@type": "Offer",
                  price: "9.99",
                  priceCurrency: "USD",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pro - Photo Restoration + Animation Credits",
                  },
                },
                {
                  "@type": "Offer",
                  price: "21.99",
                  priceCurrency: "USD",
                  itemOffered: {
                    "@type": "Service",
                    name: "Family - Extended Credits",
                  },
                },
              ],
            }),
          }}
        />

        {/* Shared Pricing section */}
        <Pricing />

        {/* Feature Directory Section */}
        <FeatureDirectory />

<Guarantees />
        {/* Brand-styled Comparison */}
        <Comparison />

        {/* Brand-styled FAQ */}
        <FAQ />

        {/* Brand-styled Final CTA */}
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
