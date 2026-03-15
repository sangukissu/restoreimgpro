import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { countryPages, supportedLanguages, type SupportedLang } from "@/lib/countrypages"
import { LocalizedPageClient } from "../localized-page-client"

function parseUsdPrice(price: string): number | null {
  const numeric = Number(price.replace(/[^0-9.]/g, ""))
  return Number.isFinite(numeric) ? numeric : null
}

// Generate static params for all supported languages and their specific keyword slugs
export function generateStaticParams() {
  return supportedLanguages.map((lang) => {
    // Extract the slug part after the language code (e.g., "/es/recrear-fotos" -> "recrear-fotos")
    // The countryPages[lang].slug format is "/lang/keyword-slug"
    const fullSlug = countryPages[lang].slug
    const slugPart = fullSlug.split('/').pop() || ''
    
    return { 
      lang,
      slug: slugPart
    }
  })
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  
  // Validate language exists
  if (!supportedLanguages.includes(lang as SupportedLang)) {
    return {}
  }

  const page = countryPages[lang as SupportedLang]

  // Validate slug matches the expected keyword slug for this language
  // This ensures /es/random-text doesn't render the Spanish page, only /es/recrear-fotos-con-ai
  const expectedSlugPart = page.slug.split('/').pop()
  if (slug !== expectedSlugPart) {
    return {}
  }

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords.join(", "),
    alternates: {
      canonical: page.slug,
      languages: {
        es: countryPages.es.slug,
        "pt-BR": countryPages["pt-br"].slug,
        id: countryPages.id.slug,
      },
    },
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: "website",
      url: `https://bringback.pro${page.slug}`,
      locale: page.locale,
      siteName: "BringBack AI",
    },
  }
}

export default async function LocalizedCountryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  
  // Validate language
  if (!supportedLanguages.includes(lang as SupportedLang)) {
    notFound()
  }

  const page = countryPages[lang as SupportedLang]

  // Validate slug matches expected keyword
  const expectedSlugPart = page.slug.split('/').pop()
  if (slug !== expectedSlugPart) {
    notFound()
  }

  const pageUrl = `https://bringback.pro${page.slug}`
  const prices = page.pricing?.plans
    ?.map((p) => parseUsdPrice(p.price))
    .filter((p): p is number => typeof p === "number")

  const lowPrice = prices?.length ? Math.min(...prices) : undefined
  const highPrice = prices?.length ? Math.max(...prices) : undefined

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${pageUrl}#webapp`,
        name: page.meta.title,
        description: page.meta.description,
        url: pageUrl,
        applicationCategory: "PhotoEditingApplication",
        operatingSystem: "Web",
        inLanguage: page.locale,
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        offers:
          typeof lowPrice === "number" && typeof highPrice === "number"
            ? {
                "@type": "AggregateOffer",
                url: "https://bringback.pro/pricing",
                priceCurrency: "USD",
                lowPrice: lowPrice.toFixed(2),
                highPrice: highPrice.toFixed(2),
                offerCount: String(page.pricing.plans.length),
              }
            : {
                "@type": "Offer",
                url: "https://bringback.pro/pricing",
                priceCurrency: "USD",
                availability: "https://schema.org/OnlineOnly",
              },
      },
      page.faq?.length
        ? {
            "@type": "FAQPage",
            "@id": `${pageUrl}#faq`,
            mainEntity: page.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }
        : null,
    ].filter(Boolean),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LocalizedPageClient page={page} />
    </>
  )
}
