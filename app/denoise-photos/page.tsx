import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Play, Star, Search, Brain, Filter, Sparkle } from "lucide-react"
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Link from "next/link"
import DenoiseHowItWorksSection from "@/components/pages/denoise-how-it-works-section"
import DenoiseShowcaseSection from "@/components/pages/denoise-showcase-section"
import DenoiseFeaturesSection from "@/components/pages/denoise-features-section"
import DenoiseFAQSection from "@/components/pages/denoise-faq-section"
import { CTA } from '@/components/landing/CTA';
import { Clients } from '@/components/landing/Clients';
import DenoiseTechnologySection from "@/components/pages/denoise-technology-section"
import { Compare } from "@/components/ui/compare"
import { Pricing } from '@/components/landing/Pricing';



export const metadata: Metadata = {
  title: "AI Photo Denoise - Remove Grain & Noise Instantly | BringBack",
  description:
    "Clean up grainy, noisy photos with AI. Remove digital noise, grain, and artifacts from low-light shots in seconds.",
  keywords: "denoise photo, remove grain, fix grainy photos, AI noise reduction, clean up photos",
  robots: "index, follow",
  alternates: {
    canonical: "/denoise-photos",
  },
  openGraph: {
    title: "AI Photo Denoise - Remove Grain & Noise Instantly | BringBack",
    description:
      "Clean up grainy, noisy photos with AI. Remove digital noise, grain, and artifacts from low-light shots in seconds.",
    type: "website",
    url: "https://bringback.pro/denoise-photos",
  },
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
        "text": "We offer 5 high-quality photo denoising cleanups for just $2.49 - no subscription required. This one-time payment gives you professional-grade noise removal in seconds, compared to traditional photo editing services that charge $30-100+ per photo."
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
        "text": "Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you."
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
    <div className="min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(denoisePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(denoiseFAQPageJsonLd) }}
      />
      <Navbar />
      {/* Hero Section */}
      <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 overflow-visible h-auto lg:min-h-screen pt-32 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center h-full">

          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 justify-center h-full relative">

            {/* Available Badge */}
            <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full mb-8 shadow-lg shadow-black/5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
              <span className="text-sm font-semibold tracking-wide">AI Powered Denoising</span>
            </div>

            {/* Heading */}
            <h1 className="relative z-10 text-[3.5rem] sm:text-[4rem] md:text-[4.5rem] xl:text-[5.5rem] font-[850] tracking-tighter leading-[0.95] text-[#111111] mb-6">
              Clean up <br />
              <span className="text-gray-400 relative">
                Grainy Photos.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-10 font-medium leading-relaxed">
              Remove distracting grain and digital noise from your photos to reveal the smooth, clean image underneath. Rescue low-light shots in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row items-center gap-3 sm:gap-4 mb-10 sm:mb-12 w-full max-w-full overflow-visible">
              {/* Primary: Orange Button */}
              <Link href="/login">
                <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
                  <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Denoise Photo</span>
                  <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                  </div>
                </button>
              </Link>

              {/* Secondary: White Button */}
              <Link href="#how-it-works">
                <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-brand-black pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/5 shrink-0">
                  <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">See Examples</span>
                  <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gray-100 rounded-full flex items-center justify-center">
                    <Play className="text-brand-black fill-brand-black ml-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pl-2">
              <div className="flex items-center relative h-12 w-[140px]">
                {[1, 2, 3].map((i, index) => (
                  <div
                    key={i}
                    className={`absolute top-0 w-12 h-12 rounded-2xl border-2 border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                      ${index === 0 ? 'left-0 z-30 -rotate-6' : ''}
                      ${index === 1 ? 'left-8 z-20 rotate-6' : ''}
                      ${index === 2 ? 'left-16 z-10 -rotate-3' : ''}
                    `}
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/thumb/men/${i * 12 + 8}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="absolute left-24 top-0 w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-xs font-bold border-2 border-[#F2F2F0] shadow-sm z-40 rotate-12 hover:rotate-0 transition-transform">
                  130+
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="fill-[#FF4D00] text-[#FF4D00]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Trusted by 190+ Families</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Demo */}
          <div className="lg:col-span-6 flex items-center justify-center w-full lg:h-full pt-12 lg:pt-0">
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-2xl select-none group border-[6px] border-white">
              <Compare
                firstImage="/noise-removed.webp"
                secondImage="/after-noise-removal.webp"
                firstImageClassName="object-cover w-full h-full"
                secondImageClassname="object-cover w-full h-full"
                className="w-full h-full"
                slideMode="hover"
                firstImageAlt="Before: grainy photo"
                secondImageAlt="After: Denoised photo"
                showHandlebar={true}
              />
              {/* Overlay Badge */}
              <div className="absolute top-6 left-6 z-30 bg-black/40 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 pointer-events-none">
                <Sparkles size={16} className="text-brand-orange animate-pulse" />
                AI Denoise
              </div>
            </div>
          </div>

        </div>
      </section>

      <DenoiseHowItWorksSection />
      <Pricing />
      <DenoiseShowcaseSection />
      <DenoiseFeaturesSection />
      <Clients />
      <DenoiseTechnologySection />
      <DenoiseFAQSection />
      <CTA />
      <Footer />
    </div>
  )
}
