import type { Metadata } from "next"
import Script from "next/script"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { Comparison } from '@/components/landing/Comparison'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'
import Guarantees from '@/components/Guarantee'



export const metadata: Metadata = {
  title: "Pricing - BringBack AI | AI Photo Restoration & Animation",
  description:
    "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $24.99 plans, no subscriptions.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing - BringBack AI | AI Photo Restoration & Animation",
    description:
      "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $24.99 plans, no subscriptions.",
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
      "Simple, transparent pricing for AI photo restoration. Starter $4.99, Pro $9.99, Family $24.99 plans, no subscriptions.",
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
                  price: "24.99",
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

        {/* Brand Assurance: Free re-restoration note */}
        <section className="w-full px-4 sm:px-8">
          <div className="max-w-[1320px] mx-auto">
            <div className="bg-brand-surface p-3 rounded-[2rem]">
              <div className="bg-white rounded-[1.5rem] p-6 sm:p-10 flex items-center gap-4 sm:gap-6">
                <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-black/10">
                  <span className="text-brand-orange">//</span> Assurance <span className="text-brand-orange">//</span>
                </div>
                <p className="text-brand-black/80 font-bold text-sm sm:text-base">
                  Even after restoration, if we detect damage still present, 
                  <span className="text-brand-orange"> we automatically offer one free re‑restoration.</span>
                </p>
              </div>
            </div>
          </div>
        </section>

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