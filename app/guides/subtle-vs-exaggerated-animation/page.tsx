import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subtle vs exaggerated photo animation | BringBack",
  description:
    "When a soft smile or blink is more respectful than big motion. Input requirements and common artifacts for animating old portraits.",
  alternates: { canonical: "/guides/subtle-vs-exaggerated-animation" },
}

export default function SubtleAnimationGuidePage() {
  return (
    <GuideLayout
      title="Subtle vs exaggerated motion"
      description="For memorial and family use, restraint usually reads as more respectful than theatrical motion."
      updated="July 19, 2026"
      crumbs={[{ name: "Subtle vs exaggerated animation" }]}
    >
      <h2 className="text-2xl font-extrabold text-brand-black">Prefer subtle when</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>The photo is a memorial or funeral tribute</li>
        <li>Viewers knew the person closely and will notice identity drift</li>
        <li>The face is soft, aged, or partially damaged</li>
        <li>You will display the clip on a loop (big motion becomes uncanny fast)</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Common artifacts</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Background warping around the head</li>
        <li>Teeth/eye flicker on large smiles</li>
        <li>Hair edges swimming</li>
        <li>Asymmetric blinks on damaged faces</li>
      </ul>

      <h2 className="text-2xl font-extrabold text-brand-black">Credits &amp; workflow</h2>
      <p>
        Animation costs <strong>10 credits</strong>. The 4-credit Restoration Starter cannot fund it.
        Restore first when scratches or blur hide landmarks, then animate.
      </p>

      <p>
        <Link href="/ai-photo-animation" className="underline font-semibold text-brand-black">
          AI photo animation
        </Link>{" "}
        ·{" "}
        <Link href="/dashboard/animate" className="underline font-semibold text-brand-black">
          Open animate tool
        </Link>
      </p>
    </GuideLayout>
  )
}
