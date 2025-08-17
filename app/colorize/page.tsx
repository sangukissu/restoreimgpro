import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PointerHighlight } from "@/components/pointer-highlight"
import { Compare } from "@/components/ui/compare"
import ColorizeHowItWorksSection from "@/components/pages/colorize-how-it-works-section"
import ColorizeBenefitsSection from "@/components/pages/colorize-benefits-section"
import ColorizeShowcaseSection from "@/components/pages/colorize-showcase-section"
import ColorizeFeaturesSection from "@/components/pages/colorize-features-section"
import ColorizeTestimonialsSection from "@/components/pages/colorize-testimonials-section"
import ColorizeFAQSection from "@/components/pages/colorize-faq-section"
import ColorizeMemoriesSection from "@/components/pages/colorize-memories-section"
import Link from "next/link"


export const metadata: Metadata = {
  title: "AI Photo Colorization - Colorize Black & White Photos | BringBack",
  description:
    "Transform black and white photos into vibrant color images with AI. Colorize old family photos, vintage portraits, and historical images in seconds.",
  keywords:
    "colorize photo, black and white to color, AI photo colorization, vintage photo coloring, historical photo restoration",
  robots: "index, follow",
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
    "foundingDate": "2024",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bringback.pro/bringback-logo.png",
      "width": 512,
      "height": 512
    }
  },
  "offers": {
    "@type": "Offer",
    "name": "BringBack Colorization Plans",
    "url": "https://bringback.pro/pricing",
    "priceCurrency": "USD",
    "price": "0",
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
        "text": "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than colorization. Your family memories remain completely private."
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
        "text": "Yes—you can upload and colorize black and white photos directly from your phone using our responsive web interface, perfect for colorizing photos on the go."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use colorized photos commercially?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes—colorized photos can be used for editorial, commercial, or personal projects, with full usage rights included in your purchase."
      }
    },
    {
      "@type": "Question",
      "name": "Does colorization preserve the original photo quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes—our AI maintains the original resolution and detail while adding colors, ensuring your colorized photos retain all the sharpness and quality of the original black and white image."
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
      <Header />
      {/* Hero Section */}
      <section className="min-h-screen w-full bg-white relative">
        {/* Diagonal Stripes Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
          }}
        />

        <div className="relative z-10 px-4 py-20 pt-32 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center">
            <div className="space-y-6">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Powered
                </div>
                <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Bring{" "}
                  <PointerHighlight
                    rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                    pointerClassName="text-purple-500 h-3 w-3"
                    containerClassName="inline-block mx-1"
                  >
                    <span className="relative z-10">black & white</span>
                  </PointerHighlight>
                  <br />
                  photos to
                  <br />
                  <PointerHighlight
                    rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                    pointerClassName="text-blue-500 h-3 w-3"
                    containerClassName="inline-block mx-1"
                  >
                    <span className="relative z-10">vibrant life</span>
                  </PointerHighlight>{" "}
                  with color
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
                  Transform your vintage black and white photos into stunning color images. Intelligent colorization,
                  simple process, and a lifetime of colorful memories.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
                
              
              <Link href="/login">
              <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
                <>
                  <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Colorize Your Photo</span>
                  <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                    <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                  </i>
                </>
              </Button>
            </Link>
              </div>
              <div className="flex flex-col items-center space-y-2 pt-2">
                <div className="flex flex-col items-center space-y-2 pt-2">
             <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar1.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar2.webp" alt="User" />  
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar3.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar6.webp" alt="User" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="/avatar5.webp" alt="User" />
                <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">17+</span>
                </div>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
                <p className="text-gray-600 font-medium">Loved by History Enthusiasts & Families</p>
              </div>

              {/* Hero Compare Section */}
              <div className="pt-8 w-full">
                <div className="max-w-4xl mx-auto">
                   
                    <div className="flex justify-center px-4">
                        <div className="border rounded-xl bg-gray-50 border-gray-200 p-3">
                      <Compare
                        firstImage="/placeholder.svg?height=400&width=600&text=Black+and+White+Photo"
                        secondImage="/placeholder.svg?height=400&width=600&text=Colorized+Photo"
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        className="h-[280px] w-[400px] md:h-[400px] md:w-[600px] rounded-lg"
                        slideMode="hover"
                        firstImageAlt="Before: black and white family photo" 
                        secondImageAlt="After: Colorized family photo with bringback ai"
                        showHandlebar={true}
                      />
                      </div>
                    </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                    Watch how BringBack transforms black and white photos into realistic, vibrant color images
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <ColorizeHowItWorksSection />
      <ColorizeBenefitsSection />
      <ColorizeShowcaseSection />
      <ColorizeFeaturesSection />
      <ColorizeTestimonialsSection />

      {/* Social Proof Section */}
      <section className="px-4 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by history lovers worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who've already brought color to their vintage photos</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "My great-grandmother's wedding photo from 1920 was beautiful but colorless. BringBack made it look like
                it was taken yesterday - the colors are so realistic!"
              </p>
              <p className="text-sm font-medium text-black">Emma Thompson</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "I colorized my entire family's vintage photo collection. The AI understood skin tones, clothing, and
                even the background perfectly. It's like time travel!"
              </p>
              <p className="text-sm font-medium text-black">Robert Chen</p>
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
