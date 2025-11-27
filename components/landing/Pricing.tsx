
import React from 'react';
import { Sparkles, Film, Zap, ShieldCheck, Image as ImageIcon, Maximize2, Infinity, ArrowUpCircle, Frame, CheckCircle2, ArrowRight, Play, Star, MagnetIcon } from 'lucide-react';
import Link from 'next/link';


interface PricingFeature {
  icon: React.ReactNode;
  text: string;
}

// Pricing Card Component - Equal Height & Aligned
const PricingCard: React.FC<{
  theme: 'light' | 'dark';
  title: string;
  price: string;
  description: string;
  badge: string;
  features: PricingFeature[];
  icon: React.ReactNode;
  buttonText: string;
  buttonLink: string;
  buttonIcon: React.ReactNode;
}> = ({ theme, title, price, description, badge, features, icon, buttonText, buttonLink, buttonIcon }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`h-full rounded-[1.5rem] p-3 flex flex-col group hover:-translate-y-1 transition-transform duration-300 relative ${isDark ? 'bg-[#111111] text-white shadow-2xl' : 'bg-white text-brand-black shadow-sm'}`}>



      {/* Nested Header Card - Reduced Padding */}
      <div className={`rounded-[1.5rem] p-6 mb-4 flex flex-col relative overflow-hidden shrink-0 ${isDark ? 'bg-white/10' : 'bg-[#F5F5F7]'}`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-white text-brand-black' : 'bg-brand-black text-white'}`}>
            {icon}
          </div>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${isDark ? 'bg-white/10 text-gray-300' : 'bg-black/5 text-gray-500'}`}>
            {badge}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="text-2xl font-[850] tracking-tight">{title}</h3>
        </div>
        <div className="mb-2">
          <span className="text-4xl font-[900] tracking-tighter">{price}</span>
        </div>

        <p className={`font-medium leading-relaxed text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>
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
          <button className={`group w-full flex items-center justify-between pl-6 pr-2 py-2 rounded-full transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${isDark ? 'bg-white text-brand-black' : 'bg-brand-black text-white'}`}>
            <span className="font-bold text-base tracking-tight">{buttonText}</span>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-brand-black text-white group-hover:bg-brand-orange' : 'bg-white text-brand-black group-hover:bg-brand-orange group-hover:text-white'}`}>
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
          {/* Column 2: Starter Plan (White) */}
          <PricingCard
            theme="light"
            title="Family"
            price="$24.99"
            description="Perfect for photo animation for your family."
            badge="One-time payment"
            features={familyFeatures}
            icon={<Sparkles size={24} />}
            buttonText="Bring Memories to life"
            buttonLink="/login"
            buttonIcon={<ArrowRight size={20} />}
          />

        </div>
      </div>

    </section>
  );
};
