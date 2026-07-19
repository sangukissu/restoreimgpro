import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Why AI changes faces and how to reduce identity drift | BringBack",
  description:
    "Missing facial detail may be reconstructed, not recovered. Practical ways to reduce identity drift when restoring or reuniting family photos.",
  alternates: { canonical: "/guides/why-ai-changes-faces" },
}

export default function WhyAiChangesFacesPage() {
  return (
    <GuideLayout
      title="Why AI changes faces — and how to reduce identity drift"
      description="The central fear for family projects is not resolution. It is whether the tool still looks like the person you remember."
      updated="July 19, 2026"
      crumbs={[{ name: "Why AI changes faces" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">Reconstruction vs recovery</h2>
      <p>
        When pixels for eyes, mouth, or structure are missing, AI fills plausible detail from
        patterns it has learned. That is reconstruction — not recovery of the exact original face.
        Treating it as “what they really looked like” can create false confidence.
      </p>

      <h2 className="text-2xl font-extrabold text-brand-black">What increases drift</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Heavy damage over the face, tears through features</li>
        <li>Very small face crops or extreme blur</li>
        <li>Aggressive colorization after repair</li>
        <li>Poor reference photos when reuniting or adding a person</li>
        <li>Forcing a download without side-by-side comparison</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">How to reduce risk</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Start with the best scan you can make safely</li>
        <li>Prefer restore-only first; add color later if needed</li>
        <li>Use clear, front-facing references for reunite tools</li>
        <li>Always use comparison before print or share</li>
        <li>If identity feels wrong, stop — keep the original or try again with better inputs</li>
      </ul>

      <p>
        See the{" "}
        <Link href="/restoration-benchmark" className="underline font-semibold text-brand-black">
          restoration benchmark
        </Link>{" "}
        for how we score identity drift, or open{" "}
        <Link href="/dashboard/restore" className="underline font-semibold text-brand-black">
          restore
        </Link>
        .
      </p>
    </GuideLayout>
  )
}
