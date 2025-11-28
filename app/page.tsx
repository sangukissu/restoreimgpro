import Link from "next/link"

import type { Metadata } from "next"
import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { NostalgicHug } from '@/components/landing/NostalgicHug';
import { Showcase } from '@/components/landing/Showcase';
import { PhotoAnimation } from '@/components/landing/PhotoAnimation';
import { WhyUs } from '@/components/landing/WhyUs';
import { Benefits } from '@/components/landing/Benefits';
import { Pricing } from '@/components/landing/Pricing';
import { Clients } from '@/components/landing/Clients';
import { FAQ } from '@/components/landing/FAQ';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/landing/CTA';


export const metadata: Metadata = {
  title: "Restore, Colorize & Animate Old damaged Photos Online | BringBack AI",
  description: "BringBack AI restores old, faded, and damaged photos to perfection. Our tools repair color, fix scratches and tears, and bring your portraits to life with realistic animation.",
  keywords: "photo restoration, AI photo repair, old photo restoration, photo animation, revive old photos, damaged photo fix, vintage photo restoration, animate photos, bring photos to life, digital photo restoration, digital photo frames, photo framing, custom photo frames",

}

const homePageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#webapp',
  name: 'Restore, Colorize & Animate Old damaged Photos Online | BringBack AI',
  description: 'BringBack AI restores old, faded, and damaged photos to perfection. Our tools repair color, fix scratches and tears, and bring your portraits to life with realistic animation.',
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

const nostalgicHugVideoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Nostalgic Hug — BringBack AI',
  description:
    'The world’s first AI that bridges the gap of time, creating heartwarming reunion videos from static photos.',
  thumbnailUrl: 'https://img.youtube.com/vi/Y0rdFdDdd10/hqdefault.jpg',
  uploadDate: '2025-11-28T00:00:00Z',
  contentUrl: 'https://www.youtube.com/watch?v=Y0rdFdDdd10',
  embedUrl: 'https://www.youtube.com/embed/Y0rdFdDdd10',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#nostalgic-hug'
  }
}

const photoAnimationTalkingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Demo — Gentle Talking',
  description:
    'Transform static portraits into realistic videos with gentle talking motions using BringBack AI.',
  thumbnailUrl: 'https://bringback.pro/dashboard-compare.png',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/speaking.mp4',
  embedUrl: 'https://bringback.pro/#photo-animation',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#photo-animation'
  }
}

const photoAnimationWaveJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Demo — Smile + Wave',
  description:
    'The person in the image smiles warmly and waves their hand in a friendly greeting gesture.',
  thumbnailUrl: 'https://bringback.pro/dashboard-compare.png',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/video-animation1.mp4',
  embedUrl: 'https://bringback.pro/#photo-animation',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#photo-animation'
  }
}

const photoAnimationLookAroundJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Demo — Smile + Look Around',
  description:
    'Curious movements, looking around naturally with eyes and head turning gently.',
  thumbnailUrl: 'https://bringback.pro/dashboard-compare.png',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/smile-and-look.mp4',
  embedUrl: 'https://bringback.pro/#photo-animation',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#photo-animation'
  }
}

const photoAnimationWarmGazeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Demo — Warm Gaze',
  description:
    'Steady, warm eye contact with a loving, subtle smile and peaceful expression.',
  thumbnailUrl: 'https://bringback.pro/dashboard-compare.png',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/warm-gaze.mp4',
  embedUrl: 'https://bringback.pro/#photo-animation',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#photo-animation'
  }
}

const howItWorksVideoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation — Blink & Tilt',
  description:
    'Example of subtle, realistic motion added to a restored photo, showing blinking and head tilting.',
  thumbnailUrl: 'https://bringback.pro/childhood-memories-colorized.webp',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/blink-tilt-animation.mp4',
  embedUrl: 'https://bringback.pro/#how-it-works',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/'
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/#how-it-works'
  }
}

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFAQPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nostalgicHugVideoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoAnimationTalkingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoAnimationWaveJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoAnimationLookAroundJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(photoAnimationWarmGazeJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksVideoJsonLd) }}
      />
      {/* Navbar - Fixed to stay at top during scroll */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <Navbar />
      </header>

      {/* Main Content */}
      <main>
        <Hero />
        <HowItWorks />
        <NostalgicHug />
        <Showcase />
        <PhotoAnimation />
        <WhyUs />
        <Benefits />
        <Pricing />
        <Clients />
        <FAQ />
        <CTA />
      </main>

      <Footer />

      {/* Decorative Gradients (Subtle background noise/glows to match high-end feel) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gray-200 rounded-full blur-[100px] opacity-40"></div>
      </div>
    </div>
  )
}
