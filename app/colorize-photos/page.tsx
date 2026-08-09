import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import ColorizeHero from "@/components/pages/colorize-hero"
import ColorizeShowcaseSection from "@/components/pages/colorize-showcase-section"
import { ColorizeHowItWorks } from "@/components/pages/colorize-how-it-works"
import ColorizeFeaturesSection from "@/components/pages/colorize-features-section"
import ColorizeQualitySection from "@/components/pages/colorize-quality-section"
import ColorizeFAQSection from "@/components/pages/colorize-faq-section"
import { COLORIZE_FAQS } from "@/lib/feature-faqs"
import { Pricing } from "@/components/landing/Pricing"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"
import { CTA } from "@/components/old-photo-restoration/CTA"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Colorize Black and White Photos AI",
  description:
    "Colorize black and white photos online with AI. Era-accurate color tones, skin color precision, and high resolution. Try free preview.",
  keywords: [
    "colorize black and white photos",
    "how to colorize black and white photos",
    "ai photo colorizer online",
    "add color to old picture",
    "colorization of vintage family photos",
  ],
  alternates: {
    canonical: "https://bringback.pro/colorize-photos",
  },
  openGraph: {
    title: "Colorize Black and White Photos AI | BringBack",
    description: "Transform monochromatic vintage photos into rich color portraits.",
    url: "https://bringback.pro/colorize-photos",
    siteName: "BringBack",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Colorize black and white photo before and after",
      },
    ],
  },
  robots: { index: true, follow: true },
}

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://bringback.pro/colorize-photos#webapp",
  name: "BringBack Colorize Black and White Photos AI",
  description: "Colorize black and white photos with era-accurate color spectrum mapping.",
  url: "https://bringback.pro/colorize-photos",
  applicationCategory: "PhotoEditingApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    name: "Colorization Credit Pack",
    url: "https://bringback.pro/pricing",
    priceCurrency: "USD",
    price: "4.99",
    description: "4 credits — covers 4 photo colorization runs.",
  },
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Colorize Black and White Photos",
  description: "Learn how to bring vibrant color to vintage black-and-white family photos in 4 simple steps.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Upload Black & White Photo",
      text: "Upload any black-and-white, sepia, or monochromatic vintage print.",
      url: "https://bringback.pro/colorize-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI Analyzes Historical Context",
      text: "Our neural network detects skin tones, clothing fabrics, foliage, and sky.",
      url: "https://bringback.pro/colorize-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Color Generated Instantly",
      text: "BringBack applies lifelike colors while retaining original contrast & shading.",
      url: "https://bringback.pro/colorize-photos#how-it-works",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Compare & Download HD",
      text: "Review your colorized photo side-by-side with the original before downloading.",
      url: "https://bringback.pro/colorize-photos#how-it-works",
    },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: COLORIZE_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function ColorizePhotosPage() {
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
        <ColorizeHero />
        {/* 2. Showcase */}
        <ColorizeShowcaseSection />
        {/* 3. 4-Step How It Works (Snippet-Winning Architecture) */}
        <ColorizeHowItWorks />
        {/* 4. Features */}
        <ColorizeFeaturesSection />
        {/* 5. Quality */}
        <ColorizeQualitySection />
        {/* 6. Pricing */}
        <Pricing />
        {/* 7. FAQ */}
        <ColorizeFAQSection />
        {/* 8. Product Cross Sell */}
        <ProductCrossSell excludeHref="/colorize-photos" />
        {/* 9. CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  )
}
