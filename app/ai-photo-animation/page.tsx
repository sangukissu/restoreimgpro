import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import Hero from "@/components/ai-photo-animation/hero"
import { HowItWorks } from "@/components/ai-photo-animation/how-it-works"
import Features from "@/components/ai-photo-animation/features"
import StylesGrid from "@/components/ai-photo-animation/styles-grid"
import FAQ from "@/components/ai-photo-animation/faq"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"
import { FEATURE_CREDIT_COSTS, PRO_PLAN } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "AI Photo Animation | Bring Old Photos to Life",
  description:
    "Animate old photos with gentle smiles, blinks, and head movements. Create a five-second silent video from one family portrait. 10 credits per animation.",
  keywords: [
    "ai photo animation",
    "how to animate old photos with ai",
    "bring old pictures to life",
    "animate faces in vintage photos",
    "make old photo smile video",
  ],
  alternates: {
    canonical: "https://bringback.pro/ai-photo-animation",
  },
  openGraph: {
    title: "AI Photo Animation | BringBack",
    description: "Turn one family portrait into a five-second silent video with a selectable motion preset.",
    url: "https://bringback.pro/ai-photo-animation",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Photo animation preview",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/ai-photo-animation#webapp",
  name: "BringBack AI Photo Animation",
  description: "Create a five-second silent video from one portrait and a selectable facial-motion preset.",
  url: "https://bringback.pro/ai-photo-animation",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Animation Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: PRO_PLAN.priceUsd.toFixed(2),
    description: `${PRO_PLAN.credits} credits — covers ${Math.floor(PRO_PLAN.credits / FEATURE_CREDIT_COSTS.animate.credits)} Photo Animation runs.`,
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Animate Old Photos with AI",
  description: "Upload one portrait, choose a subtle motion preset, generate a five-second silent video, and review it before downloading.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Still Photo",
      text: "Upload one clear vintage, sepia, black-and-white, or modern portrait.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Facial Motion Style",
      text: "Choose a gentle smile, blink and head tilt, warm gaze, soft nod, or another subtle motion preset.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "AI Generates Motion Video",
      text: "BringBack generates a five-second video from the photo and selected motion preset. Review the result because AI movement and likeness can vary.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Preview & Download Video",
      text: "Watch the generated video in your dashboard and download MP4 format for sharing.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
  ],
}

export default function AIPhotoAnimationPage() {
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

      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      <main>
        {/* 1. Hero */}
        <Hero />
        {/* 2. 4-Step How It Works (Snippet-Winning Architecture) */}
        <HowItWorks />
        {/* 3. Motion Styles Grid */}
        <StylesGrid />
        {/* 4. Deep Animation Features */}
        <Features />
        {/* 5. Pricing */}
        <Pricing />
        {/* 6. FAQ */}
        <FAQ />
        {/* 7. Product Cross Sell */}
        <ProductCrossSell excludeHref="/ai-photo-animation" />
        {/* 8. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
