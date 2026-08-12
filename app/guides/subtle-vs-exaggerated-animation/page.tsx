import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Subtle vs Exaggerated Animation for Old Family Photos (Avoid Uncanny Valley)",
  description:
    "How to animate old family photos for memorials, digital frames, and tribute videos. Choose restrained motion, understand common artifacts, and restore the still first.",
  alternates: { canonical: "/guides/subtle-vs-exaggerated-animation" },
}

const TOC_ITEMS = [
  { id: "who-this-is-for", title: "Who this guide is for" },
  { id: "the-uncanny-threshold", title: "1. Uncanny valley on memorial photos" },
  { id: "recommended-defaults", title: "2. Recommended defaults" },
  { id: "motion-types", title: "3. Subtle vs exaggerated motion" },
  { id: "animation-artifacts", title: "4. Common animation artifacts" },
  { id: "restore-before-animation", title: "5. Restore before animating" },
  { id: "bringback-constraints", title: "6. How BringBack treats motion" },
  { id: "digital-frames", title: "7. Digital frames & loop length" },
  { id: "faq", title: "FAQ" },
]

export default function SubtleAnimationGuidePage() {
  return (
    <GuideLayout
      title="Subtle vs exaggerated animation for old family photos (avoid the uncanny valley)"
      description="Choose motion for memorials, digital frames, and tribute clips. Learn which presets tend to preserve a portrait, which movements create artifacts, and why restoration should come first."
      updated="August 12, 2026"
      crumbs={[{ name: "Subtle vs exaggerated animation" }]}
      toc={TOC_ITEMS}
    >
      <div className="space-y-12 text-brand-black">

        <section id="who-this-is-for" className="scroll-mt-36 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Who this guide is for
          </h2>
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            You are animating a <strong>still family photograph</strong>—often of someone who has
            passed—for a digital frame, memorial service clip, or private share. Tools in the
            “living photo” category (including products people compare to Deep Nostalgia–style
            motion) can look magical or deeply wrong depending on amplitude. BringBack{" "}
            <Link href="/ai-photo-animation" className="text-brand-orange underline font-bold">
              AI photo animation
            </Link>{" "}
            costs <strong>10 credits</strong> per run. The Value and Family packs contain enough
            credits for animation; the 4-credit Starter pack does not. Treat motion as a deliberate
            second step after reviewing a clean still.
          </p>
        </section>

        <section id="recommended-defaults" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Recommended starting point
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
            <li><strong>Blink:</strong> natural, occasional—not rapid flutter.</li>
            <li><strong>Head movement:</strong> choose a preset described as a slight tilt, soft nod, or minimal movement for formal portraits.</li>
            <li><strong>Mouth:</strong> avoid speaking or wide-smile presets for serious memorials; a gentle smile is a better fit when the source already supports that expression.</li>
            <li><strong>Loop length for frames:</strong> BringBack produces a five-second silent video. Preview the complete file and its repeat point on your frame before leaving it on continuous play.</li>
            <li><strong>Avoid:</strong> wide laughs, big yaw turns, hair whipping, or party-filter energy on funeral or wartime portraits.</li>
          </ul>
          <p className="text-gray-700 font-medium text-sm leading-relaxed">
            When a slight smile is OK: the source already shows a gentle smile and relatives want warmth.
            When it is not: solemn military portraits, grief contexts, or faces that never smiled in the
            only surviving photo—forced cheer reads as disrespect.
          </p>
        </section>

        {/* 1. The Uncanny Valley Threshold */}
        <section id="the-uncanny-threshold" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            1. The uncanny valley on memorial photos
          </h2>
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            Family members are unusually sensitive to changes in a familiar face. A generated blink,
            smile, or head movement can feel wrong when it changes the person&apos;s expression or exposes
            facial detail that was never visible in the still image.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            If an AI animation tool applies generic, exaggerated movements — like forcing a wide head
            turn or a theatrical laugh — it quickly crosses what researchers call the{" "}
            <a
              href="https://en.wikipedia.org/wiki/Uncanny_valley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              uncanny valley
            </a>.
            The result can feel unsettling because the motion reveals invented teeth, ears, skin, or
            expressions rather than movement recorded from that person.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            A useful rule of thumb is simple: <strong>less is usually more</strong>. Subtle motion asks
            the model to invent less information and is often a better fit for formal or memorial portraits.
          </p>
        </section>

        {/* 2. Subtle Micro-Motion vs. Exaggerated Motion */}
        <section id="motion-types" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            3. Subtle micro-motion vs exaggerated motion
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Understanding the technical difference between these two approaches helps you choose the
            right animation settings:
          </p>

          <div className="grid md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-brand-black">Subtle Micro-Motion</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                Limits AI generation to natural, low-amplitude facial adjustments. This represents the
                natural resting movement of a person sitting for a portrait.
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-xs text-gray-600 font-medium">
                <li>Natural eye blinks and subtle changes in gaze direction.</li>
                <li>Gentle, natural rise and fall of the shoulders representing breathing.</li>
                <li>Micro-expressions, such as a slight warming of the corners of the mouth.</li>
                <li>Borders and background textures are less likely to warp.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-brand-black text-gray-500">Exaggerated Motion</h3>
              <p className="text-gray-700 font-medium text-sm leading-relaxed">
                Forces the AI to calculate major structural changes, requiring the model to generate
                angles and features that were never present in the original still photograph.
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-xs text-gray-600 font-medium">
                <li>Large head rotations that reveal previously hidden areas.</li>
                <li>Wide, open-mouth smiles or laughing that displays teeth.</li>
                <li>Nodding, waving, or speaking.</li>
                <li>The model must &ldquo;invent&rdquo; background textures behind the moving head.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. Three Common Animation Artifacts */}
        <section id="animation-artifacts" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            4. Common artifacts from exaggerated animation
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Pushing an animation model past its structural limits results in predictable visual
            errors, or &ldquo;artifacts.&rdquo; Watch out for these three issues:
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                1. Background Warping (Texture Smearing)
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                When the head in a photo moves significantly, the AI must fill in the background space
                that was previously hidden behind the hair, ears, or neck. Because the model doesn&apos;t know
                what was behind the person, it stretches the surrounding pixels. This causes wallpaper
                patterns, outdoor scenery, or photo borders to bend and smear unnaturally around the
                edges of the head during movement.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                2. Hallucinated Teeth and Ears
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                If the original photo shows a person with a closed mouth, and the animation forces them to
                smile widely or laugh, the AI must generate teeth. Since it has no record of the person&apos;s
                actual teeth, it inserts a generic set of symmetrical, bright-white teeth. Similarly, a
                large head turn requires showing the back of an ear that was hidden. This creates a waxy,
                artificial look that instantly breaks the illusion of reality.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                3. Speed and Timing Inconsistency (Robotic Gliding)
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                Human movement is organic and variable. We speed up and slow down as we turn our heads or
                blink. AI animation models sometimes struggle with this timing, producing linear, uniform
                movement where the head glides smoothly from side to side at a constant velocity. This
                robotic pace is one of the quickest ways to trigger uncanny valley discomfort.
              </p>
            </div>
          </div>
        </section>

        {/* 4. The Workflow: Restore Before Animating */}
        <section id="restore-before-animation" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            5. Restore before animating
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            AI animation engines rely on detecting clean facial landmark points (eyes, nose, mouth) in the
            source image. If your vintage photo has a scratch across the eye, a crease through the mouth,
            or overall fading, the landmark detector will misalign.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            When the animation warp is applied, these damaged areas will stretch and distort, making the scratch
            look like a moving physical blemish or creating strange warping shadows on the face.
          </p>

          <div className="border-l-2 border-brand-orange pl-4 py-2 my-4">
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>The correct order:</strong> Always run your vintage scan through our{" "}
              <Link
                href="/old-photo-restoration"
                className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
              >
                old photo restoration tool
              </Link>{" "}
              first to repair cracks, dust, and fading. Once you have reviewed the restored still,
              upload that file to the animation generator. Cleaner facial structure generally gives
              the animation model a better source, but it does not guarantee a stable result.
            </p>
          </div>
        </section>

        {/* 5. How BringBack Restricts Motion */}
        <section id="bringback-constraints" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            6. What BringBack lets you choose
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            To prevent the uncanny valley effect, BringBack&apos;s{" "}
            <Link
              href="/ai-photo-animation"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              AI photo animation tool
            </Link>{" "}
            offers named motion presets rather than fine-grained controls for angle, blink duration, or
            individual facial features. Current options include gentle smiles, blink with a slight head
            tilt, warm gaze, soft nod, minimal motion, and more expressive choices.
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 font-medium leading-relaxed">
            <li><strong>For a formal portrait:</strong> start with minimal motion, blink and tilt, or a soft nod.</li>
            <li><strong>For a warm candid:</strong> a gentle smile or warm gaze may suit the source expression.</li>
            <li><strong>Use caution:</strong> wave, look-around, and speaking presets ask the model to invent more movement and may create stronger artifacts.</li>
            <li><strong>Review every result:</strong> BringBack generates a five-second silent video, and likeness or motion can vary from one run to another.</li>
          </ul>
        </section>

        {/* 6. Archival Context & Digital Frames */}
        <section id="digital-frames" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            7. Digital frames, tribute clips, and loop length
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Subtle micro-motion is particularly suited for memorial and home display formats:
          </p>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-gray-800 font-bold">Continuous Digital Picture Frames</p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                If you display an animated photo on a living room digital frame, exaggerated movement
                becomes repetitive and distracting. BringBack produces a five-second clip, so choose a
                restrained preset and test how your frame repeats that exact file. Watch the loop boundary,
                eyes, ears, hair, and nearby background for a visible jump or warp.
              </p>
            </div>
            <div>
              <p className="text-gray-800 font-bold">Memorial and Tribute Videos</p>
              <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                During memorial services, family members are highly sensitive to facial likeness. Restrained
                animations honor the subject&apos;s memory without introducing distracting, AI-generated theatrical
                gestures.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-36 space-y-4 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            FAQ
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-brand-black">Should I animate before restoring?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">No. Restore first (1 credit), then animate (10 credits). Damage moves with the face if you reverse the order.</p>
            </div>
            <div>
              <h3 className="font-bold text-brand-black">Is this the same as viral “living photo” tools?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">Same category of face-driven still animation; products differ in amplitude defaults and ethics of exaggeration. Prefer subtle settings for memorials regardless of brand.</p>
            </div>
            <div>
              <h3 className="font-bold text-brand-black">How much does animation cost on BringBack?</h3>
              <p className="text-sm text-gray-600 font-medium mt-1">10 credits per animation. Value Pack ($9.99 / 20) or Family Pack ($21.99 / 60) can fund it; Starter ($4.99 / 4) cannot.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 pt-10">
          <div className="space-y-4">
            <p className="text-gray-700 font-medium leading-relaxed">
              Restore the still first, then generate a subtle, likeness-conscious loop for frames and tributes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/old-photo-restoration"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-brand-black px-6 py-3.5 rounded-full font-bold text-sm hover:border-brand-orange transition-colors"
              >
                <span>Restore first</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/ai-photo-animation"
                className="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange transition-colors shadow-md"
              >
                <span>Animate a restored photo</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </GuideLayout>
  )
}
