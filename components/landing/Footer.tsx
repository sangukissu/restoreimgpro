import React from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { CookieSettingsButton } from "@/components/consent/cookie-settings-button"
import { POSITIONING } from "@/lib/site-copy"

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-4 py-4 bg-brand-bg">
      <div className="bg-[#111111] rounded-[1.8rem] px-6 sm:px-12 py-12 text-white overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-8 select-none">
                <div className="flex items-center justify-center bg-white text-brand-black w-8 h-8 rounded-lg">
                  <Sparkles size={16} fill="currentColor" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight">BringBack</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[0.95] mb-8">
                Restore, reunite, <br />
                <span className="text-gray-400">&amp; preserve</span>
              </h2>

              <p className="text-gray-400 font-medium text-lg max-w-md mb-8">
                {POSITIONING.supportingPromise}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:pl-12 mb-8">
            <div className="flex flex-col gap-6">
              <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Tools</h4>
              <Link href="/old-photo-restoration" className="font-medium hover:text-brand-orange transition-colors">
                Old photo restoration
              </Link>
              <Link href="/ai-photo-animation" className="font-medium hover:text-brand-orange transition-colors">
                Photo animation
              </Link>
              <Link href="/ai-family-portrait" className="font-medium hover:text-brand-orange transition-colors">
                Family portrait
              </Link>
              <Link href="/add-person-to-photo" className="font-medium hover:text-brand-orange transition-colors">
                Add person
              </Link>
              <Link href="/remove-person-from-photo" className="font-medium hover:text-brand-orange transition-colors">
                Remove person
              </Link>
              <Link href="/family-memory-book" className="font-medium hover:text-brand-orange transition-colors">
                Memory Book
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Product</h4>
              <Link href="/features" className="font-medium hover:text-brand-orange transition-colors">
                All features
              </Link>
              <Link href="/compare" className="font-medium hover:text-brand-orange transition-colors">
                Compare tools
              </Link>
              <Link href="/pricing" className="font-medium hover:text-brand-orange transition-colors">
                Pricing
              </Link>
              <Link href="/colorize-photos" className="font-medium hover:text-brand-orange transition-colors">
                Colorize
              </Link>
              <Link href="/denoise-photos" className="font-medium hover:text-brand-orange transition-colors">
                Denoise
              </Link>
              <Link href="/examples" className="font-medium hover:text-brand-orange transition-colors">
                Examples
              </Link>
              <Link href="/about" className="font-medium hover:text-brand-orange transition-colors">
                About
              </Link>
              <Link href="/guides" className="font-medium hover:text-brand-orange transition-colors">
                Guides
              </Link>
              <Link href="/restoration-benchmark" className="font-medium hover:text-brand-orange transition-colors">
                Benchmark
              </Link>
              <Link href="/blog" className="font-medium hover:text-brand-orange transition-colors">
                Blog
              </Link>
            </div>
            <div className="flex flex-col gap-6">
              <h4 className="text-gray-500 font-bold text-sm uppercase tracking-wider">Legal</h4>
              <Link href="/editorial-policy" className="font-medium hover:text-brand-orange transition-colors">
                Editorial policy
              </Link>
              <Link href="/privacy" className="font-medium hover:text-brand-orange transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="font-medium hover:text-brand-orange transition-colors">
                Terms of Service
              </Link>
              <Link href="/refunds" className="font-medium hover:text-brand-orange transition-colors">
                Refund Policy
              </Link>
              <CookieSettingsButton className="font-medium hover:text-brand-orange transition-colors text-left text-white" />
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-12"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 font-medium text-center md:text-left">
            © 2026 BringBack. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://x.com/AINotSoSmart"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
              aria-label="X (Twitter)"
            >
              <XLogo className="w-5 h-5 text-white group-hover:text-black transition-colors" />
            </a>
          </div>
        </div>

        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-orange rounded-full blur-[200px] opacity-10 pointer-events-none"></div>
      </div>
    </footer>
  )
}
