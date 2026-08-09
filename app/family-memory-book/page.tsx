import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { MemoryBookHero } from "@/components/memory-book-page/hero"
import { MemoryBookArchivalPillars } from "@/components/memory-book-page/archival-pillars"
import { MemoryBookFAQ } from "@/components/memory-book-page/faq"
import { MEMORY_BOOK_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Digital Family Memory Book — Private Keepsake",
  description:
    "Organize restored family photos with names, dates, locations, and oral stories into a private digital keepsake. Included with the Family plan.",
  alternates: {
    canonical: "https://bringback.pro/family-memory-book",
  },
  openGraph: {
    title: "Digital Family Memory Book | BringBack AI",
    description:
      "A private place to organize restored photos with names, dates, and family stories so context is preserved for future generations.",
    url: "https://bringback.pro/family-memory-book",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital family memory book keepsake preview",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/family-memory-book#webapp",
  name: "BringBack Digital Family Memory Book",
  description:
    "Organize restored family photos with names, dates, and stories into a private digital keepsake.",
  url: "https://bringback.pro/family-memory-book",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Family Pack Access",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "19.99",
    description: "Includes Memory Book access and restoration credits.",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: MEMORY_BOOK_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function FamilyMemoryBookPage() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main>
        <MemoryBookHero />
        <MemoryBookArchivalPillars />
        <Pricing />
        <MemoryBookFAQ />
        <ProductCrossSell excludeHref="/family-memory-book" />
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
