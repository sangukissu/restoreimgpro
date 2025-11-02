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
      datePublished: '2025-01-01',
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

export function generateSchemaScript(page: PseoPageData): string {
  const jsonLd = generateJsonLd(page)
  return JSON.stringify(jsonLd, null, 2)
}