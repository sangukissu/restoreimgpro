import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Search, Brain, Filter, Sparkle } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { PointerHighlight } from "@/components/pointer-highlight"
import DenoiseHowItWorksSection from "@/components/pages/denoise-how-it-works-section"
import DenoiseBenefitsSection from "@/components/pages/denoise-benefits-section"
import DenoiseShowcaseSection from "@/components/pages/denoise-showcase-section"
import DenoiseFeaturesSection from "@/components/pages/denoise-features-section"
import DenoiseFAQSection from "@/components/pages/denoise-faq-section"
import DenoiseMemoriesSection from "@/components/pages/denoise-memories-section"
import { Compare } from "@/components/ui/compare"


export const metadata: Metadata = {
  title: "AI Photo Denoise - Remove Grain & Noise Instantly | BringBack",
  description:
    "Clean up grainy, noisy photos with AI. Remove digital noise, grain, and artifacts from low-light shots in seconds.",
  keywords: "denoise photo, remove grain, fix grainy photos, AI noise reduction, clean up photos",
  robots: "index, follow",
}

const denoisePageJsonLd = {
  "@context": "https://schema.org",
  "@type": ["WebPage", "WebApplication"],
  "@id": "https://bringback.pro/#denoise-webapp",
  "name": "BringBack – AI Photo Denoise Web App",
  "url": "https://bringback.pro/denoise",
  "applicationCategory": "PhotoEditingApplication",
  "operatingSystem": "Web",
  "browserRequirements": "Requires JavaScript and modern web browser.",
  "description": "BringBack is an AI-powered web app that allows users to upload noisy or low-light photos and instantly receive de-noised, high-quality images with detail preservation.",
  "provider": {
    "@type": "Organization",
    "@id": "https://bringback.pro/#organization",
    "name": "BringBack",
    "url": "https://bringback.pro/",
    "description": "AI-powered web application for photo denoising and enhancement.",
    "foundingDate": "2025",
    "logo": {
      "@type": "ImageObject",
      "url": "https://bringback.pro/bringback-logo.png",
      "width": 512,
      "height": 512
    }
  },
  "offers": {
    "@type": "Offer",
    "name": "BringBack Denoise Plans",
    "url": "https://bringback.pro/pricing",
    "priceCurrency": "USD",
    "price": "2",
    "eligibleRegion": {
      "@type": "Place",
      "name": "Worldwide"
    }
  },
  "screenshot": "https://bringback.pro/denoise-screenshot.png",
  "softwareVersion": "1.0.0"
}

const denoiseFAQPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does AI photo denoising actually work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI analyzes the patterns of noise in your photo and distinguishes between unwanted grain and important image details. It uses advanced algorithms trained on millions of images to selectively remove noise while preserving textures, edges, and fine details that matter to your photo's quality."
      }
    },
    {
      "@type": "Question",
      "name": "What types of noise can BringBack remove?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We can remove virtually any type of digital noise: high-ISO grain, color noise, luminance noise, digital artifacts from old cameras, compression artifacts, and low-light noise. Our AI handles both uniform noise patterns and complex, irregular noise with equal effectiveness."
      }
    },
    {
      "@type": "Question",
      "name": "Will denoising make my photos look plastic or fake?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No! Our AI is specifically designed to maintain natural texture and detail while removing noise. Unlike basic noise reduction tools that can make photos look over-smoothed or artificial, our system preserves skin texture, fabric details, and other important elements."
      }
    },
    {
      "@type": "Question",
      "name": "How much does photo denoising cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer 5 high-quality photo denoising cleanups for just $2 - no subscription required. This one-time payment gives you professional-grade noise removal in seconds, compared to traditional photo editing services that charge $30-100+ per photo."
      }
    },
    {
      "@type": "Question",
      "name": "Can you clean very grainy or noisy photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI excels at removing even heavy noise from challenging photos like high-ISO night shots or old digital camera images. While results depend on the original photo, we can often make severely noisy images look clean and professional."
      }
    },
    {
      "@type": "Question",
      "name": "How long does the denoising process take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most photos are processed and cleaned in under 30 seconds. Simply upload your noisy photo and watch the grain disappear in real-time. No waiting hours or days like traditional photo editing services."
      }
    },
    {
      "@type": "Question",
      "name": "Is my data safe during processing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than denoising. Your memories remain completely private."
      }
    },
    {
      "@type": "Question",
      "name": "What if the results aren't what I expected?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We offer a 30-day money-back guarantee. If you're not satisfied with the denoising results, we'll refund your purchase - no questions asked. We're confident in our AI's ability to clean your photos, but we stand behind every enhancement."
      }
    },
    {
      "@type": "Question",
      "name": "What does denoising a photo mean?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Denoising removes unwanted grain or noise from photos—especially from low-light or high-ISO images—while preserving fine details."
      }
    },
    {
      "@type": "Question",
      "name": "How does AI denoising work on BringBack?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BringBack's AI denoising uses advanced deep learning models to differentiate noise from real detail, delivering clean, sharp images quickly via our cloud-based engine."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to denoise before editing?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, denoising first is recommended. Applying noise reduction before adding contrast or sharpening helps avoid amplifying noise."
      }
    },
    {
      "@type": "Question",
      "name": "How long does denoising take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most images are denoised in under a minute, depending on size and resolution. Larger RAW files may take slightly longer."
      }
    },
    {
      "@type": "Question",
      "name": "Is my uploaded photo secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely, photos are processed securely in the cloud and can be deleted from our servers after download to ensure privacy."
      }
    },
    {
      "@type": "Question",
      "name": "Does BringBack preserve fine details when denoising?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Our AI is trained to remove noise while intelligently retaining key details like textures and edges, avoiding oversmoothing."
      }
    },
    {
      "@type": "Question",
      "name": "Can I batch denoise multiple photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, with a paid plan, you can upload and denoise multiple photos in a single batch for faster workflow."
      }
    },
    {
      "@type": "Question",
      "name": "What image formats are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "BringBack supports JPEG, PNG, and RAW formats for denoising to accommodate various user needs."
      }
    },
    {
      "@type": "Question",
      "name": "Will denoising affect image quality?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, instead of degrading quality, denoising enhances clarity and usability, especially for noisy, underexposed, or high ISO shots."
      }
    },
    {
      "@type": "Question",
      "name": "Is the web app mobile-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, you can upload and denoise photos directly from your phone using our responsive web interface."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use BringBack for commercial photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, denoised photos can be used for editorial, commercial, or personal projects, with full usage rights included."
      }
    },
    {
      "@type": "Question",
      "name": "Do I lose color or dynamic range during denoising?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, our AI preserves color fidelity and dynamic range while effectively reducing noise."
      }
    }
  ]
}

export default function DenoisePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(denoisePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(denoiseFAQPageJsonLd) }}
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
                Clean up{" "}
                <PointerHighlight
                  rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                  pointerClassName="text-purple-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">grainy photos</span>
                </PointerHighlight>
                <br />
                and rescue
                <br />
                <PointerHighlight
                  rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                  pointerClassName="text-blue-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">low-light shots</span>
                </PointerHighlight>{" "}
                to perfection
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
                Remove distracting grain and digital noise from your photos to reveal the smooth, clean image
                underneath. Quick processing, simple to use, and a lifetime of clean shots.
              </p>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center w-full">
                <Link href="/login">

              <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
                <>
                  <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Denoise Your Photo</span>
                  <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                    <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                  </i>
                </>
              </Button>
            </Link>
            <p className="text-xs text-gray-500">
                Only $0.40 per photo
              </p>
            </div>
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
              <p className="text-gray-600 font-medium">Loved by Everyone Who Shoots at Night</p>
            </div>

                {/* Hero Compare Section */}
              <div className="pt-8 w-full">
                <div className="max-w-4xl mx-auto">
                   
                    <div className="flex justify-center px-4">
                        <div className="border rounded-xl bg-gray-50 border-gray-200 p-3">
                      <Compare
                        firstImage="/noise-removed.webp"
                        secondImage="/after-noise-removal.webp"
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        className="h-[280px] w-[400px] md:h-[600px] md:w-[900px] rounded-lg"
                        slideMode="hover"
                        firstImageAlt="Before: grainy family photo" 
                        secondImageAlt="After: Denoised family photo with bringback ai"
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
      </section>

      <DenoiseHowItWorksSection />
      <DenoiseBenefitsSection />
      <DenoiseShowcaseSection />
      <DenoiseFeaturesSection />
       {/* Technology Behind Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-4">How our AI understands noise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced signal processing meets machine learning to separate noise from actual image content
            </p>
          </div>

          {/* Process Flow */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gray-200 hidden md:block"></div>

            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">🔍 Noise Pattern Analysis</h3>
                  <p className="text-gray-600 mb-4">
                    Our AI first identifies the type of noise in your photo—whether it's high-ISO grain, color noise
                    from low light, or digital artifacts from compression.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Luminance noise</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Color noise</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      Compression artifacts
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Banding</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">🧠 Content Preservation</h3>
                  <p className="text-gray-600 mb-4">
                    While removing noise, the AI carefully preserves important details like hair texture, fabric
                    patterns, and facial features that could be mistaken for noise.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Fine details</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Textures</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Sharp edges</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Important patterns</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Filter className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">⚙️ Selective Processing</h3>
                  <p className="text-gray-600 mb-4">
                    Different areas of your photo get different treatment—smooth backgrounds get heavy denoising while
                    detailed areas like faces get gentle, precise cleaning.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Adaptive strength</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Content-aware</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Region-specific</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-16 h-16 bg-black rounded-full flex items-center justify-center relative z-10">
                  <Sparkle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-xl font-bold text-black mb-3">✨ Quality Verification</h3>
                  <p className="text-gray-600 mb-4">
                    Before delivering results, our AI checks that no important details were lost and that the noise
                    reduction looks natural and professional.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Natural results</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Detail retention</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Artifact-free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
 

      <DenoiseFAQSection />
      <DenoiseMemoriesSection />


      <Footer />
    </div>
  )
}
