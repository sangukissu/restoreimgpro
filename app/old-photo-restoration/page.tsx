import Link from "next/link"

import type { Metadata } from "next"
import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/old-photo-restoration/Hero';
import { HowItWorks } from '@/components/old-photo-restoration/HowItWorks';
import { Showcase } from '@/components/old-photo-restoration/Showcase';
import { PhotoAnimation } from '@/components/old-photo-restoration/PhotoAnimation';
import { Benefits } from '@/components/old-photo-restoration/Benefits';
import { Pricing } from '@/components/landing/Pricing';
import { Clients } from '@/components/landing/Clients';
import { Comparison } from '@/components/landing/Comparison';
import { FAQ } from '@/components/old-photo-restoration/FAQ';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/old-photo-restoration/CTA';


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
            name: 'Can AI restore photos with water damage or mold stains?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. BringBack’s AI is trained to distinguish between the original photo content and surface damage like water stains, ink spills, or mold spots. The tool digitally removes the stain and uses context-aware technology to reconstruct the missing parts of the image underneath.'
            }
        },
        {
            '@type': 'Question',
            name: 'My old photos are very blurry. Can you sharpen faces?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Absolutely. We use specialized facial enhancement algorithms. The AI detects facial landmarks (eyes, nose, mouth) even in blurry or out-of-focus images and reconstructs high-definition details, making faces look sharp and clear as if they were taken with a modern camera.'
            }
        },
        {
            '@type': 'Question',
            name: 'How do I repair a torn photo or one with scratches and creases?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You don\'t need manual tools. Once you scan and upload your torn photo, our \"Scratch & Tear Removal\" model automatically identifies cracks and white creases. It fills these gaps by analyzing the surrounding pixels, seamlessly stitching the photo back together digitally.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I restore a photo and colorize it at the same time?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. BringBack acts as an all-in-one restoration suite. You can repair the physical damage (scratches/tears) and then use our AI Colorizer to turn black-and-white photos into realistic color images in a single workflow.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is it safe to upload my private family photos?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Your privacy is our priority. We use advanced encryption for all uploads. Furthermore, BringBack automatically deletes your images from our servers after a short period (usually 24 hours) to ensure your personal memories remain private and are not used for anything else.'
            }
        },
        {
            '@type': 'Question',
            name: 'What is the best resolution to scan old photos for restoration?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'For the best AI results, we recommend scanning your photos at 300 DPI to 600 DPI (dots per inch). This ensures the AI has enough pixel data to accurately sharpen details and remove grain. If you don\'t have a scanner, you can use a high-quality scanning app on your smartphone in a well-lit room.'
            }
        },
        {
            '@type': 'Question',
            name: 'Will the restored photo be good enough to print?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Our restoration process includes AI Upscaling. This increases the resolution of your small wallet-sized photos or old snapshots, allowing you to print them as 4x6, 5x7, or even 8x10 portraits without pixelation or blur.'
            }
        },
        {
            '@type': 'Question',
            name: 'Is there a free way to restore old photos online?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'BringBack offers a free trial so you can test the power of our AI restoration before committing. You can upload a photo to see the \"Before vs. After\" results instantly. Premium plans are available for high-resolution downloads without watermarks.'
            }
        },
        {
            '@type': 'Question',
            name: 'How long does the AI restoration process take?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Unlike manual restoration services which can take days or weeks, BringBack restores photos in 5 to 10 seconds. It is an automated, instant process, allowing you to restore entire albums in minutes.'
            }
        },
        {
            '@type': 'Question',
            name: 'Can I animate my photo after restoring it?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes! We highly recommend restoring your photo first to remove scratches and sharpen the face. Once the photo is clean, you can use our Live Portrait feature to make your ancestors smile, blink, and move realistically.'
            }
        }
    ]
}

// Video schema aligned with PhotoAnimation component usage
const photoAnimationVideoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Live Portrait — Photo Animation Demo',
    description:
        'Short demo showing BringBack’s Live Portrait animating faces (smile, blink, look).',
    thumbnailUrl: 'https://bringback.pro/video-thumbnail.webp',
    uploadDate: '2025-11-05T00:00:00Z',
    contentUrl: 'https://bringback.pro/videos/video-animation1.mp4',
    publisher: {
        '@type': 'Organization',
        name: 'BringBack',
        url: 'https://bringback.pro/'
    },
    potentialAction: {
        '@type': 'WatchAction',
        target: 'https://bringback.pro/ai-photo-animation'
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(photoAnimationVideoJsonLd) }}
            />
            {/* Navbar - Fixed to stay at top during scroll */}
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
                <Navbar />
            </header>

            {/* Main Content */}
            <main>
                <Hero />
                <HowItWorks />
                <Showcase />
                <PhotoAnimation />
                <Benefits />
                <Pricing />
                <Comparison />
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
