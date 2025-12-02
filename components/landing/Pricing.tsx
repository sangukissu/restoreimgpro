"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Film, Zap, ShieldCheck, Image as ImageIcon, Maximize2, Infinity, ArrowUpCircle, Frame, CheckCircle2, ArrowRight, Play, Star, MagnetIcon, Timer } from 'lucide-react';
import Link from 'next/link';

// Custom Christmas Hat Icon (Lucide style)
const ChristmasHat = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22v-2" />
    <path d="M16 20a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2" />
    <path d="M12 18a7 7 0 0 1 7-7c0-4-3-6-7-6-4 0-7 2-7 6a7 7 0 0 1 7 7Z" />
    <circle cx="12" cy="3" r="2" />
  </svg>
);

interface PricingFeature {
  icon: React.ReactNode;
  text: string;
}

// Pricing Card Component - Equal Height & Aligned
const PricingCard: React.FC<{
  theme: 'light' | 'dark';
  title: string;
  price: string;
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
}> = ({ theme, title, price, originalPrice, description, badge, features, icon, buttonText, buttonLink, buttonIcon, isPromo, promoEndDate, discountBadge }) => {
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
          <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-white/10 text-gray-300' : isPromo ? 'bg-gradient-to-r from-red-600 to-green-600 text-white shadow-sm' : 'bg-black/5 text-gray-500'}`}>
            {badge}
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-1">
          <h3 className="text-2xl font-[850] tracking-tight">{title}</h3>
          {discountBadge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPromo ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-brand-black text-white'}`}>{discountBadge}</span>
          )}
        </div>
        <div className="mb-2 flex items-baseline gap-3">
          <span className={`text-4xl font-[900] tracking-tighter ${isPromo ? 'text-red-600' : ''}`}>{price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-400 font-bold line-through decoration-2 decoration-gray-300">{originalPrice}</span>
          )}
        </div>

        <p className={`font-medium leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-brand-orange/20 text-brand-orange' : 'bg-brand-orange/10 text-brand-orange'}`}>
              {f.icon}
            </div>
            <span className={`font-bold text-sm leading-tight ${isDark ? 'text-gray-200' : 'text-brand-black/80'}`}>
              {f.text}
            </span>
          </div>
        ))}
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

export const Pricing: React.FC = () => {
  const starterFeatures = [
    { icon: <Zap size={16} />, text: "5 Credits Included" },
    { icon: <ImageIcon size={16} />, text: "Restore 5 Photos" },
    { icon: <Maximize2 size={16} />, text: "High-Resolution Output" },
    { icon: <Infinity size={16} />, text: "Credits Never Expire" },
    { icon: <ArrowUpCircle size={16} />, text: "UPto 5 Free Photo Upscale" },
    { icon: <Frame size={16} />, text: "Free Digital Frames" },
    { icon: <ShieldCheck size={16} />, text: "30-Day Money-Back Guarantee" }
  ];

  const proFeatures = [
    { icon: <Zap size={16} />, text: "20 Flexible Credits" },
    { icon: <ImageIcon size={16} />, text: "Restore up to 20 Photos" },
    { icon: <Film size={16} />, text: "OR Create 2 Video Animations" },
    { icon: <MagnetIcon size={16} />, text: "Mix & Match Usage" },
    { icon: <Maximize2 size={16} />, text: "High-Resolution 1080P Output" },
    { icon: <Infinity size={16} />, text: "Credits Never Expire" },
    { icon: <ArrowUpCircle size={16} />, text: "Upto 20 Free Photo Upscale" },
    { icon: <Frame size={16} />, text: "Free Digital Frames" },
    { icon: <ShieldCheck size={16} />, text: "30-Day Money-Back Guarantee" }
  ];

  const familyFeatures = [
    { icon: <Zap size={16} />, text: "60 Flexible Credits" },
    { icon: <ImageIcon size={16} />, text: "Restore up to 60 Photos" },
    { icon: <Film size={16} />, text: "OR Create 6 Video Animations" },
    { icon: <Sparkles size={16} />, text: "Mix & Match Usage" },
    { icon: <Maximize2 size={16} />, text: "High-Resolution 1080P Output" },
    { icon: <Infinity size={16} />, text: "Credits Never Expire" },
    { icon: <ArrowUpCircle size={16} />, text: "Upto 60 Free Photo Upscale" },
    { icon: <Frame size={16} />, text: "Free Digital Frames" },
    { icon: <ShieldCheck size={16} />, text: "30-Day Money-Back Guarantee" }
  ];

  return (
    <section id="pricing" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Pricing <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-brand-black leading-[1.1]">
              Simple pricing. <br />
              <span className="text-gray-400">Professional results.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              No subscriptions. No hidden fees. Just pay for what you restore.
            </p>
          </div>
        </div>

        {/* Pricing Grid: 3 Equal Columns - Removing items-start allows stretch by default */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">



          {/* Column 2: Starter Plan (White) */}
          <PricingCard
            theme="light"
            title="Starter"
            price="$4.99"
            description="Perfect for high-quality photo restoration."
            badge="One-time payment"
            features={starterFeatures}
            icon={<Sparkles size={24} />}
            buttonText="Start Restoring Photos"
            buttonLink="/login"
            buttonIcon={<ArrowRight size={20} />}
          />

          {/* Column 3: Pro Plan (Black) */}
          <PricingCard
            theme="dark"
            title="Pro"
            price="$9.99"
            description="Everything in Starter, plus bring photos to life."
            badge="One-time payment"
            features={proFeatures}
            icon={<Film size={24} />}
            buttonText="Get Pro Access"
            buttonLink="/dashboard"
            buttonIcon={<Play size={20} fill="currentColor" />}
          />
          {/* Column 2: Family Plan (Christmas Promo) */}
          <PricingCard
            theme="light"
            title="Family"
            price="$14.99"
            originalPrice="$24.99"
            description="Perfect for photo animation for your family."
            badge="Christmas Offer"
            features={familyFeatures}
            icon={<ChristmasHat size={24} />}
            buttonText="Claim Christmas Offer"
            buttonLink="/login"
            buttonIcon={<ArrowRight size={20} />}
            isPromo={true}
            promoEndDate="2025-12-25T23:59:59"
            discountBadge="40% OFF"
          />

        </div>
      </div>

    </section>
  );
};
