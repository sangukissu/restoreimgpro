// /app/restore/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { allPseoPages, getPageDataBySlug } from '@/lib/generate-pages';
import { generateJsonLd, generateOpenGraph, generateTwitterCard } from '@/lib/schema-generator';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import Link from 'next/link';
import { ChevronRight, Sparkles, Star, Clock, Shield } from 'lucide-react';
import { FramerButton } from '@/components/ui/framer-button';

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

      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="pt-32 pb-20">
          <div>

            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="  text-4xl lg:text-6xl text-black mb-6 leading-tight">
                {page.h1}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                {page.metaDescription}
              </p>

              {/* Main CTA */}
              <Link href="/login">
                <FramerButton
                  variant="primary"
                  icon={<ChevronRight className="w-5 h-5" />}
                  className="text-lg py-6 px-8 group relative overflow-hidden"
                >
                  Restore Your Photo in 30 Seconds
                </FramerButton>
              </Link>
            </div>

            {/* Before & After Visual */}
            <div className="mb-20">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-black text-center mb-8">See the Transformation</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-4">
                      <img
                        src={page.beforeImageUrl}
                        alt={`Before: ${page.h1}`}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-gray-600 font-medium">Before Restoration</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-4 relative">
                      <img
                        src={page.afterImageUrl}
                        alt={`After: ${page.h1} restored by AI`}
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Restored
                      </div>
                    </div>
                    <p className="text-green-600 font-medium">After Restoration</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <section className="px-4 py-20 mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 mb-20">

                {/* The Problem */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 bg-gray-800 rounded-full"></div>
                    <h2 className=" text-3xl lg:text-4xl text-black">The Challenge</h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pl-6">
                    {page.content.problem}
                  </p>
                </div>

                {/* The Solution */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-12 bg-black rounded-full"></div>
                    <h2 className=" text-3xl lg:text-4xl text-black">Our Solution</h2>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed pl-6">
                    {page.content.solution}
                  </p>
                </div>
              </div>

              {/* Subject Section (if exists) */}
              {page.content.subject && (
                <div className="text-center py-16 border-t border-gray-200">
                  <div className="max-w-4xl mx-auto">
                    <blockquote className="text-2xl md:text-3xl font-light text-gray-800 italic leading-relaxed">
                      "{page.content.subject}"
                    </blockquote>
                  </div>
                </div>
              )}
            </section>

            {/* Why Choose BringBack.pro */}
            <section className="bg-[#fff6f0de]">
              <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Why Choose Us</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight">
                    Why trust{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10">BringBack.pro</span>
                      <span className="absolute inset-0 bg-orange-100 rounded-lg transform -rotate-1 scale-110"></span>
                    </span>
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transform -rotate-1">
                    <div className="mb-6">
                      <Clock className="w-12 h-12 text-black mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">Lightning Fast</h3>
                    <p className="text-gray-600 leading-relaxed">Get your restored photos in under 30 seconds, not weeks like traditional services.</p>
                  </div>

                  <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transform rotate-1">
                    <div className="mb-6">
                      <Star className="w-12 h-12 text-black mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">Professional Quality</h3>
                    <p className="text-gray-600 leading-relaxed">AI-powered restoration that rivals expensive manual services at a fraction of the cost.</p>
                  </div>

                  <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transform -rotate-1">
                    <div className="mb-6">
                      <Shield className="w-12 h-12 text-black mx-auto" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-4">100% Private</h3>
                    <p className="text-gray-600 leading-relaxed">Your photos are processed securely and deleted automatically after restoration.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-white">
              <div className="max-w-6xl mx-auto px-4 py-20 ">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Our Process, Explained</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight">
                    {page.howItWorks.title.replace('How Our AI Photo Restoration Works', 'Your Memories, Reborn in')} {" "}
                    <span className="relative">
                      <span className="relative z-10 px-3 py-1 bg-black text-white rounded-full text-3xl lg:text-4xl font-bold">3</span>
                    </span>{" "}
                    Simple{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10">Steps</span>
                      <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-200 rounded-full transform -rotate-1"></span>
                    </span>
                  </h2>
                </div>

                <div className="max-w-6xl mx-auto">
                  <p className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
                    {page.howItWorks.description}
                  </p>

                  <div className="relative">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative">
                      {page.howItWorks.steps.map((step, index) => (
                        <div key={index} className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transform ${index === 0 ? 'lg:mt-8 -rotate-2 sm:-rotate-5' :
                            index === 1 ? 'rotate-2 sm:rotate-5' :
                              'lg:mt-8 -rotate-1 sm:-rotate-3'
                          } relative z-10`}>
                          <div className="mb-6">
                            <span className="text-6xl font-bold text-black">{index + 1}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-black mb-4">{step.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table Section */}
            <section className="bg-gray-50">
              <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Compare & Decide</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight mb-6">
                    {page.comparisonTable.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.comparisonTable.description}
                  </p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                        <tr>
                          <th className="p-6 text-left font-semibold text-lg">Feature</th>
                          <th className="p-6 text-center font-semibold text-lg">BringBack.pro</th>
                          <th className="p-6 text-center font-semibold text-lg">Competitors</th>
                          <th className="p-6 text-center font-semibold text-lg">Manual Restoration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {page.comparisonTable.rows.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                            <td className="p-6 font-semibold text-gray-900 border-b border-gray-100">{row.feature}</td>
                            <td className="p-6 text-center border-b border-gray-100">
                              <div className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-black to-gray-800 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                                <Sparkles className="w-4 h-4 mr-2" />
                                {row.bringback}
                              </div>
                            </td>
                            <td className="p-6 text-center border-b border-gray-100">
                              <div className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 shadow-sm">
                                {row.competitors}
                              </div>
                            </td>
                            <td className="p-6 text-center border-b border-gray-100">
                              <div className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 shadow-sm">
                                {row.manual}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-6">
                  {page.comparisonTable.rows.map((row, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4">
                        <h3 className="font-semibold text-lg text-center">{row.feature}</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* BringBack.pro */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-black to-gray-800 rounded-xl text-white shadow-lg">
                          <div className="flex items-center">
                            <Sparkles className="w-5 h-5 mr-2" />
                            <span className="font-semibold">BringBack.pro</span>
                          </div>
                          <span className="font-medium">{row.bringback}</span>
                        </div>

                        {/* Competitors */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl text-gray-700 shadow-sm">
                          <span className="font-semibold">Competitors</span>
                          <span className="font-medium">{row.competitors}</span>
                        </div>

                        {/* Manual Restoration */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl text-gray-600 shadow-sm">
                          <span className="font-semibold">Manual Restoration</span>
                          <span className="font-medium">{row.manual}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Use Cases & Examples Section */}
            <section className="bg-white">
              <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Real-World Applications</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight mb-6">
                    {page.useCases.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.useCases.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {page.useCases.cases.map((useCase, index) => (
                    <div key={index} className="group">
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="text-4xl mb-6">{useCase.icon}</div>
                        <h3 className="text-xl font-bold text-black mb-4">{useCase.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">{useCase.description}</p>
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-sm text-gray-500 italic">"{useCase.example}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Cost Analysis Section */}
            <section className="bg-gray-50">
              <div className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Investment & Value</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight mb-6">
                    {page.costAnalysis.title}
                  </h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    {page.costAnalysis.description}
                  </p>
                </div>

                {/* Pricing Plans */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  {page.costAnalysis.plans.map((plan, index) => (
                    <div key={index} className="group">
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                          <div className="text-4xl font-bold text-black mb-4">{plan.price}</div>
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        <ul className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-black rounded-full mr-3 flex-shrink-0"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Service Comparison */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-black text-center mb-8">Service Comparison</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {page.costAnalysis.comparison.map((service, index) => (
                      <div key={index} className="text-center p-6 rounded-xl border border-gray-100">
                        <h4 className="text-lg font-semibold text-black mb-2">{service.service}</h4>
                        <div className="text-2xl font-bold text-black mb-2">{service.cost}</div>
                        <p className="text-sm text-gray-600">{service.timeframe}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-white">
              <div className="px-4 py-20 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-gray-500 italic text-lg mb-4">Common Questions</p>
                  <h2 className=" text-4xl lg:text-5xl text-black leading-tight">
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-6">
                  {page.faqs.map((faq, index) => (
                    <div key={index} className="group">
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <h3 className="text-xl font-bold text-black mb-4 leading-tight">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="bg-black">
              <div className="px-4 py-20 max-w-4xl mx-auto text-center">
                <h2 className=" text-4xl lg:text-5xl text-white leading-tight mb-6">
                  Ready to Bring Your Memories Back?
                </h2>
                <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of satisfied customers who have restored their precious memories with our AI technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/login">
                    <FramerButton
                      variant="secondary"
                      icon={<ChevronRight className="w-5 h-5" />}
                      className="text-lg py-6 px-8 bg-white text-black hover:bg-gray-100 transition-all duration-300"
                    >
                      Start Your Restoration Now - Only $2.49
                    </FramerButton>
                  </Link>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">Trusted by 190+ customers</span>
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