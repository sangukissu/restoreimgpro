import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/private/',
          '/auth/',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: 'https://bringback.pro/sitemap.xml',
  }
}