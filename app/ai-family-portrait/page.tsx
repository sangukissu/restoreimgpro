import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from "next"

import AIAnimationHero from "@/components/ai-family-portrait/hero"
import { FamilyPortraitRealExamples } from "@/components/ai-family-portrait/real-examples"
import { FamilyPortrait } from "@/components/ai-family-portrait/styles-grid"
import { PetFamilyPortraits } from "@/components/ai-family-portrait/pet-family-portraits"
import FamilyPortraitUseCases from "@/components/ai-family-portrait/features"
import FamilyPortraitFAQ from "@/components/ai-family-portrait/faq"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { FamilyPortraitFinalCTA } from "@/components/ai-family-portrait/final-cta"
import {
  FAMILY_PORTRAIT_HOW_TO,
  FAMILY_PORTRAIT_HOW_TO_STEPS,
} from "@/lib/family-portrait/how-to-steps"
import { FAMILY_PORTRAIT_THEMES } from "@/lib/family-portrait/themes"
import { FAMILY_PORTRAIT_FAQS, faqAnswerText } from "@/lib/feature-faqs"
import { FEATURE_CREDIT_COSTS, STARTER_PLAN } from "@/lib/pricing"

const THEME_COUNT = FAMILY_PORTRAIT_THEMES.length

export const metadata: Metadata = {
  title: "AI Family Portrait Generator | Combine Separate Photos into One",
  description:
    `Combine up to 8 separate family photos into one AI portrait. Choose from ${THEME_COUNT} curated themes, include pets, control clothing, and select the canvas.`,
  keywords: [
    "ai family portrait generator",
    "ai family photo generator",
    "ai family photos",
    "family photo ai",
    "combine separate photos into one family portrait",
    "create family photo from individual photos",
    "memorial family portrait",
  ],
  alternates: {
    canonical: "https://bringback.pro/ai-family-portrait",
  },
  openGraph: {
    title: "AI Family Portrait Generator | BringBack",
    description:
      `Bring separate family photos into one shared portrait with up to 8 references, ${THEME_COUNT} curated themes, pet support, clothing control, and four canvas ratios.`,
    type: "website",
    url: "https://bringback.pro/ai-family-portrait",
    images: [
      {
        url: "/family-og.png",
        width: 1200,
        height: 630,
        alt: "AI family portrait created from separate individual photos",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const familyPortraitWebAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/ai-family-portrait#webapp',
  name: 'BringBack AI Family Portrait Generator',
  description:
    `Create one generated family portrait from up to 8 separate reference photos with ${THEME_COUNT} curated themes, people and pet counts, clothing control, and selectable canvas ratios.`,
  url: 'https://bringback.pro/ai-family-portrait',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  featureList: [
    'Upload and crop up to 8 reference photos',
    `${THEME_COUNT} curated family portrait themes`,
    'People and pet count controls',
    'Preserve original clothing or coordinate it with the theme',
    '1:1, 3:4, 4:3, and 16:9 canvas ratios',
  ],
  offers: {
    '@type': 'Offer',
    name: 'Family Portrait Credit Pack',
    url: 'https://bringback.pro/pricing',
    priceCurrency: 'USD',
    price: STARTER_PLAN.priceUsd.toFixed(2),
    description: `${STARTER_PLAN.credits} credits — covers ${Math.floor(STARTER_PLAN.credits / FEATURE_CREDIT_COSTS.familyPortrait.credits)} AI Family Portrait generations.`,
  },
}

const familyPortraitHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://bringback.pro/ai-family-portrait#how-it-works',
  name: FAMILY_PORTRAIT_HOW_TO.name,
  description: FAMILY_PORTRAIT_HOW_TO.description,
  step: FAMILY_PORTRAIT_HOW_TO_STEPS.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    url: FAMILY_PORTRAIT_HOW_TO.url,
  })),
}

const familyPortraitFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://bringback.pro/ai-family-portrait#faq',
  mainEntity: FAMILY_PORTRAIT_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faqAnswerText(faq.answer),
    },
  })),
}

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitWebAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitHowToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitFaqJsonLd) }} />

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main>
        {/* 1. Hero */}
        <AIAnimationHero />
        {/* 2. Real Visual Use Cases with Input Photo Breakdown */}
        <FamilyPortraitRealExamples />
        {/* 3. Detailed How It Works */}
        <FamilyPortrait />
        {/* 4. Family portraits with pets */}
        <PetFamilyPortraits />
        {/* 5. Why choose BringBack */}
        <FamilyPortraitUseCases />
        {/* 6. Pricing */}
        <Pricing />
        {/* 7. FAQ */}
        <FamilyPortraitFAQ />
        {/* 8. Product Cross Sell */}
        <ProductCrossSell excludeHref="/ai-family-portrait" />
        {/* 9. Family Portrait CTA */}
        <FamilyPortraitFinalCTA />
      </main>

      <Footer />
    </div>
  )
}
