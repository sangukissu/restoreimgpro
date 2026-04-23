"use client"

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Zap, PlayCircle, UploadCloud, Download, CheckCircle, Star, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { ComparePageData } from '@/lib/comparedata';
import { Compare } from "@/components/ui/compare";
import { useState } from 'react';

export default function CompareLayout({ page }: { page: ComparePageData }) {
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="w-full">
      {/* FULL-WIDTH DYNAMIC HERO SECTION */}
      <section className="border-b border-gray-300 overflow-hidden relative py-12">
        <div className="max-w-[1320px] mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Hero Left: Text & CTA */}
          <div className="flex-1 space-y-6 relative z-10">
            <div className="text-[#FF4D00] font-bold tracking-wider text-sm uppercase flex items-center gap-2">
              <span className="w-8 h-0.5 bg-[#FF4D00]"></span> {page.competitor} Alternative
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-[850] text-[#111111] leading-[1.05] tracking-tight">
              {page.hero.h1.split(new RegExp(`(${page.competitor} alternative)`, 'gi')).map((part, i) => 
                part.toLowerCase() === `${page.competitor.toLowerCase()} alternative` ? (
                  <span key={i} className="text-[#FF4D00] underline decoration-[#FF4D00]/30 underline-offset-8 decoration-8">
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
              {page.hero.subheadline}
            </p>
            
          
            
            <div className="pt-2">
              <Link href={page.ctaLink}>
                <button className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-black/10">
                  Try the Better Alternative <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Right: Dynamic Visuals based on Niche */}
          <div className="flex-1 w-full relative z-10">
            {page.niche === 'restoration' && page.hero.visuals.beforeImage && page.hero.visuals.afterImage && (
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto">
                <Compare 
                  firstImage={page.hero.visuals.beforeImage} 
                  secondImage={page.hero.visuals.afterImage} 
                  initialSliderPercentage={50}
                />
              </div>
            )}

            {page.niche === 'animation' && page.hero.visuals.videoUrl && (
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative aspect-[4/5] max-w-sm mx-auto bg-gray-900">
                <video 
                  src={page.hero.visuals.videoUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover opacity-90" 
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none"></div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> AI Animating
                  </div>
                </div>
              </div>
            )}

            {page.niche === 'merging' && page.hero.visuals.inputImages && page.hero.visuals.outputImage && (
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 max-w-xl mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {page.hero.visuals.inputImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden relative border border-gray-100 shadow-sm">
                      <img src={img} alt="input" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-1.5 py-0.5 rounded">IN</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center -mt-8 mb-4 relative z-10">
                  <div className="bg-[#FF4D00] text-white rounded-full p-2 shadow-xl border-2 border-white">
                    <ArrowRight size={20} className="rotate-90" />
                  </div>
                </div>
                <div className="aspect-[16/9] rounded-xl overflow-hidden relative border border-gray-100 shadow-sm">
                  <img src={page.hero.visuals.outputImage} alt="output" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-[#FF4D00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
                    Unified AI Portrait
                  </div>
                </div>
              </div>
            )}
            
            {/* Abstract Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#FF4D00]/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
          </div>

        </div>
      </section>

      {/* MAIN LAYOUT: TOC + Content */}
      <div className="max-w-[1320px] mx-auto px-4 py-16 relative flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDEBAR: Sticky TOC */}
        <div className="hidden lg:block w-[240px] shrink-0">
          <div className="sticky top-28 pt-2">
            <h4 className="font-bold text-gray-400 mb-6 uppercase tracking-widest text-xs">On this page</h4>
            <nav className="flex flex-col gap-4">
              <a href="#verdict" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Quick verdict</a>
              <a href="#about" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">About {page.competitor}</a>
              <a href="#why-switch" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Why people switch</a>
              <a href="#how-to-switch" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">How to switch</a>
              <a href="#matrix" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Side-by-side comparison</a>
              <a href="#semantic-capabilities" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Capabilities</a>
              <a href="#unique-advantage" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Unique advantage</a>
              <a href="#which-to-choose" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Which to pick</a>
              <a href="#final-thoughts" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Final thoughts</a>
              <a href="#faq" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">FAQ</a>
              <a href="#methodology" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Methodology</a>
            </nav>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 pb-32">
          
          {/* Section 2: The Mega Verdict Card (Matching Competitor Layout) */}
          <section id="verdict" className="scroll-mt-28 mb-24">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Top Verdict Box */}
              <div className="p-4 md:p-8 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-[#FF4D00] font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle size={18} /> Quick Verdict
                </h3>
                <p className="text-gray-800 text-lg font-medium leading-relaxed">
                  {page.verdict.text}
                </p>
              </div>
              
              {/* Two Choices Box */}
              <div className="grid md:grid-cols-2 border-b border-gray-100">
                <div className="p-4 md:p-8 border-r border-gray-100 relative">
                   <span className="bg-[#FF4D00] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block shadow-sm">
                     Our Pick
                   </span>
                   <h4 className="text-2xl font-bold mb-4 text-[#111111]">{page.verdict.ourPickTitle}</h4>
                   <p className="text-gray-600 text-lg font-medium">
                     {page.verdict.ourPickDesc}
                   </p>
                </div>
                <div className="p-4 md:p-8 relative bg-gray-50/30">
                   <span className="bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block">
                     Alternative
                   </span>
                   <h4 className="text-2xl font-bold mb-4 text-gray-800">{page.verdict.altPickTitle}</h4>
                   <p className="text-gray-600 text-lg font-medium">{page.verdict.altPickDesc}</p>
                </div>
              </div>

              {/* Testimonials */}
              <div className="p-4 md:p-8 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                   <div className="flex text-[#FF4D00]"><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/><Star fill="currentColor" size={18}/></div>
                   <span className="font-bold text-gray-900 ml-2">Loved by 1.4K+ people</span>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                   {page.testimonials.map((test, i) => (
                      <div key={i} className="flex flex-col gap-4">
                         <p className="text-gray-600 font-medium text-sm italic">"{test.quote}"</p>
                         <div className="flex items-center gap-3">
                            <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full bg-gray-200" />
                            <span className="font-bold text-sm text-gray-900">{test.author}</span>
                         </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* CTA Bar */}
              <div className="p-4 md:p-8 bg-[#FF4D00] text-white flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                    <h4 className="text-2xl font-bold mb-1">See the difference on your own photos</h4>
                    <p className="font-medium text-white/80">Premium quality • No watermarks • No subscriptions</p>
                 </div>
                 <Link href={page.ctaLink}>
                   <button className="bg-white text-[#FF4D00] px-8 py-4 rounded-full font-bold text-lg whitespace-nowrap flex items-center gap-2">
                     Try the Better Alternative <ArrowRight size={20} />
                   </button>
                 </Link>
              </div>
            </div>
          </section>

          {/* Section 3: About Competitor & Pros/Cons */}
          <section id="about" className="mb-24 scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.aboutCompetitor.title}</h2>
            <div className="space-y-4 mb-10">
               {page.aboutCompetitor.content.map((p, i) => (
                  <p key={i} className="text-lg text-gray-600 font-medium leading-relaxed">{p}</p>
               ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               {/* Pros */}
               <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-green-600 font-bold uppercase tracking-wider text-sm mb-6">Pros</h4>
                  <ul className="space-y-4">
                    {page.aboutCompetitor.pros.map((pro, i) => (
                       <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                          <span className="text-green-500 font-bold shrink-0 mt-0.5">+</span> {pro}
                       </li>
                    ))}
                  </ul>
               </div>
               {/* Cons */}
               <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                  <h4 className="text-red-500 font-bold uppercase tracking-wider text-sm mb-6">Cons</h4>
                  <ul className="space-y-4">
                    {page.aboutCompetitor.cons.map((con, i) => (
                       <li key={i} className="flex items-start gap-3 text-gray-700 font-medium">
                          <span className="text-red-400 font-bold shrink-0 mt-0.5">-</span> {con}
                       </li>
                    ))}
                  </ul>
               </div>
            </div>


          </section>

          {/* Section 4: Why People Switch (Deep Dive) */}
          <section id="why-switch" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.whySwitch.title}</h2>
             
             <div className="space-y-4 mb-12">
               {page.whySwitch.intro.map((p, i) => (
                  <p key={i} className="text-lg text-gray-600 font-medium leading-relaxed">{p}</p>
               ))}
             </div>

             <div className="space-y-8 pl-6 border-l-2 border-[#FF4D00]/20">
                {page.whySwitch.points.map((point, i) => (
                   <div key={i}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{point.title}</h3>
                      <p className="text-lg text-gray-600 font-medium leading-relaxed">{point.description}</p>
                   </div>
                ))}
             </div>
          </section>

          {/* Section 4.5: How to Switch / Step-by-Step */}
          <section id="how-to-switch" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.howToSwitch.title}</h2>
             <p className="text-lg text-gray-600 font-medium leading-relaxed mb-12">{page.howToSwitch.description}</p>
             
             <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
                
                {page.howToSwitch.steps.map((step, i) => (
                   <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-xl ring-8 ring-white">
                         {step.stepNumber}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{step.description}</p>
                   </div>
                ))}
             </div>
          </section>

          {/* Section 5: Matrix */}
          <section id="matrix" className="mb-12 scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-[#111111] mb-4">BringBack AI vs {page.competitor}</h2>
            <p className="text-lg text-gray-600 font-medium leading-relaxed mb-8 max-w-3xl">
              {page.matrix.description}
            </p>
            <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border border-gray-200">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr>
                    <th className="p-6 border-b border-gray-200 font-bold text-gray-900 w-1/4">Feature</th>
                    <th className="p-6 border-b border-gray-200 font-bold text-gray-900 w-2/5">
                       BringBack AI <span className="ml-2 bg-[#FF4D00] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">Our Pick</span>
                    </th>
                    <th className="p-6 border-b border-gray-200 font-bold text-gray-500 w-1/3">{page.competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {page.matrix.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-6 text-gray-600 font-medium">{row.feature}</td>
                      <td className="p-6 text-gray-900 font-bold bg-[#FF4D00]/5 flex items-start gap-2 h-full min-h-[80px]">
                         {row.winner === 'bringBack' && <Check size={18} className="text-[#FF4D00] shrink-0 mt-0.5" />} 
                         {row.bringBack}
                      </td>
                      <td className="p-6 text-gray-500 font-medium">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
            {/* In-Content CTA */}
            <div className="mb-12 text-center bg-[#FF4D00]/5 rounded-3xl p-8 border border-[#FF4D00]/20 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF4D00]/50 to-transparent"></div>
               <h3 className="text-3xl font-extrabold text-[#111111] mb-4">Don't let your family's history fade away.</h3>
               <p className="text-gray-600 mb-8 font-medium text-lg max-w-2xl mx-auto">
                 Behind every damaged photo is a story waiting to be told again. Stop settling for tools that treat your ancestors like digital selfies. Bring them back with the respect they deserve.
               </p>
               <Link href={page.ctaLink}>
                 <button className="bg-[#111111] text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-xl">
                   Honor Your Memories Today <ArrowRight size={20} />
                 </button>
               </Link>
            </div>
          {/* Section 5.5: Semantic Capabilities */}
          <section id="semantic-capabilities" className="mb-12 scroll-mt-28">
             <div className="bg-[#111111] rounded-3xl p-4 md:p-8 shadow-xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D00]/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative z-10">
                   <h2 className="text-3xl font-extrabold text-white mb-6">{page.semanticCapabilities.title}</h2>
                   <p className="text-lg text-gray-300 font-medium leading-relaxed mb-10 max-w-3xl">
                     {page.semanticCapabilities.description}
                   </p>
                   
                   <div className="grid md:grid-cols-2 gap-4">
                      {page.semanticCapabilities.capabilities.map((cap, i) => (
                         <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-full bg-[#FF4D00]/20 flex items-center justify-center shrink-0">
                               <Check size={16} className="text-[#FF4D00]" />
                            </div>
                            <span className="text-white font-medium">{cap}</span>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>

          {/* Section 5.6: Unique Advantage */}
          <section id="unique-advantage" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.uniqueAdvantage.title}</h2>
             <p className="text-lg text-gray-600 font-medium leading-relaxed mb-12 max-w-3xl">
               {page.uniqueAdvantage.description}
             </p>
             
             <div className="grid md:grid-cols-2 gap-8">
                {page.uniqueAdvantage.features.map((feature, i) => (
                   <div key={i} className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:bg-white hover:shadow-lg transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF4D00]/10 flex items-center justify-center mb-6">
                         <Zap size={24} className="text-[#FF4D00]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.heading}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{feature.text}</p>
                   </div>
                ))}
             </div>
          </section>

          {/* Section 6: Which to choose? */}
          <section id="which-to-choose" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-8">Which one should you choose?</h2>
             <div className="grid md:grid-cols-2 gap-6">
                {/* BringBack Box */}
                <div className="bg-white border-2 border-[#FF4D00]/20 rounded-3xl p-8 shadow-sm">
                   <h4 className="text-[#FF4D00] font-bold uppercase tracking-wider text-sm mb-6">{page.whichToChoose.bringBackTitle}</h4>
                   <ul className="space-y-4">
                      {page.whichToChoose.bringBackPoints.map((p, i) => (
                         <li key={i} className="flex items-start gap-3 text-gray-800 font-medium">
                            <Check className="text-[#FF4D00] shrink-0 mt-0.5" size={20} /> {p}
                         </li>
                      ))}
                   </ul>
                </div>
                {/* Competitor Box */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                   <h4 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-6">{page.whichToChoose.competitorTitle}</h4>
                   <ul className="space-y-4">
                      {page.whichToChoose.competitorPoints.map((p, i) => (
                         <li key={i} className="flex items-start gap-3 text-gray-600 font-medium">
                            <Check className="text-gray-400 shrink-0 mt-0.5" size={20} /> {p}
                         </li>
                      ))}
                   </ul>
                </div>
             </div>
          </section>

          {/* Section 7: Final Thoughts */}
          <section id="final-thoughts" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.finalThoughts.title}</h2>
             <div className="space-y-4">
               {page.finalThoughts.content.map((p, i) => (
                  <p key={i} className="text-lg text-gray-600 font-medium leading-relaxed">{p}</p>
               ))}
             </div>
          </section>

          {/* Section 8: Premium FAQ Accordion */}
          <section id="faq" className="mt-12 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-extrabold text-[#111111]">Frequently Asked Questions</h2>
            </div>
            <p className="text-gray-600 font-medium mb-10 text-lg">Everything you need to know about switching from {page.competitor} to BringBack AI.</p>
            
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className={`border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === i ? 'bg-white shadow-xs shadow-black/5' : 'bg-gray-50/50 hover:bg-gray-50'}`}
                >
                  <button 
                    onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left focus:outline-none"
                  >
                    <h3 className={`font-bold text-lg transition-colors ${openFaqIndex === i ? 'text-[#FF4D00]' : 'text-gray-900'}`}>
                      {faq.q}
                    </h3>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaqIndex === i ? 'bg-[#FF4D00]/10 text-[#FF4D00]' : 'bg-white text-gray-400 shadow-sm border border-gray-100'}`}>
                      {openFaqIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out origin-top ${openFaqIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="w-12 h-1 bg-gray-100 rounded-full mb-4"></div>
                      <p className="text-gray-600 font-medium leading-relaxed text-[15px]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

    

        </div>
      </div>

      {/* FLOATING CTA: Bottom/Right Conversion Point */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 p-4 z-50 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:bottom-8 lg:left-8 lg:right-auto lg:w-[350px] lg:rounded-xl lg:border lg:p-4 lg:flex-col lg:gap-4">
        <div className="text-md font-bold text-gray-800 hidden lg:block text-center">Your family's legacy is waiting.</div>
        <Link href={page.ctaLink} className="w-full">
          <button className="w-full bg-[#FF4D00] text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 hover:shadow-xl shadow-[#FF4D00]/20 flex items-center justify-center gap-2">
            Bring Them Back Today <ArrowRight size={18} />
          </button>
        </Link>
      </div>

    </div>
  );
}