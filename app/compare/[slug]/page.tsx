import { notFound } from "next/navigation"
import {
  compareData,
  compareLastUpdated,
  type ComparePageData,
} from "@/lib/comparedata"
import type { Metadata } from "next"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import CompareLayout from "@/components/pages/compare-layout"

const SITE_URL = "https://bringback.pro"

function comparePath(page: ComparePageData) {
  return `/compare/${page.slug}`
}

function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

function primaryImageFor(page: ComparePageData) {
  return page.hero.visuals.afterImage || page.hero.visuals.outputImage || "/og-image.png"
}

function stripMdLinks(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
}

export async function generateStaticParams() {
  return Object.keys(compareData).map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = compareData[slug]

  if (!page) return {}

  const path = comparePath(page)
  const url = absoluteUrl(path)
  const image = absoluteUrl(primaryImageFor(page))
  const lastUpdated = compareLastUpdated(page)

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords,
    robots: { index: true, follow: true },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: "article",
      url,
      siteName: "BringBack",
      locale: "en_US",
      modifiedTime: `${lastUpdated}T00:00:00.000Z`,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${page.competitor} alternative comparison by BringBack`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.meta.title,
      description: page.meta.description,
      images: [image],
    },
  }
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = compareData[slug]

  if (!page) {
    notFound()
  }

  const path = comparePath(page)
  const url = absoluteUrl(path)
  const image = absoluteUrl(primaryImageFor(page))
  const lastUpdated = compareLastUpdated(page)

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.meta.title,
    description: page.meta.description,
    dateModified: lastUpdated,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
    about: {
      "@type": "Thing",
      name: page.competitor,
    },
  }

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: page.meta.title,
    description: page.meta.description,
    dateModified: lastUpdated,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    image: [image],
    author: {
      "@type": "Organization",
      name: "BringBack",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "BringBack",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/bringback-logo.webp`,
      },
    },
    about: [
      { "@type": "Thing", name: `${page.competitor} alternative` },
      { "@type": "Thing", name: page.niche },
    ],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#verdict", "#faq"],
    },
  }

  const faqLd =
    page.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${url}#faq`,
          mainEntity: page.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: stripMdLinks(faq.a),
            },
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <Navbar />
      <main className="pt-8 pb-16">
        <CompareLayout page={page} />
      </main>
      <Footer />
    </div>
  )
}
