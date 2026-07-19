import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "How to scan a family photo without damaging it | BringBack",
  description:
    "Safety-first tips for flat scans, phone scans, glass glare, and stuck-to-glass photos. Links to National Archives digitization guidance.",
  alternates: { canonical: "/guides/scan-family-photos-safely" },
}

export default function ScanGuidePage() {
  return (
    <GuideLayout
      title="Scan a family photo without damaging it"
      description="Better inputs produce better restorations. This guide prioritizes not harming the print over chasing maximum resolution claims."
      updated="July 19, 2026"
      crumbs={[{ name: "Scan family photos safely" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">Prefer a flat scan when you can</h2>
      <p>
        A flatbed scanner keeps the print flat and even. Place the photo face-down carefully; do not
        force curled prints. If the photo is stuck in an album or to glass, do not peel aggressively
        — that can destroy emulsion.
      </p>

      <h2 className="text-2xl font-extrabold text-brand-black">Phone scan checklist</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Dark, non-reflective mat or table under the print</li>
        <li>Even light from the side; avoid hard overhead glare</li>
        <li>Hold the phone parallel to the print to reduce keystone distortion</li>
        <li>Fill the frame with the photo; crop borders later if needed</li>
        <li>Disable beauty filters and HDR “enhancements” when possible</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Photos behind glass</h2>
      <p>
        Reflections hide faces and textures. Try angled light, turn off nearby lamps, or carefully
        open the frame if the print is not adhered. If the print is stuck to glass, stop and seek
        conservator advice rather than force separation.
      </p>

      <h2 className="text-2xl font-extrabold text-brand-black">Primary sources</h2>
      <p>
        For family digitization basics, see the{" "}
        <a
          href="https://www.archives.gov/preservation/family-archives/digitizing"
          className="underline font-semibold text-brand-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          US National Archives digitizing guidance
        </a>{" "}
        and{" "}
        <a
          href="https://www.digitizationguidelines.gov/guidelines/digitize-technical.html"
          className="underline font-semibold text-brand-black"
          target="_blank"
          rel="noopener noreferrer"
        >
          FADGI technical guidelines
        </a>
        . We do not replace professional conservation.
      </p>

      <p>
        Next:{" "}
        <Link href="/guides/restore-only-vs-colorize" className="underline font-semibold text-brand-black">
          choose restore-only vs colorize
        </Link>{" "}
        or open{" "}
        <Link href="/dashboard/restore" className="underline font-semibold text-brand-black">
          the restore tool
        </Link>
        .
      </p>
    </GuideLayout>
  )
}
