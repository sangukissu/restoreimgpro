// /app/restore/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { allPseoPages, getPageDataBySlug } from '@/lib/generate-pages';
import { generateJsonLd, generateOpenGraph, generateTwitterCard } from '@/lib/schema-generator';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { Upload, Sparkles, Star, Clock, Shield, ArrowRight, Play, CheckCircle2, Zap, Lock } from 'lucide-react';

// 1. Tell Next.js what pages to build (this now uses the *generated* list)
export async function generateStaticParams() {
  return allPseoPages.map((page) => ({
    slug: page.slug,
  }));
}

// 2. Generate unique SEO metadata for this page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageDataBySlug(slug);
  if (!page) return {};

  const openGraph = generateOpenGraph(page);
  const twitter = generateTwitterCard(page);

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph,
    twitter,
    alternates: {
      canonical: `/restore/${page.slug}`,
    },
  };
}

// 3. The Page Component (Now with HIGH-QUALITY content)
export default async function PseoTemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageDataBySlug(slug);
  if (!page) notFound();

  // Generate JSON-LD structured data
  const jsonLd = generateJsonLd(page);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F2F2F0]">
        <Navbar />

        <main className="pt-32 pb-20">
          <div>

            {/* Hero Section */}
            <div className="text-center mb-20 px-4">
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full mb-8 shadow-lg shadow-black/5 mx-auto">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF4D00] animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wide">Premium Photo Restoration</span>
              </div>

              <h1 className="text-[3rem] sm:text-[4rem] lg:text-[5rem] font-[850] tracking-tighter leading-[0.95] text-[#111111] mb-8 max-w-5xl mx-auto">
                {page.h1}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                {page.metaDescription}
              </p>

              {/* Main CTA */}
              <div className="flex flex-col items-center gap-8">
                <Link href="/dashboard">
                  <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
                    <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Restore Photo Now</span>
                    <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </div>
                  </button>
                </Link>

                {/* Social Proof */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center relative h-10 w-[120px]">
                    {[1, 2, 3].map((i, index) => (
                      <div
                        key={i}
                        className={`absolute top-0 w-10 h-10 rounded-xl border-2 border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                          ${index === 0 ? 'left-0 z-30 -rotate-6' : ''}
                          ${index === 1 ? 'left-7 z-20 rotate-6' : ''}
                          ${index === 2 ? 'left-14 z-10 -rotate-3' : ''}
                        `}
                      >
                        <img
                          src={`https://randomuser.me/api/portraits/thumb/men/${i * 12 + 8}.jpg`}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="absolute left-20 top-0 w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#F2F2F0] shadow-sm z-40 rotate-12 hover:rotate-0 transition-transform">
                      260+
                    </div>
                  </div>

                  <div className="flex flex-col justify-center text-left">
                    <div className="flex gap-0.5 mb-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={12} className="fill-[#FF4D00] text-[#FF4D00]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Trusted by 260+ Families</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Before & After Visual */}
            <div className="mb-24 px-4">
              <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-black/5 border border-white/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent opacity-20"></div>

                <h2 className="text-3xl font-bold text-[#111111] text-center mb-12">See the Transformation</h2>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  <div className="group relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-gray-100 to-transparent rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="bg-[#F2F2F0] rounded-3xl p-3 shadow-inner">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-lg">
                        <img
                          src={page.beforeImageUrl}
                          alt={`Before: ${page.h1}`}
                          className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10">
                          Original
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-4 font-bold text-gray-500 uppercase tracking-widest text-sm">Before</p>
                  </div>



                  <div className="group relative">
                    <div className="absolute -inset-4 bg-gradient-to-bl from-orange-50 to-transparent rounded-[2rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="bg-white rounded-3xl p-3 shadow-xl shadow-orange-500/10 ring-1 ring-black/5">
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                        <img
                          src={page.afterImageUrl}
                          alt={`After: ${page.h1} restored by AI`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-[#FF4D00] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                          <Sparkles size={12} fill="currentColor" />
                          Restored
                        </div>
                      </div>
                    </div>
                    <p className="text-center mt-4 font-bold text-[#FF4D00] uppercase tracking-widest text-sm">After Restoration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <section className="px-4 py-24 mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">

                {/* The Problem */}
                <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-lg shadow-black/5 border border-gray-100">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#111111] mb-2">The Challenge</h2>
                      <div className="h-1 w-20 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {page.content.problem}
                  </p>
                </div>

                {/* The Solution */}
                <div className="bg-[#111111] rounded-[2rem] p-8 sm:p-12 shadow-2xl shadow-black/20 text-white relative overflow-hidden">
                  {/* Removed expensive blur effect */}

                  <div className="flex items-start gap-6 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF4D00] flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Our Solution</h2>
                      <div className="h-1 w-20 bg-[#FF4D00] rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                    {page.content.solution}
                  </p>
                </div>
              </div>

              {/* Subject Section (if exists) */}
              {page.content.subject && (
                <div className="text-center py-16 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 text-9xl text-gray-200 font-serif opacity-50 select-none">"</div>
                  <div className="max-w-4xl mx-auto relative z-10">
                    <blockquote className="text-3xl md:text-4xl font-medium text-[#111111] leading-tight">
                      {page.content.subject}
                    </blockquote>
                  </div>
                </div>
              )}
            </section>

            {/* Why Choose BringBack.pro */}
            <section className="bg-white py-24 border-y border-gray-100">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <div className="inline-block bg-[#F2F2F0] px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider">Why Choose Us</div>
                  <h2 className="text-4xl lg:text-6xl font-[850] text-[#111111] tracking-tight leading-[0.95]">
                    Why trust <span className="text-[#FF4D00]">BringBack.pro</span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="group bg-[#F2F2F0] rounded-[2rem] p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-[#111111] hover:text-white will-change-transform">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#111111] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#FF4D00] group-hover:text-white transition-colors">
                      <Clock className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">Get your restored photos in under 30 seconds, not weeks like traditional services.</p>
                  </div>

                  <div className="group bg-[#F2F2F0] rounded-[2rem] p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-[#111111] hover:text-white md:-mt-8 will-change-transform">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#111111] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#FF4D00] group-hover:text-white transition-colors">
                      <Star className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Professional Quality</h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">AI-powered restoration that rivals expensive manual services at a fraction of the cost.</p>
                  </div>

                  <div className="group bg-[#F2F2F0] rounded-[2rem] p-8 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-[#111111] hover:text-white will-change-transform">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#111111] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#FF4D00] group-hover:text-white transition-colors">
                      <Shield className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">100% Private</h3>
                    <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed transition-colors">Your photos are processed securely and deleted automatically after restoration.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-[#F2F2F0]">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <div className="inline-block bg-white px-4 py-1.5 rounded-full text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider shadow-sm">Process</div>
                  <h2 className="text-4xl lg:text-6xl font-[850] text-[#111111] tracking-tight leading-[0.95] mb-6">
                    {page.howItWorks.title.replace('How Our AI Photo Restoration Works', 'Restored in')} {" "}
                    <span className="text-[#FF4D00]">3 Simple Steps</span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.howItWorks.description}
                  </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                  {page.howItWorks.steps.map((step, index) => (
                    <div key={index} className={`bg-white rounded-[2rem] p-8 shadow-lg shadow-black/5 border border-white/50 transition-transform duration-300 hover:scale-105 will-change-transform
                      ${index === 1 ? 'lg:-mt-8' : ''}
                    `}>
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-6xl font-[850] text-gray-100">{index + 1}</span>
                        <div className="w-12 h-12 rounded-full bg-[#F2F2F0] flex items-center justify-center">
                          {index === 0 && <Upload className="w-6 h-6 text-[#111111]" />}
                          {index === 1 && <Zap className="w-6 h-6 text-[#FF4D00] fill-[#FF4D00]" />}
                          {index === 2 && <ArrowRight className="w-6 h-6 text-[#111111]" />}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-[#111111] mb-4">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Comparison Table Section */}
            <section className="bg-white py-24">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-[850] text-[#111111] tracking-tight mb-6">
                    {page.comparisonTable.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.comparisonTable.description}
                  </p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="bg-[#F2F2F0] rounded-[2.5rem] p-2 shadow-inner">
                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-[#111111] text-white">
                          <tr>
                            <th className="p-8 text-left font-bold text-xl">Feature</th>
                            <th className="p-8 text-center font-bold text-xl bg-[#FF4D00] text-white">BringBack.pro</th>
                            <th className="p-8 text-center font-bold text-xl text-gray-400">Competitors</th>
                            <th className="p-8 text-center font-bold text-xl text-gray-400">Manual Restoration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {page.comparisonTable.rows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="p-6 pl-8 font-bold text-[#111111] text-lg">{row.feature}</td>
                              <td className="p-6 text-center bg-orange-50/30">
                                <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-[#FF4D00] text-white shadow-lg shadow-orange-500/20">
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  {row.bringback}
                                </div>
                              </td>
                              <td className="p-6 text-center">
                                <span className="text-gray-500 font-medium">{row.competitors}</span>
                              </td>
                              <td className="p-6 text-center">
                                <span className="text-gray-500 font-medium">{row.manual}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-6">
                  {page.comparisonTable.rows.map((row, index) => (
                    <div key={index} className="bg-white rounded-3xl shadow-lg shadow-black/5 border border-gray-100 overflow-hidden">
                      <div className="bg-[#111111] text-white p-6">
                        <h3 className="font-bold text-xl text-center">{row.feature}</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* BringBack.pro */}
                        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-[#FF4D00] flex items-center justify-center mr-3">
                              <Sparkles className="w-4 h-4 text-white fill-white" />
                            </div>
                            <span className="font-bold text-[#111111]">BringBack</span>
                          </div>
                          <span className="font-bold text-[#FF4D00]">{row.bringback}</span>
                        </div>

                        {/* Competitors */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="font-semibold text-gray-500">Competitors</span>
                          <span className="font-medium text-gray-600">{row.competitors}</span>
                        </div>

                        {/* Manual Restoration */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <span className="font-semibold text-gray-500">Manual</span>
                          <span className="font-medium text-gray-600">{row.manual}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Use Cases & Examples Section */}
            <section className="bg-[#F2F2F0] py-24">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl lg:text-5xl font-[850] text-[#111111] tracking-tight mb-6">
                    {page.useCases.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.useCases.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {page.useCases.cases.map((useCase, index) => (
                    <div key={index} className="group h-full">
                      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-white/50 h-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-2 will-change-transform">
                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300 origin-left">{useCase.icon}</div>
                        <h3 className="text-2xl font-bold text-[#111111] mb-4">{useCase.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-8">{useCase.description}</p>
                        <div className="bg-[#F2F2F0] rounded-xl p-4 border border-gray-100">
                          <p className="text-sm text-gray-600 italic">"{useCase.example}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Cost Analysis Section */}
            <section className="bg-white py-24">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl lg:text-5xl font-[850] text-[#111111] tracking-tight mb-6">
                    {page.costAnalysis.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.costAnalysis.description}
                  </p>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                  {page.costAnalysis.plans.map((plan, index) => (
                    <div key={index} className="group relative">
                      {index === 0 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF4D00] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-10">
                          Most Popular
                        </div>
                      )}
                      <div className={`rounded-[2.5rem] p-10 h-full transition-transform duration-300 hover:-translate-y-2 will-change-transform
                        ${index === 0
                          ? 'bg-[#111111] text-white shadow-2xl shadow-black/20'
                          : 'bg-[#F2F2F0] text-[#111111] border border-gray-200'
                        }
                      `}>
                        <div className="text-center mb-10">
                          <h3 className={`text-2xl font-bold mb-4 ${index === 0 ? 'text-white' : 'text-[#111111]'}`}>{plan.name}</h3>
                          <div className="text-5xl font-[850] mb-4">{plan.price}</div>
                          <p className={index === 0 ? 'text-gray-400' : 'text-gray-600'}>{plan.description}</p>
                        </div>
                        <ul className="space-y-4 mb-10">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0
                                ${index === 0 ? 'bg-[#FF4D00] text-white' : 'bg-black text-white'}
                              `}>
                                <CheckCircle2 size={14} />
                              </div>
                              <span className={index === 0 ? 'text-gray-300' : 'text-gray-700'}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href="/dashboard" className="block">
                          <button className={`w-full py-4 rounded-full font-bold text-lg transition-transform duration-300 hover:scale-105 active:scale-95
                            ${index === 0
                              ? 'bg-white text-black hover:bg-gray-100'
                              : 'bg-[#111111] text-white hover:bg-black/90 shadow-lg shadow-black/10'
                            }
                          `}>
                            Choose Plan
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Comparison */}
                <div className="bg-[#F2F2F0] rounded-[2.5rem] p-10 shadow-inner">
                  <h3 className="text-2xl font-bold text-[#111111] text-center mb-10">Service Comparison</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {page.costAnalysis.comparison.map((service, index) => (
                      <div key={index} className="text-center p-8 rounded-[2rem] bg-white shadow-sm border border-white/50">
                        <h4 className="text-lg font-bold text-gray-500 uppercase tracking-wider mb-4">{service.service}</h4>
                        <div className="text-3xl font-[850] text-[#111111] mb-2">{service.cost}</div>
                        <p className="text-sm font-medium text-gray-400">{service.timeframe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-[#F2F2F0] py-24">
              <div className="px-4 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl lg:text-5xl font-[850] text-[#111111] tracking-tight mb-6">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-6">
                  {page.faqs.map((faq, index) => (
                    <div key={index} className="group">
                      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-white/50 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 will-change-transform">
                        <h3 className="text-xl font-bold text-[#111111] mb-4 leading-tight flex items-start gap-3">
                          <span className="text-[#FF4D00]">Q.</span>
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="max-w-[1320px] mx-auto bg-[#111111] py-32 relative overflow-hidden rounded-[1.8rem]">
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
              {/* Removed expensive blur effect */}

              <div className="px-4 max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-5xl lg:text-7xl font-[850] text-white tracking-tighter leading-[0.9] mb-8">
                  Ready to Bring Your <br />
                  <span className="text-[#FF4D00]">Memories Back?</span>
                </h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of satisfied customers who have restored their precious memories with our AI technology.
                </p>
                <div className="flex flex-col items-center gap-8">
                  <Link href="/login">
                    <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-[#111111] pl-6 pr-2 py-2 sm:pl-10 sm:pr-2.5 sm:py-3 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.4)] shrink-0">
                      <span className="font-bold text-lg tracking-tight whitespace-nowrap">Start Restoration Now</span>
                      <div className="w-12 h-12 bg-[#FF4D00] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                        <ArrowRight className="text-white w-6 h-6" strokeWidth={2.5} />
                      </div>
                    </button>
                  </Link>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className="fill-[#FF4D00] text-[#FF4D00]" />
                      ))}
                    </div>
                    <span className="text-sm">Trusted by 260+ customers</span>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}