// /app/restore/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { allPseoPages, getPageDataBySlug } from '@/lib/generate-pages';
import { generateJsonLd, generateOpenGraph, generateTwitterCard } from '@/lib/schema-generator';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { Clients } from '@/components/landing/Clients';
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
              <span className="text-[#FF4D00]">//</span> Premium Photo Restoration <span className="text-[#FF4D00]">//</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-[850] tracking-tighter leading-[0.95] mb-8 text-[#111111] max-w-5xl mx-auto">
              {page.h1}
            </h1>
            
            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-3xl mx-auto">
              {page.metaDescription}
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full">
              <Link href="/dashboard">
                <button className="group relative flex items-center justify-center gap-3 bg-[#FF4D00] text-white pl-8 pr-6 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(255,77,0,0.5)]">
                  <span className="font-bold text-lg tracking-tight">Restore Photo Now</span>
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

          {/* --- QUALITY ANALYSIS / REAL RESULTS SECTION --- */}
          <section id="quality-analysis" className="bg-[#111111] text-white py-32 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF4D00]/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-[1320px] mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                    <span className="text-[#FF4D00]">//</span> Professional Quality <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                    See the Transformation
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-400 font-medium leading-relaxed">
                    Witness the power of our AI as it breathes new life into your most precious memories.
                  </p>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                 <div className="space-y-8">
                    <div className="flex gap-4 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300">
                         <Clock size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">The Challenge</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{page.content.problem}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 group">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300">
                         <Zap size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1 text-white">Our Solution</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{page.content.solution}</p>
                      </div>
                    </div>
                    {page.content.subject && (
                      <div className="flex gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-300">
                           <Star size={18} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1 text-white">Why It Matters</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{page.content.subject}</p>
                        </div>
                      </div>
                    )}
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all duration-300 text-left">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-2 flex flex-col h-full">
                         <div className="bg-black/20 rounded-xl flex-1 relative overflow-hidden aspect-[4/5] border border-white/10">
                            <img src={page.beforeImageUrl} alt="Before" className="w-full h-full object-cover grayscale-[20%] contrast-[1.1]" />
                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                              Original
                            </div>
                         </div>
                      </div>
                      <div className="bg-black rounded-xl h-full relative overflow-hidden border border-white/10 aspect-[4/5]">
                         <img src={page.afterImageUrl} alt="After" className="w-full h-full object-cover" />
                         <div className="absolute top-3 right-3 bg-[#FF4D00] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                           <Sparkles size={10} fill="currentColor" /> Result
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between px-2">
                      <div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Before → After</p>
                         <p className="font-bold text-lg leading-tight text-white">AI Transformation in 30 Seconds</p>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* --- HOW IT WORKS --- */}
          <section id="how-it-works" className="py-24 bg-[#F2F2F0]">
            <div className="max-w-[1320px] mx-auto px-4">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> Process <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
                    {page.howItWorks.title}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {page.howItWorks.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {page.howItWorks.steps.map((step, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-[#FF4D00]/10">
                    <div className="text-8xl font-[900] text-gray-100 absolute -top-6 -right-6 select-none group-hover:text-[#FF4D00]/5 transition-colors duration-300">{idx + 1}</div>
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
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> Why It Matters <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
                    {page.useCases.title}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {page.useCases.description}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
                {page.useCases.cases.map((useCase, idx) => (
                    <div key={idx} className="flex flex-col gap-6 group">
                      <div className="w-16 h-16 bg-[#F2F2F0] rounded-2xl flex items-center justify-center text-[#111111] text-3xl group-hover:bg-[#FF4D00] group-hover:text-white transition-all duration-500">
                        {useCase.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4 text-[#111111]">{useCase.title}</h3>
                        <p className="text-lg text-gray-500 leading-relaxed mb-4">{useCase.description}</p>
                        <div className="bg-[#F2F2F0] rounded-xl p-4 border border-gray-100 italic text-sm text-gray-600">
                          "{useCase.example}"
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- COMPARISON SECTION --- */}
          <section className="bg-[#111111] text-white py-32 overflow-hidden relative">
            <div className="max-w-[1320px] mx-auto px-4 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 border border-white/10">
                    <span className="text-[#FF4D00]">//</span> Advantage <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                    {page.comparisonTable.title}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-400 font-medium leading-relaxed">
                    {page.comparisonTable.description}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-sm hidden md:block">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="p-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Feature</th>
                      <th className="p-6 font-bold text-[#FF4D00] uppercase tracking-wider text-sm border-l border-r border-white/10 bg-[#FF4D00]/10">BringBack.pro</th>
                      <th className="p-6 font-bold text-gray-400 uppercase tracking-wider text-sm">Competitors</th>
                      <th className="p-6 font-bold text-gray-400 uppercase tracking-wider text-sm border-l border-white/10">Manual Restoration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {page.comparisonTable.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="p-6 font-semibold text-white">{row.feature}</td>
                        <td className="p-6 font-bold text-white border-l border-r border-white/10 bg-[#FF4D00]/5 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-[#FF4D00]" /> {row.bringback}
                        </td>
                        <td className="p-6 text-gray-400">{row.competitors}</td>
                        <td className="p-6 text-gray-400 border-l border-white/10">{row.manual}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Comparison View */}
              <div className="md:hidden space-y-4">
                {page.comparisonTable.rows.map((row, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4 pb-2 border-b border-white/10">{row.feature}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-[#FF4D00]/10 rounded-lg p-2 border border-[#FF4D00]/20">
                        <span className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">BringBack</span>
                        <span className="text-sm font-bold text-white flex items-center gap-1"><CheckCircle2 size={12} className="text-[#FF4D00]"/> {row.bringback}</span>
                      </div>
                      <div className="flex justify-between items-center p-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Competitors</span>
                        <span className="text-sm text-gray-300">{row.competitors}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-t border-white/5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Manual</span>
                        <span className="text-sm text-gray-300">{row.manual}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-28 bg-[#F2F2F0]">
            <div className="max-w-[1320px] mx-auto px-4">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-1 bg-[#111111] text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                    <span className="text-[#FF4D00]">//</span> Value <span className="text-[#FF4D00]">//</span>
                  </div>
                  <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.1]">
                    {page.costAnalysis.title}
                  </h2>
                </div>
                <div className="max-w-sm">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {page.costAnalysis.description}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 mb-10">
                {page.costAnalysis.plans.map((plan, idx) => (
                  <div key={idx} className="bg-white rounded-[2rem] border border-gray-200 p-8 shadow-sm">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">Plan</p>
                        <h3 className="text-2xl font-extrabold text-[#111111]">{plan.name}</h3>
                      </div>
                      <p className="text-3xl font-extrabold text-[#FF4D00]">{plan.price}</p>
                    </div>
                    <p className="text-gray-600 font-medium mb-6">{plan.description}</p>
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-[#FF4D00] mt-0.5" />
                          <p className="text-sm text-gray-700 font-medium">{feature}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-sm">
                {page.costAnalysis.comparison.map((row, idx) => (
                  <div key={idx} className={`grid md:grid-cols-3 gap-4 px-6 py-5 ${idx !== page.costAnalysis.comparison.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <p className="font-bold text-[#111111]">{row.service}</p>
                    <p className="text-gray-700 font-medium">{row.cost}</p>
                    <p className="text-gray-500 font-medium">{row.timeframe}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* --- PRICING --- */}
          <Pricing />

          {/* --- CLIENTS --- */}
          <Clients />

          {/* --- FAQ --- */}
          <FAQ 
            items={page.faqs}
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
