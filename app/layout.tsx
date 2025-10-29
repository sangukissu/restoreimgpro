import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toast"
import NetworkStatus from "@/components/network-status"
import ReferralHandler from "@/components/referral-handler"
import Script from "next/script"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
export const metadata: Metadata = {
  title: "BringBack - AI Photo Restoration & Animation | Revive Old Memories",
  description: "BringBack AI restores old, damaged photos and even animates them with AI. Repair faded colors, fix damage, and bring portraits to life in seconds.",
  keywords: "photo restoration, AI photo repair, photo to video, old photo restoration, photo animation, revive old photos, damaged photo fix, vintage photo restoration, bring photos to life, image enhancement, digital photo restoration",
  authors: [{ name: "BringBack Team" }],
  creator: "BringBack",
  publisher: "BringBack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bringback.pro'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BringBack - AI Photo Restoration & Animation",
    description: "BringBack AI restores old, damaged photos and animates them with AI. Preserve your history and relive memories in motion.",
    url: 'https://bringback.pro',
    siteName: 'BringBack',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BringBack Photo Restoration and Animation demo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "BringBack - AI Photo Restoration & Animation",
    description: "Transform old photos with AI. Restore damage, enhance quality, and even animate your loved ones in seconds.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://bringback.pro/#website',
      url: 'https://bringback.pro/',
      name: 'BringBack',
      description: 'AI-powered photo restoration and animation service.',
      publisher: {
        '@id': 'https://bringback.pro/#organization'
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://bringback.pro/#organization',
      name: 'BringBack',
      url: 'https://bringback.pro/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bringback.pro/bringback-logo.png',
        width: 512,
        height: 512
      },
      description: 'AI-powered photo restoration and animation service helping people preserve and relive memories.',
      foundingDate: '2025',
      serviceArea: {
        '@type': 'Place',
        name: 'Worldwide'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Photo Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Photo Restoration',
              description: 'Restore old, damaged, or faded photos using advanced AI technology.'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Photo Animation',
              description: 'Revive still photos by animating faces — subtle smiles, waves, and lifelike gestures with AI.'
            }
          }
        ]
      }
    }
  ]
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Suspense fallback={null}>
          <ReferralHandler />
        </Suspense>
        <NetworkStatus />
        <Toaster />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-184H988WCE"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());
            gtag('config', 'G-184H988WCE', { debug_mode: true });
          `}
        </Script>
      </body>
    </html>
  )
}
