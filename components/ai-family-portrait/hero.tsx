import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
import Image from "next/image";
import { FamilyPortraitStyleShowcase } from "@/components/ai-family-portrait/style-showcase";

export default function AIAnimationHero() {
  return (
    <section className="relative mx-auto w-full max-w-[1320px] overflow-visible px-4 pb-12 pt-32 sm:px-8 sm:pt-36">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="relative z-10 flex flex-col items-start lg:col-span-6">

          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
            <span className="text-brand-orange">//</span> FAMILY PHOTO AI <span className="text-brand-orange">//</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 max-w-2xl text-[2.7rem] font-[850] leading-[0.98] tracking-tighter text-brand-black sm:text-[3.5rem] lg:text-[3.75rem] xl:text-[4rem]">
            AI Family Portrait Generator <br className="hidden sm:block" />
            <span className="text-gray-400">from Separate Photos</span>
          </h1>

          {/* Subheading */}
          <p className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-gray-600 sm:text-xl">
            Upload up to 8 family reference photos, choose from 24 curated portrait themes, and include
            the people and pets who belong in the scene. BringBack creates one new shared portrait
            rather than a pasted collage.
          </p>

          {/* CTA Buttons - Exact Match */}
          <div className="mb-10 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">

            {/* Primary Button */}
            <Link href="/dashboard/family-portrait">
              <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_20px_40px_-12px_rgba(255,77,0,0.6)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_25px_50px_-12px_rgba(255,77,0,0.7)] shrink-0">
                <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Create Family Photo</span>
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                  <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                </div>
              </button>
            </Link>

            {/* Secondary Button */}
            <Link href="#how-it-works">
              <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-white text-brand-black pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] ring-1 ring-black/5 shrink-0">
                <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">See How It Works</span>
                <div className="w-8 h-8 sm:w-11 sm:h-11 bg-gray-100 rounded-full flex items-center justify-center">
                  <Play className="text-brand-black fill-brand-black ml-0.5 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>
            </Link>
          </div>

          {/* Social Proof - Avatar Stack (Rotated Squircles) */}
          <div className="flex items-center gap-6 pl-2">
            <div className="flex items-center relative h-12 w-[140px]">
              {[1, 2, 3].map((i, index) => (
                <div
                  key={i}
                  className={`absolute top-0 w-12 h-12 rounded-2xl border-2 border-[#F2F2F0] overflow-hidden shadow-sm transition-transform duration-300 hover:z-50 hover:scale-110
                    ${index === 0 ? 'left-0 z-30 -rotate-6' : ''}
                    ${index === 1 ? 'left-8 z-20 rotate-6' : ''}
                    ${index === 2 ? 'left-16 z-10 -rotate-3' : ''}
                  `}
                >
                  <img
                    src={['/avatar1.webp', '/avatar2.webp', '/avatar3.webp'][index]}
                    alt="Real BringBack restoration result"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={48}
                    height={48}
                  />
                </div>
              ))}
              <div className="absolute left-24 top-0 w-12 h-12 rounded-2xl bg-[#111111] text-white flex items-center justify-center text-xs font-bold border-2 border-[#F2F2F0] shadow-sm z-40 rotate-12 hover:rotate-0 transition-transform">
                3.1K+
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex gap-0.5 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className="fill-[#FF4D00] text-[#FF4D00]" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Trusted by 3.1K+ Families</span>
            </div>
          </div>
        </div>

        {/* Right Column: Family Portrait */}
        <div className="flex w-full items-center justify-center lg:col-span-6">
          <div className="w-full rounded-[2rem] bg-brand-surface p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.55rem] bg-gray-100">
              <Image
                src="/family-portrait.png"
                alt="Four family members brought together from separate photos in one unified studio portrait"
                fill
                sizes="(max-width: 1024px) 92vw, 48vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      <FamilyPortraitStyleShowcase />
    </section>
  );
}
