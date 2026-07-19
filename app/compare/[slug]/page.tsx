import { notFound } from "next/navigation"
import { compareData, type ComparePageData } from "@/lib/comparedata"
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
      type: "website",
      url,
      siteName: "BringBack",
      locale: "en_US",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.meta.title,
    description: page.meta.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-8 pb-16">
        <CompareLayout page={page} />
      </main>
      <Footer />
    </div>
  )
}
