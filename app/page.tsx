import Link from "next/link"
import { Sparkles, ChevronRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { FramerButton } from "@/components/ui/framer-button"
import { PointerHighlight } from "@/components/pointer-highlight"
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog"
import HowItWorksSection from "@/components/how-it-works-section"
import BenefitsSection from "@/components/benefits-section"
import FeaturesSection from "@/components/features-section"
import ShowcaseSection from "@/components/showcase-section"
import FAQSection from "@/components/faq-section"
import MemoriesSection from "@/components/memories-section"
import InlinePhotosHeadline from "@/components/inline-photos-headline"
import type { Metadata } from "next"
import Image from "next/image"


export const metadata: Metadata = {
  title: "BringBack - AI Photo Restoration, Animation & Digital Frames | Revive Old Memories",
  description: "BringBack restores old, faded, or damaged photos, brings them to life with AI animation, and creates beautiful digital frames. Repair colors, fix damage, and showcase memories in stunning frames in seconds.",
  keywords: "photo restoration, AI photo repair, old photo restoration, photo animation, revive old photos, damaged photo fix, vintage photo restoration, animate photos, bring photos to life, digital photo restoration, digital photo frames, photo framing, custom photo frames",
  
}

const homePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#webapp',
  name: 'BringBack – AI Photo Restoration, Animation & Digital Frames',
  description: 'BringBack is an AI-powered web app where users upload old, faded, or damaged photos and instantly receive restored, vibrant images. Users can also bring photos to life with subtle AI animations and create beautiful digital frames for display.',
  url: 'https://bringback.pro/',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    name: 'BringBack Restoration, Animation & Framing Plans',
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
    'Repair damaged or torn photos',
    'Enhance old and faded images',
    'Automatic color restoration',
    'Side-by-side before/after preview',
    'Bring photos to life with AI animations',
    'Animate photos with smiling and waving gestures',
    'Create beautiful digital photo frames',
    'Customizable frame styles and colors',
    'Add personalized captions to framed photos',
    'Fast processing – results under 30 seconds',
    'High-quality output for download and sharing'
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
      name: 'How does AI photo animation work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI animation technology analyzes facial features and expressions in your photos to create natural, lifelike movements. It can generate subtle animations like smiling, waving, blinking, and head tilts while maintaining the original character and authenticity of the person in the photo.'
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
      name: 'What animation styles are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer three animation presets: Smile + Wave (natural smile with gentle wave gesture), Subtle Blink + Head Tilt (soft blinking with slight head movement), and Smile + Look Around (light smile with curious gaze movement). Each animation is designed to bring your photos to life naturally.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much do photo restoration and animation cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Photo restoration: We offer 5 high-quality photo restorations for just $2.49 - no subscription required. Photo animation: Each animation costs 10 credits (available through our pricing plans). Both services deliver professional-grade results in seconds, compared to traditional services that charge $50-200 per photo and take weeks to complete.'
      }
    },
    {
      '@type': 'Question',
      name: 'Is my personal data and photos safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. Your photos are processed securely and uploaded media automatically deleted from our servers within 30 minutes and the generated media is auotmatically deleted after 7 days. We never store, share, or use your personal photos for any purpose other than restoration or animation. Your memories remain completely private and belong only to you.'
      }
    },
    {
      '@type': 'Question',
      name: 'How long does the restoration and animation process take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Photo restoration takes under 30-60 seconds, while photo animation typically takes 2-3 minutes. Both processes happen in real-time with no waiting days or weeks like traditional services.'
      }
    },
    {
      '@type': 'Question',
      name: 'What if I\'m not satisfied with the results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We\'re confident you\'ll love the results, but if you\'re not completely satisfied, we offer a full refund within 30 days. Our AI produces consistently high-quality results for both restoration and animation, but we stand behind every service with our satisfaction guarantee.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I use restored and animated photos commercially?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Once processed, the photos and videos are yours to use however you\'d like - personal use, commercial projects, printing, sharing, or selling. We don\'t retain any rights to your enhanced content. They\'re your memories, enhanced and returned to you.'
      }
    },
    {
      '@type': 'Question',
      name: 'What file formats do you support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We support all common image formats including JPG, PNG, TIFF, and BMP for both restoration and animation. You can upload photos up to 50MB in size. Restored photos are delivered in high-resolution PNG format, while animations are provided as MP4 videos.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can you animate very old or damaged photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For best animation results, we recommend restoring damaged photos first, then animating them. Our AI works best with clear facial features and good image quality. However, we can often animate moderately damaged photos with visible faces.'
      }
    },
    {
      '@type': 'Question',
      name: 'How does this compare to manual photo restoration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional restoration can take weeks and cost $50-200 per photo. Our AI delivers comparable or better results in seconds for a fraction of the cost. Animation would be nearly impossible manually, but our AI creates natural movements that bring your memories to life instantly.'
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
        text: 'Old photo restoration uses AI to automatically repair faded, torn, scratched, or discolored photographs—returning them to vibrant, clear versions that can then be animated to bring your ancestors to life.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are my uploaded photos kept private?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Photos are processed securely, and uploaded photos are automatically deleted from our servers within 30 minutes and generated media is deleted after 7 days for privacy. We never use your personal photos for training or any other purpose.'
      }
    },
    {
      '@type': 'Question',
      name: 'What digital frame styles are available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer a variety of digital frame styles including classic wooden frames, modern metallic frames, vintage ornate frames, and minimalist borders. You can customize colors, add matting, and include personalized captions to create the perfect display for your restored memories.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much do digital frames cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Digital frame creation is included with our restoration and animation services for free. Once you\'ve restored or animated your photo, you can add beautiful frames at no additional cost. The frames are delivered as high-resolution images perfect for printing or digital display.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I print or enlarge restored photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Definitely. Restored images and framed photos maintain high resolution and quality, ideal for printing or enlargements. Animated videos can be shared digitally or converted to GIFs for various uses.'
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
        <div className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center  pointer-events-none" />
     
      <div className="px-4 py-12 pt-32 max-w-[85rem] 2xl:max-w-[100rem] mx-auto text-center" >
      
        <div className="relative z-10 space-y-6">
          <div className="space-y-6">
            <div className="shadow-xl shadow-zinc-500/10 text-black inline-flex items-center px-3 py-1 rounded-full bg-white/50 text-xs font-medium mb-4 backdrop-blur-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              BringBack AI
            </div>
            <InlinePhotosHeadline
              beforeText="Bring back"
              imageUrl1="/childhood-memories-black-and-white.webp"
              betweenText="old photos &"
              accentWord="faded memories"
              imageUrl2="/childhood-memories-colorized.webp"
              afterText="to life"
            />

            <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-tight -mt-4">
              Restore, animate, and frame your precious memories. Our AI revives faded, torn, damaged or black-and-white photos, makes your loved ones smile and wave again, and creates beautiful digital frames perfect for display.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center w-full">
            <Link href="/dashboard">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden w-full sm:w-auto">
            Bring Back Memories
          </FramerButton>
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
                <div className="w-8 h-8 rounded-full bg-stone-800 border-2 border-white flex items-center justify-center">
                  <span className="text-stone-200 text-xs font-bold">17+</span>
                </div>
              </div>
              <div className="flex text-zinc-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-lg sm:text-xl text-stone-700 max-w-3xl mx-auto leading-tight">Loved by Everyone</p>
          </div>
          
          {/* Peerlist Badge */}
          <div className="flex justify-center pt-4 space-x-4">
            <a href="https://peerlist.io/harvansh/project/bringback-ai" target="_blank" rel="noopener noreferrer">
              <Image src="/peerlist.svg" alt="Peerlist Badge" className="h-12 sm:h-16 md:h-18 w-auto" width={171} height={54} />
            </a>
              </div>
        
        </div>
        </div>
          <div>
            <div className="flex justify-center">
              <div className="py-4 border rounded-3xl bg-white border-neutral-200 px-4">
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc="https://youtu.be/K_CYXkv2Yso"
                  thumbnailSrc="/video-thumbnail.webp"
                  thumbnailAlt="Photo restoration demo video"
                  className="h-[250px] w-[380px] sm:h-[300px] sm:w-[450px] md:h-[400px] md:w-[600px] lg:h-[500px] lg:w-[800px] xl:h-[720px] xl:w-[1080px] rounded-2xl overflow-hidden"
                />
              </div>
            </div>
          </div>
      </section>

      <HowItWorksSection />
      <MemoriesSection />
            <ShowcaseSection />
      <BenefitsSection />

      <FeaturesSection />


      <FAQSection />

   
    
       {/* Emotional Connection */}
             <section className="px-4 py-20 max-w-6xl mx-auto text-center">

        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-gray-200 pt-12">
              <blockquote className="text-2xl md:text-3xl font-light text-gray-800 italic leading-relaxed">
                "Every photo tells a story. Every animation brings that story to life. Every memory deserves to be
                preserved, restored, and shared with future generations."
              </blockquote>
              <div className="mt-8 mx-auto">
              

            <Link href="/dashboard">
            
             <FramerButton variant="primary" icon={<ChevronRight className="w-4 h-4" />} className="text-md py-6 group relative overflow-hidden  sm:w-auto">
            Start bringing memories to life
          </FramerButton>
            </Link>
              </div>
            </div>
          </div>
        </div>
        </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
