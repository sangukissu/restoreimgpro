import { notFound } from 'next/navigation';
import { compareData } from '@/lib/comparedata';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import CompareLayout from '@/components/pages/compare-layout';
import React from 'react';

export async function generateStaticParams() {
  return Object.keys(compareData).map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = compareData[slug];
  
  if (!page) return {};

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords.join(', '),
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: 'website',
      url: `https://bringback.pro/compare/${page.slug}`,
    },
    alternates: {
      canonical: `https://bringback.pro/compare/${page.slug}`,
    }
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = compareData[slug];

  if (!page) {
    notFound();
  }

  // Critical for Google SGE & People Also Ask
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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