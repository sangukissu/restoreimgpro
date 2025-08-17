import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PointerHighlight } from "@/components/pointer-highlight"
import { GridPattern } from "@/components/grid-pattern"
import DeblurHowItWorksSection from "@/components/pages/deblur-how-it-works-section"
import DeblurBenefitsSection from "@/components/pages/deblur-benefits-section"
import DeblurShowcaseSection from "@/components/pages/deblur-showcase-section"
import DeblurFeaturesSection from "@/components/pages/deblur-features-section"
import DeblurTestimonialsSection from "@/components/pages/deblur-testimonials-section"
import DeblurFAQSection from "@/components/pages/deblur-faq-section"
import DeblurMemoriesSection from "@/components/pages/deblur-memories-section"
import { cn } from "@/lib/utils"
import { Compare } from "@/components/ui/compare"
import Link from "next/link"



export const metadata: Metadata = {
  title: "AI Photo Deblur - Fix Blurry Photos Instantly | BringBack",
  description:
    "Turn blurry, out-of-focus photos into crystal-clear images with AI. Fix motion blur, camera shake, and missed focus in seconds.",
  keywords: "deblur photo, unblur image, fix blurry photo, sharpen image, AI photo enhancement",
  robots: "index, follow",
}

const deblurPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/deblur#webapp',
  name: 'AI Photo Deblur Tool',
  description: 'Self-serve web application that automatically fixes blurry, out-of-focus photos using advanced AI technology.',
  url: 'https://bringback.pro/deblur',
  applicationCategory: 'PhotoEditingApplication',

  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free photo deblur service with premium options available'
  },
  featureList: [
    'AI-powered photo deblurring',
    'Motion blur correction',
    'Camera shake removal',
    'Focus enhancement',
    'Instant processing'
  ],
  provider: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  }
}

const deblurFAQPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How can I deblur a photo online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can deblur a photo online instantly using BringBack. Simply upload your blurry photo, and our AI automatically restores it with improved sharpness and clarity.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is BringBack free to use for photo deblurring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack offers a free trial to deblur photos. For higher resolution results and batch processing, you can choose from affordable paid plans.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of blurry photos can BringBack fix?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack can fix motion blur, out-of-focus images, low-light photos, and old scanned pictures that appear soft or unclear.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do I need to download any software to deblur photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No downloads are required. BringBack is a web app that works directly in your browser.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can BringBack deblur old scanned family photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BringBack specializes in restoring and deblurring old scanned photos, making them look clearer and more detailed.'
      }
    },
    {
      '@type': 'Question',
      name: 'How fast does it take to deblur a photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most photos are processed in under 30 seconds, depending on image size and resolution.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my uploaded photo safe on BringBack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Uploaded photos are processed securely and can be deleted after restoration to protect your privacy.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does BringBack work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can upload and deblur photos directly from your phone using BringBack\'s mobile-friendly web app.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I deblur multiple photos at once?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With a paid plan, BringBack supports batch deblurring so you can restore multiple images in one go.'
      }
    },
    {
      '@type': 'Question',
      name: 'What image formats does BringBack support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack supports JPEG, PNG, and WebP image formats for photo deblurring and restoration.'
      }
    },
    {
      '@type': 'Question',
      name: 'Will deblurring reduce the quality of my photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. BringBack enhances sharpness and details while preserving the original photo quality.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can BringBack fix both blur and noise in photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The AI engine reduces noise while deblurring, giving you a cleaner, sharper final image.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is AI deblurring better than manual editing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For most cases, AI deblurring is faster, easier, and more effective than manual Photoshop edits, especially for everyday photos.'
      }
    },
    {
      '@type': 'Question',
      name: 'Does BringBack support high-resolution photo deblurring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BringBack can deblur photos up to very high resolutions, making it ideal for prints and professional use.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I use BringBack to deblur photos for commercial projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You are free to use deblurred and restored photos from BringBack for both personal and commercial purposes.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does AI photo deblurring actually work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI analyzes the type and pattern of blur in your photo, then applies sophisticated algorithms to reverse the blurring process. It understands the physics of how motion blur, focus blur, and camera shake affect images, allowing it to reconstruct sharp details from blurry areas while preserving the natural look of your photo.'
      }
    },
    {
      '@type': 'Question',
      name: 'What types of blur can BringBack fix?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We can fix virtually any type of blur: motion blur from moving subjects or camera shake, out-of-focus blur from missed autofocus, low-light softness, and general image blur. Our AI handles both uniform blur (like camera shake) and complex blur patterns (like moving subjects) with equal effectiveness.'
      }
    },
    {
      '@type': 'Question',
      name: 'Will my photos look artificial after deblurring?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No! Our AI is specifically trained to enhance sharpness while preserving the natural texture and character of your photos. Unlike basic sharpening filters that can create harsh edges or artifacts, our system intelligently enhances details without making images look over-processed or fake.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much does photo deblurring cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer 5 high-quality photo deblurring enhancements for just $2 - no subscription required. This one-time payment gives you professional-grade results in seconds, compared to traditional photo editing services that charge $50-200+ per photo.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you fix severely blurry photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our AI excels at recovering details from even heavily blurred images. While the results depend on the original photo quality, we can often restore clarity to photos that seem completely unusable. The more detail visible in the original blur, the better the results.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long does the deblurring process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most photos are processed and deblurred in under 30 seconds. Simply upload your blurry photo and watch it transform into a sharp, clear image in real-time. No waiting hours or days like traditional photo editing services.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my data safe during processing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Your photos are processed securely and automatically deleted from our servers within 30 minutes. We never store, share, or use your personal photos for any purpose other than deblurring. Your memories remain completely private.'
      }
    },
    {
      '@type': 'Question',
      name: 'What if the results aren\'t perfect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the deblurring results, we\'ll refund your purchase - no questions asked. We\'re confident in our AI\'s ability to enhance your photos, but we stand behind every enhancement.'
      }
    }
  ]
}

export default function DeblurPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deblurPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(deblurFAQPageJsonLd) }}
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
                Turn{" "}
                <PointerHighlight
                  rectangleClassName="bg-purple-100 border-purple-300 leading-tight px-2"
                  pointerClassName="text-purple-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">blurry photos</span>
                </PointerHighlight>
                <br />
                and
                <br />
                <PointerHighlight
                  rectangleClassName="bg-blue-100 border-blue-300 leading-tight px-2"
                  pointerClassName="text-blue-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">missed moments</span>
                </PointerHighlight>{" "}
                into sharp focus
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-tight">
                Fix your out-of-focus, shaky, or blurred photos into crystal-clear images. Instant sharpening, simple
                process, and a second chance at a perfect shot.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
              <Link href="/login">

              <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
                <>
                  <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Unblur Your Photo</span>
                  <i className="absolute right-1.5 top-1.5 bottom-1.5 rounded-sm z-10 grid w-1/5 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                    <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                  </i>
                </>
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
              <p className="text-gray-600 font-medium">Trusted by Photographers & Memory Keepers</p>
            </div>

            {/* Hero Comapre Section */}
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
                        firstImageAlt="Before: Blurred family photo" 
                        secondImageAlt="After: Deblurred and restored family photo with bringback ai"
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

      <DeblurHowItWorksSection />
      <DeblurBenefitsSection />
      <DeblurShowcaseSection />
      <DeblurFeaturesSection />
      <DeblurTestimonialsSection />

      {/* Social Proof Section */}
      <section className="px-4 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Trusted by photographers worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands who've already sharpened their blurry shots</p>
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
                "My concert photos were all blurry from the excitement. BringBack made them sharp enough to print and
                frame. The details came back perfectly!"
              </p>
              <p className="text-sm font-medium text-black">Alex P.</p>
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
                "I thought my wedding photos were ruined by camera shake. This AI brought them back to life - they look
                professional now!"
              </p>
              <p className="text-sm font-medium text-black">Maria S.</p>
            </div>
          </div>
        </div>
      </section>

      <DeblurFAQSection />
      <DeblurMemoriesSection />

      {/* Final CTA Section */}
      <section className="px-4 py-20 max-w-6xl mx-auto text-center">
        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-4">Ready to bring your blurry photos into focus?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Don't let blur steal the clarity from your precious moments. Every photo deserves to be seen in perfect
              focus.
            </p>

            <Button className="px-8 py-6 group relative overflow-hidden w-full sm:w-auto" size="lg">
              <>
                <span className="mr-10 transition-opacity duration-500 group-hover:opacity-0">Start Deblurring Now</span>
                <i className="absolute right-1 top-1 bottom-1 rounded-sm z-10 grid w-1/4 place-items-center transition-all duration-500 bg-primary-foreground/15 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95 text-black-500">
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </i>
              </>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
