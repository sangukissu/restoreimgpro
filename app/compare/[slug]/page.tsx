import { notFound } from 'next/navigation';
import { compareData, type ComparePageData } from '@/lib/comparedata';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import CompareLayout from '@/components/pages/compare-layout';

const SITE_URL = 'https://bringback.pro';

function comparePath(page: ComparePageData) {
  return `/compare/${page.slug}`;
}

function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function primaryImageFor(page: ComparePageData) {
  return page.hero.visuals.afterImage || page.hero.visuals.outputImage || '/og-image.png';
}

export async function generateStaticParams() {
  return Object.keys(compareData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = compareData[slug];

  if (!page) return {};

  const path = comparePath(page);
  const url = absoluteUrl(path);
  const image = absoluteUrl(primaryImageFor(page));

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: 'website',
      url,
      siteName: 'BringBack AI',
      locale: 'en_US',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${page.competitor} alternative comparison by BringBack AI`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta.title,
      description: page.meta.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = compareData[slug];

  if (!page) {
    notFound();
  }

  const path = comparePath(page);
  const url = absoluteUrl(path);
  const image = absoluteUrl(primaryImageFor(page));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.meta.title,
        description: page.meta.description,
        inLanguage: 'en-US',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: [
          {
            '@type': 'Thing',
            name: page.competitor,
          },
          {
            '@type': 'SoftwareApplication',
            name: 'BringBack AI',
            applicationCategory: 'PhotoEditingApplication',
            operatingSystem: 'Web',
          },
        ],
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: image,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${page.competitor} alternative`,
            item: url,
          },
        ],
      },
      {
        '@type': 'WebApplication',
        '@id': `${SITE_URL}/#webapp`,
        name: 'BringBack AI',
        description: 'AI-powered photo restoration, animation, colorization, and family portrait tools.',
        url: SITE_URL,
        applicationCategory: 'PhotoEditingApplication',
        operatingSystem: 'Web',
        inLanguage: 'en-US',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/pricing`,
          priceCurrency: 'USD',
          availability: 'https://schema.org/OnlineOnly',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#F2F2F0] font-sans">
        <Navbar />
        <main className="pt-16 pb-20">
          <CompareLayout page={page} />
        </main>
        <Footer />
      </div>
    </>
  );
}