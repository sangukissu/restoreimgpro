import { PseoPageData } from './generate-pages'

export function generateJsonLd(page: PseoPageData) {
  const pageUrl = `https://bringback.pro/restore/${page.slug}`
  const parsedPlanPrices = page.costAnalysis.plans
    .map((plan) => parsePrice(plan.price))
    .filter((price): price is number => typeof price === 'number')
  const lowPrice = parsedPlanPrices.length ? Math.min(...parsedPlanPrices) : 4.99
  const highPrice = parsedPlanPrices.length ? Math.max(...parsedPlanPrices) : 24.99
  const keywords = extractKeywords(page)
  const howToId = pageUrl + '#howto'
  
  const schemas: any[] = [
    {
      '@type': 'WebPage',
      '@id': pageUrl + '#webpage',
      url: pageUrl,
      name: page.metaTitle,
      description: page.metaDescription,
      inLanguage: 'en-US',
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: ensureAbsoluteAsset(page.afterImageUrl),
      },
      mainEntity: {
        '@id': pageUrl + '#webapp',
      },
      keywords,
      isPartOf: {
        '@id': 'https://bringback.pro/#website'
      },
      about: {
        '@id': 'https://bringback.pro/#organization'
      },
      datePublished: '2025-11-02',
      dateModified: new Date().toISOString().split('T')[0],
      breadcrumb: {
        '@id': pageUrl + '#breadcrumb'
      }
    },

    {
      '@type': 'WebApplication',
      '@id': pageUrl + '#webapp',
      name: page.h1,
      description: page.metaDescription,
      url: pageUrl,
      applicationCategory: 'PhotoEditingApplication',
      applicationSubCategory: 'AI Photo Restoration',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      inLanguage: 'en-US',
      provider: {
        '@type': 'Organization',
        '@id': 'https://bringback.pro/#organization',
        name: 'BringBack',
        url: 'https://bringback.pro/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://bringback.pro/bringback-logo.webp',
        },
        sameAs: [
          'https://www.trustpilot.com/review/bringback.pro'
        ]
      },
      screenshot: ensureAbsoluteAsset(page.afterImageUrl),
      softwareVersion: 'latest',
      offers: {
        '@type': 'AggregateOffer',
        name: 'BringBack Premium Plans',
        url: 'https://bringback.pro/pricing',
        priceCurrency: 'USD',
        lowPrice: lowPrice.toFixed(2),
        highPrice: highPrice.toFixed(2),
        offerCount: page.costAnalysis.plans.length,
        availability: 'https://schema.org/InStock',
        eligibleRegion: {
          '@type': 'Place',
          name: 'Worldwide'
        }
      },
      featureList: [
        'AI-powered photo restoration',
        'Competitor-grade premium output',
        'Photo repair for fading, scratches, tears, and color loss',
        'AI Photo Animation',
        'AI Photo Colorization',
        'AI Photo Denoising',
        'AI Photo Enhancement',
        'AI Photo Upscaling',
        'Repair old family and archival photos',
        'Fast processing – results under 30 seconds',
        'High-quality output for download and sharing',
        'Secure file handling',
        'No software installation required',
        'Premium support and 30-day guarantee'
      ],
      potentialAction: {
        '@type': 'UseAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://bringback.pro/dashboard'
        }
      },
      hasPart: page.costAnalysis.plans.map((plan) => ({
        '@type': 'Offer',
        name: plan.name,
        description: plan.description,
        priceCurrency: 'USD',
        price: parsePrice(plan.price)?.toFixed(2) ?? undefined,
        url: 'https://bringback.pro/pricing'
      })).filter((plan) => typeof plan.price === 'string'),
      mainEntityOfPage: {
        '@id': pageUrl + '#webpage'
      }
    },
    {
      '@type': 'HowTo',
      '@id': howToId,
      name: page.howItWorks.title,
      description: page.howItWorks.description,
      totalTime: 'PT30S',
      supply: [
        {
          '@type': 'HowToSupply',
          name: 'Digital photo to restore'
        }
      ],
      tool: [
        {
          '@type': 'HowToTool',
          name: 'BringBack AI restoration engine'
        }
      ],
      step: page.howItWorks.steps.map((step) => ({
        '@type': 'HowToStep',
        name: step.title,
        text: step.description,
        url: pageUrl + '#how-it-works'
      })),
      mainEntityOfPage: {
        '@id': pageUrl + '#webpage'
      }
    },

    {
      '@type': 'BreadcrumbList',
      '@id': pageUrl + '#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://bringback.pro/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Restore',
          item: 'https://bringback.pro/restore'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.metaTitle,
          item: pageUrl
        }
      ]
    },
    {
      '@type': 'ItemList',
      '@id': pageUrl + '#plans',
      name: page.costAnalysis.title,
      description: page.costAnalysis.description,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: page.costAnalysis.plans.length,
      itemListElement: page.costAnalysis.plans.map((plan, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Offer',
          name: plan.name,
          description: plan.description,
          priceCurrency: 'USD',
          price: parsePrice(plan.price)?.toFixed(2) ?? undefined,
          url: 'https://bringback.pro/pricing'
        }
      }))
    }
  ]

  if (page.faqs && page.faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      '@id': pageUrl + '#faq',
      mainEntityOfPage: {
        '@id': pageUrl + '#webpage'
      },
      mainEntity: page.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  }
}

export function generateOpenGraph(page: PseoPageData) {
  const pageUrl = `https://bringback.pro/restore/${page.slug}`
  
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    url: pageUrl,
    siteName: 'BringBack',
    images: [
      {
        url: 'https://bringback.pro/og-image.png',
        width: 1200,
        height: 630,
        alt: `BringBack - ${page.h1}`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  }
}

export function generateTwitterCard(page: PseoPageData) {
  return {
    card: 'summary_large_image',
    title: page.metaTitle,
    description: page.metaDescription,
    images: ['https://bringback.pro/og-image.png'],
  }
}

export function generateSchemaScript(page: PseoPageData): string {
  const jsonLd = generateJsonLd(page)
  return `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
}

function parsePrice(price: string): number | undefined {
  const parsed = Number.parseFloat(price.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(parsed)) {
    return undefined
  }
  return parsed
}

function ensureAbsoluteAsset(assetPath: string): string {
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath
  }
  return `https://bringback.pro${assetPath.startsWith('/') ? '' : '/'}${assetPath}`
}

function extractKeywords(page: PseoPageData): string {
  const keywordParts = [
    page.h1,
    page.slug.replace(/-/g, ' '),
    page.content.problem,
    page.content.solution
  ]
  const keywordText = keywordParts.join(' ').toLowerCase()
  const candidateKeywords = [
    'ai photo restoration',
    'old photo restoration',
    'photo enhancement',
    'photo colorization',
    'photo denoise',
    'restore damaged photos',
    'premium photo restoration'
  ]

  const selected = candidateKeywords.filter((keyword) => keywordText.includes(keyword.split(' ')[0]))
  return selected.length ? selected.join(', ') : 'ai photo restoration, premium photo restoration'
}
