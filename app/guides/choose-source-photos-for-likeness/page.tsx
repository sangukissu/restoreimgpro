import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Choose source photos that preserve likeness | BringBack",
  description:
    "Lighting, angle, resolution, and expression tips when building a family portrait or adding a person to a photo.",
  alternates: { canonical: "/guides/choose-source-photos-for-likeness" },
}

export default function SourcePhotosGuidePage() {
  return (
    <GuideLayout
      title="Choose source photos that preserve likeness"
      description="Reunite tools work best when each person has a clear, honest face reference — not a distant group crop."
      updated="July 19, 2026"
      crumbs={[{ name: "Source photos for likeness" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">Prefer</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Front or near-front facing faces</li>
        <li>Even lighting without deep shadows across one eye</li>
        <li>Eyes open, face not covered by hands, hats, or heavy sunglasses</li>
        <li>Similar era/style when possible (reduces jarring mismatch)</li>
        <li>Restored versions of damaged prints used as references</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Avoid as sole reference</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tiny faces in large group photos</li>
        <li>Strong profile-only angles with no second view</li>
        <li>Heavy filters, heavy makeup edits, or AI avatars</li>
        <li>Severely torn faces where eyes/mouth are gone</li>
      </ul>

      <p>
        Tools:{" "}
        <Link href="/ai-family-portrait" className="underline font-semibold text-brand-black">
          Family portrait
        </Link>
        ,{" "}
        <Link href="/add-person-to-photo" className="underline font-semibold text-brand-black">
          Add person
        </Link>
        . Restore damaged references first on{" "}
        <Link href="/old-photo-restoration" className="underline font-semibold text-brand-black">
          restoration
        </Link>
        .
      </p>
    </GuideLayout>
  )
}
