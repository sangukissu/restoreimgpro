import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ScanLine, Camera, AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Scan Family Photos Safely: DPI Settings & Glare Prevention | BringBack",
  description:
    "Learn the safest techniques for scanning old family photos. Recommended DPI settings, smartphone vs flatbed tips, and handling stuck glass prints.",
  alternates: { canonical: "/guides/scan-family-photos-safely" },
}

export default function ScanGuidePage() {
  return (
    <GuideLayout
      title="How to Scan Family Photos Safely for AI Restoration"
      description="Protecting physical prints is paramount. Learn how to achieve high-DPI digital captures without peeling stuck photos, flexing fragile emulsion, or causing scanner glass scratches."
      updated="July 21, 2026"
      crumbs={[{ name: "Scan family photos safely" }]}
    >
      <div className="space-y-10">

        {/* Overview Box */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-extrabold text-brand-black mb-3">The Golden Rule: Do No Harm</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            The quality of your AI restoration depends directly on the digital input. However, chasing maximum resolution should never put fragile 100-year-old paper at risk. If a photo is stuck to glass or cracking along fold lines, prioritize physical safety over forced flatbed pressure.
          </p>
        </div>

        {/* DPI Resolution Chart */}
        <div>
          <h2 className="text-2xl font-extrabold text-brand-black mb-6">Recommended Scanner DPI Settings</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Standard Prints</span>
              <h3 className="text-2xl font-extrabold text-brand-black">300 DPI</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">4x6" or 5x7" Standard Photo</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed pt-2">
                Ideal for 1:1 digital viewing or reprint at the same physical size. Fast scan time with clean file sizes (approx 2–5MB per scan).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 ring-2 ring-brand-orange/30">
              <span className="bg-brand-orange text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Best for AI Repair</span>
              <h3 className="text-2xl font-extrabold text-brand-black">600 DPI</h3>
              <p className="text-xs text-brand-orange font-bold uppercase">Small Wallet Prints / Details</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed pt-2">
                Our recommended default. Captures subtle facial details and small scratches, giving AI restoration models maximum pixel density.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="bg-gray-100 text-brand-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Enlargement</span>
              <h3 className="text-2xl font-extrabold text-brand-black">1200 DPI</h3>
              <p className="text-xs text-gray-500 font-bold uppercase">Tiny 1-Inch Photos / Negatives</p>
              <p className="text-sm text-gray-600 font-medium leading-relaxed pt-2">
                Necessary only when enlarging tiny locket photos or postage-stamp size prints for 8x10 wall frame prints.
              </p>
            </div>
          </div>
        </div>

        {/* Flatbed vs Phone Scan Checklist */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Flatbed Scanner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-black flex items-center justify-center font-bold">
                <CheckCircle2 size={20} className="text-brand-orange" />
              </div>
              <h3 className="text-xl font-extrabold text-brand-black">Flatbed Scanner Best Practices</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Clean the scanner glass with microfiber and glass cleaner; let dry completely.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Place photos face-down gently; never force curled prints flat with heavy books.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Save as uncompressed TIFF or high-quality 24-bit RGB JPG files.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Disable automatic hardware "sharpening" or "auto-color fix" filters.
              </li>
            </ul>
          </div>

          {/* Smartphone Scanning */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-black flex items-center justify-center font-bold">
                <Camera size={20} className="text-brand-orange" />
              </div>
              <h3 className="text-xl font-extrabold text-brand-black">Smartphone Camera Scan Tips</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Place photo on a flat, dark, non-reflective mat or wooden table.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Use indirect window daylight from the side to avoid direct overhead lamp glare.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Hold phone strictly parallel to the photo to prevent perspective distortion.
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-brand-orange">•</span>
                Turn off camera flash and beauty/portrait mode background blurs.
              </li>
            </ul>
          </div>
        </div>

        {/* Warning Box: Photos Stuck to Glass */}
        <div className="bg-amber-50 p-6 sm:p-8 rounded-3xl border border-amber-200 space-y-3">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertTriangle size={22} className="text-amber-600" />
            <h3 className="text-xl font-extrabold">Warning: Photos Stuck to Glass</h3>
          </div>
          <p className="text-sm text-amber-950 font-medium leading-relaxed">
            If a historic photograph has adhered to glass inside its frame over decades of humidity, <strong>do not attempt to peel it apart physically</strong>. Forced separation tears the gelatin emulsion off the paper, causing irreversible loss.
          </p>
          <p className="text-sm text-amber-900 font-medium">
            Instead, place the glass + photo assembly directly on your flatbed scanner, or photograph it through glass using side lighting to minimize glare.
          </p>
        </div>

        {/* National Archives Primary Resources */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
          <h2 className="text-xl font-extrabold text-brand-black">Authoritative Preservation Standards</h2>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            Our digitizing guidance reflects standards established by federal cultural institutions:
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://www.archives.gov/preservation/family-archives/digitizing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-brand-black hover:border-brand-orange transition-colors"
            >
              <span>US National Archives Digitization Guide</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://www.digitizationguidelines.gov/guidelines/digitize-technical.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-brand-black hover:border-brand-orange transition-colors"
            >
              <span>FADGI Federal Technical Guidelines</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Tool Callout */}
        <div className="bg-brand-black text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Done Scanning? Restore Your Photo Now</h3>
            <p className="text-gray-300 font-medium text-sm">
              Upload your clean scan into our AI restoration tool to fix scratches, stains, and sepia fading.
            </p>
          </div>
          <Link
            href="/old-photo-restoration"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shrink-0"
          >
            <span>Start Restoration Tool</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </GuideLayout>
  )
}
