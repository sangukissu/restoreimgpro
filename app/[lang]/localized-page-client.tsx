"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Droplets,
  Sun,
  Heart,
  Landmark,
  Users,
  CheckCircle2,
  ArrowRight,
  Lock,
  ScanLine,
  Play,
  Sparkles,
  Zap,
  Star,
  Plus,
  Minus,
  Timer,
  Info,
  CloudRain,
  History,
  Archive,
} from "lucide-react"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import type { LocalizedPageData } from "@/lib/countrypages"

// --- Shared Framer Motion Variants ---
const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

// --- Brand Components (Inlined to match Design System exactly) ---

// 1. Comparison Slider (Matches Showcase.tsx)
const ComparisonSlider: React.FC<{ before: string; after: string; label?: string }> = ({
  before,
  after,
  label,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    let clientX
    if ("touches" in e) {
      clientX = e.touches[0].clientX
    } else {
      clientX = (e as React.MouseEvent).clientX
    }
    const relativeX = clientX - left
    setSliderPosition(Math.min(Math.max((relativeX / width) * 100, 0), 100))
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] overflow-hidden rounded-[1.5rem] cursor-ew-resize select-none group border border-gray-100 shadow-sm"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* AFTER Image (Background) */}
      <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />

      {/* BEFORE Image (Foreground - Clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden border-r-[3px] border-white bg-gray-900"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={before}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover max-w-none grayscale sepia-[0.3] contrast-125 brightness-90 blur-[0.5px]"
          style={{ width: containerRef.current ? containerRef.current.offsetWidth : "100%" }}
        />
        {/* Label Overlay */}
        <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">
          Before
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-transparent z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-brand-orange transform hover:scale-110 transition-transform">
          <ScanLine size={18} strokeWidth={2.5} />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 bg-brand-orange/90 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-bold tracking-widest uppercase z-10">
        After
      </div>

      {label && (
        <div className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur text-brand-black px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          {label}
        </div>
      )}
    </div>
  )
}

// 2. Pricing Card (Matches Pricing.tsx)
const LocalizedPricingCard: React.FC<{
  title: string
  price: string
  description: string
  badge: string
  details: string[]
  featured?: boolean
  ctaText: string
}> = ({ title, price, description, badge, details, featured, ctaText }) => {
  return (
    <div
      className={`h-full rounded-[1.5rem] p-3 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative ${
        featured ? "bg-[#111111] text-white shadow-2xl" : "bg-white text-brand-black shadow-sm border border-gray-100"
      }`}
    >
      {/* Nested Header Card */}
      <div
        className={`rounded-[1.5rem] p-6 mb-4 flex flex-col relative overflow-hidden shrink-0 ${
          featured ? "bg-white/10" : "bg-[#F5F5F7]"
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              featured ? "bg-white text-brand-black" : "bg-brand-black text-white"
            }`}
          >
            {featured ? <Zap size={24} /> : <Sparkles size={24} />}
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              featured ? "bg-brand-orange text-white" : "bg-black/5 text-gray-500"
            }`}
          >
            {badge}
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-2xl font-[850] tracking-tight">{title}</h3>
          <p className={`font-black text-4xl mt-2 tracking-tighter ${featured ? "text-white" : "text-brand-black"}`}>
            {price}
          </p>
          <p className={`font-medium text-sm mt-2 leading-relaxed ${featured ? "text-gray-400" : "text-gray-500"}`}>
            {description}
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="px-4 space-y-3 mb-6 flex-grow">
        {details.map((detail, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={`w-5 h-5 mt-0.5 rounded-full flex items-center justify-center shrink-0 ${
                featured ? "bg-brand-orange/20 text-brand-orange" : "bg-brand-orange/10 text-brand-orange"
              }`}
            >
              <CheckCircle2 size={14} />
            </div>
            <span
              className={`font-medium text-sm leading-tight ${
                featured ? "text-gray-300" : "text-brand-black/80"
              }`}
            >
              {detail}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="px-2 pb-2 mt-auto">
        <Link href="/dashboard">
          <button
            className={`group w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              featured ? "bg-white text-brand-black" : "bg-brand-black text-white"
            }`}
          >
            <span className="font-bold text-base tracking-tight">{ctaText}</span>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                featured
                  ? "bg-brand-black text-white group-hover:bg-brand-orange"
                  : "bg-white text-brand-black group-hover:bg-brand-orange group-hover:text-white"
              }`}
            >
              {featured ? <Play size={18} fill="currentColor" /> : <ArrowRight size={18} />}
            </div>
          </button>
        </Link>
      </div>
    </div>
  )
}

// 3. FAQ Accordion Item (Matches FAQ.tsx)
const LocalizedFAQItem: React.FC<{
  question: string
  answer: string
  isOpen: boolean
  toggle: () => void
}> = ({ question, answer, isOpen, toggle }) => {
  return (
    <div
      onClick={toggle}
      className={`bg-white rounded-[1.5rem] overflow-hidden transition-all duration-300 cursor-pointer group border border-gray-100 ${
        isOpen ? "shadow-md ring-1 ring-black/5" : "hover:bg-gray-50"
      }`}
    >
      <div className="p-6 flex justify-between items-center gap-4">
        <h3 className="text-lg sm:text-xl font-bold text-brand-black leading-tight select-none">
          {question}
        </h3>
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 cursor-pointer ${
            isOpen ? "bg-brand-orange text-white" : "bg-gray-100 text-brand-black group-hover:bg-gray-200"
          }`}
        >
          {isOpen ? <Minus size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
        </div>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-8 text-gray-600 font-medium leading-relaxed text-base sm:text-lg max-w-3xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Landmark,
  Users,
  Sun,
  CloudRain,
  Droplets,  
  Sparkles,
  Zap,
  History,
  Archive,
}

// --- Main Client Component ---

export function LocalizedPageClient({ page }: { page: LocalizedPageData }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-brand-bg text-brand-black font-sans selection:bg-brand-orange/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-8 pt-32 pb-16 lg:pb-24 overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start z-10 justify-center relative">
            <motion.div {...reveal}>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full mb-8 shadow-lg shadow-black/5 border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse shadow-[0_0_8px_rgba(255,77,0,0.6)]"></div>
                <span className="text-sm font-semibold tracking-wide">{page.hero.trustBadge}</span>
              </div>

              {/* H1 Title */}
              <h1 className="relative z-10 text-[3rem] sm:text-[3.5rem] lg:text-[4.5rem] font-[850] tracking-tighter leading-[0.95] text-[#111111] mb-6">
                {page.hero.h1}
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mb-10 font-medium leading-relaxed">
                {page.hero.subheadline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-row items-center gap-3 sm:gap-4 mb-10 w-full">
                <Link href="/dashboard">
                  <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
                    <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">
                      {page.hero.ctaText}
                    </span>
                    <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                      <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    </div>
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Visual Column (Slider) */}
          <div className="lg:col-span-6 relative z-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              {/* Decorative elements behind */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl"></div>
              
              <ComparisonSlider
                before={page.showcaseCaptions[0].beforeImage}
                after={page.showcaseCaptions[0].afterImage}
                label={page.showcaseCaptions[0].caption}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SHOWCASE SECTION --- */}
      <section id="showcase" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> Showcase <span className="text-brand-orange">//</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] tracking-tight text-brand-black leading-[0.95]">
                {page.sectionTitles.showcase}
              </h2>
            </div>
          </div>

          {/* Grid Layout - Brand Surface */}
          <div className="bg-brand-surface p-3 rounded-[1.8rem]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {page.showcaseCaptions.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[1.5rem] p-3 overflow-hidden shadow-sm">
                  <ComparisonSlider
                    before={item.beforeImage}
                    after={item.afterImage}
                    label={item.caption}
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold uppercase tracking-wider text-gray-400">Result</div>
                      <div className="text-sm font-bold text-brand-black">{item.caption}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BENEFITS (BENTO GRID) --- */}
      <section id="benefits" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> {page.sectionTitles.benefits} <span className="text-brand-orange">//</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] tracking-tight text-brand-black leading-[0.95]">
                {page.benefitsSection.title}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-sm">
              {page.benefitsSection.subtitle}
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {page.benefitsSection.cards.map((card, idx) => {
                const Icon = iconMap[card.icon] || Star;
                const isDark = card.variant === 'dark';
                const isOrange = card.variant === 'orange';
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`
                      relative p-8 rounded-[2rem] flex flex-col justify-between overflow-hidden group min-h-[320px]
                      ${card.colSpan === 2 ? 'md:col-span-2' : ''}
                      ${isDark ? 'bg-[#111111] text-white' : isOrange ? 'bg-brand-orange text-white' : 'bg-white text-brand-black shadow-sm'}
                    `}
                  >
                     {/* Background Decor */}
                     {isDark && <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/20 blur-[80px] rounded-full pointer-events-none"></div>}
                     {isOrange && <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none"></div>}

                     <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                           isDark ? 'bg-white/10 text-brand-orange' : 
                           isOrange ? 'bg-white/20 text-white' : 
                           'bg-brand-surface text-brand-black'
                        }`}>
                           <Icon size={28} strokeWidth={1.5} />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight">{card.title}</h3>
                        <p className={`text-lg font-medium leading-relaxed ${isDark ? 'text-gray-400' : isOrange ? 'text-white/90' : 'text-gray-500'}`}>
                           {card.description}
                        </p>
                     </div>

                     {/* Hover Effect Line */}
                     <div className={`absolute bottom-0 left-0 h-1 bg-current opacity-0 group-hover:opacity-20 transition-opacity duration-300 w-full`}></div>
                  </motion.div>
                )
             })}
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Process <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] tracking-tight text-brand-black leading-[0.95]">
              {page.sectionTitles.howItWorks}
            </h2>
          </div>

          <div className="bg-brand-surface p-3 rounded-[1.8rem]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {page.howItWorks.map((step) => (
                <div key={step.step} className="bg-white rounded-[1.5rem] p-8 flex flex-col group min-h-[300px]">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#F2F2F0] flex items-center justify-center transition-colors group-hover:bg-brand-orange/10 group-hover:text-brand-orange">
                      <span className="font-bold text-lg">0{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-black mb-3">{step.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST & PRIVACY --- */}
      <section className="w-full px-4 sm:px-8 py-12 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          <div className="bg-[#111111] rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-brand-orange">
                  <ShieldCheck size={14} />
                  Privacy First
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-[850] tracking-tight mb-6">
                  {page.trustAndPrivacy.title}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  {page.trustAndPrivacy.description}
                </p>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 max-w-lg">
                  <Lock className="text-brand-orange shrink-0" />
                  <p className="text-sm font-mono text-gray-300">{page.trustAndPrivacy.policy}</p>
                </div>
              </div>
              <div className="relative h-64 sm:h-80 bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <Timer className="w-16 h-16 text-brand-orange mx-auto mb-4 animate-pulse" />
                  <div className="text-2xl font-bold">Auto-Deletion</div>
                  <div className="text-gray-500 font-mono mt-1">in 30 minutes</div>
                </div>
                {/* Scan line effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange/50 shadow-[0_0_15px_rgba(255,77,0,0.5)] animate-[scan-line_3s_linear_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> Pricing <span className="text-brand-orange">//</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] tracking-tight text-brand-black leading-[0.95]">
                {page.pricing.title}
              </h2>
            </div>
            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-sm">
              {page.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {page.pricing.plans.map((plan, idx) => (
              <LocalizedPricingCard
                key={idx}
                title={plan.name}
                price={plan.price}
                description={plan.description}
                badge={plan.badge}
                details={plan.details}
                featured={plan.featured}
                ctaText={page.hero.ctaText}
              />
            ))}
          </div>

          {/* Local Cost Comparison */}
          <div className="mt-12 bg-white rounded-[1.5rem] border border-gray-100 p-8 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-brand-black mb-6 flex items-center gap-2">
              <Landmark className="text-brand-orange" />
              {page.localCostComparison.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Studio</div>
                <div className="font-bold text-gray-800">{page.localCostComparison.studioCost}</div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">BringBack AI</div>
                <div className="font-bold text-indigo-900">{page.localCostComparison.bringBackCost}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time</div>
                <div className="font-bold text-gray-800">{page.localCostComparison.turnaround}</div>
              </div>
            </div>
            <p className="mt-6 text-gray-500 text-sm font-medium text-center">
              {page.localCostComparison.summary}
            </p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section id="testimonials" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-16">
             <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> Reviews <span className="text-brand-orange">//</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] tracking-tight text-brand-black leading-[0.95]">
                {page.sectionTitles.testimonials}
              </h2>
          </div>

          <div className="bg-brand-surface p-3 rounded-[1.8rem]">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {page.testimonials.map((t, i) => (
                  <div key={i} className="bg-white rounded-[1.5rem] p-8 flex flex-col gap-4">
                     <div className="flex items-center gap-1 text-brand-orange">
                        {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                     </div>
                     <p className="text-lg font-medium text-brand-black leading-relaxed">"{t.quote}"</p>
                     <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="font-bold text-brand-black">{t.name}</div>
                        <div className="text-sm text-gray-500">{t.location}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faqs" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 sm:sticky top-32">
              <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
                <span className="text-brand-orange">//</span> FAQs <span className="text-brand-orange">//</span>
              </div>
              <h2 className="text-5xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-brand-black leading-[0.95] mb-8">
                Questions <br />
                <span className="text-gray-400">& answers.</span>
              </h2>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-brand-surface p-3 rounded-[1.8rem]">
                <div className="flex flex-col gap-3">
                  {page.faq.map((item, index) => (
                    <LocalizedFAQItem
                      key={index}
                      question={item.question}
                      answer={item.answer}
                      isOpen={openFaqIndex === index}
                      toggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BOTTOM CTA --- */}
      <section className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
        <div className="max-w-[1320px] mx-auto">
           <div className="bg-brand-surface p-3 rounded-[2.5rem]">
              <div className="relative bg-white rounded-[2rem] p-8 sm:p-16 overflow-hidden group shadow-sm text-center">
                  <div className="max-w-3xl mx-auto relative z-10">
                     <h2 className="text-4xl sm:text-5xl lg:text-6xl font-[850] text-brand-black tracking-tighter leading-[0.95] mb-6">
                        {page.bottomCta.title}
                     </h2>
                     <p className="text-xl text-gray-600 font-medium mb-10">
                        {page.bottomCta.subtitle}
                     </p>
                     <div className="flex justify-center">
                        <Link href="/dashboard">
                          <button className="group flex items-center justify-between gap-6 bg-brand-orange text-white pl-8 pr-2 py-2.5 rounded-full shadow-[0_20px_40px_-15px_rgba(255,77,0,0.4)] hover:shadow-[0_25px_50px_-15px_rgba(255,77,0,0.5)] transition-all hover:scale-105">
                              <span className="font-bold text-lg tracking-tight">{page.bottomCta.buttonText}</span>
                              <div className="w-12 h-12 bg-white text-brand-orange rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                                  <ArrowRight size={20} strokeWidth={3} />
                              </div>
                          </button>
                        </Link>
                     </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
