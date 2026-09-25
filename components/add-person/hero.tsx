"use client"

import Link from "next/link"
import { Star, ArrowRight, UserPlus, Play } from "lucide-react"
import { DASHBOARD_CTA } from "@/lib/site-copy"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"

export function AddPersonHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-8 bg-brand-bg overflow-hidden">
      <div className="max-w-[1320px] mx-auto">
        <SiteBreadcrumb items={[{ name: "Add Person to Photo" }]} />
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Text Column */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-black text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide mb-8 shadow-lg shadow-black/10 border border-white/10">
              <UserPlus className="w-4 h-4 text-brand-orange" />
              <span>Multi-Photo Compositing</span>
            </div>

            <h1 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black mb-6">
              Add a Person <br />
              to an Existing Photo <br />
              <span className="text-gray-400 font-extrabold">with AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed mb-10 max-w-xl">
              Add one person to an existing family, group, wedding, or event photo. Choose placement and BringBack matches lighting, scale, perspective, color, and shadows.
            </p>

            <div className="flex flex-row items-center gap-3 sm:gap-4 mb-10 w-full">
              <Link href={DASHBOARD_CTA.addPerson}>
                <button className="group relative flex items-center justify-between gap-3 sm:gap-6 bg-[#FF4D00] text-white pl-5 pr-1.5 py-1.5 sm:pl-8 sm:pr-2 sm:py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-[inset_0_0px_1px_rgba(255,255,255,0.3),0_20px_30px_-8px_rgba(255,77,0,0.6)] shrink-0">
                  <span className="font-bold text-sm sm:text-lg tracking-tight whitespace-nowrap">Add Person to Photo</span>
                  <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#111111] rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowRight className="text-[#FF4D00] w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                  </div>
                </button>
              </Link>
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

          {/* Right Visual Image Card (Clean Single Image Feature Card) */}
          <div className="flex-1 w-full max-w-xl">
            <div className="bg-brand-surface p-3 rounded-[2.2rem] shadow-2xl border border-white/80">
              <div className="rounded-[1.8rem] overflow-hidden bg-white shadow-inner border border-gray-100 aspect-[4/3] relative">
                <img
                  src="/add-person.webp"
                  alt="Add person to family photo workflow illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
