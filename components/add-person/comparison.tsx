"use client"

import React from "react"
import { Check, Sparkles, ShieldCheck, Zap, Coins, UserPlus, MousePointer2 } from "lucide-react"
import { FEATURE_CREDIT_COSTS, PUBLIC_PLANS, formatCredits } from "@/lib/pricing"

const starter = PUBLIC_PLANS.find((p) => p.tier === "starter")
const addPersonCredits = FEATURE_CREDIT_COSTS.addPerson.credits
/** Rough per-edit cost on the starter pack (2 credits per add-person run). */
const approxPerEdit =
  starter != null
    ? `About $${((starter.priceUsd / starter.credits) * addPersonCredits).toFixed(2)}`
    : "Paid credits"

const FEATURES = [
  {
    label: "How natural it looks",
    icon: <Sparkles size={18} />,
    bringback: "Blends into the photo",
    manual: "Great if you know Photoshop",
    free: "Often looks pasted on",
  },
  {
    label: "Light and shadows",
    icon: <UserPlus size={18} />,
    bringback: "Matched for you",
    manual: "You paint them by hand",
    free: "Usually none",
  },
  {
    label: "Grain and texture",
    icon: <ShieldCheck size={18} />,
    bringback: "Closer to the original print",
    manual: "You add filters yourself",
    free: "Often mismatches",
  },
  {
    label: "How long it takes",
    icon: <Zap size={18} />,
    bringback: "About a minute",
    manual: "Hours to days",
    free: "Instant, but rough",
  },
  {
    label: "Cost per edit",
    icon: <Coins size={18} />,
    bringback: `${approxPerEdit} (${formatCredits(addPersonCredits)})`,
    manual: "$20–$50+ if you hire someone",
    free: "Free, often watermarked",
  },
  {
    label: "Skill needed",
    icon: <MousePointer2 size={18} />,
    bringback: "Upload and go",
    manual: "Pro software skill",
    free: "Crop and paste",
  },
]

const HEADER_HEIGHT = "h-40"
const ROW_HEIGHT = "h-24"
const FOOTER_HEIGHT = "h-32"

export function AddPersonComparison() {
  return (
    <section id="comparison" className="w-full px-4 sm:px-8 py-24 bg-brand-bg">
      <div className="max-w-[1320px] mx-auto">
        {/* Header — same system as other add-person sections */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Compare Options{" "}
              <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              How this compares
              <br />
              <span className="text-gray-400">to other options</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Side-by-side: BringBack, hiring a Photoshop editor, and free cutout apps—on quality,
              time, cost, and how much skill you need.
            </p>
          </div>
        </div>

        {/* DESKTOP Table */}
        <div className="hidden lg:flex items-end justify-center gap-0 max-w-6xl mx-auto">
          {/* Feature Labels */}
          <div className="w-[25%] flex flex-col">
            <div className={`${HEADER_HEIGHT} flex items-end pb-8 pl-8 border-b border-transparent`}>
              <h4 className="text-gray-400 font-bold text-sm uppercase tracking-widest">What matters</h4>
            </div>
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center gap-3 pl-8 border-b border-gray-200/50`}>
                <div className="text-gray-400">{f.icon}</div>
                <span className="font-bold text-brand-black text-lg">{f.label}</span>
              </div>
            ))}
            <div className={`${FOOTER_HEIGHT} flex items-center pl-8`}>
              <span className="font-extrabold text-xl text-gray-900">Bottom line</span>
            </div>
          </div>

          {/* BringBack */}
          <div className="w-[30%] bg-white rounded-[2.5rem] shadow-xs border border-gray-100 relative z-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 bg-brand-orange rounded-b-full"></div>
            <div className={`${HEADER_HEIGHT} flex flex-col items-start justify-end pb-8 border-b border-gray-100 pl-8`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center text-white">
                  <Sparkles size={16} fill="currentColor" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-brand-black">BringBack</span>
              </div>
              <div className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Recommended
              </div>
            </div>
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-100 pl-8 text-left`}>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="font-bold text-brand-black text-lg">{f.bringback}</span>
                </div>
              </div>
            ))}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-8`}>
              <span className="font-extrabold text-xl text-brand-orange">Fast and simple</span>
            </div>
          </div>

          {/* Manual Photoshop */}
          <div className="w-[22.5%] flex flex-col opacity-60">
            <div className={`${HEADER_HEIGHT} flex items-end justify-start pb-8 border-b border-transparent pl-6`}>
              <h4 className="font-bold text-lg text-brand-black">Photoshop / a pro editor</h4>
            </div>
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-200/50 text-left pl-6 px-2`}>
                <span className="text-gray-600 font-medium">{f.manual}</span>
              </div>
            ))}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-6`}>
              <span className="font-bold text-sm text-gray-500">Best quality if you have time or budget</span>
            </div>
          </div>

          {/* Basic Cutout Apps */}
          <div className="w-[22.5%] flex flex-col opacity-60">
            <div className={`${HEADER_HEIGHT} flex items-end justify-start pb-8 border-b border-transparent pl-6`}>
              <h4 className="font-bold text-lg text-brand-black">Basic cutout apps</h4>
            </div>
            {FEATURES.map((f, i) => (
              <div key={i} className={`${ROW_HEIGHT} flex items-center justify-start border-b border-gray-200/50 text-left pl-6 px-2`}>
                <span className="text-gray-600 font-medium">{f.free}</span>
              </div>
            ))}
            <div className={`${FOOTER_HEIGHT} flex items-center justify-start pl-6`}>
              <span className="font-bold text-sm text-gray-500">Cheap, but usually looks fake</span>
            </div>
          </div>
        </div>

        {/* MOBILE View */}
        <div className="lg:hidden flex flex-col gap-6 bg-brand-surface p-4 rounded-[1.8rem]">
          <div className="bg-white rounded-[1.5rem] p-6 border relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-brand-black rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-extrabold text-2xl text-brand-black leading-none">BringBack</h3>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wide">
                  Recommended
                </span>
              </div>
            </div>
            <div className="space-y-5">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 gap-4"
                >
                  <span className="text-gray-500 font-medium text-sm">{f.label}</span>
                  <span className="font-bold text-brand-black text-right text-sm">{f.bringback}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
