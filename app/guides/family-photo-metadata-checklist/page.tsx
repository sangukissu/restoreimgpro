import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { FileText, Users, MapPin, Calendar, BookOpen, ArrowRight, ShieldCheck, Tag } from "lucide-react"

export const metadata: Metadata = {
  title: "Family Photo Metadata Checklist: How to Document & Archive Memories | BringBack",
  description:
    "A comprehensive checklist for documenting names, dates, places, and provenance when scanning and restoring historic family photos.",
  alternates: { canonical: "/guides/family-photo-metadata-checklist" },
}

export default function MetadataChecklistPage() {
  return (
    <GuideLayout
      title="Family Photo Metadata & Archival Document Checklist"
      description="Pixels without names become digital orphans. Learn how to record dates, locations, provenance, and back-of-photo inscriptions alongside your AI restorations."
      updated="July 21, 2026"
      crumbs={[{ name: "Metadata checklist" }]}
    >
      <div className="space-y-10">

        {/* Overview Box */}
        <div className="bg-brand-surface p-6 sm:p-8 rounded-3xl border border-gray-100 space-y-3">
          <h2 className="text-2xl font-extrabold text-brand-black">Why Digital Metadata Matters</h2>
          <p className="text-gray-600 font-medium leading-relaxed">
            Restoring an old photograph to pristine 4K quality is only half the job. Without capturing who is in the photo, where it was taken, and what year it depicts, the memory risks becoming an anonymous image for future generations.
          </p>
        </div>

        {/* The 7 Metadata Pillars */}
        <div>
          <h2 className="text-2xl font-extrabold text-brand-black mb-6">The 7 Pillars of Family Photo Archiving</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">1. Subject Identification</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Record full maiden/married names and relative position: <em>"Left to right: Eleanor Smith (grandmother), John Smith (uncle, age 6)."</em>
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <Calendar size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">2. Date or Estimated Range</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Exact year or estimated decade with uncertainty markers: <em>"c. 1944 (estimated from military uniform insignia)."</em>
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">3. Location & Setting</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                City, state/country, or landmark: <em>"Family homestead porch, Springfield, Illinois."</em>
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <FileText size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">4. Back-of-Photo Transcriptions</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Always scan or transcribe handwritten notes, studio stamps, or developer dates printed on the reverse side of paper prints.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <Tag size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">5. Occasion / Context</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Event category: <em>"Golden wedding anniversary, high school graduation, WWII deployment farewell."</em>
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-surface text-brand-orange flex items-center justify-center font-bold mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-brand-black">6. Provenance & Ownership</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Who currently holds the physical original print and scan date: <em>"Original 4x6 print held by Aunt Mary; flatbed scanned 2026."</em>
              </p>
            </div>
          </div>
        </div>

        {/* File Naming & Versioning Rules */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-2xl font-extrabold text-brand-black">Recommended File Naming Convention</h2>
          <p className="text-gray-600 font-medium leading-relaxed text-sm">
            Keep raw scans distinct from AI restorations and colorizations using a clear naming structure:
          </p>
          <div className="bg-brand-surface p-4 rounded-2xl border border-gray-100 font-mono text-xs text-brand-black space-y-2">
            <p><span className="text-gray-400">Raw Scan:</span> 1952_Smith_Family_Reunion_ORIGINAL.jpg</p>
            <p><span className="text-brand-orange font-bold">Restored:</span> 1952_Smith_Family_Reunion_RESTORED.jpg</p>
            <p><span className="text-blue-600 font-bold">Colorized:</span> 1952_Smith_Family_Reunion_COLORIZED_AI.jpg</p>
          </div>
        </div>

        {/* Memory Book Product Banner */}
        <div className="bg-brand-black text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold mb-2">Preserve Stories in a Private Memory Book</h3>
            <p className="text-gray-300 font-medium text-sm">
              Combine your restored photos, audio captions, and family metadata into a private digital keepsake.
            </p>
          </div>
          <Link
            href="/family-memory-book"
            className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shrink-0"
          >
            <span>Explore Family Memory Book</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </GuideLayout>
  )
}
