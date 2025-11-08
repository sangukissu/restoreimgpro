import Header from "@/components/header"
import Footer from "@/components/footer"
import type { Metadata } from "next"

import AIAnimationHero from "@/components/ai-family-portrait/hero"
import FamilyPortraitShowcase from "@/components/ai-family-portrait/styles-grid"
import AIAnimationHowItWorks from "@/components/ai-family-portrait/how-it-works"
import FamilyPortraitUseCases from "@/components/ai-family-portrait/features"
import AIAnimationPricingCTA from "@/components/ai-family-portrait/pricing-cta"
import FamilyPortraitFAQ from "@/components/ai-family-portrait/faq"
import AITechnologySection from "@/components/ai-family-portrait/AITechnologySection"


export const metadata: Metadata = {
  title: "AI Family Portrait: Combine Photos to Create a Family Portrait with AI | BringBack AI",
  description:
    "Create a unified family portrait from up to 4 individual photos—across time, distance, and even black-and-white. Private, high‑resolution family portrait in seconds.",
}

// WebApplication schema for the family portrait feature
const familyPortraitWebAppJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  '@id': 'https://bringback.pro/#ai-family-portrait-webapp',
  name: 'BringBack – AI Family Portrait',
  description:
    'Combine up to 4 individual photos into one harmonious, high‑resolution family portrait. Works beautifully across time, distance, and styles.',
  url: 'https://bringback.pro/ai-family-portrait',
  applicationCategory: 'PhotoEditingApplication',
  operatingSystem: 'Web',
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
    'Combine up to 4 photos into one portrait',
    'Respects original likeness and expression',
    'Harmonizes lighting, colors, and style',
    'High‑resolution download',
    'Privacy‑first handling with auto‑deletion',
  ],
  screenshot: 'https://bringback.pro/family-portrait.png',
}

// ImageObject schema for the hero visual
const familyPortraitImageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  name: 'AI Family Portrait Example',
  description:
    'Example of a unified modern family portrait generated from separate photos.',
  contentUrl: 'https://bringback.pro/family-portrait.png',
  url: 'https://bringback.pro/ai-family-portrait#hero',
}

// FAQ schema for common questions (aligned to ai-family-portrait FAQ component)
const familyPortraitFAQJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Will the final photo look fake or like a bad photoshop?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "No. Our AI's greatest strength is its ability to create consistent lighting, color, and texture across all individuals, blending them into a cohesive and natural‑looking portrait.",
      },
    },
    {
      '@type': 'Question',
      name: 'Does the AI change what my family members look like?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely not. The feature is designed to preserve the exact likeness and identity of each person. We do not perform any facial swapping or alteration.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best photos to upload for this feature?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For the best results, use clear, well‑lit, front‑facing portraits where the face is not obscured. While our AI is versatile, higher quality input photos will yield a more stunning final portrait.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I combine black‑and‑white photos with color photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. This is one of the most powerful uses of the feature. The AI will intelligently interpret the black‑and‑white photos and render them in a style that harmonizes beautifully with the color photos in the final portrait.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you combine photos into one picture without it looking fake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "This is the core of our technology. Our AI goes beyond simple 'cut and paste.' It acts like a digital artist by re‑rendering the entire scene. It analyzes each person and creates a new, unified lighting and color scheme, so everyone looks like they were in the same room. It harmonizes textures and shadows to ensure a natural, cohesive final portrait, not a cheap‑looking photoshop.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can the AI fix old, faded, or damaged photos before combining them?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'While this tool is focused on composition, we highly recommend using our Old Photo Restoration feature first for any damaged or faded images. Restoring a photo before adding it to your family portrait will yield dramatically better and more lifelike results. A clear input creates a masterpiece output.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I add a deceased person to a family photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. This is one of the most meaningful uses of our tool. You can create a beautiful memorial portrait by combining a photo of a loved one who has passed with a current family picture. The AI will blend them together respectfully, creating a treasured keepsake that honors their memory and keeps them part of the family portrait.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it possible to create a generational photo with ancestors?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. You can unite generations that never met. Combine a photo of a grandparent in their youth with a photo of a grandchild. Our AI can even harmonize black‑and‑white photos with color ones, creating a powerful image that visualizes your family's legacy through time.",
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best photos to use for an AI family portrait?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clear, front‑facing portraits work best. Ensure the face is well‑lit and not covered by shadows or objects. Similar head sizes across the photos can help the AI create a more balanced composition. Simple backgrounds are preferred, as they allow the AI to focus on the people.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many people can I combine into one group photo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently, you can combine up to 4 individual photos into a single family portrait. For groups of 3–4 people, we recommend using a wider aspect ratio (like 4:3 or 16:9) to give the AI enough space for a beautiful composition.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I change the clothes or background in the photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This feature is focused on composing the subjects into a new portrait. It does not perform clothing changes. The AI generates a new, simple studio‑style background to ensure the final image is cohesive and focuses entirely on your family members.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from using Photoshop or hiring an artist?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The primary differences are speed, cost, and accessibility. A manual edit in Photoshop can take a professional artist hours or days and cost $50–$200+. Our AI delivers a comparable, high‑quality result in under a minute for a fraction of the cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this better than free apps that merge photos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, in two critical ways: quality and privacy. Free tools often produce low‑quality images with inconsistent lighting that look obviously fake. More importantly, they may use your private family photos for data collection. Our service provides a professional‑grade, artistic result while guaranteeing the absolute privacy of your cherished memories.',
      },
    },
  ],
}

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitWebAppJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitImageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(familyPortraitFAQJsonLd) }} />
      <Header />
      <AIAnimationHero />
      <FamilyPortraitShowcase />
      <AIAnimationHowItWorks />
      <FamilyPortraitUseCases />
      <AITechnologySection />
      <FamilyPortraitFAQ />
      <AIAnimationPricingCTA />
      <Footer />
    </div>
  )
}