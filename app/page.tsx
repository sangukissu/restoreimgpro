import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Cover } from "@/components/ui/cover" 
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
  name: 'BringBack – AI Old Photo Restoration Web App',
  description: 'BringBack is an AI-powered web app where users upload old, faded, or damaged photos and instantly receive restored, vibrant images automatically. Users can also use the app to denoise, deblur, and remove grain from photos.',
  url: 'https://bringback.pro/',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    name: 'BringBack Restoration Plans',
    url: 'https://bringback.pro/pricing',
    priceCurrency: 'USD',
    price: '2',
    eligibleRegion: {
      '@type': 'Place',
      name: 'Worldwide'
    }
  },
  featureList: [
    'AI-powered photo restoration',
    'Repair damaged photos',
    'Enhance old and faded images',
    'Remove scratches and tears',
    'Color restoration',
    'High-quality output',
    'Denoise photo online',
    'Remove grain from photos',
    'Remove noise from photos',
    'Deblur photos online',
    'Restore old photos',
    'Restore faded photos',
  ],
  screenshot: 'https://bringback.pro/screenshot.png'
}

const homeFAQPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does AI photo restoration actually work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI analyzes millions of photo patterns to understand how damage occurs and how to reverse it. It identifies faces, textures, and objects, then intelligently reconstructs missing or damaged areas while preserving the original character of your photo. The process happens in seconds, but the technology behind it represents years of machine learning development.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of photo damage can BringBack fix?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We can restore virtually any type of damage: tears, scratches, water stains, fading, yellowing, blur, darkness, cracks, and missing pieces. Our AI handles both physical damage (like tears) and quality issues (like blur or low resolution). If you can see some of the original photo, we can likely restore it.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does photo restoration cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer 5 high-quality photo restorations for just $2 - no subscription required. This one-time payment gives you professional-grade results in seconds. Compare that to traditional photo restoration services that charge $50-200 per photo and take weeks to complete.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my personal data and photos safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than restoration. Your memories remain completely private and belong only to you.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long does the restoration process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most photos are restored in under 30 seconds. Upload your photo, and watch the transformation happen in real-time. No waiting days or weeks like traditional restoration services - you get professional results instantly.'
      }
    },
    {
      '@type': 'Question',
      name: 'What if I\'m not satisfied with the results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We\'re confident you\'ll love the results, but if you\'re not completely satisfied, we offer a full refund within 30 days. Our AI produces consistently high-quality results, but we stand behind every restoration with our satisfaction guarantee.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I use restored photos commercially?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Once restored, the photos are yours to use however you\'d like - personal use, commercial projects, printing, sharing, or selling. We don\'t retain any rights to your restored images. They\'re your memories, enhanced and returned to you.'
      }
    },
    {
      '@type': 'Question',
      name: 'What file formats do you support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support all common image formats including JPG, PNG, TIFF, and BMP. You can upload photos up to 50MB in size. The restored photo will be delivered in high-resolution PNG format, perfect for printing or digital use.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does this compare to manual photo restoration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional restoration can take weeks and cost $50-200 per photo. Our AI delivers comparable or better results in seconds for a fraction of the cost. While manual restoration has its place for extremely rare or historically significant photos, our AI is perfect for family photos and personal memories.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you restore very old or severely damaged photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our AI excels at restoring even severely damaged photos from decades ago. The more of the original photo that\'s visible, the better the results. Even if large portions are missing or damaged, our AI can often reconstruct them based on surrounding context and learned patterns.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is old photo restoration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Old photo restoration uses AI to automatically repair faded, torn, scratched, or discolored photographs—returning them to vibrant, clear versions.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does it cost to restore an old photo using BringBack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack offers a free trial to restore your first photo. Paid plans for higher resolution or batch processing are available through our pricing page.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can BringBack repair water-damaged or sun-faded photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our AI module is trained to handle common damage like water stains, fading, scratches, and sun-exposure effects.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is the restoration fully automatic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Upload your image, and our AI automatically restores color, sharpness, and detail—no manual intervention needed.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long does it take to restore a photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most photos are fully restored in under 60 seconds, depending on image size and server load.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can BringBack restore scratched or torn old photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our AI handles structured defects like scratches and tears and recovers details while maintaining realism.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is the restoration quality better than manual editing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'AI restoration is faster and highly effective for most photos. It automates complex tasks—yet keeps sentimental accuracy—often in seconds rather than hours.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are my uploaded photos kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Photos are processed securely, and you may choose to delete them from our servers after download for privacy.'
      }
    },
    {
      '@type': 'Question',
      name: 'What image formats does BringBack support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support common formats like JPEG, PNG, and TIFF to ensure compatibility with scanned or digital old photographs.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I restore multiple old photos at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, with a paid plan, batch restoration is available so you can process multiple images together.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I print or enlarge restored photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Definitely. Restored images maintain high resolution and quality, ideal for printing or enlargements.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are restored photos usable for commercial purposes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You retain full rights to restored images and may use them for personal, editorial, or commercial purposes.'
      }
    }
  ]
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFAQPageJsonLd) }}
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
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <Link href="/dashboard">
            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Restore Your Photo</span>
              <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </i>
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
            {/* Our Promise Section - Matching existing design patterns */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header - matching other sections */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-black mb-6">
              <Cover>Our Promise</Cover> to You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built on trust, transparency, and technical excellence
            </p>
          </div>

          {/* Content - matching the border-left style from benefits section */}
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">100% Privacy Guaranteed</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your photos are processed securely and automatically deleted from our servers within 30 minutes. We
                never store, share, or use your personal photos for any purpose other than restoration.
              </p>
              <div className="text-sm text-gray-500">🔒 Your memories remain completely private</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Lightning Fast Results</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Most photos are restored in under 30 seconds. No waiting days or weeks like traditional restoration
                services - you get professional results instantly.
              </p>
              <div className="text-sm text-gray-500">⚡ Results in under 30 seconds</div>
            </div>

            <div className="border-l-2 border-gray-200 pl-8">
              <h3 className="text-2xl font-bold text-black mb-3">Quality Guarantee</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Not satisfied with the results? Get a full refund within 30 days. We're confident in our AI's ability to
                restore your memories perfectly.
              </p>
              <div className="text-sm text-gray-500">💰 30-day money-back guarantee</div>
            </div>
          </div>

          {/* Bottom message - matching memories section style */}
          <div className="text-center mt-16 pt-8 border-t border-gray-100">
            <p className="text-lg text-gray-600 italic">
              "We built BringBack because we believe every memory deserves to be preserved perfectly."
            </p>
            <p className="text-gray-500 mt-2">— The BringBack Team</p>
          </div>
        </div>
      </section>

      <FAQSection />
      <MemoriesSection />

   

      {/* Footer */}
      <Footer />
    </div>
  )
}
