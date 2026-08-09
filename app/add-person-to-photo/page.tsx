import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { AddPersonHero } from "@/components/add-person/hero"
import { AddPersonRealExamples } from "@/components/add-person/real-examples"
import { AddPersonHowItWorks } from "@/components/add-person/how-it-works"
import { AddPersonGuide } from "@/components/add-person/guide"
import { AddPersonHarmonizationGuide } from "@/components/add-person/harmonization-guide"
import { AddPersonComparison } from "@/components/add-person/comparison"
import { AddPersonFAQ } from "@/components/add-person/faq"
import { ADD_PERSON_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Add a Person to Photo AI | Insert Missing Person in Family Photos",
  description:
    "Add a deceased loved one, late parent, or missing family member into a wedding, memorial, or family portrait with AI. Natural lighting, matched skin tones, and real before & after results.",
  keywords: [
    "add deceased loved one to photo ai",
    "add deceased loved one to wedding photo",
    "add passed family member to portrait",
    "add missing person to group photo",
    "combine separate photos of deceased relatives into one portrait",
    "how to add a person to a family photo",
    "ai memorial family photo generator",
  ],
  alternates: {
    canonical: "https://bringback.pro/add-person-to-photo",
  },
  openGraph: {
    title: "Add a Person to Photo AI | BringBack",
    description:
      "Combine separate photos of relatives into a single cohesive family portrait with natural AI lighting and skin tone matching.",
    url: "https://bringback.pro/add-person-to-photo",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Add a person to family photo before and after composite",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/add-person-to-photo#webapp",
  name: "BringBack Add a Person to Photo AI",
  description:
    "Add a missing person or deceased loved one into a wedding, memorial, or family portrait with matched lighting.",
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

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Add a Person to a Family Photo",
  description: "Learn how to add a missing relative or deceased loved one into any family photo using AI in 4 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Group Photo",
      text: "Select the main family, wedding, or reunion snapshot where you want to add someone.",
      url: "https://bringback.pro/add-person-to-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Upload the Person's Photo",
      text: "Choose a clear reference photo of the missing relative or deceased loved one.",
      url: "https://bringback.pro/add-person-to-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Position & Adjust (Optional)",
      text: "Specify where they should stand or sit (e.g. next to the bride or on the living room sofa).",
      url: "https://bringback.pro/add-person-to-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Your Family Memory",
      text: "Review the result side-by-side in your dashboard and download high-res print quality.",
      url: "https://bringback.pro/add-person-to-photo#how-it-works",
    },
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main>
        {/* 1. Hero */}
        <AddPersonHero />
        {/* 2. Real Before & After Photo Case Studies */}
        <AddPersonRealExamples />
        {/* 3. 4-Step How It Works Workflow (Featured-Snippet Target) */}
        <AddPersonHowItWorks />
        {/* 4. Human-First Guide & Best Source Tips */}
        <AddPersonGuide />
        {/* What we match so an added person looks natural */}
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
