// /app/examples/page.tsx
import { allPseoPages } from '@/lib/generate-pages';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CTA } from '@/components/landing/CTA';
import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-brand-bg">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
          
                   {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Use Cases <span className="text-brand-orange">//</span>
            </div>

            {/* Title */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[0.95]">
               Use Cases & Examples <br />
              <span className="text-gray-400">of Bringback AI</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
Explore the many ways our AI can restore your photos. Each example below links to a dedicated page with more details.

            </p>
          </div>
        </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {allPseoPages.map((page) => (
              <Link key={page.slug} href={`/restore/${page.slug}`} className="group block h-full">
                <div className="bg-white rounded-3xl p-8 h-full shadow-sm border border-gray-100 hover:shadow-xs transition-all duration-300 flex flex-col">
                  <h3 className="text-xl font-bold text-brand-black mb-3 group-hover:text-brand-orange transition-colors">
                    {page.h1}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {page.metaDescription}
                  </p>
                  <div className="flex items-center text-brand-black font-semibold text-sm group-hover:translate-x-1 transition-transform duration-300">
                    View Example <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}