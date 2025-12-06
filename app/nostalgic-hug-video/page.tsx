import Link from "next/link"
import type { Metadata } from "next"
import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import NostalgicHugHero from '@/components/nostalgic-hug-video/hero';
import NostalgicHugFeatures from '@/components/nostalgic-hug-video/features';
import NostalgicHugHowItWorks from '@/components/nostalgic-hug-how-it-works';
import NostalgicHugFAQ from '@/components/nostalgic-hug-video/faq';
import { Pricing } from '@/components/landing/Pricing';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/landing/CTA';

export const metadata: Metadata = {
    title: "Nostalgic Hug Video AI | Bring Back Memories with AI Hugs",
    description: "Create a heartwarming video of you hugging a loved one who is no longer here. BringBack AI uses advanced technology to reunite you with family members in a realistic video embrace.",
    keywords: "nostalgic hug, ai hug video, hug deceased loved one, family reunion ai, ai video generator, bring photos to life, emotional ai video, hug animation",
    openGraph: {
        title: "Nostalgic Hug Video AI | Bring Back Memories with AI",
        description: "Reconnect with loved ones across time. Turn still photos into a heartwarming video embrace with privacy and respect.",
        images: [
            {
                url: '/hug/second-frame-image-for-video.png',
                width: 1200,
                height: 630,
                alt: 'AI Nostalgic Hug Video',
            }
        ]
    }
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
        target: 'https://bringback.pro/nostalgic-hug-video'
    }
}

export default function NostalgicHugPage() {
    return (
        <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange selection:text-white relative overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(nostalgicHugVideoJsonLd) }}
            />

            {/* Navbar - Fixed to stay at top during scroll */}
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
                <Navbar />
            </header>

            {/* Main Content */}
            <main>
                <NostalgicHugHero />
                <NostalgicHugFeatures />
                {/* We use the HowItWorks component from the dashboard directory as it's perfectly suited for this landing page too */}
                <NostalgicHugHowItWorks />

                {/* Reuse Pricing from Landing */}
                <Pricing />

                <NostalgicHugFAQ />

                {/* Reuse CTA from Landing */}
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
