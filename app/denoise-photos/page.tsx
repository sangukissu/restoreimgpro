import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { DenoiseHero } from "@/components/pages/denoise-hero"
import DenoiseShowcaseSection from "@/components/pages/denoise-showcase-section"
import { DenoiseHowItWorksSection } from "@/components/pages/denoise-how-it-works-section"
import DenoiseFeaturesSection from "@/components/pages/denoise-features-section"
import DenoiseTechnologySection from "@/components/pages/denoise-technology-section"
import DenoiseFAQSection from "@/components/pages/denoise-faq-section"
import { DENOISE_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Unblur & Sharpen Old Photos AI | Face Enhancer",
  description:
    "Unblur out-of-focus faces, sharpen soft vintage prints, and remove heavy film noise with AI. Compare before downloading.",
  keywords: [
    "unblur old photo ai",
    "how to unblur and sharpen old photos",
    "sharpen blurry family picture",
    "ai face enhancer online",
    "remove film noise from vintage photo",
  ],
  alternates: {
    canonical: "https://bringback.pro/denoise-photos",
  },
  openGraph: {
    title: "Unblur & Sharpen Old Photos AI | BringBack",
    description: "Reconstruct HD facial clarity from blurry or noisy vintage prints.",
    url: "https://bringback.pro/denoise-photos",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unblur old photo face enhancer before and after",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/denoise-photos#webapp",
  name: "BringBack Unblur & Sharpen Old Photos AI",
  description: "Reconstruct HD facial clarity from blurry or noisy vintage prints.",
  url: "https://bringback.pro/denoise-photos",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Enhancement Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 4 photo sharpening runs.",
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Unblur and Sharpen Old Photos",
  description: "Learn how to unblur soft faces and remove heavy film noise from old photos in 4 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Blurry or Noisy Photo",
      text: "Upload out-of-focus portraits, low-res scans, or noisy film prints.",
      url: "https://bringback.pro/denoise-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI Detects Facial Landmarks",
      text: "Our facial enhancement engine maps eyes, nose, mouth, and skin texture.",
      url: "https://bringback.pro/denoise-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "HD Details Reconstructed",
      text: "BringBack sharpens fuzzy facial details and removes heavy film grain.",
      url: "https://bringback.pro/denoise-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Compare & Download HD",
      text: "Review your unblurred photo side-by-side with the original before downloading.",
      url: "https://bringback.pro/denoise-photos#how-it-works",
    },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DENOISE_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function DenoisePhotosPage() {
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
        <DenoiseHero />
        {/* 2. Showcase */}
        <DenoiseShowcaseSection />
        {/* 3. 4-Step How It Works (Snippet-Winning Architecture) */}
        <DenoiseHowItWorksSection />
        {/* 4. Features */}
        <DenoiseFeaturesSection />
        {/* 5. Technology */}
        <DenoiseTechnologySection />
        {/* 6. Pricing */}
        <Pricing />
        {/* 7. FAQ */}
        <DenoiseFAQSection />
        {/* 8. Product Cross Sell */}
        <ProductCrossSell excludeHref="/denoise-photos" />
        {/* 9. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
