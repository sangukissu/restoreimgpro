import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { AddPersonHero } from "@/components/add-person/hero"
import { AddPersonHowItWorks } from "@/components/add-person/how-it-works"
import { AddPersonGuide } from "@/components/add-person/guide"
import { AddPersonUseCases } from "@/components/add-person/use-cases"
import { AddPersonHarmonizationGuide } from "@/components/add-person/harmonization-guide"
import { AddPersonComparison } from "@/components/add-person/comparison"
import { AddPersonFAQ } from "@/components/add-person/faq"
import { ADD_PERSON_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Add a Person to a Family Photo | AI Photo Compositing | BringBack",
  description:
    "Add missing relatives or loved ones into a family photo naturally with AI. Harmonizes lighting, color temperature, and film grain. 2 credits per run.",
  alternates: {
    canonical: "https://bringback.pro/add-person-to-photo",
  },
  openGraph: {
    title: "Add a Person to a Family Photo | BringBack AI",
    description:
      "Combine separate photos of relatives into a single cohesive group portrait with natural AI lighting harmonization.",
    url: "https://bringback.pro/add-person-to-photo",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Add person to family photo before and after composite",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/add-person-to-photo#webapp",
  name: "BringBack Add Person to Photo",
  description:
    "Combine separate photos of relatives into a single cohesive group portrait with natural AI lighting harmonization.",
  url: "https://bringback.pro/add-person-to-photo",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Add Person Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 2 Add Person compositing runs.",
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ADD_PERSON_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function AddPersonToPhotoPage() {
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
        <AddPersonHero />
        {/* 2. 4-Step How It Works Workflow */}
        <AddPersonHowItWorks />
        {/* 3. Deep 200+ Line Technical Guide */}
        <AddPersonGuide />
        {/* 4. Real-World Use Cases */}
        <AddPersonUseCases />
        {/* 5. 4 Pillars of Harmonization */}
        <AddPersonHarmonizationGuide />
        {/* 6. Competitor Comparison Matrix */}
        <AddPersonComparison />
        {/* 7. Pricing */}
        <Pricing />
        {/* 8. FAQ */}
        <AddPersonFAQ />
        {/* 9. Product Cross Sell */}
        <ProductCrossSell excludeHref="/add-person-to-photo" />
        {/* 10. CTA Banner */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
