import type { Metadata } from "next"
import { GuideLayout } from "@/components/guides/guide-layout"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Why AI Changes Faces & How to Prevent Identity Drift | BringBack Guide",
  description:
    "Understand why AI photo restoration can alter faces — from facial hallucination to training data bias — and learn practical techniques to verify that a restored photo still looks like the person you remember.",
  alternates: { canonical: "/guides/why-ai-changes-faces" },
}

const TOC_ITEMS = [
  { id: "the-real-fear", title: "The Real Fear" },
  { id: "reconstruction-not-recovery", title: "Reconstruction, Not Recovery" },
  { id: "five-causes", title: "5 Causes of Identity Drift" },
  { id: "uncanny-valley", title: "The Uncanny Valley Effect" },
  { id: "how-to-verify", title: "How to Verify Likeness" },
  { id: "input-quality", title: "Input Quality Makes the Difference" },
  { id: "when-ai-cant-help", title: "When AI Can't Help" },
]

export default function WhyAiChangesFacesPage() {
  return (
    <GuideLayout
      title="Why AI Changes Faces — And How to Prevent Identity Drift"
      description="The central fear in family photo restoration isn't resolution — it's whether the restored face still looks like the person you remember. Here's why it happens and what you can do about it."
      updated="July 22, 2026"
      crumbs={[{ name: "Why AI changes faces" }]}
      toc={TOC_ITEMS}
    >
      <div className="space-y-12 text-brand-black">

        {/* 1. The Real Fear */}
        <section id="the-real-fear" className="scroll-mt-36 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            The Real Fear Behind Every Restoration Project
          </h2>
          <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed">
            Nobody worries about megapixels. The actual fear — the one that stops people from
            clicking &ldquo;restore&rdquo; — is: <em>&ldquo;Will this tool change the person I
            remember?&rdquo;</em>
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            It is a legitimate concern. AI restoration models can and sometimes do alter facial
            features in subtle ways: narrowing a jawline, smoothing out a distinctive nose
            shape, making eyes slightly more symmetrical than they were in life. These changes
            are small enough that the photo still looks &ldquo;good&rdquo; — but the person no
            longer looks quite like your grandmother. Researchers call this phenomenon
            {" "}<strong>identity drift</strong>.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            This guide explains <em>why</em> it happens at a technical level, how to spot it,
            and what practical steps you can take to minimize it.
          </p>
        </section>

        {/* 2. Reconstruction, Not Recovery */}
        <section id="reconstruction-not-recovery" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Reconstruction, Not Recovery: How AI Restoration Actually Works
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            When a photograph has severe blur, grain, or physical tears across a face, the original
            pixel data is <strong>destroyed</strong>. It does not exist anymore. There is no hidden
            layer of information waiting to be unlocked — the silver halide crystals that formed the
            image are physically gone.
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            What AI restoration models do instead is <strong>reconstruct</strong> — they predict what
            the missing pixels probably looked like based on two inputs:
          </p>
          <ol className="list-decimal list-outside ml-5 space-y-3 text-gray-700 font-medium leading-relaxed">
            <li>
              <strong>The surviving pixels in your photo.</strong> The intact parts of the face (an
              undamaged left eye, a clear jawline on one side) provide reference data that the model
              uses to infer the damaged areas.
            </li>
            <li>
              <strong>A generative prior — millions of other faces.</strong> Models like{" "}
              <a
                href="https://github.com/TencentARC/GFPGAN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
              >
                GFPGAN
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/sczhou/CodeFormer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
              >
                CodeFormer
              </a>{" "}
              are trained on large datasets of high-quality face photographs. When your photo is
              missing detail, the model fills the gap with patterns it learned from these other
              faces — not from your grandmother&apos;s actual face.
            </li>
          </ol>
          <p className="text-gray-700 font-medium leading-relaxed">
            This is the core tension: the more damaged the input, the more the AI has to rely on
            its training data (other people&apos;s faces) rather than your actual photo. And the more
            it relies on training data, the higher the risk of identity drift.
          </p>
        </section>

        {/* 3. Five Causes of Identity Drift */}
        <section id="five-causes" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            The 5 Causes of Identity Drift
          </h2>

          <div className="space-y-8 pt-2">
            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                1. Extreme low input resolution
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-2">
                When a face occupies fewer than roughly 64×64 pixels in the source image, the AI has
                so little reference data that it must generate up to 90% of the facial structure from
                its training prior. At this point, the model is essentially <em>painting a new
                face</em> that is statistically plausible — not restoring the original one. This is
                the single biggest cause of identity drift, and it is why{" "}
                <Link
                  href="/guides/scan-family-photos-safely"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  scanning at high DPI
                </Link>{" "}
                matters so much.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                2. Physical damage directly over key facial landmarks
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-2">
                There are specific facial features that carry most of your identity signal: the
                inter-pupillary distance (space between your eyes), the nose bridge width, the
                lip contour, and the jawline angle. When a scratch, tear, or water stain cuts
                directly through one of these landmarks, the model has to hallucinate that geometry.
                Researchers at{" "}
                <a
                  href="https://arxiv.org/abs/2109.07161"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  Tencent ARC
                </a>{" "}
                documented this as a core limitation of GAN-based face restoration — the generator
                prioritizes producing a &ldquo;plausible-looking&rdquo; face over an accurate one.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                3. Over-aggressive face enhancement (&ldquo;beautification bias&rdquo;)
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-2">
                Many AI restoration tools optimize for <strong>perceptual quality</strong> — how
                &ldquo;good&rdquo; the output looks to a human viewer — rather than pixel-level
                accuracy to the original. This creates a systematic bias toward smoothing skin,
                straightening noses, and making faces more symmetrical. The result looks impressive
                as a photograph, but it no longer looks like the specific person. Wrinkles, moles,
                scars, and unique asymmetries that made your grandfather&apos;s face <em>his</em> face
                get quietly erased.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                4. Training data demographic bias
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-2">
                AI face models are trained predominantly on contemporary, well-lit photographs of
                younger adults. When the input is a 1940s portrait of an elderly person with deep
                wrinkles, strong light-and-shadow contrast, or non-Western facial structures, the
                model has fewer reference examples to draw from. This can cause it to subtly shift
                features toward the &ldquo;average face&rdquo; in its training set — a documented
                problem in{" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  NIH-published research
                </a>{" "}
                on AI facial recognition bias.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                5. Colorization-induced skin tone shift
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-2">
                When restoration and colorization are applied simultaneously, the AI is performing
                two generative tasks at once. The color layer can alter the perceived shape of facial
                features — warm skin tones can make cheekbones appear flatter, cool tones can make a
                jawline look sharper. This is why the{" "}
                <Link
                  href="/guides/restore-only-vs-colorize"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  restore-first, colorize-second
                </Link>{" "}
                workflow produces better identity preservation than a single combined pass.
              </p>
            </div>
          </div>
        </section>

        {/* 4. The Uncanny Valley Effect */}
        <section id="uncanny-valley" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            The Uncanny Valley Effect in Restoration
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The{" "}
            <a
              href="https://en.wikipedia.org/wiki/Uncanny_valley"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              uncanny valley
            </a>{" "}
            is a well-documented psychological phenomenon: when a face looks <em>almost</em> real
            but has subtle imperfections, our brains register discomfort rather than simply noticing
            &ldquo;low quality.&rdquo;
          </p>
          <p className="text-gray-700 font-medium leading-relaxed">
            In AI restoration, this often shows up as:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2 text-gray-700 font-medium leading-relaxed">
            <li>
              <strong>Skin that looks &ldquo;waxy&rdquo; or plastic</strong> — the AI removed
              natural texture (pores, fine lines) and replaced it with a smooth, synthetic surface.
            </li>
            <li>
              <strong>Eyes that feel &ldquo;dead&rdquo; or vacant</strong> — the AI reconstructed
              iris detail and specular highlights that are technically correct but lack the micro-asymmetry
              of real eyes.
            </li>
            <li>
              <strong>Teeth that are too perfect</strong> — generic AI face priors default to
              straight, white teeth because that is what appears most frequently in modern training
              data. A 1950s portrait subject likely did not have Hollywood-perfect teeth.
            </li>
          </ul>
          <p className="text-gray-700 font-medium leading-relaxed">
            When a family member sees the restored version and says &ldquo;something feels
            off&rdquo; without being able to pinpoint what, they are likely experiencing the uncanny
            valley. The photo is <em>too perfect</em> to feel authentic.
          </p>
        </section>

        {/* 5. How to Verify Likeness */}
        <section id="how-to-verify" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            How to Verify Likeness After Restoration
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            You do not need specialized software to check for identity drift. Here are practical
            techniques anyone can use:
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                The side-by-side test
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                Open the original scan and the restored version next to each other at 100% zoom.
                Focus specifically on these five invariant landmarks — features that should
                <em> not</em> change during restoration:
              </p>
              <ol className="list-decimal list-outside ml-5 space-y-1 text-gray-700 font-medium leading-relaxed text-sm mt-2">
                <li><strong>Inter-pupillary distance</strong> — the space between the centers of both eyes</li>
                <li><strong>Nose bridge width</strong> — measured at the narrowest point between the eyes</li>
                <li><strong>Lip contour shape</strong> — the Cupid&apos;s bow and commissure angles</li>
                <li><strong>Ear shape and attachment angle</strong> — often overlooked, but highly individual</li>
                <li><strong>Jawline asymmetry</strong> — real faces are never perfectly symmetrical</li>
              </ol>
              <p className="text-gray-600 font-medium leading-relaxed text-sm mt-2">
                If any of these five landmarks shifted noticeably, the AI introduced identity drift.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                The family member test
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                Show the restored photo — without the original beside it — to a family member who
                knew the person. Do not prompt them. Simply ask: &ldquo;Does this look like
                [name]?&rdquo; If they hesitate, furrow their brow, or say &ldquo;something&apos;s
                different,&rdquo; the AI likely drifted. Human facial memory is remarkably specific,
                especially for loved ones.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-brand-black">
                The second reference photo test
              </h3>
              <p className="text-gray-700 font-medium leading-relaxed text-sm mt-1">
                If you have a second photograph of the same person from a different angle or era,
                compare it against the restored version. Consistent facial proportions across multiple
                source photos is a strong signal that the restoration preserved identity accurately.
                This is particularly useful for{" "}
                <Link
                  href="/add-person-to-photo"
                  className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
                >
                  composite projects
                </Link>{" "}
                where you are working with reference photos of the same person.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Input Quality */}
        <section id="input-quality" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            Input Quality Makes the Difference
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The single most effective way to prevent identity drift is to give the AI more data to
            work with. Here is a practical breakdown:
          </p>

          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full text-sm font-medium border-collapse mt-2">
              <thead>
                <tr className="border-b-2 border-brand-black">
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">Face Size in Scan</th>
                  <th className="text-left py-3 pr-4 font-extrabold text-brand-black">AI Reliance on Prior</th>
                  <th className="text-left py-3 font-extrabold text-brand-black">Identity Drift Risk</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">256px+ across face</td>
                  <td className="py-3 pr-4">Low — uses mostly your actual pixels</td>
                  <td className="py-3">
                    <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Minimal</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">128–256px</td>
                  <td className="py-3 pr-4">Moderate — blends your pixels with prior</td>
                  <td className="py-3">
                    <span className="inline-block bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">Moderate</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-bold">64–128px</td>
                  <td className="py-3 pr-4">High — prior dominates reconstruction</td>
                  <td className="py-3">
                    <span className="inline-block bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold">High</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-bold">Under 64px</td>
                  <td className="py-3 pr-4">Near-total — essentially generating a new face</td>
                  <td className="py-3">
                    <span className="inline-block bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs font-bold">Very high</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 font-medium leading-relaxed text-sm pt-2">
            To maximize the face pixel count, scan at 600 DPI or higher. A 4×6&rdquo; print
            scanned at 600 DPI produces a 2400×3600px image — giving even a small face in a group
            photo enough resolution for faithful reconstruction. See our{" "}
            <Link
              href="/guides/scan-family-photos-safely"
              className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
            >
              complete scanning guide
            </Link>{" "}
            for DPI recommendations by print size.
          </p>
        </section>

        {/* 7. When AI Can't Help */}
        <section id="when-ai-cant-help" className="scroll-mt-36 space-y-5 border-t border-gray-100 pt-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-black tracking-tight">
            When AI Can&apos;t Help: Knowing the Limits
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            Honesty about limitations is more valuable than false promises. There are situations
            where no AI tool — including BringBack — can restore a face without significant identity
            drift:
          </p>

          <div className="space-y-3 pl-1 pt-2">
            <p className="text-gray-700 font-medium leading-relaxed">
              <strong>Face is a tiny speck in a large group photo</strong> — if the face is under
              ~40 pixels across in the scan, even 1200 DPI rescanning won&apos;t provide enough
              data. The AI will produce something that looks like a face, but it will be a generated
              face, not the original person.
            </p>
            <p className="text-gray-700 font-medium leading-relaxed">
              <strong>The entire face area is physically missing</strong> — a hole in the print, a
              burn, or a water stain that dissolved the emulsion across the full face. With zero
              surviving reference pixels, the AI has nothing to anchor reconstruction to.
            </p>
            <p className="text-gray-700 font-medium leading-relaxed">
              <strong>Heavy motion blur on the only copy</strong> — motion blur is directional
              information loss. Unlike grain or noise (which is random), motion blur systematically
              smears facial geometry in one direction, and the model cannot reliably reverse it
              without introducing drift.
            </p>
          </div>

          <div className="border-l-2 border-brand-orange pl-4 py-2 mt-4">
            <p className="text-gray-700 font-medium leading-relaxed text-sm">
              <strong>What to do instead:</strong> In these extreme cases, consider using the{" "}
              <Link
                href="/add-person-to-photo"
                className="text-brand-orange underline font-bold hover:text-brand-black transition-colors"
              >
                add person to photo
              </Link>{" "}
              tool with a separate, clearer reference photo of the same person. This lets you place
              their likeness from a better source into the scene, rather than asking AI to invent
              facial detail from almost nothing.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-gray-100 pt-10">
          <div className="space-y-4">
            <p className="text-gray-700 font-medium leading-relaxed">
              Ready to try restoration with identity-aware processing? BringBack&apos;s side-by-side
              comparison tool lets you inspect original vs. restored pixels at full zoom before
              downloading — so you can verify likeness before committing.
            </p>
            <Link
              href="/old-photo-restoration"
              className="inline-flex items-center gap-2 bg-brand-black text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange transition-colors shadow-md"
            >
              <span>Try the Restoration Tool</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </GuideLayout>
  )
}
