import React from "react"
import { ShieldCheck, Scale, Eye, Heart, ExternalLink, Lock, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Trust section reimagined as an asymmetric Bento Box.
 * Real reviews live on Trustpilot; no fabricated social proof.
 */
export const Clients: React.FC = () => {
  return (
    <section id="clients" className="w-full px-4 sm:px-8 py-24 bg-brand-bg pb-32">
      <div className="max-w-[1320px] mx-auto">
        
        {/* Split Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-16">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1 bg-brand-black text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider mb-6 shadow-lg shadow-black/10">
              <span className="text-brand-orange">//</span> Trust & Authenticity <span className="text-brand-orange">//</span>
            </div>
            
            {/* Title */}
            <h2 className="text-[2.25rem] sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4rem] font-[850] tracking-tighter leading-[1.05] sm:leading-[0.95] text-brand-black">
              Built for the fear that <br />
              <span className="text-gray-400">AI will change the person you remember.</span>
            </h2>
          </div>

          {/* Subtitle */}
          <div className="max-w-sm">
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              We do not invent star ratings on this page. Public reviews live transparently on{" "}
              <a
                href="https://www.trustpilot.com/review/bringback.pro"
                className="underline font-semibold text-brand-black hover:text-brand-orange transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trustpilot
              </a>
              .
            </p>
          </div>
        </div>

        {/* Bento Box Outer Container */}
        <div className="bg-brand-surface p-2 sm:p-3 rounded-[2.5rem]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* Bento Card 1: Dark Hero Card - Trustpilot Verification (7 cols) */}
            <div className="lg:col-span-7 bg-brand-black rounded-[2rem] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between gap-4 mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-brand-orange">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified Feedback Protocol
                  </div>
                  <span className="text-xs font-mono text-white/50">No Fake Stars</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4 text-white">
                  Zero Fabricated Testimonials. <br />
                  <span className="text-gray-400">100% Real Reviews on Trustpilot.</span>
                </h3>

                <p className="text-gray-300 font-medium leading-relaxed text-base sm:text-lg max-w-xl">
                  Unlike generic AI tools that populate landing pages with fake quotes and fabricated 5-star badges, we send every downloaded user directly to an independent review platform.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Independent Proof</span>
                    <span className="text-sm font-bold text-white">Trustpilot Verified Domain</span>
                  </div>
                </div>

                <a
                  href="https://www.trustpilot.com/review/bringback.pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-brand-black px-5 py-2.5 rounded-full font-bold text-sm hover:bg-brand-orange hover:text-white transition-colors self-start sm:self-auto shadow-md"
                >
                  <span>Verify on Trustpilot</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* Bento Card 2: Identity Protection (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-surface text-brand-black flex items-center justify-center mb-6 shadow-sm">
                  <Eye size={24} />
                </div>
                <div className="inline-block bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Original-First Architecture
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Identity Drift Protection</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  Choose restore-only to preserve black-and-white or sepia chemical character. Color is optional—never forced—so your ancestors' faces remain authentic.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-brand-orange" />
                Zero Generic AI Stock Face Replacement
              </div>
            </div>

            {/* Bento Card 3: Transparent Credits (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-brand-surface text-brand-black flex items-center justify-center mb-6 shadow-sm">
                  <Scale size={24} />
                </div>
                <div className="inline-block bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Transparent Pricing
                </div>
                <h3 className="text-2xl font-extrabold text-brand-black mb-3">Pay Once, Clear Credits</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base">
                  No recurring subscription traps or hidden monthly auto-renews. See exact credit costs before generating. Credits never expire.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Lock size={14} className="text-brand-orange" />
                No Monthly Subscription Required
              </div>
            </div>

            {/* Bento Card 4: Ecosystem (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 sm:p-10 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-gray-200 transition-all">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-surface text-brand-black flex items-center justify-center shadow-sm">
                    <Heart size={24} />
                  </div>
                  <span className="bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Family Archives System
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-black mb-3">Built for Family Archives</h3>
                <p className="text-gray-600 font-medium leading-relaxed text-base max-w-xl">
                  Restore → reunite → optional motion → private Memory Book. One continuous project across specialized tools—not a generic one-off photo editor.
                </p>
              </div>

              {/* Visual Workflow Sequence Pills */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="bg-brand-surface text-brand-black px-3.5 py-1.5 rounded-full border border-gray-200">1. Restore Photo</span>
                  <ArrowRight size={14} className="text-gray-300" />
                  <span className="bg-brand-surface text-brand-black px-3.5 py-1.5 rounded-full border border-gray-200">2. Combine Family</span>
                  <ArrowRight size={14} className="text-gray-300" />
                  <span className="bg-brand-surface text-brand-black px-3.5 py-1.5 rounded-full border border-gray-200">3. Optional Motion</span>
                  <ArrowRight size={14} className="text-gray-300" />
                  <span className="bg-brand-orange text-white px-3.5 py-1.5 rounded-full shadow-sm">4. Memory Book</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-500 font-medium max-w-full">
          <p className="max-w-2xl">
            Missing facial detail may be reconstructed, not recovered. Always compare results side-by-side to your original.
          </p>
          <Link href="/privacy" className="underline font-semibold text-brand-black hover:text-brand-orange transition-colors shrink-0">
            Privacy policy & data retention →
          </Link>
        </div>

      </div>
    </section>
  )
}
