import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { Hero } from "@/components/old-photo-restoration/Hero"
import { DamageTypes } from "@/components/old-photo-restoration/DamageTypes"
import { HowItWorks } from "@/components/old-photo-restoration/HowItWorks"
import { RestorationGuide } from "@/components/old-photo-restoration/RestorationGuide"
import { Benefits } from "@/components/old-photo-restoration/Benefits"
import { PhotoAnimation } from "@/components/landing/PhotoAnimation"
import { Pricing } from "@/components/landing/Pricing"
import { Comparison } from "@/components/old-photo-restoration/Comparison"
import { FAQ } from "@/components/old-photo-restoration/FAQ"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"
import { FEATURE_CREDIT_COSTS, STARTER_PLAN } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "AI Old Photo Restoration Online | Fix Scratches & Fading",
  description:
    "Restore scratched, torn, faded, and water-damaged old family photos with AI. Keep original sepia/B&W or colorize. Compare before downloading. 1 credit per photo.",
  keywords: [
    "old photo restoration ai",
    "how to restore old photos",
    "fix scratched photo online",
    "repair torn family picture",
    "unblur old photo ai",
  ],
  alternates: {
    canonical: "https://bringback.pro/old-photo-restoration",
  },
  openGraph: {
    title: "AI Old Photo Restoration | BringBack",
    description:
      "Repair torn, faded, and scratched family photos while reviewing reconstructed facial and image details against the original.",
    url: "https://bringback.pro/old-photo-restoration",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Old photo restoration before and after",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/old-photo-restoration#webapp",
  name: "BringBack AI Old Photo Restoration",
  description:
    "Generate a repaired digital version of a scratched, torn, stained, blurred, or faded family photograph.",
  url: "https://bringback.pro/old-photo-restoration",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Restoration Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: STARTER_PLAN.priceUsd.toFixed(2),
    description: `${STARTER_PLAN.credits} credits — covers ${Math.floor(STARTER_PLAN.credits / FEATURE_CREDIT_COSTS.restore.credits)} photo restorations.`,
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Restore Old Photos",
  description: "Upload an old family photo, choose restore-only or restore and colorize, generate a repair, and compare it before downloading.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Faded or Damaged Photo",
      text: "Upload your scanned physical photo, wallet print, or smartphone snapshot.",
      url: "https://bringback.pro/old-photo-restoration#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Choose Restoration Settings",
      text: "Select restore-only to keep original B&W/sepia, or restore + colorize.",
      url: "https://bringback.pro/old-photo-restoration#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "AI Repairs Damage Automatically",
      text: "BringBack generates a repaired digital version that reduces visible damage and reconstructs missing areas when needed.",
      url: "https://bringback.pro/old-photo-restoration#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Compare & Download High-Res",
      text: "Review your photo side-by-side with an interactive slider before downloading.",
      url: "https://bringback.pro/old-photo-restoration#how-it-works",
    },
  ],
}

export default function OldPhotoRestorationPage() {
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
        {/* 2. Interactive Damage Types Showcase */}
        <DamageTypes />
        {/* 3. 4-Step How It Works (Snippet-Winning Architecture) */}
        <HowItWorks />
        {/* 4. Deep Technical Restoration Guide */}
        <RestorationGuide />
        {/* 5. Benefits Grid */}
        <Benefits />
        {/* 6. Photo Animation Feature */}
        <PhotoAnimation />
        {/* 7. Pricing */}
        <Pricing />
        {/* 8. Competitor Comparison */}
        <Comparison />
        {/* 9. FAQ */}
        <FAQ />
        {/* 10. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
