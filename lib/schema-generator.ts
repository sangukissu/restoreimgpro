import { PseoPageData } from './generate-pages'

export function generateJsonLd(page: PseoPageData) {
  const pageUrl = `https://bringback.pro/restore/${page.slug}`
  
  const schemas: any[] = [
    // WebPage Schema
    {
      '@type': 'WebPage',
      '@id': pageUrl + '#webpage',
      url: pageUrl,
      name: page.metaTitle,
      description: page.metaDescription,
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
    
    // WebApplication Schema
    {
      '@type': 'WebApplication',
      '@id': pageUrl + '#webapp',
      name: page.metaTitle,
      description: page.metaDescription,
      url: pageUrl,
      applicationCategory: 'PhotoEditingApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        name: page.h1,
        url: 'https://bringback.pro/pricing',
        priceCurrency: 'USD',
        price: '2.49',
        eligibleRegion: {
          '@type': 'Place',
          name: 'Worldwide'
        }
      },
      featureList: [
        'AI-powered photo restoration',
        'AI Photo Aniamtion',
        'AI Photo Colorization',
        'AI Photo Denoising',
        'AI Photo Enhancement',
        'AI Photo Restoration',
        'AI Photo Upscaling',
        'Restore old photos',
        'Old photo restoration',
        'Fast processing – results under 30 seconds',
        'High-quality output for download and sharing',
        'Secure file handling',
        'No software installation required'
      ]
    },

    // Breadcrumb Schema
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
    }
  ]

  // Add FAQ Schema if FAQs exist
  if (page.faqs && page.faqs.length > 0) {
    schemas.push({
      '@type': 'FAQPage',
      '@id': pageUrl + '#faq',
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