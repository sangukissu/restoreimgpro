import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from "next"
import AIAnimationHero from "@/components/ai-photo-animation/hero"
import AnimationStylesGrid from "@/components/ai-photo-animation/styles-grid"
import AIAnimationHowItWorks from "@/components/ai-photo-animation/how-it-works"
import AIAnimationFeatures from "@/components/ai-photo-animation/features"
import { CTA } from '@/components/landing/CTA';
import AIAnimationFAQ from "@/components/ai-photo-animation/faq"
import { Pricing } from "@/components/landing/Pricing"


export const metadata: Metadata = {
  title: "AI Photo Animation: Bring Your Old Photos to Life | BringBack AI",
  description:
    "Watch your loved ones smile and wave again. Our advanced AI Photo Animation tool turns still portraits into beautiful, living memories in seconds. Try it now.",
  alternates: {
    canonical: "/ai-photo-animation",
  },
  openGraph: {
    title: "AI Photo Animation: Bring Your Old Photos to Life | BringBack AI",
    description:
      "Watch your loved ones smile and wave again. Our advanced AI Photo Animation tool turns still portraits into beautiful, living memories in seconds. Try it now.",
    type: "website",
    url: "https://bringback.pro/ai-photo-animation",
  },
}

// WebApplication schema for the animation page (mirrors homepage pattern)
const animationWebAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#ai-photo-animation-webapp',
  name: 'BringBack – AI Photo Animation',
  description:
    'BringBack turns still portraits into subtle, lifelike animations like gentle smiles, blinks, and head tilts in seconds.',
  url: 'https://bringback.pro/ai-photo-animation',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    name: 'BringBack Restoration & Animation Plans',
    url: 'https://bringback.pro/pricing',
    priceCurrency: 'USD',
    price: '2',
    eligibleRegion: {
      '@type': 'Place',
      name: 'Worldwide',
    },
  },
  featureList: [
    'AI-powered photo animation',
    'Subtle, respectful motion (smiles, blinks, head tilts)',
    'High‑definition MP4 output',
    'Fast processing under 60 seconds',
    'Privacy-first handling with auto-deletion',
  ],
  screenshot: 'https://bringback.pro/video-thumbnail.webp',
}

// VideoObject schemas for animation demos (mirrors homepage video schema)
const animationHeroVideoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Demo — BringBack AI (Hero)',
  description:
    'Quick demo of BringBack animating a portrait with gentle, lifelike motion.',
  thumbnailUrl: 'https://bringback.pro/video-thumbnail.webp',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/blink-tilt-animation.mp4',
  embedUrl: 'https://bringback.pro/ai-photo-animation#hero',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/',
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/ai-photo-animation#hero',
  },
}

const animationStylesVideoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'AI Photo Animation Styles Demo — BringBack AI',
  description:
    'Showcase of multiple animation presets including Smile + Wave, Subtle Blink + Tilt, and Smile + Look Around.',
  thumbnailUrl: 'https://bringback.pro/video-thumbnail.webp',
  uploadDate: '2025-11-05T00:00:00Z',
  contentUrl: 'https://bringback.pro/videos/smile-and-look.mp4',
  embedUrl: 'https://bringback.pro/ai-photo-animation#styles',
  publisher: {
    '@type': 'Organization',
    name: 'BringBack',
    url: 'https://bringback.pro/',
  },
  potentialAction: {
    '@type': 'WatchAction',
    target: 'https://bringback.pro/ai-photo-animation#styles',
  },
}

const animationFAQPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Will it look weird or create the 'uncanny valley' effect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is the most common concern. Our AI is specifically trained to produce gentle, respectful, and natural movements. We focus on subtle smiles, blinks, and head tilts—not exaggerated or unrealistic motion. The goal is a touching moment of recognition, not a deepfake."
      }
    },
    {
      "@type": "Question",
      "name": "Can I animate a photo with multiple people in it?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our AI is designed to focus on and animate one primary face in a photograph to ensure the highest quality and most natural result. For group photos, the AI will typically identify and animate the most prominent or clearest face."
      }
    },
    {
      "@type": "Question",
      "name": "What happens to my photos after I upload them? Is my data used for AI training?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely not. Your privacy is our top priority. Your uploaded photos are processed securely and automatically deleted from our servers within 30 minutes. The final animated video is deleted after 7 days. We never use your personal photos for AI training or any other purpose. Your memories remain yours alone."
      }
    },
    {
      "@type": "Question",
      "name": "Can I animate low-quality, blurry, or very old photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For the best animation results, the AI needs to clearly identify facial features. We highly recommend using our Photo Restoration tool first to repair any damage, fix blurriness, and enhance clarity. Animating a restored photo yields dramatically more lifelike and beautiful results."
      }
    },
    {
      "@type": "Question",
      "name": "Can I choose which person in a group photo gets animated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Currently, our AI automatically detects the most suitable face for animation in a photo. We recommend cropping the photo to focus on the individual you'd like to animate before uploading to ensure the best result."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use the animated videos for commercial purposes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Once you download the animated video, it is yours to use however you wish. This includes personal sharing, social media, and even commercial projects. You retain full ownership of your memories."
      }
    },
    {
      "@type": "Question",
      "name": "What's the difference between your service and free animation apps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The difference lies in quality, privacy, and respect for the subject. Free tools often produce lower-quality, unnatural animations and may use your photos to train their AI models. Our service provides subtle, high-definition animations while guaranteeing the complete privacy and security of your cherished photos."
      }
    },
    {
      "@type": "Question",
      "name": "Will the animation add sound to my photo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our service is focused purely on creating a silent, moving portrait. There is no audio added, which we believe creates a more timeless and respectful final video."
      }
    }
  ]
}

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animationWebAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animationFAQPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animationHeroVideoJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(animationStylesVideoJsonLd) }} />
      <Navbar />
      <AIAnimationHero />
      <AnimationStylesGrid />
      <AIAnimationHowItWorks />
      <Pricing />
      <AIAnimationFeatures />
      <AIAnimationFAQ />
      <CTA />

      <Footer />
    </div>
  )
}