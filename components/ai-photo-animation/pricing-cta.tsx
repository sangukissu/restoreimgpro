"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, UploadCloud } from "lucide-react";

export default function AIAnimationPricingCTA() {
  return (
    <section className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-24 bg-white">

      {/* Main Container - Clean White with Subtle Border */}
      <div className="relative bg-white rounded-[3rem] p-8 sm:p-16 lg:p-20 overflow-hidden border border-gray-100 text-center group">

        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/30 to-white pointer-events-none"></div>

        {/* Decorative Blur */}
        <div className="absolute -top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-orange-100/50 blur-[120px] rounded-full pointer-events-none opacity-60"></div>

        <div className="relative z-10 flex flex-col items-center justify-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-black text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-10">
            <Sparkles size={14} className="text-brand-orange fill-brand-orange" />
            <span>Bring them back</span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-[850] text-brand-black tracking-tighter leading-[0.95] mb-8">
            Ready to see <br />
            <span className="text-brand-orange">them smile?</span>
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg sm:text-xl font-medium leading-relaxed mb-12 max-w-xl">
            Animation is available in our best-value Restore & Animate plan. Get restoration credits and an animation credit with a simple one-time payment.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/dashboard/animate">
              <button className="group flex items-center justify-between gap-6 bg-[#FF4D00] text-white pl-8 pr-2 py-2.5 rounded-full transition-all duration-300 hover:scale-105">
                <span className="font-bold text-lg tracking-tight">Animate Your First Photo</span>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#FF4D00] group-hover:rotate-45 transition-transform duration-300">
                  <ArrowRight size={20} strokeWidth={3} />
                </div>
              </button>
            </Link>
          </div>

          {/* Guarantee Text */}
          <div className="mt-10 flex items-center justify-center gap-3 text-gray-500 font-medium text-sm">
            <UploadCloud size={16} />
            <span>Includes our 30-Day Money-Back Guarantee</span>
          </div>

        </div>
      </div>
    </section>
  );
}