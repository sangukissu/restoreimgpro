import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import type { Metadata } from "next"

import AIAnimationHero from "@/components/ai-family-portrait/hero"
import { FamilyPortrait } from "@/components/ai-family-portrait/styles-grid"
import FamilyPortraitConversionGuide from "@/components/ai-family-portrait/conversion-guide"
import AIAnimationHowItWorks from "@/components/ai-family-portrait/how-it-works"
import FamilyPortraitUseCases from "@/components/ai-family-portrait/features"
import { CTA } from '@/components/landing/CTA';
import FamilyPortraitFAQ from "@/components/ai-family-portrait/faq"
import AITechnologySection from "@/components/ai-family-portrait/AITechnologySection"
import { Pricing } from "@/components/landing/Pricing"

export const metadata: Metadata = {
  title: "AI Family Portrait Generator | Separate Photos into One Family Photo",
  description:
    "Create a family photo from individual photos. BringBack AI turns separate portraits into one realistic, studio-quality family portrait for framing, gifts, and memorial keepsakes.",
  alternates: {
    canonical: "/ai-family-portrait",
  },
  openGraph: {
    title: "AI Family Portrait Generator | Separate Photos into One Family Photo",
    description:
      "Create a family photo from individual photos. BringBack AI turns separate portraits into one realistic, studio-quality family portrait.",
    type: "website",
    url: "https://bringback.pro/ai-family-portrait",
    images: [
      {
        url: "https://bringback.pro/family-portrait.png",
        width: 1200,
        height: 800,
        alt: "AI family portrait created from separate photos",
      },
    ],
  },
}

const familyPortraitWebAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#ai-family-portrait-webapp',
  name: 'BringBack AI Family Portrait Generator',
  description:
    'Create a studio-quality AI family portrait from separate individual photos. Combine up to 4 people, choose canvas ratios and studio backdrops, and preserve recognizable facial likeness.',
  url: 'https://bringback.pro/ai-family-portrait',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
  image: 'https://bringback.pro/family-portrait.png',
  offers: {
    '@type': 'Offer',
    name: 'BringBack Family Portrait',
    url: 'https://bringback.pro/pricing',
    priceCurrency: 'USD',
    price: '2',
    eligibleRegion: {
      '@type': 'Place',
      name: 'Worldwide',
    },
  },
  featureList: [
    'Separate photos into one family photo',
    'Combine up to 4 individual portraits',
    'Preserve original facial likeness and expression',
    'Choose 1:1, 3:4, 4:3, or 16:9 canvas ratios',
    'Choose matte black, neutral gray, warm beige, gradient, dark brown, or bokeh studio backdrops',
    'High-resolution download',
    'Private account media library',
  ],
  screenshot: 'https://bringback.pro/family-portrait.png',
}

const familyPortraitImageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  name: 'AI Family Portrait Example',
  description:
    'Example of a professional AI family portrait generated from separate individual photos.',
  contentUrl: 'https://bringback.pro/family-portrait.png',
  url: 'https://bringback.pro/ai-family-portrait#hero',
}

const familyPortraitHowToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to create a family photo from individual photos',
  description:
    'Upload separate portraits, choose a canvas and studio background, then generate one cohesive AI family portrait.',
  totalTime: 'PT2M',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Upload individual portraits',
      text: 'Add 2 to 4 clear JPG, PNG, or WebP photos with visible faces. Restore damaged or blurry old photos first for best results.',
    },
    {
      '@type': 'HowToStep',
      name: 'Choose canvas and backdrop',
      text: 'Pick a square, portrait, classic, or wide aspect ratio, then choose a studio background such as matte black, gray, beige, brown, gradient, or bokeh.',
    },
    {
      '@type': 'HowToStep',
      name: 'Generate and download',
      text: 'BringBack composes the people into one studio-quality family portrait with harmonized lighting, color, scale, and perspective.',
    },
  ],
}

const familyPortraitFAQJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can I create a family photo from individual photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Upload separate portraits of 2 to 4 people and BringBack composes them into one realistic studio-quality family photo.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I make a family photo with separate photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Upload 2 to 4 individual portraits, choose a 4:3 or 16:9 canvas for groups, select a studio background, and generate. BringBack re-composes the people into one new family portrait instead of placing photo cutouts side by side.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will the final photo look fake or like a collage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack is designed to avoid the cut-and-paste look. It creates a new studio portrait with consistent lighting, color, scale, and texture across the people you upload.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the AI change what my family members look like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The family portrait generator is built to preserve recognizable facial likeness, age, and expression from the uploaded references. Results can vary by input quality, so clear face photos work best.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best photos to upload?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use JPG, PNG, or WebP images under 20MB each. Clear, well-lit, front-facing portraits with visible faces produce the most natural family photo.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I combine black-and-white photos with color photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can combine black-and-white photos with color photos. If the older photo is damaged, faded, or blurry, restore it first for the best likeness.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many people can I combine into one group photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can combine up to 4 individual photos into a single family portrait. For 3 to 4 people, wider ratios such as 4:3 or 16:9 usually create a more balanced composition.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add a deceased person to a family photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many families use BringBack to create respectful memorial portraits by combining a loved one who has passed with current family members.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I choose the background or aspect ratio?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BringBack supports 1:1, 3:4, 4:3, and 16:9 canvases plus studio backdrops including matte black, neutral gray, warm beige, subtle gradient, dark brown vignette, and gentle bokeh.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is BringBack a free family portrait creator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BringBack is a premium AI family photo generator. It costs 2 credits because it focuses on realistic likeness, studio composition, high-resolution output, and private account storage rather than quick collage-style merging.',
      },
    },
  ],
}

export default function Page() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitWebAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitImageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitHowToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitFAQJsonLd) }} />
      <Navbar />
      <AIAnimationHero />
      <FamilyPortrait />
      <FamilyPortraitConversionGuide />
      <AIAnimationHowItWorks />
      <Pricing />
      <FamilyPortraitUseCases />
      <AITechnologySection />
      <FamilyPortraitFAQ />
      <CTA />
      <Footer />
    </div>
  )
}