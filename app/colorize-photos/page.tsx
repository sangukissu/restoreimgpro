import type { Metadata } from "next"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import ColorizeHowItWorks from "@/components/pages/colorize-how-it-works"
import ColorizeShowcaseSection from "@/components/pages/colorize-showcase-section"
import ColorizeFeaturesSection from "@/components/pages/colorize-features-section"
import ColorizeFAQSection from "@/components/pages/colorize-faq-section"
import ColorizeMemoriesSection from "@/components/pages/colorize-memories-section"
import ColorizeHero from "@/components/pages/colorize-hero"




export const metadata: Metadata = {
  title: "AI Photo Colorization - Colorize Black & White Photos | BringBack",
  description:
    "Transform black and white photos into vibrant color images with AI. Colorize old family photos, vintage portraits, and historical images in seconds.",
  keywords:
    "colorize photo, black and white to color, AI photo colorization, vintage photo coloring, historical photo restoration",
  robots: "index, follow",
  alternates: {
    canonical: "/colorize-photos",
  },
  openGraph: {
    title: "AI Photo Colorization - Colorize Black & White Photos | BringBack",
    description:
      "Transform black and white photos into vibrant color images with AI. Colorize old family photos, vintage portraits, and historical images in seconds.",
    type: "website",
    url: "https://bringback.pro/colorize-photos",
  },
}

const colorizePageJsonLd = {
  "@context": "https://schema.org",
  "@type": ["WebPage", "WebApplication"],
  "@id": "https://bringback.pro/#colorize-webapp",
  "name": "BringBack – AI Photo Colorization Web App",
  "url": "https://bringback.pro/colorize",
  "applicationCategory": "PhotoEditingApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript and modern web browser.",
  "description": "BringBack is an AI-powered web app that allows users to upload black and white photos and instantly receive realistic colorized images with intelligent color mapping.",
  "provider": {
    "@type": "Organization",
    "@id": "https://bringback.pro/#organization",
    "name": "BringBack",
    "url": "https://bringback.pro/",
    "description": "AI-powered web application for photo colorization and enhancement.",
    "foundingDate": "2025",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bringback.pro/bringback-logo.webp",
      "width": 512,
      "height": 512
    }
  },
  "offers": {
    "@type": "Offer",
    "name": "BringBack Colorization Plans",
    "url": "https://bringback.pro/pricing",
    "priceCurrency": "USD",
    "price": "2",
    "eligibleRegion": {
      "@type": "Place",
      "name": "Worldwide"
    }
  },
  "screenshot": "https://bringback.pro/colorize-screenshot.png",
  "softwareVersion": "1.0.0"
}

const colorizeFAQPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI photo colorization actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes the grayscale patterns, textures, and context in your black and white photo to intelligently predict realistic colors. It uses deep learning models trained on millions of historical and colorized images to understand how objects, skin tones, clothing, and environments should naturally appear in color."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are the colors in AI colorization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI achieves highly realistic colorization by understanding context clues like skin tones, common object colors, and historical color palettes. While we can't know the exact original colors, our system produces natural, believable results that bring photos to life authentically."
      }
    },
    {
      "@type": "Question",
      "name": "Can I colorize very old or damaged black and white photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI works well with vintage photos from any era, including damaged or faded images. The system can handle scratches, stains, and age-related deterioration while adding realistic colors. For best results, ensure the main subjects are clearly visible."
      }
    },
    {
      "@type": "Question",
      "name": "How much does photo colorization cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 5 high-quality photo colorizations for just $2 - no subscription required. This one-time payment gives you professional-grade colorization in seconds, compared to traditional photo colorization services that charge $50-200+ per photo."
      }
    },
    {
      "@type": "Question",
      "name": "Will colorization work on portraits and people?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! Our AI excels at colorizing portraits, understanding skin tones, hair colors, and clothing. It can handle individual portraits, family photos, and group pictures with natural-looking results for each person."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the colorization process take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most photos are colorized in under 60 seconds. Simply upload your black and white photo and watch it transform into a vibrant color image in real-time. No waiting days or weeks like traditional colorization services."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data safe during colorization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you."
      }
    },
    {
      "@type": "Question",
      "name": "What if I'm not satisfied with the colorization results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day money-back guarantee. If you're not satisfied with the colorization results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to bring your photos to life, but we stand behind every colorization."
      }
    },
    {
      "@type": "Question",
      "name": "What does colorizing a photo mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Colorizing a photo means adding realistic colors to black and white or grayscale images, transforming them into vibrant, lifelike pictures that appear as if they were originally taken in color."
      }
    },
    {
      "@type": "Question",
      "name": "Can I colorize historical or vintage family photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI specializes in vintage and historical photo colorization, understanding period-appropriate colors, clothing styles, and historical context to create authentic-looking results."
      }
    },
    {
      "@type": "Question",
      "name": "Does colorization work on landscape and nature photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Our AI excels at colorizing landscapes, understanding natural colors like sky blues, grass greens, and seasonal variations to create stunning, realistic outdoor scenes."
      }
    },
    {
      "@type": "Question",
      "name": "What image formats are supported for colorization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BringBack supports JPEG, PNG, and TIFF formats for colorization. We recommend high-resolution images for the best colorization results."
      }
    },
    {
      "@type": "Question",
      "name": "Can I adjust or customize the colors after AI colorization?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The AI provides realistic, automatic colorization. For specific color preferences or adjustments, you can use the colorized result as a base and make further edits in your preferred photo editing software."
      }
    },
    {
      "@type": "Question",
      "name": "Will colorization work on group photos or wedding pictures?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI handles complex scenes with multiple people, understanding different skin tones, clothing colors, and background elements to create natural-looking group colorizations."
      }
    },
    {
      "@type": "Question",
      "name": "Is the colorization mobile-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can upload and colorize black and white photos directly from your phone using our responsive web interface, perfect for colorizing photos on the go."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use colorized photos commercially?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, colorized photos can be used for editorial, commercial, or personal projects, with full usage rights included in your purchase."
      }
    },
    {
      "@type": "Question",
      "name": "Does colorization preserve the original photo quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our AI maintains the original resolution and detail while adding colors, ensuring your colorized photos retain all the sharpness and quality of the original black and white image."
      }
    },
    {
      "@type": "Question",
      "name": "How realistic do the colorized photos look?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI produces highly realistic colorizations that often look like the photos were originally taken in color. The system understands natural color relationships and historical context for authentic results."
      }
    }
  ]
}

export default function ColorizePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(colorizePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(colorizeFAQPageJsonLd) }}
      />
      <Navbar />
      <ColorizeHero />

      <ColorizeHowItWorks />
      <ColorizeShowcaseSection />
      <ColorizeFeaturesSection />
      {/* Colorization Quality Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-black mb-4">Colorization quality & accuracy</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding what makes AI colorization realistic and when it works best
            </p>
          </div>

          {/* Quality Factors */}
          <div className="space-y-12 mb-16">
            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold text-black mb-3">Image Quality Matters</h3>
              <p className="text-gray-600">
                Sharp, well-exposed photos with clear details produce the most realistic colorization. Blurry or very
                dark images may have less accurate color predictions.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold text-black mb-3">Common Objects Work Best</h3>
              <p className="text-gray-600">
                The AI performs exceptionally well on familiar subjects like people, nature, buildings, and everyday
                objects that appear frequently in training data.
              </p>
            </div>

            <div className="border-l-4 border-black pl-6">
              <h3 className="text-xl font-bold text-black mb-3">Context Helps Accuracy</h3>
              <p className="text-gray-600">
                Photos with clear context clues - like outdoor settings, recognizable clothing styles, or familiar
                objects - help the AI make more accurate color choices.
              </p>
            </div>
          </div>


        </div>
      </section>


      <ColorizeFAQSection />
      <ColorizeMemoriesSection />


      <Footer />
    </div>
  )
}
