import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { RemovePersonHero } from "@/components/remove-person/hero"
import { RemovePersonHowItWorks } from "@/components/remove-person/how-it-works"
import { RemovePersonGuide } from "@/components/remove-person/guide"
import { RemovePersonInpaintingGuide } from "@/components/remove-person/inpainting-guide"
import { RemovePersonComparison } from "@/components/remove-person/comparison"
import { RemovePersonUseCases } from "@/components/remove-person/use-cases"
import { RemovePersonFAQ } from "@/components/remove-person/faq"
import { REMOVE_PERSON_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Remove Person from Photo AI | Object & Figure Eraser",
  description:
    "Remove photobombers, strangers, exes, or unwanted objects from photos with AI. Rebuilds background foliage, brickwork, and shadows naturally. 1 credit per run.",
  keywords: [
    "remove person from photo ai",
    "how to remove a person from a photo",
    "erase photobombers from picture",
    "ai object remover from photo",
    "remove unwanted person from image",
  ],
  alternates: {
    canonical: "https://bringback.pro/remove-person-from-photo",
  },
  openGraph: {
    title: "Remove Person from Photo AI | BringBack",
    description:
      "Seamlessly erase photobombers or unwanted figures from photos while AI synthesizes matching background patterns.",
    url: "https://bringback.pro/remove-person-from-photo",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Remove person from photo AI before and after",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/remove-person-from-photo#webapp",
  name: "BringBack Remove Person from Photo AI",
  description:
    "Erase photobombers or unwanted figures from photos while AI synthesizes matching background patterns.",
  url: "https://bringback.pro/remove-person-from-photo",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Remove Person Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 4 Remove Person runs.",
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove a Person from a Photo",
  description: "Learn how to erase photobombers or unwanted figures from any photo using AI in 4 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Your Photo",
      text: "Select the photo containing photobombers, strangers, or an unwanted person.",
      url: "https://bringback.pro/remove-person-from-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Highlight Person to Remove",
      text: "Simply brush over or select the figure or object you want erased from the picture.",
      url: "https://bringback.pro/remove-person-from-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "AI Rebuilds the Background",
      text: "BringBack erases the figure and synthesizes matching background patterns in seconds.",
      url: "https://bringback.pro/remove-person-from-photo#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Download Clean Photo",
      text: "Review your photo side-by-side in your dashboard and download high-res print quality.",
      url: "https://bringback.pro/remove-person-from-photo#how-it-works",
    },
  ],
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
        <RemovePersonHero />
        {/* 2. 4-Step How It Works (Snippet-Winning Architecture) */}
        <RemovePersonHowItWorks />
        {/* 3. Deep Inpainting Guide */}
        <RemovePersonGuide />
        {/* 4. Use Cases */}
        <RemovePersonUseCases />
        {/* 5. 4 Pillars of Background Synthesis */}
        <RemovePersonInpaintingGuide />
        {/* 6. Competitor Comparison */}
        <RemovePersonComparison />
        {/* 7. Pricing */}
        <Pricing />
        {/* 8. FAQ */}
        <RemovePersonFAQ />
        {/* 9. Product Cross Sell */}
        <ProductCrossSell excludeHref="/remove-person-from-photo" />
        {/* 10. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
