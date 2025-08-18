import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Play, Video, Clock, Zap } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { PointerHighlight } from "@/components/pointer-highlight"
import { Compare } from "@/components/ui/compare"
import AnimateHowItWorksSection from "@/components/pages/animate-how-it-works-section"
import AnimateBenefitsSection from "@/components/pages/animate-benefits-section"


export const metadata: Metadata = {
  title: "AI Photo Animation - Bring Old Photos to Life | BringBack",
  description:
    "Transform static photos into captivating videos with AI. Bring old family photos to life with realistic motion and vintage effects.",
  keywords: "animate photo, photo to video, AI animation, bring photos to life, old photo revival, vintage animation",
  robots: "index, follow",
}

const animatePageJsonLd = {
  "@context": "https://schema.org",
  "@type": ["WebPage", "WebApplication"],
  "@id": "https://bringback.pro/#animate-webapp",
  "name": "BringBack – AI Photo Animation Web App",
  "url": "https://bringback.pro/animate",
  "applicationCategory": "PhotoEditingApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript and modern web browser.",
  "description": "BringBack is an AI-powered web app that allows users to upload static photos and instantly receive animated videos with realistic motion and old photo revival effects.",
  "provider": {
    "@type": "Organization",
    "@id": "https://bringback.pro/#organization",
    "name": "BringBack",
    "url": "https://bringback.pro/",
    "description": "AI-powered web application for photo animation and enhancement.",
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
    "name": "BringBack Animation Plans",
    "url": "https://bringback.pro/pricing",
    "priceCurrency": "USD",
    "price": "0",
    "eligibleRegion": {
      "@type": "Place",
      "name": "Worldwide"
    }
  },
  "screenshot": "https://bringback.pro/animate-screenshot.png",
  "softwareVersion": "1.0.0"
}

const animateFAQPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI photo animation actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes the depth, objects, and context in your static photo to intelligently predict realistic motion patterns. It uses advanced deep learning models trained on millions of videos to understand how elements should naturally move and interact, creating smooth, lifelike animations."
      }
    },
    {
      "@type": "Question",
      "name": "What is the old photo revival effect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The old photo revival effect is a special AI template that adds vintage-style motion to historical photos, making them appear as if they were captured as living moments. It includes subtle movements like gentle swaying, atmospheric effects, and period-appropriate motion that brings old memories to life."
      }
    },
    {
      "@type": "Question",
      "name": "Can I animate very old or damaged photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI works excellently with vintage photos from any era, including damaged or faded images. The old photo revival effect is specifically designed for historical photos and can handle scratches, stains, and age-related deterioration while adding realistic motion."
      }
    },
    {
      "@type": "Question",
      "name": "How much does photo animation cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 5 high-quality photo animations for just $2 - no subscription required. This one-time payment gives you professional-grade video animations in seconds, compared to traditional video editing services that charge $100-500+ per animation."
      }
    },
    {
      "@type": "Question",
      "name": "How long are the animated videos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Generated videos are typically 5-8 seconds long, perfect for social media sharing, digital frames, or creating memorable moments. The duration is optimized to showcase the animation effect while maintaining high quality."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the animation process take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most photos are animated in 2-5 minutes depending on complexity and server load. Simply upload your photo, select the old photo revival effect, and watch your static image transform into a captivating video."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data safe during animation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than animation. Your family memories remain completely private."
      }
    },
    {
      "@type": "Question",
      "name": "What if I'm not satisfied with the animation results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day money-back guarantee. If you're not satisfied with the animation results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to bring your photos to life, but we stand behind every animation."
      }
    }
  ]
}

export default function AnimatePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(animatePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(animateFAQPageJsonLd) }}
      />
      <Header />
      {/* Hero Section */}
      <section className="relative px-4 py-20 pt-32 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent, transparent 2px, #f3f4f6 2px, #f3f4f6 4px)",
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </div>
              <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Bring your{" "}
                <PointerHighlight
                  rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                  pointerClassName="text-purple-500 h-3 w-3"
                >
                  old photos
                </PointerHighlight>{" "}
                to life
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform static family photos into captivating videos with AI. Watch your vintage memories come alive with realistic motion and old photo revival effects.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Animate Your Photos
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="text-sm text-gray-500">
                ✨ 5 animations for $2 • No subscription
              </div>
            </div>
          </div>

          {/* Demo Video Section */}
          <div className="mt-16">
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-black mb-4">See the magic in action</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      Watch how our AI transforms a static vintage family photo into a living, breathing memory with the old photo revival effect.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>5 seconds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>540p quality</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span>Old photo revival</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                      {/* Placeholder for before/after comparison */}
                      <Compare
                        firstImage="/vintage-family-photo.png"
                        secondImage="/vintage-family-photo.png"
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        className="h-[280px] w-[400px] md:h-[400px] md:w-[600px] rounded-lg"
                        slideMode="hover"
                        firstImageAlt="Before: Static vintage family photo"
                        secondImageAlt="After: Animated vintage family photo with old photo revival effect"
                        showHandlebar={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                    Watch how BringBack transforms static vintage photos into captivating animated memories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AnimateHowItWorksSection />
      <AnimateBenefitsSection />

      
      {/* Technology Behind Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">How our AI brings photos to life</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced computer vision meets motion synthesis to create realistic animations from static images
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Process Steps */}
            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">🎬 Motion Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI analyzes the depth, objects, and composition in your photo to understand how elements should naturally move and interact in a realistic animation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Depth mapping</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Object detection</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Scene understanding</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">✨ Old Photo Revival Effect</h3>
                  <p className="text-gray-600 mb-4">
                    The special old photo revival template adds vintage-appropriate motion patterns, atmospheric effects, and subtle movements that make historical photos feel alive and authentic.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Vintage motion</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Atmospheric effects</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Period-appropriate</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">🎥 Video Generation</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced neural networks generate smooth, high-quality video frames that maintain the original photo's character while adding realistic motion and life.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Smooth motion</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">High quality</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Character preservation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-black mb-8">Why choose our animation?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Realistic Motion</h4>
                    <p className="text-gray-600 text-sm">Natural movement that respects physics and photo composition</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Vintage Authenticity</h4>
                    <p className="text-gray-600 text-sm">Old photo revival effect designed specifically for historical images</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Fast Processing</h4>
                    <p className="text-gray-600 text-sm">Professional results in 2-5 minutes, not hours or days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">High Quality Output</h4>
                    <p className="text-gray-600 text-sm">540p-1080p video quality perfect for sharing and preservation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  )
}