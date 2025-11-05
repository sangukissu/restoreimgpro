import type { Metadata } from "next"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Login - BringBack | Sign in to restore photos",
  description: "Sign in to BringBack to start restoring and enhancing your photos securely.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Login - BringBack",
    description: "Sign in to BringBack to start restoring and enhancing your photos securely.",
    url: "https://bringback.pro/login",
    siteName: "BringBack",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login - BringBack",
    description: "Sign in to BringBack to start restoring and enhancing your photos securely.",
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login",
    description: "Sign in to BringBack to start restoring photos",
    isPartOf: { "@type": "WebSite", name: "BringBack" },
    url: "https://bringback.pro/login",
  }

  return (
    <section>
      {/* Route-scoped JSON-LD (loads early) */}
      <Script id="login-jsonld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      {children}
    </section>
  )
}