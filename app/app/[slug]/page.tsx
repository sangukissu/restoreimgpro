
import { notFound } from 'next/navigation';
import { appData } from '@/lib/appdata';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Clients } from '@/components/landing/Clients';
import Link from 'next/link';
import { Upload, Sparkles, Star, Clock, Shield, ArrowRight, Zap, CheckCircle2, Heart, Palette, Image as ImageIcon, Camera, Layers, History, Gift, Printer, Cloud, Globe, Sun, Wallet, Minimize, Grid, Mouse, Maximize, Layout, Users, Smartphone, Download } from 'lucide-react';
import React from 'react';

// 1. Generate Static Params
export async function generateStaticParams() {
  return Object.keys(appData).map((slug) => ({
    slug: slug,
  }));
}

// 2. Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = appData[slug];
  
  if (!page) {
    return {};
  }

  return {
    title: page.meta.title,
    description: page.meta.description,
    keywords: page.meta.keywords.join(', '),
    openGraph: {
      title: page.meta.title,
      description: page.meta.description,
      type: 'website',
      url: `https://bringback.pro${page.slug}`,
      siteName: 'BringBack AI',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.meta.title,
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
export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = appData[slug];

  if (!page) {
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
        offers: {
          '@type': 'Offer',
          url: 'https://bringback.pro/pricing',
          priceCurrency: 'USD',
          availability: 'https://schema.org/OnlineOnly'
        }
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#F2F2F0] text-[#111111] font-sans">
        <Navbar />

        <main className="pt-16 pb-20">
          
          {/* --- HERO SECTION --- */}
          <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 pt-6 pb-24 overflow-visible flex flex-col items-center text-center z-10">

            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF4D00]/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-8 shadow-lg shadow-black/10">
              <span className="text-[#FF4D00]">//</span> {page.hero.trustBadge} <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-[850] tracking-tighter leading-[0.95] mb-8 text-[#111111] max-w-5xl mx-auto">
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
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
              {page.hero.subheadline}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
              <Link href="/dashboard">
                <button className="group relative flex items-center justify-center gap-3 bg-[#FF4D00] text-white pl-8 pr-6 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(255,77,0,0.5)]">
                  <span className="font-bold text-lg tracking-tight">{page.hero.ctaText}</span>
                  <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                    <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 pl-4">
              <div className="flex items-center relative h-12 w-[140px]">
                {[1, 2, 3].map((i, index) => (
                  <div
                    key={i}
                    className={`absolute top-0 w-12 h-12 rounded-2xl border-[3px] border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                      ${index === 0 ? 'left-0 z-30' : ''}
                      ${index === 1 ? 'left-8 z-20' : ''}
                      ${index === 2 ? 'left-16 z-10' : ''}
                    `}
                  >
                    <img
                      src={`https://randomuser.me/api/portraits/thumb/men/${i * 12 + 8}.jpg`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div className="absolute left-24 top-0 w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-[10px] font-bold border-[3px] border-[#F2F2F0] shadow-sm z-40">
                  1.4K+
                </div>
              </div>

              <div className="flex flex-col justify-center text-left gap-0.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-[#FF4D00] text-[#FF4D00]" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Trusted by 1.4K+ Families</span>
              </div>
            </div>
          </section>

          {/* --- APP STORE FRICTION / WHY A WEB APP --- */}
          {page.appStoreFriction && (
            <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 pb-24">
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4D00]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#FF4D00]/10 text-[#FF4D00] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                      <Smartphone size={14} />
                      <span>No Install Required</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight text-[#111111] mb-6 leading-tight">
                      {page.appStoreFriction.heading}
                    </h2>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8">
                      {page.appStoreFriction.body}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <Cloud size={18} className="text-[#FF4D00]" />
                        <span className="text-sm font-bold text-gray-700">Instant Access</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                        <Download size={18} className="text-gray-400" />
                        <span className="text-sm font-bold text-gray-700">0 MB Download</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    {/* Visual representation of "Instant App" */}
                    <div className="bg-[#111111] rounded-[2rem] p-6 text-white shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                       <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                          <div className="flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="text-xs font-mono text-gray-500">bringback.pro/app</div>
                       </div>
                       <div className="space-y-4">
                          <div className="h-40 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                             <Zap size={48} className="text-[#FF4D00]" />
                          </div>
                          <div className="space-y-2">
                             <div className="h-4 bg-white/10 rounded w-3/4"></div>
                             <div className="h-4 bg-white/10 rounded w-1/2"></div>
                          </div>
                          <button className="w-full bg-[#FF4D00] py-3 rounded-lg font-bold text-sm mt-4">Launch App Instantly</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* --- QUALITY ANALYSIS / REAL RESULTS SECTION --- */}
          <section id="quality-analysis" className="bg-[#111111] text-white py-32 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF4D00]/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-[1320px] mx-auto px-4 relative z-10">
              {page.qualityAnalysis ? (
                <>
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl">
                      <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                        <span className="text-[#FF4D00]">//</span> Feature Deep Dive <span className="text-[#FF4D00]">//</span>
                      </div>
                      <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                        {page.qualityAnalysis.heading}
                      </h2>
                    </div>
                    <div className="max-w-sm">
                      <p className="text-lg text-gray-400 font-medium leading-relaxed">
                        {page.qualityAnalysis.subheading}
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content Side */}
                    <div>
                      <div className="space-y-8">
                      {page.qualityAnalysis.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300">
                             <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1 text-white">{feature.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual Transformation Side */}
                  <div className="relative w-full min-w-0">
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 lg:p-8 backdrop-blur-sm w-full">
                       {/* Inputs */}
                       <div className="flex gap-4 mb-8 overflow-x-auto pb-4 no-scrollbar mask-gradient-r w-full">
                          {page.qualityAnalysis.visuals.inputs.map((input, idx) => (
                            <div key={idx} className="flex-shrink-0 w-32 relative group">
                               <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 border-2 border-white/10 relative">
                                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded text-white">IN</div>
                                  <img src={input.src} className="w-full h-full object-cover" alt={input.label} />
                               </div>
                               <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 text-center">{input.label}</p>
                            </div>
                          ))}
                       </div>

                       {/* Process Arrow */}
                       <div className="flex justify-center mb-8 relative">
                          <div className="bg-[#FF4D00] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-[#FF4D00]/20 flex items-center gap-2 z-10">
                             AI Processing <Sparkles size={14} fill="currentColor" />
                          </div>
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -z-0"></div>
                       </div>

                       {/* Result */}
                       <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-2xl shadow-black/50">
                          <div className="absolute top-4 left-4 z-10 bg-[#FF4D00] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">FINAL RESULT</div>
                          {page.qualityAnalysis.visuals.output.src.endsWith('.mp4') ? (
                            <video 
                              src={page.qualityAnalysis.visuals.output.src} 
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                            />
                          ) : (
                            <img 
                              src={page.qualityAnalysis.visuals.output.src} 
                              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                              alt={page.qualityAnalysis.visuals.output.label} 
                            />
                          )}
                          
                          {/* Floating Detail Badges */}
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto no-scrollbar">
                             {['Perfect Lighting', 'Unified Scale', 'HD Detail'].map((tag, i) => (
                                <div key={i} className="flex-shrink-0 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                                   <CheckCircle2 size={10} className="text-[#FF4D00]" /> {tag}
                                </div>
                             ))}
                          </div>
                       </div>
                       <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 mt-4">{page.qualityAnalysis.visuals.output.label}</p>
                    </div>
                  </div>
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
                       <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
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

          {/* --- HOW IT WORKS --- */}
          <section id="how-it-works" className="py-24 bg-[#F2F2F0]">
            <div className="max-w-[1320px] mx-auto px-4">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> Process <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
                    {page.howItWorks.heading}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {page.howItWorks.subheading}
                  </p>
                </div>
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

          {/* --- EMOTIONAL BENEFITS / USE CASES --- */}
          <section id="emotional-benefits" className="py-32 bg-white relative">
            <div className="max-w-[1320px] mx-auto px-4">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> Why It Matters <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
                    {page.benefits.heading}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {page.benefits.subheading}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
                {page.benefits.items.map((benefit, idx) => {
                  const Icon = iconMap[benefit.icon] || Star;
                  return (
                    <div key={idx} className="flex flex-col gap-6 group">
                      <div className="w-16 h-16 bg-[#F2F2F0] rounded-2xl flex items-center justify-center text-[#111111] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-500">
                        <Icon size={32} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-[#111111]">{benefit.title}</h3>
                        <p className="text-lg text-gray-500 leading-relaxed">{benefit.description}</p>
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
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                      <span className="text-[#FF4D00]">//</span> Security <span className="text-[#FF4D00]">//</span>
                    </div>
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                      Your Privacy is <br />
                      <span className="text-gray-400">Non-Negotiable.</span>
                    </h2>
                  </div>
                  <div className="max-w-sm">
                    <p className="text-lg text-gray-400 font-medium leading-relaxed">
                      We operate with a zero-retention policy. Your photos are processed securely and permanently destroyed after your session.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   {/* Card 1 */}
                   <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                      <div className="w-14 h-14 bg-[#FF4D00]/20 rounded-2xl flex items-center justify-center mb-8 text-[#FF4D00]">
                         <Clock size={28} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Auto-Deletion Protocol</h3>
                      <p className="text-gray-400 leading-relaxed font-medium">
                         Every uploaded and generated image is automatically scrubbed from our servers within 30 minutes. No backups, no hidden archives.
                      </p>
                   </div>

                   {/* Card 2 */}
                   <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                      <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 text-blue-400">
                         <Shield size={28} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">End-to-End Encryption</h3>
                      <p className="text-gray-400 leading-relaxed font-medium">
                         Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We utilize isolated processing containers that prevent any cross-user data leakage.
                      </p>
                   </div>

                   {/* Card 3 */}
                   <div className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors duration-300">
                      <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-8 text-green-400">
                         <Users size={28} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">No AI Training</h3>
                      <p className="text-gray-400 leading-relaxed font-medium">
                         We strictly do NOT use your private photos to train our public AI models. Your memories remain yours, and yours alone.
                      </p>
                   </div>
                </div>
             </div>
          </section>

          {/* --- PRICING --- */}
          <Pricing />

          {/* --- CLIENTS --- */}
          <Clients />

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
