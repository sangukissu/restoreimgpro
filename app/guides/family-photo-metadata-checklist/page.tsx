import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Family photo metadata checklist | BringBack",
  description:
    "Record names, dates, places, and uncertainty for family photos. Keep originals distinct from restored versions in a private keepsake.",
  alternates: { canonical: "/guides/family-photo-metadata-checklist" },
}

export default function MetadataChecklistPage() {
  return (
    <GuideLayout
      title="Family photo metadata checklist"
      description="Pixels without names become orphans. Capture what you know — and label what you don’t."
      updated="July 19, 2026"
      crumbs={[{ name: "Metadata checklist" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">For each photo, try to record</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Who</strong> — full names if known; otherwise “unknown adult, left”
        </li>
        <li>
          <strong>When</strong> — year or range; mark uncertainty (“approx. 1952”)
        </li>
        <li>
          <strong>Where</strong> — town, home, event if known
        </li>
        <li>
          <strong>Event</strong> — wedding, school, military, reunion
        </li>
        <li>
          <strong>Source</strong> — who held the print; scan date
        </li>
        <li>
          <strong>Back of photo</strong> — photograph or transcribe handwritten notes
        </li>
        <li>
          <strong>Version</strong> — original scan vs restored vs colorized (keep distinct)
        </li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Invite relatives</h2>
      <p>
        Share a private keepsake link when appropriate and ask who recognizes faces. Prefer private
        tools over public social posts for unidentified people.
      </p>

      <p>
        Product:{" "}
        <Link href="/family-memory-book" className="underline font-semibold text-brand-black">
          Family Memory Book
        </Link>{" "}
        (Family pack). Restore first:{" "}
        <Link href="/old-photo-restoration" className="underline font-semibold text-brand-black">
          restoration
        </Link>
        .
      </p>
    </GuideLayout>
  )
}
