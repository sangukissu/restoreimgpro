import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Choose Source Photos for Perfect AI Likeness & Accuracy | BringBack Guide",
  description:
    "Master the art of selecting source photos to preserve facial likeness when creating AI family portraits, adding relatives, or restoring old photos.",
  alternates: { canonical: "/guides/choose-source-photos-for-likeness" },
}

export default function SourcePhotosGuidePage() {
  return (
    <GuideLayout
      title="How to Choose Source Photos for Perfect AI Likeness"
      description="Reuniting family members into one studio portrait or adding a loved one to a photo requires selecting reference images that give the AI clear, uncorrupted facial geometry."
      updated="July 21, 2026"
      crumbs={[{ name: "Source photos for likeness" }]}
    >
      <div className="space-y-10">
        
        {/* Intro Overview */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100">
          <h2 className="text-2xl font-extrabold text-brand-black mb-3">Why Reference Quality Matters</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            AI family portrait models don't copy-paste pixels; they construct a 3D geometric mesh of facial features (eye spacing, jawline angle, lip thickness) and re-render them under new studio lighting. The clearer your input photo, the more authentic the facial reconstruction will be.
          </p>
        </div>

        {/* Section 1: The 5 Golden Rules */}
        <div>
          <h2 className="text-2xl font-extrabold text-brand-black mb-6">5 Golden Rules for Selecting Reference Photos</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">1</div>
              <h3 className="text-lg font-bold text-brand-black">Front or 3/4 Eye-Level Angle</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Photos taken directly at eye level or slightly to the side allow the AI to map both eyes, the nose bridge, and mouth corners accurately without guessing hidden structures.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">2</div>
              <h3 className="text-lg font-bold text-brand-black">Even, Soft Natural Lighting</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Avoid photos with harsh direct sunlight or extreme half-face shadows. Soft, diffused lighting reveals natural skin texture and pupil alignment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">3</div>
              <h3 className="text-lg font-bold text-brand-black">Unobstructed Facial Landmarks</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Ensure hands, hats, dark sunglasses, or heavy hair strands do not cover key landmarks like eyebrows, cheekbones, or lips.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center font-bold">4</div>
              <h3 className="text-lg font-bold text-brand-black">High Resolution & Sharp Focus</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Upload original digital camera files or flatbed scans instead of low-res screenshots or tiny group photo crops.
              </p>
            </div>
          </div>
        </div>

        {/* Do's and Don'ts Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ideal References */}
          <div className="bg-green-50/60 p-6 sm:p-8 rounded-3xl border border-green-100">
            <h3 className="text-xl font-extrabold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" size={22} />
              Ideal Photo References
            </h3>
            <ul className="space-y-3 text-sm text-green-950 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Individual portrait or small headshot where face fills 30%+ of frame
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Clean, unblurred facial details (individual eyelashes and irises visible)
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Pre-restored scans of damaged vintage prints
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Natural expressions (relaxed smile or calm neutral look)
              </li>
            </ul>
          </div>

          {/* References to Avoid */}
          <div className="bg-red-50/60 p-6 sm:p-8 rounded-3xl border border-red-100">
            <h3 className="text-xl font-extrabold text-red-900 mb-4 flex items-center gap-2">
              <XCircle className="text-red-600" size={22} />
              References to Avoid
            </h3>
            <ul className="space-y-3 text-sm text-red-950 font-medium">
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Tiny cropped faces from 20-person crowd photos
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Heavy beauty filters, aggressive smoothing, or social media avatars
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Severe profile views (90-degree side silhouette with only 1 eye visible)
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">•</span>
                Damaged photos with tears across eyes, nose, or mouth
              </li>
            </ul>
          </div>
        </div>

        {/* Section: Combining Vintage & Modern Photos */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-brand-black">Combining Vintage Prints & Modern Phone Photos</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            When creating a family portrait that includes deceased relatives or ancestors, you will often mix older black-and-white prints with high-definition smartphone portraits.
          </p>
          <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-700 space-y-2">
            <p className="font-bold text-brand-orange">Pro Tip: Restore Damaged Prints First!</p>
            <p>
              If your vintage reference photo has scratches, fading, or water stains, run it through our <Link href="/old-photo-restoration" className="underline font-bold text-brand-black">AI Old Photo Restoration Tool</Link> first. This ensures the portrait generator receives a clean face structure.
            </p>
          </div>
        </div>

        {/* Tools Section */}
        <div className="bg-brand-black text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Ready to Build Your Family Portrait?</h3>
            <p className="text-gray-300 font-medium text-sm">
              Combine 2–4 individual photos into one realistic group portrait now.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/ai-family-portrait"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
              <span>Family Portrait Generator</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/add-person-to-photo"
              className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-6 py-3 rounded-full font-bold text-sm hover:bg-white/20 transition-colors"
            >
              <span>Add Person Tool</span>
            </Link>
          </div>
        </div>

      </div>
    </GuideLayout>
  )
}
