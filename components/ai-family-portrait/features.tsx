import {
  Frame,
  Lock,
  ScanFace,
  Wallet,
} from "lucide-react"
import { FEATURE_CREDIT_COSTS, STARTER_PLAN } from "@/lib/pricing"
import { PRIVACY_COPY } from "@/lib/site-copy"
import { FAMILY_PORTRAIT_THEMES } from "@/lib/family-portrait/themes"

const THEME_COUNT = FAMILY_PORTRAIT_THEMES.length
const PORTRAIT_CREDITS = FEATURE_CREDIT_COSTS.familyPortrait.credits
const STARTER_PORTRAITS = Math.floor(STARTER_PLAN.credits / PORTRAIT_CREDITS)

const REASONS = [
  {
    icon: ScanFace,
    badge: "Likeness-first",
    title: "One composed scene — not a pasted collage",
    description:
      "BringBack builds true AI family photos from your references — one shared scene with unified lighting, color, and perspective. Faces stay recognizable, and the result feels like a real family sitting together, not cutouts on a background.",
  },
  {
    icon: Frame,
    badge: "Real controls",
    title: `${THEME_COUNT} styles & flexible canvas ratios`,
    description:
      "Pick a tested studio, outdoor, lifestyle, seasonal, formal, retro, royal, or fine-art direction. Preserve clothing or match it to the theme, set people and pet counts, and choose 1:1, 3:4, 4:3, or 16:9 for the group.",
  },
  {
    icon: Wallet,
    badge: "Fair pricing",
    title: "Studio-session quality without the session cost",
    description: `A multi-subject photoshoot can run hundreds of dollars. Family portrait costs ${PORTRAIT_CREDITS} credits — the ${STARTER_PLAN.priceDisplay} ${STARTER_PLAN.name} includes ${STARTER_PLAN.credits} credits (up to ${STARTER_PORTRAITS} portraits). Pay once; credits never expire.`,
  },
  {
    icon: Lock,
    badge: "Your media",
    title: "Private family photos, under your control",
    description: PRIVACY_COPY.short,
  },
]

export default function FamilyPortraitUseCases() {
  return (
    <section id="why-bringback" className="w-full bg-brand-bg px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-16 flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-brand-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-black/10 sm:text-sm">
              <span className="text-brand-orange">//</span> The Reason{" "}
              <span className="text-brand-orange">//</span>
            </div>

            <h2 className="text-[2.25rem] font-[850] leading-[1.05] tracking-tighter text-brand-black sm:text-[3.25rem] sm:leading-[0.95] lg:text-[3.75rem] xl:text-[4rem]">
              Why choose BringBack for
              <br />
              <span className="text-gray-400">AI family photos.</span>
            </h2>
          </div>

          <div className="max-w-sm">
            <p className="text-lg font-medium leading-relaxed text-gray-600">
              Not another generic merge app. True group composition, real creative controls,
              transparent credits, and private results you control in My Media.
            </p>
          </div>
        </div>

        <div className="rounded-[2.2rem] bg-brand-surface p-2 sm:p-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {REASONS.map((item) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="group flex flex-col justify-between rounded-[1.8rem] border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-gray-200 hover:shadow-md sm:p-9"
                >
                  <div>
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange shadow-sm transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-black">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-extrabold leading-tight text-brand-black sm:text-2xl">
                      {item.title}
                    </h3>
                  </div>

                  <div className="relative z-10 mt-4 border-t border-gray-100 pt-4">
                    <p className="text-sm font-medium leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
