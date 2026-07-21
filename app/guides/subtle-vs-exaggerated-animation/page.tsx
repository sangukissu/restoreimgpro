import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { Sparkles, AlertTriangle, ShieldCheck, Heart, ArrowRight, PlayCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Subtle vs Exaggerated Photo Animation: Avoiding the Uncanny Valley | BringBack",
  description:
    "Learn when natural subtle motion (gentle smiles, realistic blinks) is superior to exaggerated video motion for animating vintage family portraits.",
  alternates: { canonical: "/guides/subtle-vs-exaggerated-animation" },
}

export default function SubtleAnimationGuidePage() {
  return (
    <GuideLayout
      title="Subtle vs. Exaggerated Motion: Avoiding the Uncanny Valley"
      description="Animating historical photographs requires emotional restraint. Learn why subtle micro-expressions preserve dignity in family portraits while theatrical motion causes uncanny valley artifacts."
      updated="July 21, 2026"
      crumbs={[{ name: "Subtle vs exaggerated animation" }]}
    >
      <div className="space-y-10">

        {/* Overview Box */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-3">
          <h2 className="text-2xl font-extrabold text-brand-black">The Uncanny Valley Threshold</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            When animating a deceased relative or ancestor, viewers who knew the person closely possess deep muscular memory of their exact smile and head tilt. Large, exaggerated movement forces the AI model to generate novel head turns and extreme expressions—often resulting in a jarring "uncanny" feeling.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Subtle Motion */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              <Heart size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-brand-black">Subtle Micro-Motion (Recommended)</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Focuses on natural 2-to-4 second loops: gentle eyelid blinks, subtle eye glints, and a soft warming of the lips into a gentle smile.
            </p>
            <ul className="space-y-2 text-xs font-medium text-gray-700 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Ideal for memorial videos and funeral tributes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Does not warp background textures or hair edges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Looks natural on continuous digital frame loops
              </li>
            </ul>
          </div>

          {/* Exaggerated Motion */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-brand-black">Exaggerated Motion (Use Caution)</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Forces wide head turns, full open-mouth laughs, or theatrical nodding. Requires generating synthetic teeth and hidden ear perspectives.
            </p>
            <ul className="space-y-2 text-xs font-medium text-gray-700 pt-2 border-t border-gray-100">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Causes background warping around ears and collar
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Creates flickering synthetic teeth artifacts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                Often feels unnatural to immediate family members
              </li>
            </ul>
          </div>
        </div>

        {/* Technical Workflow Advice */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-brand-black">Workflow Order: Restore Before Animating</h2>
          <p className="text-gray-600 font-medium leading-relaxed text-sm">
            AI animation drivers map keypoints onto eyes, eyebrows, and lips. If your vintage photo contains scratches or fading over these keypoints, the animation engine will distort.
          </p>
          <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 text-xs font-medium text-gray-700 space-y-2">
            <p className="font-bold text-brand-orange text-sm">Recommended 2-Step Process:</p>
            <p>1. Run your damaged photo through <Link href="/old-photo-restoration" className="underline font-bold text-brand-black">AI Restoration</Link> to repair surface scratches and sharpen features.</p>
            <p>2. Upload the clean restored output to the <Link href="/ai-photo-animation" className="underline font-bold text-brand-black">Photo Animation Generator</Link>.</p>
          </div>
        </div>

        {/* Credit Transparency */}
        <div className="bg-brand-surface p-6 rounded-3xl border border-gray-100 space-y-2 text-sm text-gray-700 font-medium">
          <h3 className="font-extrabold text-brand-black">Credit Cost & Pricing Notice</h3>
          <p>
            Photo Animation requires high-compute video inference and costs <strong>10 credits</strong> per generation. Note that the 4-credit Starter Pack is designed for photo restorations (1 credit each) or family portraits (2 credits each).
          </p>
        </div>

        {/* CTA Banner */}
        <div className="bg-brand-black text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Animate Your Family Memories</h3>
            <p className="text-gray-300 font-medium text-sm">
              See your ancestors smile, blink, and move naturally with AI Live Portrait technology.
            </p>
          </div>
          <Link
            href="/ai-photo-animation"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shrink-0"
          >
            <span>Explore Photo Animation</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </GuideLayout>
  )
}
