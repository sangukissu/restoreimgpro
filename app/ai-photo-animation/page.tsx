import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/ai-photo-animation/hero"
import { HowItWorks } from "@/components/ai-photo-animation/how-it-works"
import { Features } from "@/components/ai-photo-animation/features"
import { StylesGrid } from "@/components/ai-photo-animation/styles-grid"
import { FAQ } from "@/components/ai-photo-animation/faq"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "AI Photo Animation | Bring Old Photos to Life | BringBack",
  description:
    "Animate old photos with realistic facial motion, natural blinks, and warm smiles using AI. Turn still family pictures into video memories. 2 credits per video.",
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
    description: "Transform still family portraits into realistic moving video memories.",
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
  description: "Animate still family portraits with natural facial movements.",
  url: "https://bringback.pro/ai-photo-animation",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Animation Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 2 Photo Animation runs.",
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Animate Old Photos with AI",
  description: "Learn how to bring ancestral faces to life with natural video motion in 4 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Still Photo",
      text: "Upload a vintage black-and-white print, sepia portrait, or modern photo.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Select Facial Motion Style",
      text: "Choose gentle smiles, warm blinking, subtle head tilts, or realistic nostalgic hugs.",
      url: "https://bringback.pro/ai-photo-animation#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "AI Generates Motion Video",
      text: "BringBack animates facial expressions while preserving authentic identity and likeness.",
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
