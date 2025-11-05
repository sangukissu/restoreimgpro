import { MetadataRoute } from 'next'
import { getAllPostSlugs } from '@/lib/wordpress'
import { allPseoPages } from '@/lib/generate-pages'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://bringback.pro'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/denoise`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/colorize`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/examples`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-photo-animation`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  
  try {
    const slugs = await getAllPostSlugs()
    blogPages = slugs.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error generating blog sitemap:', error)
    // Continue without blog pages if WordPress is unavailable
  }

  // Programmatic SEO pages
  const pseoPages: MetadataRoute.Sitemap = allPseoPages.map((page) => ({
    url: `${baseUrl}/restore/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7, // Higher priority than blog posts as these are core service pages
  }))

  return [...staticPages, ...blogPages, ...pseoPages]
}