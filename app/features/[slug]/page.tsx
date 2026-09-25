
import { notFound } from 'next/navigation';
import { featuresData } from '@/lib/featuresdata';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { SiteBreadcrumb } from '@/components/seo/site-breadcrumb';
import { schemaOffers } from '@/lib/pricing';
import urlPolicy from '@/config/url-policy.json';
import Link from 'next/link';
import { Upload, Sparkles, Star, Clock, Shield, ArrowRight, ArrowDown, Zap, CheckCircle2, XCircle, Lightbulb, Heart, Palette, Image as ImageIcon, Camera, Layers, History, Gift, Printer, Cloud, Globe, Sun, Wallet, Minimize, Grid, Mouse, Maximize, Layout, Users } from 'lucide-react';
import React from 'react';

// 1. Generate Static Params
export async function generateStaticParams() {
  return Object.keys(featuresData)
    .filter(
      (slug) =>
        !(`/features/${slug}` in urlPolicy.retiredKeywordPaths) &&
        !(urlPolicy.gone410Paths || []).includes(`/features/${slug}`)
    )
    .map((slug) => ({
      slug: slug,
    }));
}

// 2. Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = featuresData[slug];

  if (
    !page ||
    `/features/${slug}` in urlPolicy.retiredKeywordPaths ||
    (urlPolicy.gone410Paths || []).includes(`/features/${slug}`)
  ) {
    return {};
  }

  // `title` picks up the root layout's "%s | BringBack" template, so meta.title
  // must NOT carry the brand itself. openGraph/twitter titles bypass that
  // template, so they get the brand appended explicitly.
  const socialTitle = `${page.meta.title} | BringBack`;

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords.join(', '),
    openGraph: {
      title: socialTitle,
      description: page.meta.description,
      type: 'website',
      url: `https://bringback.pro${page.slug}`,
      siteName: 'BringBack AI',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: page.meta.description,
    },
    alternates: {
      canonical: `https://bringback.pro${page.slug}`,
    }
  };
}

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  Heart,
  Palette,
  Image: ImageIcon,
  Camera,
  Layers,
  History,
  Gift,
  Printer,
  Cloud,
  Globe,
  Sun,
  Wallet,
  Minimize,
  Grid,
  Mouse,
  Maximize,
  Layout,
  Zap,
  Clock,
  Shield,
  Users,
};

// 3. Page Component
export default async function FeaturesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = featuresData[slug];

  if (
    !page ||
    `/features/${slug}` in urlPolicy.retiredKeywordPaths ||
    (urlPolicy.gone410Paths || []).includes(`/features/${slug}`)
  ) {
    notFound();
  }

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `https://bringback.pro${page.slug}#webapp`,
        name: page.meta.title,
        description: page.meta.description,
        url: `https://bringback.pro${page.slug}`,
        applicationCategory: 'PhotoEditingApplication',
        operatingSystem: 'Web',
        inLanguage: 'en-US',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: schemaOffers(),
      },
      ...(page.faq?.length ? [{
        '@type': 'FAQPage',
        '@id': `https://bringback.pro${page.slug}#faq`,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }] : []),
    ]
  };

  const breadcrumbItems = page.parentBreadcrumb
    ? [page.parentBreadcrumb, { name: page.meta.title }]
    : [{ name: "Features", href: "/features" }, { name: page.meta.title }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F2F2F0] text-[#111111] font-sans">
        <Navbar />

        <main className="pt-16 pb-20">
          <div className="max-w-[1320px] mx-auto px-4 sm:px-8 pt-4">
            <SiteBreadcrumb items={breadcrumbItems} />
          </div>

          {/* --- HERO SECTION --- */}
          <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 pt-6 pb-24 overflow-visible flex flex-col items-center text-center z-10">

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF4D00]/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

            {/* Trust Badge - Matches Screenshot */}
            <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> {page.hero.trustBadge} <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Heading - Larger, Bolder, Tighter */}
            <h1 className="mx-auto max-w-4xl text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black mb-6">
              {page.hero.heading ? (
                <>
                  {page.hero.heading.primary}
                  <br />
                  <span className="text-gray-400">{page.hero.heading.secondary}</span>
                </>
              ) : (
                page.hero.h1
              )}
            </h1>

            {/* Subheading - Refined Typography */}
            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
              {page.hero.subheadline}
            </p>

            {/* CTA Button - Matches Screenshot (Orange, Rounded, Large) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
              <Link href={page.hero.ctaHref || "/dashboard"}>
                <button className="group relative flex items-center justify-center gap-3 bg-[#FF4D00] text-white pl-8 pr-6 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(255,77,0,0.5)]">
                  <span className="font-bold text-lg tracking-tight">{page.hero.ctaText}</span>
                  <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                    <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Factual Trust Guarantees (No BS) */}
            {page.hero.trustHighlights && page.hero.trustHighlights.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-xs sm:text-sm font-medium text-gray-700 max-w-3xl mx-auto pt-2">
                {page.hero.trustHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#111111]/10 px-3.5 py-1.5 rounded-full shadow-xs">
                    <CheckCircle2 size={15} className="text-[#FF4D00] flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-xs sm:text-sm font-medium text-gray-700 max-w-2xl mx-auto pt-2">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#111111]/10 px-3.5 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 size={15} className="text-[#FF4D00] flex-shrink-0" />
                  <span>2 credits per generation</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#111111]/10 px-3.5 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 size={15} className="text-[#FF4D00] flex-shrink-0" />
                  <span>No subscription required</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#111111]/10 px-3.5 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 size={15} className="text-[#FF4D00] flex-shrink-0" />
                  <span>Private account storage</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#111111]/10 px-3.5 py-1.5 rounded-full shadow-xs">
                  <CheckCircle2 size={15} className="text-[#FF4D00] flex-shrink-0" />
                  <span>Full likeness preview</span>
                </div>
              </div>
            )}
          </section>

          {/* --- QUALITY ANALYSIS / REAL RESULTS SECTION --- */}
          <section id="quality-analysis" className="bg-[#111111] text-white py-32 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF4D00]/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[1320px] mx-auto px-4 relative z-10">
              {page.qualityAnalysis ? (
                <>
                  {/* Unified Centered Header */}
                  <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
                    <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                      <span className="text-[#FF4D00]">//</span> Professional Spatial Harmonization <span className="text-[#FF4D00]">//</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-white leading-[1.1] mb-5">
                      {page.qualityAnalysis.heading}
                    </h2>
                    <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                      {page.qualityAnalysis.subheading}
                    </p>
                  </div>

                  {/* Centered Heroic Visual Transformation Card */}
                  <div className="max-w-4xl mx-auto mb-12 relative w-full min-w-0">
                    <div className="bg-[#18181B] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-md shadow-2xl w-full">
                      {/* Inputs: 4:3 Base + 3:4 Reference */}
                      {page.qualityAnalysis.visuals.inputs.length === 2 ? (
                        <div>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                            {/* Input 1: 4:3 Base Scene */}
                            <div className="w-full sm:flex-[1.75] min-w-0">
                              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-md">
                                <img
                                  src={page.qualityAnalysis.visuals.inputs[0].src}
                                  alt={page.qualityAnalysis.visuals.inputs[0].label}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <p className="mt-2.5 text-xs sm:text-sm font-medium text-gray-300 text-center">
                                {page.qualityAnalysis.visuals.inputs[0].label}
                              </p>
                            </div>

                            {/* Plus Connector */}
                            <div className="flex-shrink-0 text-gray-400 font-light text-2xl my-1 sm:my-0 select-none">
                              +
                            </div>

                            {/* Input 2: 3:4 Solo Reference */}
                            <div className="w-full max-w-[240px] sm:max-w-none sm:flex-1 min-w-0">
                              <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-md">
                                <img
                                  src={page.qualityAnalysis.visuals.inputs[1].src}
                                  alt={page.qualityAnalysis.visuals.inputs[1].label}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              <p className="mt-2.5 text-xs sm:text-sm font-medium text-gray-300 text-center">
                                {page.qualityAnalysis.visuals.inputs[1].label}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          {page.qualityAnalysis.visuals.inputs.map((input, idx) => (
                            <div key={idx} className="relative">
                              <div className="aspect-[3/4] rounded-xl overflow-hidden mb-2 border border-white/10 bg-black/50">
                                <img src={input.src} className="w-full h-full object-cover" alt={input.label} loading="lazy" />
                              </div>
                              <p className="text-xs font-medium text-gray-300 text-center truncate">{input.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Clean Downward Flow Divider */}
                      <div className="my-6 sm:my-8 flex items-center justify-center gap-3">
                        <div className="h-px bg-white/10 flex-1" />
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium tracking-wide">
                          <span>Harmonized Result</span>
                          <ArrowDown size={13} className="text-[#FF4D00]" />
                        </div>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>

                      {/* Output Result: 4:3 Full Width of Card */}
                      <div className="relative w-full">
                        <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/50">
                          <img
                            src={page.qualityAnalysis.visuals.output.src}
                            className="w-full h-full object-cover"
                            alt={page.qualityAnalysis.visuals.output.label}
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-2.5 text-xs sm:text-sm font-medium text-gray-200 text-center">
                          {page.qualityAnalysis.visuals.output.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Feature Pillars in Balanced Grid Below the Card */}
                  <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {page.qualityAnalysis.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#18181B] border border-white/10 hover:border-[#FF4D00]/40 transition-all flex flex-col justify-start group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#FF4D00]/10 border border-[#FF4D00]/30 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300 mb-3">
                          <CheckCircle2 size={16} />
                        </div>
                        <h3 className="font-bold text-sm text-white mb-1.5 leading-snug">{feature.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-normal">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // FALLBACK for pages without specific quality data
                <>
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                        <span className="text-[#FF4D00]">//</span> Professional Quality <span className="text-[#FF4D00]">//</span>
                      </div>
                      <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-white leading-[1.1]">
                        Real Results
                      </h2>
                    </div>
                    <div className="max-w-sm">
                      <p className="text-lg text-gray-400 font-medium leading-relaxed">
                        See how we bring elements together naturally.
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {page.showcaseCaptions.map((item, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all duration-300 text-left">
                        <div className="grid grid-cols-2 gap-4 mb-6 h-[300px]">
                          <div className="space-y-2 flex flex-col h-full">
                            <div className="bg-white/10 rounded-xl flex-1 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-wider">Source 1</div>
                            </div>
                            <div className="bg-white/10 rounded-xl flex-1 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase tracking-wider">Source 2</div>
                            </div>
                          </div>
                          <div className="bg-black rounded-xl h-full relative overflow-hidden border border-white/10">
                            <div className="absolute top-4 right-4 bg-[#FF4D00] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Result</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between px-2">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{item.beforeLabel} → {item.afterLabel}</p>
                            <p className="font-bold text-lg leading-tight text-white">{item.caption}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>



          {/* --- SOURCE PHOTO GUIDELINES (DOS & DONTS) --- */}
          {page.photoGuide && (
            <section id="photo-guidelines" className="py-28 bg-[#F2F2F0]">
              <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-sm">
                    <span className="text-[#FF4D00]">//</span> Photo Selection <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-[#111111] leading-[1.1] mb-4">
                    {page.photoGuide.heading}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
                    {page.photoGuide.subheading}
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* DOs Card */}
                  <div className="bg-white rounded-[2.5rem] p-7 sm:p-9 border border-emerald-500/20 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <CheckCircle2 size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#111111]">Recommended Photo Guidelines</h3>
                          <p className="text-xs text-emerald-700 font-semibold">Practices that yield natural, high-likeness portraits</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {page.photoGuide.dos.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3.5">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5">
                              <CheckCircle2 size={15} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-[#111111] mb-1">{item.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DONTs Card */}
                  <div className="bg-white rounded-[2.5rem] p-7 sm:p-9 border border-red-500/20 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
                          <XCircle size={22} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#111111]">What to Avoid</h3>
                          <p className="text-xs text-red-700 font-semibold">Common photo traps that compromise the final result</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {page.photoGuide.donts.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3.5">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center mt-0.5">
                              <XCircle size={15} />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm sm:text-base text-[#111111] mb-1">{item.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* --- HOW IT WORKS --- */}
          <section id="how-it-works" className="py-24 bg-[#F2F2F0]">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
              {/* Centered Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                  <span className="text-[#FF4D00]">//</span> Process <span className="text-[#FF4D00]">//</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-[#111111] leading-[1.1] mb-4">
                  {page.howItWorks.heading}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
                  {page.howItWorks.subheading}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {page.howItWorks.steps.map((step, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#FF4D00]/10">
                    <div className="text-8xl font-[900] text-gray-100 absolute -top-6 -right-6 select-none group-hover:text-[#FF4D00]/5 transition-colors duration-300">{step.step}</div>
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-[#111111] text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:bg-[#FF4D00] transition-all duration-300">
                        {idx === 0 && <Upload size={24} />}
                        {idx === 1 && <Zap size={24} />}
                        {idx === 2 && <ArrowRight size={24} />}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-[#111111]">{step.title}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>



          {/* --- EMOTIONAL BENEFITS --- */}
          <section id="emotional-benefits" className="py-32 bg-white relative">
            <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
              {/* Centered Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                  <span className="text-[#FF4D00]">//</span> Why It Matters <span className="text-[#FF4D00]">//</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-[#111111] leading-[1.1] mb-4">
                  {page.benefits.heading}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-2xl mx-auto">
                  {page.benefits.subheading}
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {page.benefits.items.map((benefit, idx) => {
                  const Icon = iconMap[benefit.icon] || Star;
                  return (
                    <div key={idx} className="flex flex-col gap-5 p-7 rounded-[2rem] bg-[#F9F9F8] border border-[#111111]/10 group hover:border-[#FF4D00]/30 transition-all duration-300">
                      <div className="w-14 h-14 bg-white border border-[#111111]/10 rounded-2xl flex items-center justify-center text-[#111111] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300 shadow-xs">
                        <Icon size={28} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-3 text-[#111111]">{benefit.title}</h3>
                        <p className="text-base text-gray-600 leading-relaxed font-normal">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>



          {/* --- TRUST & PRIVACY --- */}
          <section id="trust-privacy" className="py-32 bg-[#111111] text-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FF4D00]/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-[1320px] mx-auto px-4 relative z-10">
              {/* Centered Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                  <span className="text-[#FF4D00]">//</span> Security & Privacy <span className="text-[#FF4D00]">//</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-white leading-[1.1] mb-4">
                  Your Privacy is <span className="text-gray-400">Non-Negotiable.</span>
                </h2>
                <p className="text-base sm:text-lg text-gray-400 font-normal leading-relaxed max-w-2xl mx-auto">
                  Generated media stays in your account until you delete it. We do not use your family photos to train general-purpose AI models.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                  <div className="w-14 h-14 bg-[#FF4D00]/20 rounded-2xl flex items-center justify-center mb-8 text-[#FF4D00]">
                    <Clock size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">You control media</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Results remain available in My Media so you can download later. Delete anytime. Memory Book is stored only when you save a keepsake.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                  <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400">
                    <Shield size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Secure processing</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    Uploads are transmitted over HTTPS and processed only to deliver the feature you request. See our Privacy Policy for processors.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-8 text-green-400">
                    <Users size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">No public model training</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">
                    We do not use your private family photos to train general-purpose AI models for public release.
                  </p>
                </div>
              </div>
            </div>
          </section>



          {/* --- PRICING --- */}
          <Pricing />

          {/* --- FAQ --- */}
          <FAQ
            items={page.faq}
            title={
              <>
                Common <br />
                <span className="text-gray-400">Questions.</span>
              </>
            }
            subtitle="Everything you need to know about the product and billing."
            badge="FAQ"
          />

        </main>
        <Footer />
      </div>
    </>
  );
}
