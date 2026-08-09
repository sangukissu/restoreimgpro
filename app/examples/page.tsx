import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Restoration examples — before and after family photos",
  description:
    "Real BringBack demo repairs: scratches, tears, water damage, fade, and blur. Each example notes the damage type and mode. Results vary by input.",
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Restoration examples | BringBack",
    description: "Before/after demo repairs for common family-photo damage.",
    url: "https://bringback.pro/examples",
    siteName: "BringBack",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BringBack restoration examples" }],
  },
  robots: { index: true, follow: true },
}

type Example = {
  id: string
  title: string
  damage: string
  mode: string
  note: string
  before: string
  after: string
}

/** Owned demo assets only — not presented as third-party customer stories. */
const EXAMPLES: Example[] = [
  {
    id: "tears",
    title: "Torn print",
    damage: "Tears / missing edge",
    mode: "Restore only (illustrative)",
    note: "AI fills gaps from surrounding texture. Large missing faces may look reconstructed.",
    before: "/ripped.webp",
    after: "/ripped-restored.webp",
  },
  {
    id: "scratches",
    title: "Scratched surface",
    damage: "Scratches & creases",
    mode: "Restore only (illustrative)",
    note: "Surface marks are reduced; fine facial identity still depends on what remains underneath.",
    before: "/scratched.webp",
    after: "/scratched-restored.webp",
  },
  {
    id: "water",
    title: "Water damage",
    damage: "Stains / water marks",
    mode: "Restore only (illustrative)",
    note: "Stain removal invents texture where the print is gone. Always compare to the original.",
    before: "/water-damaged.webp",
    after: "/water-damage-restored.webp",
  },
  {
    id: "fade",
    title: "Faded / yellowed",
    damage: "Fade & yellowing",
    mode: "Restore only (illustrative)",
    note: "Tonality recovery is not a guarantee of original darkroom color.",
    before: "/yellowandfaded.webp",
    after: "/yellowandfaded-restored.webp",
  },
  {
    id: "blur",
    title: "Soft / blurry face",
    damage: "Blur",
    mode: "Restore only (illustrative)",
    note: "Sharpening can reconstruct facial detail. Treat as plausible, not recovered forensic detail.",
    before: "/blurred.webp",
    after: "/blurred-restored.webp",
  },
  {
    id: "colorize",
    title: "Optional colorize",
    damage: "Black & white",
    mode: "Restore + colorize (illustrative)",
    note: "Color is an AI interpretation. Prefer restore-only when black-and-white is the memory.",
    before: "/childhood-memories-black-and-white.webp",
    after: "/childhood-memories-colorized.webp",
  },
]

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-20 max-w-[1320px] mx-auto px-4 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-3">
          Proof
        </p>
        <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight max-w-3xl leading-[1.05]">
          Before and after examples
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl font-medium leading-relaxed">
          These are product demos using owned sample images — not anonymous customer testimonials.
          Your results depend on scan quality and damage. Always compare side-by-side before you print
          or share.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/restore"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF4D00] text-white px-5 py-2.5 text-sm font-bold"
          >
            Restore your photo <ArrowRight size={16} />
          </Link>
          <Link
            href="/old-photo-restoration"
            className="inline-flex items-center gap-2 rounded-full bg-white border border-black/10 px-5 py-2.5 text-sm font-bold"
          >
            How restoration works
          </Link>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          {EXAMPLES.map((ex) => (
            <article
              key={ex.id}
              id={ex.id}
              className="bg-white rounded-[1.8rem] border border-black/5 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1 p-2">
                <figure>
                  <img
                    src={ex.before}
                    alt={`${ex.title} before`}
                    className="w-full h-48 sm:h-56 object-cover rounded-xl"
                  />
                  <figcaption className="text-center text-[10px] font-bold uppercase tracking-wide py-2 text-gray-500">
                    Before
                  </figcaption>
                </figure>
                <figure>
                  <img
                    src={ex.after}
                    alt={`${ex.title} after`}
                    className="w-full h-48 sm:h-56 object-cover rounded-xl"
                  />
                  <figcaption className="text-center text-[10px] font-bold uppercase tracking-wide py-2 text-gray-500">
                    After
                  </figcaption>
                </figure>
              </div>
              <div className="px-6 pb-6">
                <h2 className="text-xl font-extrabold tracking-tight">{ex.title}</h2>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-brand-orange">
                  {ex.damage} · {ex.mode}
                </p>
                <p className="mt-3 text-sm text-gray-600 font-medium leading-relaxed">{ex.note}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-sm text-gray-500 max-w-2xl">
          Want a private keepsake of many restorations? See{" "}
          <Link href="/family-memory-book" className="underline font-semibold text-brand-black">
            Family Memory Book
          </Link>
          . To reunite people across separate photos, see{" "}
          <Link href="/ai-family-portrait" className="underline font-semibold text-brand-black">
            AI family portrait
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  )
}
