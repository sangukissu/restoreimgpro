import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { RemovePersonHero } from "@/components/remove-person/hero"
import { RemovePersonHowItWorks } from "@/components/remove-person/how-it-works"
import { RemovePersonGuide } from "@/components/remove-person/guide"
import { RemovePersonUseCases } from "@/components/remove-person/use-cases"
import { RemovePersonInpaintingGuide } from "@/components/remove-person/inpainting-guide"
import { RemovePersonComparison } from "@/components/remove-person/comparison"
import { RemovePersonFAQ } from "@/components/remove-person/faq"
import { REMOVE_PERSON_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Remove a Person from a Photo | AI Object Eraser | BringBack",
  description:
    "Erase unwanted photobombers, strangers, or figures from family photos with context-aware AI background inpainting. 2 credits per run.",
  alternates: {
    canonical: "https://bringback.pro/remove-person-from-photo",
  },
  openGraph: {
    title: "Remove a Person from a Photo | BringBack AI",
    description:
      "Erase unwanted persons from family photos while context-aware AI seamlessly rebuilds background architecture, foliage, and textures.",
    url: "https://bringback.pro/remove-person-from-photo",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Remove person from family photo before and after inpainting",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/remove-person-from-photo#webapp",
  name: "BringBack Remove Person from Photo",
  description:
    "Erase unwanted figures from family photos while context-aware AI seamlessly rebuilds background architecture and textures.",
  url: "https://bringback.pro/remove-person-from-photo",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Remove Person Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 2 Remove Person inpainting runs.",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: REMOVE_PERSON_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function RemovePersonFromPhotoPage() {
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
        {/* 1. Hero (Static framed feature card) */}
        <RemovePersonHero />
        {/* 2. 4-Step How It Works Workflow */}
        <RemovePersonHowItWorks />
        {/* 3. Deep 200+ Line Technical Guide */}
        <RemovePersonGuide />
        {/* 4. Real-World Use Cases */}
        <RemovePersonUseCases />
        {/* 5. 4 Pillars of Inpainting */}
        <RemovePersonInpaintingGuide />
        {/* 6. Competitor Comparison Matrix */}
        <RemovePersonComparison />
        {/* 7. Pricing */}
        <Pricing />
        {/* 8. FAQ */}
        <RemovePersonFAQ />
        {/* 9. Product Cross Sell */}
        <ProductCrossSell excludeHref="/remove-person-from-photo" />
        {/* 10. CTA Banner */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
