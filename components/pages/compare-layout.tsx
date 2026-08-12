"use client"

import React from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Zap, PlayCircle, UploadCloud, Download, CheckCircle, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { ComparePageData, COMPARE_CLAIM, compareLastUpdated, listComparePages } from '@/lib/comparedata';
import { Compare } from "@/components/ui/compare";
import { useState } from 'react';
import { SiteBreadcrumb } from '@/components/seo/site-breadcrumb';

function formatDisplayDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Supporting guides selected by comparison category. */
const RELATED_GUIDES: Record<
  ComparePageData["niche"],
  { href: string; title: string; blurb: string }[]
> = {
  restoration: [
    {
      href: "/guides/scan-family-photos-safely",
      title: "Scan family photos safely",
      blurb: "DPI, glare, stuck glass, and a ready-for-AI acceptance check.",
    },
    {
      href: "/guides/why-ai-changes-faces",
      title: "Why AI changes faces",
      blurb: "Identity drift risks before you print or share a restore.",
    },
    {
      href: "/guides/restore-only-vs-colorize",
      title: "Restore-only vs colorize",
      blurb: "When to keep monochrome character vs interpret color.",
    },
    {
      href: "/restoration-benchmark",
      title: "Restoration benchmark",
      blurb: "How we score identity, damage, texture, and artifacts.",
    },
  ],
  animation: [
    {
      href: "/guides/subtle-vs-exaggerated-animation",
      title: "Subtle vs exaggerated animation",
      blurb: "How to choose restrained presets and spot common motion artifacts.",
    },
    {
      href: "/guides/choose-source-photos-for-likeness",
      title: "Source photos for likeness",
      blurb: "Angle, resolution, and lighting that keep identity stable.",
    },
    {
      href: "/old-photo-restoration",
      title: "Restore before you animate",
      blurb: "Clean landmarks first so motion does not stretch damage.",
    },
    {
      href: "/ai-photo-animation",
      title: "AI photo animation",
      blurb: "Product path for restrained face motion (10 credits).",
    },
  ],
  merging: [
    {
      href: "/guides/choose-source-photos-for-likeness",
      title: "Source photos for likeness",
      blurb: "Front/three-quarter rules and the 200px face minimum.",
    },
    {
      href: "/guides/scan-family-photos-safely",
      title: "Scan family photos safely",
      blurb: "Better scans before multi-era composites.",
    },
    {
      href: "/ai-family-portrait",
      title: "AI family portrait",
      blurb: "Merge separate photos into one studio-style group.",
    },
    {
      href: "/add-person-to-photo",
      title: "Add person to photo",
      blurb: "Memorial and missing-relative inserts into an existing shot.",
    },
  ],
}

/** Renders plain text with optional markdown-style links: [label](/path) or [label](https://...) */
function RichText({
  text,
  className = "text-lg text-gray-600 font-medium leading-relaxed",
}: {
  text: string
  className?: string
}) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return (
    <p className={className}>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (!m) return <React.Fragment key={i}>{part}</React.Fragment>
        const [, label, href] = m
        if (href.startsWith("/")) {
          return (
            <Link
              key={i}
              href={href}
              className="underline font-semibold text-gray-900 hover:text-[#FF4D00]"
            >
              {label}
            </Link>
          )
        }
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-gray-900 hover:text-[#FF4D00]"
          >
            {label}
          </a>
        )
      })}
    </p>
  )
}

export default function CompareLayout({ page }: { page: ComparePageData }) {
  
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const allCompare = listComparePages()
  const related = allCompare
    .filter((p) => p.slug !== page.slug)
    .sort((a, b) => a.competitor.localeCompare(b.competitor));
  const lastUpdated = compareLastUpdated(page)
  const hasEssays = Boolean(page.contextEssays && page.contextEssays.length > 0)
  const hasScenario = Boolean(page.scenario)
  const relatedGuides = RELATED_GUIDES[page.niche] ?? RELATED_GUIDES.restoration
  const nicheRelated = related
    .filter((p) => p.niche === page.niche)
    .slice(0, 6)

  return (
    <div className="w-full">
      <div className="max-w-[1320px] mx-auto px-4 pt-4">
        <SiteBreadcrumb
          items={[
            { name: "Compare", href: "/compare" },
            { name: `vs ${page.competitor}` },
          ]}
        />
      </div>
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

            <p className="text-sm text-gray-500 font-medium">
              Last updated {formatDisplayDate(lastUpdated)}
              {page.readingMinutes ? ` · ${page.readingMinutes} min read` : ""}
              {" · "}
              <Link href="/methodology" className="underline hover:text-[#FF4D00]">
                How we compare
              </Link>
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
            <h4 className="font-bold text-gray-400 mb-6 uppercase tracking-wider text-xs">On this page</h4>
            <nav className="flex flex-col gap-4">
              <a href="#verdict" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Quick verdict</a>
              {hasEssays && page.contextEssays!.map((essay) => (
                <a
                  key={essay.id}
                  href={`#${essay.id}`}
                  className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all"
                >
                  {essay.title}
                </a>
              ))}
              <a href="#about" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">About {page.competitor}</a>
              <a href="#why-switch" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Why people switch</a>
              {hasScenario && (
                <a href={`#${page.scenario!.id}`} className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">
                  In practice
                </a>
              )}
              <a href="#how-to-switch" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">How to switch</a>
              <a href="#matrix" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Side-by-side comparison</a>
              <a href="#semantic-capabilities" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Capabilities</a>
              <a href="#unique-advantage" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Unique advantage</a>
              <a href="#which-to-choose" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Which to pick</a>
              <a href="#final-thoughts" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Final thoughts</a>
              <a href="#methodology" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Methodology</a>
              <a href="#related-guides" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">Related guides</a>
              <a href="#faq" className="text-gray-500 font-medium hover:text-[#FF4D00] hover:font-bold text-sm transition-all">FAQ</a>
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

              {/* Trust notes — no invented testimonials or ratings */}
              <div className="p-4 md:p-8 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">How we compare honestly</h3>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="flex flex-col gap-2">
                      <p className="text-gray-700 font-semibold text-sm">Pay once</p>
                      <p className="text-gray-600 font-medium text-sm">{COMPARE_CLAIM.payOnce}</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <p className="text-gray-700 font-semibold text-sm">Compare before download</p>
                      <p className="text-gray-600 font-medium text-sm">Side-by-side view keeps the original and edit clearly distinguished.</p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <p className="text-gray-700 font-semibold text-sm">Method, not invented stars</p>
                      <p className="text-gray-600 font-medium text-sm">
                        No fabricated ratings here. See{" "}
                        <Link href="/restoration-benchmark" className="underline font-semibold text-gray-900">
                          restoration benchmark
                        </Link>
                        {", "}
                        <Link href="/methodology" className="underline font-semibold text-gray-900">
                          methodology
                        </Link>
                        , and Trustpilot for third-party reviews.
                      </p>
                   </div>
                </div>
                {page.testimonials?.length > 0 && (
                  <div className="grid md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-100">
                    {page.testimonials.map((test, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        <p className="text-gray-600 font-medium text-sm italic">&ldquo;{test.quote}&rdquo;</p>
                        <span className="font-bold text-sm text-gray-900">{test.author}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA Bar */}
              <div className="p-4 md:p-8 bg-[#FF4D00] text-white flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                    <h4 className="text-2xl font-bold mb-1">See the difference on your own photos</h4>
                    <p className="font-medium text-white/80">Premium quality • No watermarks • No subscriptions</p>
                 </div>
                 <Link href={page.ctaLink2}>
                   <button className="bg-white text-[#FF4D00] px-8 py-4 rounded-full font-bold text-lg whitespace-nowrap flex items-center gap-2">
                     Try the Better Alternative <ArrowRight size={20} />
                   </button>
                 </Link>
              </div>
            </div>
          </section>

          {/* Optional background sections */}
          {hasEssays && page.contextEssays!.map((essay) => (
            <section key={essay.id} id={essay.id} className="mb-20 scroll-mt-28">
              <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{essay.title}</h2>
              <div className="space-y-4">
                {essay.paragraphs.map((p, i) => (
                  <RichText key={i} text={p} />
                ))}
              </div>
              {essay.subsections && essay.subsections.length > 0 && (
                <div className="mt-10 space-y-8">
                  {essay.subsections.map((sub, i) => (
                    <div key={i} className="border-l-2 border-[#FF4D00]/30 pl-5">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{sub.heading}</h3>
                      <RichText text={sub.text} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Section 3: About Competitor & Pros/Cons */}
          <section id="about" className="mb-24 scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.aboutCompetitor.title}</h2>
            <div className="space-y-4 mb-10">
               {page.aboutCompetitor.content.map((p, i) => (
                  <RichText key={i} text={p} />
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
                  <RichText key={i} text={p} />
               ))}
             </div>

             <div className="space-y-8 pl-6 border-l-2 border-[#FF4D00]/20">
                {page.whySwitch.points.map((point, i) => (
                   <div key={i}>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{point.title}</h3>
                      <RichText text={point.description} />
                   </div>
                ))}
              </div>
          </section>

          {/* Optional real-world scenario */}
          {hasScenario && page.scenario && (
            <section id={page.scenario.id} className="mb-20 scroll-mt-28">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 md:p-10 shadow-sm">
                <p className="text-[#FF4D00] font-bold text-sm uppercase tracking-wider mb-3">In practice</p>
                <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.scenario.title}</h2>
                <div className="space-y-4">
                  {page.scenario.paragraphs.map((p, i) => (
                    <RichText key={i} text={p} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 4.5: How to Switch / Step-by-Step */}
          <section id="how-to-switch" className="mb-12 scroll-mt-28">
             <h2 className="text-3xl font-extrabold text-[#111111] mb-6">{page.howToSwitch.title}</h2>
             <div className="mb-12">
               <RichText text={page.howToSwitch.description} />
             </div>
             
             <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting line for desktop */}
                <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gray-200 z-0"></div>
                
                {page.howToSwitch.steps.map((step, i) => (
                   <div key={i} className="relative z-10 flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-16 h-16 rounded-full bg-[#111111] text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-xl ring-8 ring-white">
                         {step.stepNumber}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <RichText
                        text={step.description}
                        className="text-gray-600 font-medium leading-relaxed text-base"
                      />
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
               <Link href={page.ctaLink2}>
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
             <div className="mb-12 max-w-3xl">
               <RichText text={page.uniqueAdvantage.description} />
             </div>
             
             <div className="grid md:grid-cols-2 gap-8">
                {page.uniqueAdvantage.features.map((feature, i) => (
                   <div key={i} className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF4D00]/10 flex items-center justify-center mb-6">
                         <Zap size={24} className="text-[#FF4D00]" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.heading}</h3>
                      <RichText
                        text={feature.text}
                        className="text-gray-600 font-medium leading-relaxed"
                      />
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
                  <RichText key={i} text={p} />
               ))}
             </div>
          </section>

          {/* Methodology / trust — always rendered from page data + shared claim helpers */}
          <section id="methodology" className="mb-12 scroll-mt-28">
            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 md:p-8">
              <h2 className="text-2xl font-extrabold text-[#111111] mb-4">
                {page.trustAndMethodology?.title || "How we compare"}
              </h2>
              <div className="mb-4">
                <RichText
                  text={page.trustAndMethodology?.content || COMPARE_CLAIM.methodologyNote}
                  className="text-gray-600 font-medium leading-relaxed"
                />
              </div>
              <div className="mb-4">
                <RichText
                  text={COMPARE_CLAIM.privacyShort}
                  className="text-gray-600 font-medium leading-relaxed"
                />
              </div>
              <p className="text-sm text-gray-500 font-medium mb-3">
                {COMPARE_CLAIM.packSummary}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                Last reviewed {formatDisplayDate(lastUpdated)}. Pricing and competitor features change — verify on their site before buying.{" "}
                <Link href="/methodology" className="underline font-semibold text-gray-800 hover:text-[#FF4D00]">
                  Editorial methodology
                </Link>
                {" · "}
                <Link href="/restoration-benchmark" className="underline font-semibold text-gray-800 hover:text-[#FF4D00]">
                  Restoration benchmark
                </Link>
                {" · "}
                <Link href="/privacy" className="underline font-semibold text-gray-800 hover:text-[#FF4D00]">
                  Privacy Policy
                </Link>
                {" · "}
                <Link href="/pricing" className="underline font-semibold text-gray-800 hover:text-[#FF4D00]">
                  Pricing
                </Link>
              </p>
            </div>
          </section>

          {/* Related guides */}
          <section id="related-guides" className="mb-12 scroll-mt-28">
            <h2 className="text-3xl font-extrabold text-[#111111] mb-3">Related guides</h2>
            <p className="text-gray-600 font-medium mb-8 max-w-2xl">
              Practical guidance for preparing source photos, reviewing results, and choosing the next step.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {relatedGuides.map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="rounded-2xl border border-gray-200 bg-white p-5 hover:border-[#FF4D00]/40 transition-colors"
                >
                  <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed">{g.blurb}</p>
                </Link>
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
                    className={`transition-all duration-300 ease-in-out origin-top ${openFaqIndex === i ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="w-12 h-1 bg-gray-100 rounded-full mb-4"></div>
                      <RichText
                        text={faq.a}
                        className="text-gray-600 font-medium leading-relaxed text-[15px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* More comparisons hub links */}
          <section id="more-comparisons" className="mt-16 scroll-mt-28 border-t border-gray-200 pt-12">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-[#111111]">More comparisons</h2>
                <p className="mt-2 text-gray-600 font-medium">
                  Explore every BringBack alternative page.
                </p>
              </div>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 font-bold text-[#FF4D00] hover:underline"
              >
                Full comparison hub <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-800 hover:border-[#FF4D00]/40 hover:text-[#FF4D00] transition-colors"
                >
                  vs {p.competitor}
                </Link>
              ))}
            </div>
            {related.length === 0 && (
              <Link href="/compare" className="text-sm font-bold text-[#FF4D00]">
                View all comparisons
              </Link>
            )}
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
