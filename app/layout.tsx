import type React from "react"
import type { Metadata } from "next"
import { Caveat, Great_Vibes, Manrope, Inter, Patrick_Hand } from "next/font/google"
import { Toaster } from "@/components/ui/toast"
import NetworkStatus from "@/components/network-status"
import { ConsentBanner } from "@/components/consent/consent-banner"
import { AnalyticsLoader } from "@/components/consent/analytics-loader"
import { CrispLoader } from "@/components/consent/crisp-loader"
import { POSITIONING } from "@/lib/site-copy"
import "./globals.css"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patrick-hand",
  weight: ["400"],
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
  weight: ["400"],
})

const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Restore, reunite, and preserve your family photos | BringBack",
    template: "%s | BringBack",
  },
  description: POSITIONING.supportingPromise,
  keywords:
    "family photo restoration, restore old photos, AI family portrait, add person to photo, photo animation, family memory book, preserve family photos",
  authors: [{ name: "BringBack Team" }],
  creator: "BringBack",
  publisher: "BringBack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://bringback.pro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Restore, reunite, and preserve your family photos | BringBack",
    description: POSITIONING.supportingPromise,
    url: "https://bringback.pro",
    siteName: "BringBack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BringBack family photo preservation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Restore, reunite, and preserve your family photos | BringBack",
    description: POSITIONING.supportingPromise,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://bringback.pro/#website",
      url: "https://bringback.pro/",
      name: "BringBack",
      description: POSITIONING.category,
      publisher: {
        "@id": "https://bringback.pro/#organization",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://bringback.pro/#organization",
      name: "BringBack",
      url: "https://bringback.pro/",
      logo: {
        "@type": "ImageObject",
        url: "https://bringback.pro/bringback-logo.webp",
        width: 512,
        height: 512,
      },
      description: POSITIONING.supportingPromise,
      foundingDate: "2025",
      sameAs: ["https://x.com/AINotSoSmart", "https://www.trustpilot.com/review/bringback.pro"],
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@bringback.pro",
        contactType: "customer support",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${patrickHand.variable} ${greatVibes.variable} ${caveat.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`antialiased`}>
        {children}

        <AnalyticsLoader />
        <CrispLoader />
        <ConsentBanner />
        <NetworkStatus />
        <Toaster />
      </body>
    </html>
  )
}
