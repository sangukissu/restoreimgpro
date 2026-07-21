import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ShieldCheck, AlertTriangle, Eye, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Why AI Changes Faces & How to Prevent Identity Drift | BringBack Guide",
  description:
    "Learn why AI photo restoration can cause identity drift and discover practical techniques to keep facial features authentic to your family memories.",
  alternates: { canonical: "/guides/why-ai-changes-faces" },
}

export default function WhyAiChangesFacesPage() {
  return (
    <GuideLayout
      title="Why AI Changes Faces — And How to Prevent Identity Drift"
      description="The central fear in family restoration projects isn't resolution—it's whether the restored face still looks like the person you remember. Here is how facial synthesis works and how to prevent identity drift."
      updated="July 21, 2026"
      crumbs={[{ name: "Why AI changes faces" }]}
    >
      <div className="space-y-10">

        {/* Overview Box */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-3">
          <h2 className="text-2xl font-extrabold text-brand-black">Reconstruction vs. True Recovery</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            When a photograph suffers severe blur, grain, or surface tearing across a face, the original pixel data is destroyed. Deep learning restoration models work by <strong>reconstructing plausible facial landmarks</strong> (eyelashes, pupil geometry, skin texture) from millions of trained faces.
          </p>
          <p className="text-gray-600 font-medium leading-relaxed">
            This process is a statistical reconstruction, not magical retrieval of lost silver haloid grains. Knowing the difference empowers you to evaluate AI outputs critically.
          </p>
        </div>

        {/* Causes of Identity Drift */}
        <div>
          <h2 className="text-2xl font-extrabold text-brand-black mb-6">The Top 5 Causes of Identity Drift</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm">1</span>
              <h3 className="text-lg font-bold text-brand-black">Extreme Low Input Resolution</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                When a face in a photo is under 64x64 pixels, the AI has too few reference pixels and must guess up to 90% of the facial structure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm">2</span>
              <h3 className="text-lg font-bold text-brand-black">Damage Directly Over Key Features</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Deep scratches or tears passing straight through the pupils, nose tip, or lip contours force the model to hallucinate geometry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm">3</span>
              <h3 className="text-lg font-bold text-brand-black">Over-Aggressive Face Enhancement Settings</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Generic facial upscalers apply smooth "porcelain skin" and stock teeth filters that smooth away authentic aging details and unique expressions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <span className="w-7 h-7 rounded-lg bg-red-50 text-red-600 font-bold flex items-center justify-center text-sm">4</span>
              <h3 className="text-lg font-bold text-brand-black">Forced AI Colorization Misalignment</h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                Applying artificial skin tone hues over monochrome shadows can alter the perceived age or ethnic likeness of an ancestor.
              </p>
            </div>
          </div>
        </div>

        {/* How BringBack Prevents Drift */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-2xl font-extrabold text-brand-black">How BringBack Protects Likeness</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-extrabold text-brand-black text-sm">1. Likeness Preservation Loss</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Our models penalize changes to eye-to-nose distance, lip width, and facial bone structure during processing.
              </p>
            </div>
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-extrabold text-brand-black text-sm">2. Restore-Only Mode</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                We allow users to skip colorization entirely to keep authentic black-and-white or sepia chemical character.
              </p>
            </div>
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-extrabold text-brand-black text-sm">3. Side-by-Side Inspection Tool</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                An interactive slider lets you inspect original vs restored pixels at 100% zoom before downloading.
              </p>
            </div>
            <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 space-y-1">
              <h4 className="font-extrabold text-brand-black text-sm">4. Transparent Failure Thresholds</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                If damage is too severe for accurate restoration, we provide free second passes or advise manual conservators.
              </p>
            </div>
          </div>
        </div>

        {/* Actionable Rules */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-4">
          <h2 className="text-xl font-extrabold text-brand-black">Practical Checklist to Minimize Drift</h2>
          <ul className="space-y-2.5 text-sm text-gray-700 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <span>Upload the clearest 600+ DPI scan of the face available.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <span>Use <strong>Restore Only</strong> first before attempting colorization.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <span>Compare results to a second reference photo of the same person if available.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <span>Read our <Link href="/restoration-benchmark" className="underline font-bold text-brand-black">Restoration Benchmark Methodology</Link> to see how we score accuracy.</span>
            </li>
          </ul>
        </div>

        {/* Action Banner */}
        <div className="bg-brand-black text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Test Your Photos with Identity Protection</h3>
            <p className="text-gray-300 font-medium text-sm">
              Try our AI restoration engine with real-time side-by-side inspection.
            </p>
          </div>
          <Link
            href="/old-photo-restoration"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shrink-0"
          >
            <span>Open Restoration Tool</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </GuideLayout>
  )
}
