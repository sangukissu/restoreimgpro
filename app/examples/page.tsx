// /app/examples/page.tsx
import { allPseoPages } from '@/lib/generate-pages';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import  Header from '@/components/header';
import Footer from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Photo Restoration Examples & Use Cases | BringBack',
  description: 'Explore real examples of AI photo restoration. See how BringBack can restore old, damaged, faded, and blurry photos with advanced AI technology.',
  keywords: 'photo restoration examples, AI photo repair samples, before after photos, damaged photo restoration, old photo examples, vintage photo restoration',
  openGraph: {
    title: 'AI Photo Restoration Examples & Use Cases | BringBack',
    description: 'Explore real examples of AI photo restoration. See how BringBack can restore old, damaged, faded, and blurry photos with advanced AI technology.',
    url: 'https://bringback.pro/examples',
    siteName: 'BringBack',
    images: [
      {
        url: 'https://bringback.pro/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BringBack - AI Photo Restoration Examples',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Photo Restoration Examples & Use Cases | BringBack',
    description: 'Explore real examples of AI photo restoration. See how BringBack can restore old, damaged, faded, and blurry photos with advanced AI technology.',
    images: ['https://bringback.pro/og-image.png'],
  },
  alternates: {
    canonical: 'https://bringback.pro/examples',
  },
};

export default function ExamplesPage() {
  // Generate JSON-LD structured data for the examples page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://bringback.pro/examples#webpage',
    url: 'https://bringback.pro/examples',
    name: 'AI Photo Restoration Examples & Use Cases | BringBack',
    description: 'Explore real examples of AI photo restoration. See how BringBack can restore old, damaged, faded, and blurry photos with advanced AI technology.',
    isPartOf: {
      '@id': 'https://bringback.pro/#website'
    },
    about: {
      '@id': 'https://bringback.pro/#organization'
    },
    datePublished: '2025-11-02',
    dateModified: new Date().toISOString().split('T')[0],
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://bringback.pro'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Examples',
          item: 'https://bringback.pro/examples'
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      name: 'Photo Restoration Examples',
      description: 'Collection of AI photo restoration use cases and examples',
      numberOfItems: allPseoPages.length,
      itemListElement: allPseoPages.map((page, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: page.h1,
        description: page.metaDescription,
        url: `https://bringback.pro/restore/${page.slug}`
      }))
    }
  };
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      <main className="container mx-auto px-4 pt-30">
        <h1 className="text-4xl font-bold mb-8 text-center">Use Cases & Examples</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Explore the many ways our AI can restore your photos. Each example below links to a dedicated page with more details.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allPseoPages.map((page) => (
            <Link key={page.slug} href={`/restore/${page.slug}`} passHref>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{page.h1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{page.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}