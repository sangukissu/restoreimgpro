import React from "react"
import { ShieldCheck, Scale, Eye, Heart } from "lucide-react"
import Link from "next/link"

/**
 * Trust section without invented testimonials or star ratings.
 * Real reviews live on Trustpilot; do not fabricate social proof here.
 */
const TRUST_POINTS = [
  {
    icon: <Eye size={22} />,
    title: "Original-first",
    body: "Choose restore-only to keep black-and-white or sepia character, or restore and colorize when you want color.",
  },
  {
    icon: <Scale size={22} />,
    title: "Compare before you download",
    body: "Side-by-side comparison keeps the original and the edit clearly distinguished so identity drift is visible.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Pay once, clear credits",
    body: "No forced subscription. See exact credit costs per feature before you generate. Credits never expire.",
  },
  {
    icon: <Heart size={22} />,
    title: "Built for family archives",
    body: "Restore → reunite → optional motion → private Memory Book. One project across tools, not a generic editor.",
  },
]

export const Clients: React.FC = () => {
  return (
    <section id="clients" className="w-full px-4 sm:px-8 py-24 bg-brand-bg pb-32">
      <div className="max-w-[1320px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Trust <span className="text-brand-orange">//</span>
            </div>
            <h2 className="text-[3.5rem] sm:text-[4rem] font-extrabold tracking-tight text-brand-black leading-[0.95]">
              Built for the fear that{" "}
              <span className="text-gray-400">AI will change the person you remember.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We do not invent star ratings on this page. After a successful download, we invite real
              feedback. Public reviews live on{" "}
              <a
                href="https://www.trustpilot.com/review/bringback.pro"
                className="underline font-semibold text-brand-black"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trustpilot
              </a>
              .
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TRUST_POINTS.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[1.8rem] p-8 border border-black/5 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mb-2">{item.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-gray-500 max-w-2xl">
          Missing facial detail may be reconstructed, not recovered. Always compare results to your
          original.{" "}
          <Link href="/privacy" className="underline font-medium text-brand-black">
            Privacy policy
          </Link>
          .
        </p>
      </div>
    </section>
  )
}
