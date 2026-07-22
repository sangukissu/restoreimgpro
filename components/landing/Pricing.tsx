"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Film, ShieldCheck, Image as ImageIcon, Maximize2, Infinity, ArrowRight, Play, Timer } from 'lucide-react';
import Link from 'next/link';
import { PUBLIC_PLANS, FEATURE_CREDIT_COSTS } from "@/lib/pricing";

interface PricingFeature {
  icon: React.ReactNode;
  text: string;
  isPerk?: boolean;
}

// Pricing Card Component - Equal Height & Aligned
const PricingCard: React.FC<{
  theme: 'light' | 'dark';
  title: string;
  price: string;
  creditsText: string;
  originalPrice?: string;
  description: string;
  badge: string;
  features: PricingFeature[];
  icon: React.ReactNode;
  buttonText: string;
  buttonLink: string;
  buttonIcon: React.ReactNode;
  isPromo?: boolean;
  promoEndDate?: string;
  discountBadge?: string;
}> = ({ theme, title, price, creditsText, originalPrice, description, badge, features, icon, buttonText, buttonLink, buttonIcon, isPromo, promoEndDate, discountBadge }) => {
  const isDark = theme === 'dark';

  // Countdown Timer Logic
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!promoEndDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(promoEndDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [promoEndDate]);

  return (
    <div className={`h-full rounded-[1.5rem] p-3 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative ${isDark ? 'bg-[#111111] text-white shadow-2xl' : 'bg-white text-brand-black shadow-sm'} ${isPromo ? 'ring-1 ring-brand-orange/30 shadow-brand-orange/5' : ''}`}>

      {/* Nested Header Card - Reduced Padding */}
      <div className={`rounded-[1.5rem] p-6 mb-4 flex flex-col relative overflow-hidden shrink-0 ${isDark ? 'bg-white/10' : 'bg-[#F5F5F7]'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-white text-brand-black' : isPromo ? 'bg-red-600 text-white' : 'bg-brand-black text-white'}`}>
            {icon}
          </div>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-white/10 text-gray-300' : isPromo ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm' : 'bg-black/5 text-gray-500'}`}>
            {badge}
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          <h3 className="text-2xl font-[850] tracking-tight">{title}</h3>
          {discountBadge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPromo ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-brand-black text-white'}`}>{discountBadge}</span>
          )}
        </div>
        <div className="mb-1 flex items-baseline gap-3">
          <span className={`text-4xl font-[900] tracking-tighter ${isPromo ? 'text-red-600' : ''}`}>{price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-400 font-bold line-through decoration-2 decoration-gray-300">{originalPrice}</span>
          )}
        </div>
        
        {/* Diminished Credits Metric */}
        <div className={`text-[11px] font-extrabold uppercase tracking-wider mt-2 mb-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`}>
          Includes {creditsText}
        </div>

        <p className={`font-medium leading-relaxed text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>

        {/* Minimal Countdown Timer Display */}
        {timeLeft && isPromo && (
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center gap-2">
            <Timer size={14} className="text-red-600" />
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Offer ends in: <span className="text-brand-black font-bold tabular-nums">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
            </div>
          </div>
        )}
      </div>

      {/* Features List - Flexible Grow to push button down */}
      <div className="px-4 space-y-3 mb-6 flex-grow">
        {features.map((f, i) => {
          const isPerk = f.isPerk;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isPerk 
                  ? (isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100/85 text-gray-500') 
                  : (isDark ? 'bg-brand-orange/25 text-brand-orange' : 'bg-brand-orange/10 text-brand-orange')
              }`}>
                {f.icon}
              </div>
              <span className={`font-bold text-sm leading-tight ${
                isPerk
                  ? (isDark ? 'text-gray-300 font-medium' : 'text-gray-700 font-medium')
                  : (isDark ? 'text-gray-200' : 'text-brand-black/80')
              }`}>
                {f.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hero Style Button - Compact */}
      <div className="px-2 pb-2 mt-auto">
        <Link href={buttonLink}>
          <button className={`group w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isDark ? 'bg-white text-brand-black' : isPromo ? 'bg-brand-black text-white hover:shadow-red-500/20' : 'bg-brand-black text-white'}`}>
            <span className="font-bold text-base tracking-tight">{buttonText}</span>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-brand-black text-white group-hover:bg-brand-orange' : isPromo ? 'bg-white text-brand-black group-hover:bg-red-600 group-hover:text-white' : 'bg-white text-brand-black group-hover:bg-brand-orange group-hover:text-white'}`}>
              {buttonIcon}
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

function planFeatures(tier: "starter" | "pro" | "family"): PricingFeature[] {
  const plan = PUBLIC_PLANS.find((p) => p.tier === tier)!;
  const base: PricingFeature[] = plan.equivalents.map((text, i) => ({
    icon:
      i === 0 ? (
        <ImageIcon size={16} />
      ) : text.toLowerCase().includes("animation") || text.toLowerCase().includes("hug") ? (
        <Film size={16} />
      ) : (
        <Sparkles size={16} />
      ),
    text,
  }));
  base.push(
    { icon: <Maximize2 size={16} />, text: "Download high-resolution results" },
    { icon: <Infinity size={16} />, text: "Credits never expire", isPerk: true },
    { icon: <ShieldCheck size={16} />, text: "30-day money-back guarantee", isPerk: true }
  );
  return base;
}

export const Pricing: React.FC = () => {
  const starter = PUBLIC_PLANS[0];
  const pro = PUBLIC_PLANS[1];
  const family = PUBLIC_PLANS[2];

  return (
    <section id="pricing" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Pricing <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black leading-[1.1]">
              Pay once. <br />
              <span className="text-gray-400">No subscription.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Exact credit costs: restore {FEATURE_CREDIT_COSTS.restore.credits}, family portrait / add person{" "}
              {FEATURE_CREDIT_COSTS.familyPortrait.credits}, animation {FEATURE_CREDIT_COSTS.animate.credits},
              hug video {FEATURE_CREDIT_COSTS.nostalgicHug.credits}. Starter cannot fund animation or hug.
            </p>
          </div>
        </div>
 
        {/* Pricing Grid: 3 Equal Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <PricingCard
            theme="light"
            title={starter.name}
            price={starter.priceDisplay}
            creditsText={`${starter.credits} Credits`}
            description={starter.description}
            badge={starter.badge}
            features={planFeatures("starter")}
            icon={<Sparkles size={24} />}
            buttonText={starter.ctaLabel}
            buttonLink="/login"
            buttonIcon={<ArrowRight size={20} />}
          />

          <PricingCard
            theme="dark"
            title={pro.name}
            price={pro.priceDisplay}
            creditsText={`${pro.credits} Credits`}
            description={pro.description}
            badge={pro.badge}
            features={planFeatures("pro")}
            icon={<Film size={24} />}
            buttonText={pro.ctaLabel}
            buttonLink="/login"
            buttonIcon={<Play size={20} fill="currentColor" />}
          />

          <PricingCard
            theme="light"
            title={family.name}
            price={family.priceDisplay}
            creditsText={`${family.credits} Credits`}
            description={family.description}
            badge={family.badge}
            features={planFeatures("family")}
            icon={<Sparkles size={24} />}
            buttonText={family.ctaLabel}
            buttonLink="/login"
            buttonIcon={<ArrowRight size={20} />}
          />

        </div>
      </div>

    </section>
  );
};
