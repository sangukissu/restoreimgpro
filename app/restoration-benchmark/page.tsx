import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"
import { SiteBreadcrumb } from "@/components/seo/site-breadcrumb"
import { ProductCrossSell } from "@/components/seo/product-cross-sell"

export const metadata: Metadata = {
  title: "Photo Restoration Quality Benchmark: Identity Drift & Scoring Rubric | BringBack",
  description:
    "BringBack’s restoration quality rubric for identity drift, damage repair, texture, unwanted colorization, and artifacts, with owned demos, examples, limitations, and a changelog.",
  alternates: { canonical: "/restoration-benchmark" },
  openGraph: {
    title: "Restoration quality benchmark | BringBack",
    description:
      "How we score BringBack restoration outputs: identity drift, damage repair, texture, colorization, artifacts—with demo cases.",
    url: "https://bringback.pro/restoration-benchmark",
    type: "website",
  },
  robots: { index: true, follow: true },
}

const DEMO_ROWS = [
  {
    id: "tears",
    input: "Torn print (demo asset)",
    mode: "Restore only",
    before: "/ripped.webp",
    after: "/ripped-restored.webp",
    notes: {
      identity: "Face mostly intact; edge reconstruction invents texture outside the tear.",
      damage: "Tear line reduced; large missing paper is filled, not recovered.",
      texture: "Paper grain partially preserved.",
      color: "No forced colorization.",
      artifacts: "Possible soft blend at fill boundaries.",
    },
  },
  {
    id: "water",
    input: "Water-stained print (demo asset)",
    mode: "Restore only",
    before: "/water-damaged.webp",
    after: "/water-damage-restored.webp",
    notes: {
      identity: "Depends on how much face remains under stain.",
      damage: "Stain area reconstructed from context.",
      texture: "May smooth heavily damaged patches.",
      color: "No forced colorization.",
      artifacts: "Invented detail in wiped regions.",
    },
  },
  {
    id: "fade",
    input: "Yellowed / faded print (demo asset)",
    mode: "Restore only",
    before: "/yellowandfaded.webp",
    after: "/yellowandfaded-restored.webp",
    notes: {
      identity: "Usually stable when structure remains.",
      damage: "Tonality recovery; not original darkroom truth.",
      texture: "Grain may reduce with aggressive cleanup.",
      color: "No forced colorization.",
      artifacts: "Possible contrast shift.",
    },
  },
  {
    id: "colorize",
    input: "B&W childhood photo (demo asset)",
    mode: "Restore + colorize",
    before: "/childhood-memories-black-and-white.webp",
    after: "/childhood-memories-colorized.webp",
    notes: {
      identity: "Color can change perceived age/look of skin and clothes.",
      damage: "N/A — colorization focus.",
      texture: "May look smoother than monochrome original.",
      color: "Interpretation only — not historical proof.",
      artifacts: "Color bleed possible on edges.",
    },
  },
]

export default function RestorationBenchmarkPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "BringBack photo restoration quality benchmark",
    datePublished: "2026-07-19",
    dateModified: "2026-08-12",
    author: { "@type": "Organization", name: "BringBack", url: "https://bringback.pro" },
    publisher: { "@type": "Organization", name: "BringBack", url: "https://bringback.pro" },
    description:
      "Scoring rubric and owned demos for AI photo restoration: identity drift, damage repair, texture, unwanted colorization, artifacts.",
    mainEntityOfPage: "https://bringback.pro/restoration-benchmark",
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-28 pb-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="max-w-[900px] mx-auto px-4 sm:px-8">
          <SiteBreadcrumb
            items={[
              { name: "Guides", href: "/guides" },
              { name: "Restoration benchmark" },
            ]}
          />
          <h1 className="text-4xl sm:text-5xl font-[850] tracking-tight leading-[1.05]">
            Photo restoration quality benchmark
          </h1>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Published 19 July 2026 · Last updated 12 August 2026
          </p>
          <p className="mt-6 text-lg text-gray-600 font-medium leading-relaxed">
            This page explains how we evaluate BringBack restoration demos made from images we own.
            Research standards for competitor comparisons are documented separately in our{" "}
            <Link href="/methodology" className="underline font-semibold text-brand-black">
              methodology
            </Link>
            . The demo rows do not compare multiple vendors and cannot establish historical color accuracy.
          </p>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-extrabold">Quality dimension glossary</h2>
            <dl className="space-y-4 text-gray-700 font-medium">
              <div>
                <dt className="font-extrabold text-brand-black">Identity drift</dt>
                <dd>
                  The restored face no longer matches the person in the input—for example, age,
                  expression, eye shape, or jawline changes. Compare the result with the source before printing or sharing.
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-brand-black">Damage repair</dt>
                <dd>
                  The extent to which scratches, tears, stains, and fading are reduced. Content added
                  to a missing area is a plausible reconstruction, not recovered evidence.
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-brand-black">Texture preservation</dt>
                <dd>
                  Whether useful paper or film texture remains without turning skin into an unnaturally smooth surface.
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-brand-black">Unwanted colorization</dt>
                <dd>
                  Whether restore-only adds color that was not requested. Colorize mode is an interpretation,
                  not proof of the original dyes or scene colors.
                </dd>
              </div>
              <div>
                <dt className="font-extrabold text-brand-black">Artifacts</dt>
                <dd>
                  Warping, double edges, mushy regions, color bleed, seam lines at fill boundaries.
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-extrabold">Evaluation dimensions (rubric)</h2>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700 font-medium leading-relaxed">
              <li>
                <strong>Identity drift</strong> — Does the person still look like the input face, or
                did the model invent a different one?
              </li>
              <li>
                <strong>Damage repair</strong> — Scratches, tears, stains, fade: improved, partial,
                or failed?
              </li>
              <li>
                <strong>Texture preservation</strong> — Paper grain / film character kept vs plastic
                smoothing.
              </li>
              <li>
                <strong>Unwanted colorization</strong> — Did restore-only keep monochrome/sepia, or
                bleed color?
              </li>
              <li>
                <strong>Visible artifacts</strong> — Warping, double edges, mushy skin, color bleed.
              </li>
            </ol>
          </section>

          <section className="mt-12 space-y-4">
            <h2 className="text-2xl font-extrabold">Sample &amp; method</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 font-medium">
              <li>Demo set: owned product samples representing common family-print damage.</li>
              <li>Modes tested: restore-only and restore+colorize where relevant.</li>
              <li>Every row shows input and output, including known failure modes in notes.</li>
              <li>Opinion (what “looks good”) is separated from observable notes above.</li>
              <li>
                When the production model/pipeline changes, we will date the update on this page
                rather than silently rewriting scores.
              </li>
            </ul>
            <p className="text-gray-600 font-medium leading-relaxed">
              We do <strong>not</strong> publish fabricated multi-competitor lab tests. Public
              pricing and workflow differences vs tools like Remini or MyHeritage are discussed on
              comparison pages without invented sample sizes.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-extrabold mb-6">Demo cases (owned assets)</h2>
            <div className="space-y-10">
              {DEMO_ROWS.map((row) => (
                <article
                  key={row.id}
                  className="bg-white rounded-3xl border border-black/5 p-4 sm:p-6 shadow-sm"
                >
                  <h3 className="text-xl font-extrabold">{row.input}</h3>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-orange mt-1">
                    Mode: {row.mode}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <figure>
                      <img
                        src={row.before}
                        alt={`${row.id} before`}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl"
                      />
                      <figcaption className="text-center text-[10px] font-bold uppercase py-2 text-gray-500">
                        Input
                      </figcaption>
                    </figure>
                    <figure>
                      <img
                        src={row.after}
                        alt={`${row.id} after`}
                        className="w-full h-40 sm:h-48 object-cover rounded-xl"
                      />
                      <figcaption className="text-center text-[10px] font-bold uppercase py-2 text-gray-500">
                        Result
                      </figcaption>
                    </figure>
                  </div>
                  <dl className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                    <div>
                      <dt className="font-bold text-brand-black">Identity</dt>
                      <dd className="font-medium">{row.notes.identity}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-brand-black">Damage repair</dt>
                      <dd className="font-medium">{row.notes.damage}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-brand-black">Texture</dt>
                      <dd className="font-medium">{row.notes.texture}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-brand-black">Colorization</dt>
                      <dd className="font-medium">{row.notes.color}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-bold text-brand-black">Artifacts</dt>
                      <dd className="font-medium">{row.notes.artifacts}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 space-y-3">
            <h2 className="text-2xl font-extrabold">Limitations — what this page is not</h2>
            <ul className="list-disc pl-6 text-gray-700 font-medium space-y-2">
              <li>Not a promise that every family photo will match these demos</li>
              <li>Not forensic recovery of missing faces</li>
              <li>Not proof of original film dye colors</li>
              <li>Not a substitute for a paper conservator on unique physical objects</li>
              <li>Not a controlled comparison of multiple restoration products</li>
              <li>Not the place for full competitor pricing/privacy editorial rules (see methodology)</li>
            </ul>
            <p className="text-gray-600 font-medium pt-4">
              Related:{" "}
              <Link href="/methodology" className="underline font-semibold text-brand-black">
                Methodology (claims &amp; research protocol)
              </Link>
              ,{" "}
              <Link href="/guides/restore-only-vs-colorize" className="underline font-semibold text-brand-black">
                Restore-only vs colorize
              </Link>
              ,{" "}
              <Link href="/examples" className="underline font-semibold text-brand-black">
                Examples
              </Link>
              ,{" "}
              <Link href="/old-photo-restoration" className="underline font-semibold text-brand-black">
                Old photo restoration
              </Link>
              .
            </p>
          </section>
        </div>
        <ProductCrossSell excludeHref="/restoration-benchmark" />
      </main>
      <Footer />
    </div>
  )
}
