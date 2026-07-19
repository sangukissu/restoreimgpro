import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Restore-only vs colorize: how to choose | BringBack",
  description:
    "Keep black-and-white or sepia character with restore-only, or add AI color as an interpretation. When colorize is the wrong choice for family memory.",
  alternates: { canonical: "/guides/restore-only-vs-colorize" },
}

export default function RestoreVsColorizePage() {
  return (
    <GuideLayout
      title="Restore-only vs colorize: how to choose"
      description="The default for many family projects should be restore-only. Color is optional — and never historical proof."
      updated="July 19, 2026"
      crumbs={[{ name: "Restore-only vs colorize" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">Choose restore-only when</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>The memory is black-and-white or sepia and that tonality matters</li>
        <li>You need the least interpretive change to faces and clothes</li>
        <li>You will print or archive a “faithful” version next to the original</li>
        <li>Relatives disagree about “what color things really were”</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Choose restore + colorize when</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>You explicitly want a modern color interpretation for a gift or display</li>
        <li>You understand colors are estimated, not recovered from the film dyes</li>
        <li>You will keep the monochrome original and label the color version as AI-assisted</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">What AI color may invent</h2>
      <p>
        Hair, skin, uniforms, and backgrounds can shift identity perception. Always compare
        side-by-side. See also{" "}
        <Link href="/guides/why-ai-changes-faces" className="underline font-semibold text-brand-black">
          why AI changes faces
        </Link>
        .
      </p>

      <p>
        Product page:{" "}
        <Link href="/old-photo-restoration" className="underline font-semibold text-brand-black">
          Old photo restoration
        </Link>{" "}
        · Optional color workflow:{" "}
        <Link href="/colorize-photos" className="underline font-semibold text-brand-black">
          Colorize photos
        </Link>
        .
      </p>
    </GuideLayout>
  )
}
