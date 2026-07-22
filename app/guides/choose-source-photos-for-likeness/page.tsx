import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Choose Source Photos for Perfect AI Likeness | BringBack Guide",
  description:
    "Practical rules for selecting reference photos that preserve facial identity in AI family portraits and photo composites. Covers angle, resolution, lighting, and what to avoid.",
  alternates: { canonical: "/guides/choose-source-photos-for-likeness" },
}

const TOC_ITEMS = [
  { id: "why-selection-matters", title: "Why Photo Selection Matters" },
  { id: "angle", title: "Rule 1: Camera Angle" },
  { id: "resolution", title: "Rule 2: Face Resolution" },
  { id: "lighting", title: "Rule 3: Lighting" },
  { id: "obstructions", title: "Rule 4: No Obstructions" },
  { id: "expression", title: "Rule 5: Expression" },
  { id: "vintage-modern", title: "Mixing Vintage & Modern Photos" },
  { id: "quick-reference", title: "Quick Reference Table" },
]

export default function SourcePhotosGuidePage() {
  return (
    <GuideLayout
      title="How to Choose Source Photos for Perfect AI Likeness"
      description="The quality of your output is capped by the quality of your input. Here are the concrete rules for selecting reference photos that give the AI enough facial data to preserve identity."
      updated="July 22, 2026"
      crumbs={[{ name: "Source photos for likeness" }]}
      toc={TOC_ITEMS}
    >
      <div className="space-y-12 text-brand-black">

        {/* 1. Why Selection Matters */}
        <section id="why-selection-matters" className="scroll-mt-36 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Why Photo Selection Matters
          </h2>
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            When you upload a photo for{" "}
            <Link
              href="/ai-family-portrait"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              AI family portrait generation
            </Link>{" "}
            or{" "}
            <Link
              href="/add-person-to-photo"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              adding someone into a photo
            </Link>,
            the AI needs to detect specific facial landmarks — the exact positions of the eyes,
            nose bridge, mouth corners, jawline, and eyebrows. Industry-standard models map{" "}
            <a
              href="https://ibug.doc.ic.ac.uk/resources/300-W/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              68 landmark points
            </a>{" "}
            across the face to build a geometric mesh.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            If the reference photo is blurry, badly angled, or too small, the model cannot
            reliably detect these landmarks. It fills the gaps with guesses from its training
            data — other people&apos;s faces — which causes{" "}
            <Link
              href="/guides/why-ai-changes-faces"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              identity drift
            </Link>.
            Your output is always capped by the quality of your input.
          </p>
        </section>

        {/* 2. Rule 1: Angle */}
        <section id="angle" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Rule 1: Camera Angle — Front or Three-Quarter View
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The AI needs to see <strong>both eyes, the nose bridge, and both mouth
            corners</strong> in the same frame. This is only possible in two angle ranges:
          </p>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-gray-800 font-bold">Front-facing (0° yaw)</p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-1">
                Both eyes are equally visible. The nose appears centered. This gives the AI
                maximum data and produces the most accurate likeness.
              </p>
            </div>
            <div>
              <p className="text-gray-800 font-bold">Three-quarter view (15–45° yaw)</p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-1">
                One ear may be hidden, but both eyes and the full nose bridge are still visible.
                This is the most common angle in casual portraits and works well. Beyond 45°,
                one eye starts to disappear behind the nose bridge, and the AI must hallucinate
                the hidden side.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-brand-black pt-4">
            Angles to avoid
          </h3>
          <div className="space-y-3 pl-1">
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>Full profile (90°)</strong> — only one eye visible. The AI has to invent
              the entire hidden half of the face. The result will look like a plausible face, but
              it won&apos;t be <em>their</em> face.
            </p>
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>Extreme upward or downward tilt (&gt;30° pitch)</strong> — distorts the
              apparent distance between eyes and mouth. The AI may reconstruct a face with
              proportions that feel &ldquo;off&rdquo; because it learned from mostly level photos.
            </p>
          </div>
        </section>

        {/* 3. Rule 2: Resolution */}
        <section id="resolution" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Rule 2: Face Resolution — The 200px Minimum
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The face in your reference photo needs to be large enough for the AI to detect
            individual features — not just &ldquo;there is a face here&rdquo; but the specific
            shape of <em>this person&apos;s</em> iris, nose tip, and lip contour.
          </p>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm font-medium border-collapse mt-2">
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Face Width</th>
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">What the AI Sees</th>
                  <th className="text-left py-3 font-extrabold text-brand-black">Likeness Quality</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">400px+</td>
                  <td className="py-3 pr-4">Individual pores, iris texture, eyelash direction</td>
                  <td className="py-3">
                    <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Excellent</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">200–400px</td>
                  <td className="py-3 pr-4">Eye shape, nose profile, mouth contour, skin texture</td>
                  <td className="py-3">
                    <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Good</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">80–200px</td>
                  <td className="py-3 pr-4">General face shape and eye position, but features are blurred</td>
                  <td className="py-3">
                    <span className="inline-block bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">Usable</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold">Under 80px</td>
                  <td className="py-3 pr-4">A blob with eye-socket shadows — AI will generate features</td>
                  <td className="py-3">
                    <span className="inline-block bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold">High drift risk</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 font-medium leading-relaxed text-sm pt-2">
            <strong>How to check:</strong> Open the photo on your computer, zoom to 100%, and look
            at the face. Can you clearly see the shape of each individual eye? Can you
            distinguish the upper lip from the lower lip? If yes, the resolution is sufficient.
            If the face is a soft blur of skin tone, scan or photograph the source again at
            higher resolution. See our{" "}
            <Link
              href="/guides/scan-family-photos-safely"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              scanning guide
            </Link>{" "}
            for DPI recommendations.
          </p>
        </section>

        {/* 4. Rule 3: Lighting */}
        <section id="lighting" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Rule 3: Lighting — Even and Soft
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Lighting directly affects how the AI interprets facial geometry. The model reads
            brightness transitions to understand where the nose protrudes, where the cheekbones
            sit, and where the jawline ends. Bad lighting creates false signals.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <p className="text-gray-800 font-bold">What works</p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-1">
                Soft, diffused light from a window or overcast sky. Even studio lighting with
                minimal shadows. Indoor photos taken without flash. The face should be evenly
                illuminated with no more than a gentle gradient from one side to the other.
              </p>
            </div>
            <div>
              <p className="text-gray-800 font-bold">What causes problems</p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-1">
                <strong>Hard direct sunlight</strong> — creates deep, sharp-edged shadows under the
                nose and brow that the AI may interpret as actual facial contours. A harsh noon
                shadow under the nose can make the AI think the upper lip is much thicker than it
                actually is.
              </p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-2">
                <strong>Side-lit dramatic portraits</strong> — half the face is in deep shadow. The
                AI cannot see the landmarks on the dark side and must hallucinate them, which
                increases drift risk.
              </p>
              <p className="text-gray-600 font-medium text-sm leading-relaxed mt-2">
                <strong>Direct camera flash</strong> — flattens the face and blows out skin texture.
                The AI loses the subtle depth cues (cheekbone shadows, nose bridge gradient) that
                help it distinguish one person from another.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Rule 4: No Obstructions */}
        <section id="obstructions" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Rule 4: Clear Face — No Obstructions Over Key Landmarks
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The AI prioritizes five landmark regions. If any of these are covered, it will
            generate that region from its training data instead of from your actual photo:
          </p>

          <ol className="list-decimal list-outside ml-5 space-y-2.5 text-gray-700 font-medium leading-relaxed pt-2">
            <li><strong>Eyes</strong> — the most identity-carrying feature. Sunglasses, heavy
            shadows, or hair strands across the eyes force the model to guess eye shape,
            color, and gaze direction.</li>
            <li><strong>Eyebrows</strong> — shape and thickness are highly individual. Wide-brim
            hats or heavy bangs that cover the brows lose critical identity data.</li>
            <li><strong>Nose bridge and tip</strong> — defines the central axis of the face. A
            hand resting against the cheek or a scarf pulled up to the nose removes this anchor
            point.</li>
            <li><strong>Mouth and lip contour</strong> — especially the Cupid&apos;s bow shape
            and commissure (corner) angles. Avoid photos where the person is mid-bite,
            mid-yawn, or holding something in their teeth.</li>
            <li><strong>Jawline</strong> — defines face shape (oval, square, heart). Turtlenecks,
            scarves, or a hand cupping the chin obscure this boundary.</li>
          </ol>

          <div className="border-l-2 border-brand-orange pl-4 py-2 mt-4">
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>Glasses are usually fine.</strong> Standard prescription glasses with clear
              lenses do not obstruct eye landmarks. The AI can see through them. Dark sunglasses
              or reflective lenses are the problem — they hide the iris and eye shape entirely.
            </p>
          </div>
        </section>

        {/* 6. Rule 5: Expression */}
        <section id="expression" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Rule 5: Neutral or Gentle Expression
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Extreme expressions distort facial geometry in ways that confuse AI landmark
            mapping:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 font-medium leading-relaxed pt-2">
            <li>
              <strong>Wide-open laughing</strong> — stretches the mouth, squints the eyes, and
              raises the cheeks. The AI may reconstruct a face that looks permanently
              &ldquo;squished.&rdquo;
            </li>
            <li>
              <strong>Squinting in bright sun</strong> — narrows the eyes so much that iris
              shape is lost. The AI guesses a generic eye shape.
            </li>
            <li>
              <strong>Crying or extreme emotion</strong> — redness, tear streaks, and contorted
              features add noise that the model may interpret as skin texture or facial contours.
            </li>
          </ul>
          <p className="text-gray-700 font-medium leading-relaxed pt-2">
            The ideal expression is a <strong>relaxed neutral face</strong> or a <strong>gentle
            closed-mouth smile</strong>. This keeps all 68 landmark points in their natural
            resting positions, giving the AI the most accurate map of the person&apos;s actual
            facial structure.
          </p>
        </section>

        {/* 7. Mixing Vintage & Modern */}
        <section id="vintage-modern" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Mixing Vintage Prints and Modern Phone Photos
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Family portrait composites often combine a 1960s B&amp;W print with a 2024
            smartphone selfie. The AI handles the lighting and color matching, but it cannot fix
            fundamental problems in the source material. Here is the workflow:
          </p>

          <div className="space-y-5 pt-2">
            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-sm font-extrabold">1</span>
              <div>
                <p className="font-bold text-brand-black">Restore damaged vintage prints first</p>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                  If the old photo has scratches, tears, or fading across the face, run it
                  through{" "}
                  <Link
                    href="/old-photo-restoration"
                    className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                  >
                    old photo restoration
                  </Link>{" "}
                  before using it as a portrait reference. The portrait model needs clean
                  landmarks — it is not designed to repair damage.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-sm font-extrabold">2</span>
              <div>
                <p className="font-bold text-brand-black">Match the era if possible</p>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                  If you want a portrait of the family &ldquo;as they were&rdquo; in the 1970s,
                  use photos from that era for everyone — not a mix of 1970s prints and 2024
                  selfies. Age differences in the same person across decades will confuse the
                  AI&apos;s age estimation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-sm font-extrabold">3</span>
              <div>
                <p className="font-bold text-brand-black">Use the highest-quality version available</p>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mt-1">
                  If you have both a wallet-sized print and the original 4×6&rdquo; version,
                  always scan the larger one. More pixels = more facial data = better likeness.
                  A 4×6&rdquo; print scanned at 600 DPI gives you a 2400×3600px image — far
                  more data than a phone snapshot of a wallet photo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Quick Reference Table */}
        <section id="quick-reference" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Quick Reference
          </h2>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm font-medium border-collapse mt-2">
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Factor</th>
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Use</th>
                  <th className="text-left py-3 font-extrabold text-brand-black">Avoid</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">Angle</td>
                  <td className="py-3 pr-4">Front-facing or three-quarter (0–45°)</td>
                  <td className="py-3">Full profile, extreme up/down tilt</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">Face size</td>
                  <td className="py-3 pr-4">200px+ across the face</td>
                  <td className="py-3">Tiny crops from group photos (&lt;80px)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">Lighting</td>
                  <td className="py-3 pr-4">Soft diffused, window light, overcast</td>
                  <td className="py-3">Hard sun, half-face shadow, direct flash</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">Face visibility</td>
                  <td className="py-3 pr-4">All 5 landmarks clear (eyes, brows, nose, mouth, jaw)</td>
                  <td className="py-3">Sunglasses, hand on face, hair across eyes</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">Expression</td>
                  <td className="py-3 pr-4">Neutral or gentle smile</td>
                  <td className="py-3">Wide laugh, squinting, crying</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold">Source quality</td>
                  <td className="py-3 pr-4">Original camera file or 600 DPI scan</td>
                  <td className="py-3">Screenshot of a screenshot, social media thumbnail</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 pt-10">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link
              href="/ai-family-portrait"
              className="inline-flex items-center justify-between w-full bg-gray-50 hover:bg-brand-black hover:text-white px-5 py-3.5 rounded-xl text-sm font-bold text-brand-black transition-colors border border-gray-200"
            >
              <span>Family Portrait Generator</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/add-person-to-photo"
              className="inline-flex items-center justify-between w-full bg-gray-50 hover:bg-brand-black hover:text-white px-5 py-3.5 rounded-xl text-sm font-bold text-brand-black transition-colors border border-gray-200"
            >
              <span>Add Person to Photo</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </GuideLayout>
  )
}
