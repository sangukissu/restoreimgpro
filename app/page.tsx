import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PointerHighlight } from "@/components/pointer-highlight"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import { GridPattern } from "@/components/grid-pattern"
import HowItWorksSection from "@/components/how-it-works-section"
import BenefitsSection from "@/components/benefits-section"
import FeaturesSection from "@/components/features-section"
import ShowcaseSection from "@/components/showcase-section"
import FAQSection from "@/components/faq-section"
import MemoriesSection from "@/components/memories-section"
import TestimonialsSection from "@/components/testimonials-section"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "BringBack - AI Photo Restoration | Restore Old & Damaged Photos Online",
  description: "Transform your old, faded, torn or damaged photos into vibrant memories with our advanced AI technology. Quick restoration, simple process, and lifetime preserved moments. Start restoring your precious photos today!",
  keywords: "photo restoration, AI photo repair, old photo restoration, damaged photo fix, vintage photo restoration, image enhancement, photo recovery, digital photo restoration, restore photos online, fix old photos",
  openGraph: {
    title: "BringBack - AI Photo Restoration | Restore Old & Damaged Photos Online",
    description: "Transform your old, faded, torn or damaged photos into vibrant memories with our advanced AI technology. Quick restoration, simple process, and lifetime preserved moments.",
    images: [
      {
        url: '/blurred-restored.webp',
        width: 1200,
        height: 630,
        alt: 'Before and after photo restoration example showing damaged photo transformed into vibrant memory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "BringBack - AI Photo Restoration | Restore Old & Damaged Photos Online",
    description: "Transform your old, faded, torn or damaged photos into vibrant memories with our advanced AI technology.",
    images: ['/blurred-restored.webp'],
  },
}

const homePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#webapp',
  name: 'BringBack Photo Restoration',
  description: 'Transform your old, damaged photos into stunning restored images with our advanced AI technology.',
  url: 'https://bringback.pro/',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free photo restoration service with premium options available'
  },
  featureList: [
    'AI-powered photo restoration',
    'Repair damaged photos',
    'Enhance old and faded images',
    'Remove scratches and tears',
    'Color restoration',
    'High-quality output'
  ],
  screenshot: 'https://bringback.pro/blurred-restored.webp'
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <Header />
      {/* Hero Section */}
      <section className="relative pb-12 overflow-hidden">
          {/* Grid Pattern Background - positioned at the very top */}
          <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_50%_20%,white,transparent)]",
            "absolute inset-x-0 top-0 h-full skew-y-12 fill-gray-200/70 stroke-gray-300/70",
          )}
        />
      <div className="px-4 py-12 pt-32 max-w-[85rem] 2xl:max-w-[100rem] mx-auto text-center" >
      
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 mb-4">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </div>
            <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-800 leading-tight">
              Bring back{" "}
              <PointerHighlight
                rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                pointerClassName="text-purple-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">old photos</span>
              </PointerHighlight>
              <br />
              and
              <br />
              <PointerHighlight
                rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                pointerClassName="text-blue-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="relative z-10">faded memories</span>
              </PointerHighlight>{" "}
              to life
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
              Restore your old, faded, torn or damaged photos into vibrant memories again. Quick restoration simple
              process and a lifetime of preserved moments.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <Link href="/dashboard">
            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Restore Your Photo</span>
              <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
            </Button>
            </Link>
          
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
            <p className="text-gray-600 font-medium">Loved by Everyone</p>
          </div>
        
        </div>
        </div>
          <div>
            <div className="flex justify-center">
              <div className="py-4 border rounded-3xl bg-neutral-50 border-neutral-200 px-4">
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc="https://youtu.be/u3tc96poZ6Q?si=v_NauGytkfuvjQf0"
                  thumbnailSrc="/blurred-restored.webp"
                  thumbnailAlt="Photo restoration demo video"
                  className="h-[250px] w-[400px] sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[600px] lg:h-[500px] lg:w-[800px] xl:h-[720px] xl:w-[1080px] rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
      </section>

      <HowItWorksSection />
      <BenefitsSection />
      <ShowcaseSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <MemoriesSection />

   

      {/* Footer */}
      <Footer />
    </div>
  )
}
