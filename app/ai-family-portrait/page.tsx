import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from "next"

import AIAnimationHero from "@/components/ai-family-portrait/hero"
import { FamilyPortraitRealExamples } from "@/components/ai-family-portrait/real-examples"
import { FamilyPortrait } from "@/components/ai-family-portrait/styles-grid"
import FamilyPortraitConversionGuide from "@/components/ai-family-portrait/conversion-guide"
import AIAnimationHowItWorks from "@/components/ai-family-portrait/how-it-works"
import FamilyPortraitUseCases from "@/components/ai-family-portrait/features"
import FamilyPortraitFAQ from "@/components/ai-family-portrait/faq"
import AITechnologySection from "@/components/ai-family-portrait/AITechnologySection"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"

export const metadata: Metadata = {
  title: "AI Family Portrait Generator | Combine Separate Photos into One | BringBack",
  description:
    "Combine separate family photos into one natural group portrait with AI. Merge individual photos, add deceased relatives, and compose 35mm studio portraits.",
  keywords: [
    "ai family portrait generator",
    "combine separate photos into one family portrait",
    "how to create a family photo from individual photos",
    "generational family portrait generator",
    "add deceased relative to family portrait",
    "merge multiple photos into one family picture",
  ],
  alternates: {
    canonical: "https://bringback.pro/ai-family-portrait",
  },
  openGraph: {
    title: "AI Family Portrait Generator | BringBack",
    description:
      "Combine separate family photos into one natural group portrait with AI. Merge individual photos, add deceased relatives, and compose studio portraits.",
    type: "website",
    url: "https://bringback.pro/ai-family-portrait",
    images: [
      {
        url: "/og-image.png",
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
    'Combine separate family photos into one natural group portrait with matched lighting and skin tones.',
  url: 'https://bringback.pro/ai-family-portrait',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    name: 'Family Portrait Credit Pack',
    url: 'https://bringback.pro/pricing',
    priceCurrency: 'USD',
    price: '4.99',
    description: '4 credits — covers 2 AI Family Portrait generations.',
  },
}

const familyPortraitHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Create a Family Photo from Individual Photos',
  description:
    'Upload separate portraits, choose a canvas and studio background, then generate one cohesive AI family portrait.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload Individual Portraits',
      text: 'Upload 2 to 4 separate photos of your family members from smartphone scans or old albums.',
      url: 'https://bringback.pro/ai-family-portrait#how-it-works',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Choose Canvas & Background',
      text: 'Select 4:3, 16:9, or 3:4 canvas aspect ratio and choose a studio or natural backdrop.',
      url: 'https://bringback.pro/ai-family-portrait#how-it-works',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'AI Matches Lighting & Scale',
      text: 'BringBack re-composes everyone into one frame, matching lighting, skin tones, and perspective.',
      url: 'https://bringback.pro/ai-family-portrait#how-it-works',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Download Family Portrait',
      text: 'Preview your combined family portrait side-by-side and download high-res print quality.',
      url: 'https://bringback.pro/ai-family-portrait#how-it-works',
    },
  ],
}

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitWebAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitHowToJsonLd) }} />

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main>
        {/* 1. Hero */}
        <AIAnimationHero />
        {/* 2. 6 Real Visual Use Cases with Input Photo Breakdown & Comparison Sliders */}
        <FamilyPortraitRealExamples />
        {/* 3. Style Grid */}
        <FamilyPortrait />
        {/* 4. 4-Step How It Works (Snippet-Winning Architecture) */}
        <AIAnimationHowItWorks />
        {/* 5. Deep Family Photo Creation Guide */}
        <FamilyPortraitConversionGuide />
        {/* 6. Pricing */}
        <Pricing />
        {/* 7. Features & Use Cases */}
        <FamilyPortraitUseCases />
        {/* 8. AI Technology Section */}
        <AITechnologySection />
        {/* 9. FAQ */}
        <FamilyPortraitFAQ />
        {/* 10. Product Cross Sell */}
        <ProductCrossSell excludeHref="/ai-family-portrait" />
        {/* 11. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}