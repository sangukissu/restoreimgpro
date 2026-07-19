/**
 * Single source of truth for public pricing, credit packs, and per-feature costs.
 * Checkout still loads live plan rows from the database; these values must stay
 * aligned with production payment_plans (4 / 20 / 60 credits).
 */

export const SITE_URL = "https://bringback.pro" as const

export type CreditFeatureKey =
  | "restore"
  | "colorize"
  | "denoise"
  | "familyPortrait"
  | "addPerson"
  | "removePerson"
  | "animate"
  | "nostalgicHug"
  | "memoryBook"

export const FEATURE_CREDIT_COSTS: Record<
  CreditFeatureKey,
  { credits: number; label: string; notes?: string }
> = {
  restore: { credits: 1, label: "Photo restoration" },
  colorize: { credits: 1, label: "Colorize black-and-white photo" },
  denoise: { credits: 1, label: "Denoise / degrain photo" },
  familyPortrait: { credits: 2, label: "Studio family portrait" },
  addPerson: { credits: 2, label: "Add person to photo" },
  removePerson: { credits: 2, label: "Remove person from photo" },
  animate: { credits: 10, label: "Photo animation" },
  nostalgicHug: {
    credits: 19,
    label: "Nostalgic hug video",
    notes: "Full hug/reunion video flow deducts 19 credits on start.",
  },
  memoryBook: {
    credits: 0,
    label: "Family Memory Book",
    notes: "Included with the Family pack; editing is free once unlocked.",
  },
}

export type PlanTier = "starter" | "pro" | "family"

export interface PublicPlan {
  tier: PlanTier
  /** Display name shown on marketing pages */
  name: string
  /** Short badge (e.g. Most Popular) */
  badge: string
  priceUsd: number
  priceDisplay: string
  credits: number
  description: string
  /** Honest feature equivalents for this credit amount */
  equivalents: string[]
  /** Whether this pack can fund at least one animation (10 credits) */
  includesAnimation: boolean
  /** Whether this pack can fund at least one nostalgic hug (19 credits) */
  includesHug: boolean
  includesMemoryBook: boolean
  ctaLabel: string
  schemaName: string
}

export const PUBLIC_PLANS: PublicPlan[] = [
  {
    tier: "starter",
    name: "Restoration Starter",
    badge: "One-time payment",
    priceUsd: 4.99,
    priceDisplay: "$4.99",
    credits: 4,
    description:
      "Low-risk way to restore a few important photos. Not enough credits for animation or hug video.",
    equivalents: [
      "Up to 4 photo restorations",
      "OR up to 2 studio family portraits ",
      "OR up to 2 add/remove person edits",
      "Does not include animation or hug video",
    ],
    includesAnimation: false,
    includesHug: false,
    includesMemoryBook: false,
    ctaLabel: "Start with restorations",
    schemaName: "BringBack Restoration Starter",
  },
  {
    tier: "pro",
    name: "Value Pack",
    badge: "Most Popular",
    priceUsd: 9.99,
    priceDisplay: "$9.99",
    credits: 20,
    description:
      "Enough credits for restorations plus animation or family reunions.",
    equivalents: [
      "Up to 20 photo restorations",
      "OR up to 2 photo animations",
      "OR up to 10 studio family portraits",
      "OR up to 10 add/remove person edits",
    ],
    includesAnimation: true,
    includesHug: true, // 20 credits covers one 19-credit hug run
    includesMemoryBook: false,
    ctaLabel: "Bring memories to life",
    schemaName: "BringBack Value Pack",
  },
  {
    tier: "family",
    name: "Family Pack",
    badge: "Best Value",
    priceUsd: 21.99,
    priceDisplay: "$21.99",
    credits: 60,
    description:
      "For albums, multi-person projects, and the private Family Memory Book.",
    equivalents: [
      "Up to 60 photo restorations",
      "OR up to 6 photo animations",
      "OR up to 30 studio family portraits",
      "OR up to 30 add/remove person edits",
      "Unlocks Family Memory Book editing",
    ],
    includesAnimation: true,
    includesHug: true,
    includesMemoryBook: true,
    ctaLabel: "Preserve family history",
    schemaName: "BringBack Family Pack",
  },
]

export const STARTER_PLAN = PUBLIC_PLANS[0]
export const PRO_PLAN = PUBLIC_PLANS[1]
export const FAMILY_PLAN = PUBLIC_PLANS[2]

/** Lowest public offer price for schema Offer blocks */
export const LOWEST_OFFER_PRICE = STARTER_PLAN.priceUsd.toFixed(2)

export function formatCredits(n: number): string {
  return n === 1 ? "1 credit" : `${n} credits`
}

export function featureCostLine(key: CreditFeatureKey): string {
  const f = FEATURE_CREDIT_COSTS[key]
  if (f.credits === 0) return `${f.label}: free to edit (Family pack)`
  return `${f.label}: ${formatCredits(f.credits)}`
}

export function planEquivalentsForSchema(): string[] {
  return PUBLIC_PLANS.flatMap((p) =>
    p.equivalents.map((e) => `${p.name} (${p.priceDisplay}, ${p.credits} credits): ${e}`)
  )
}

/** Schema.org Offer list derived from PUBLIC_PLANS */
export function schemaOffers() {
  return PUBLIC_PLANS.map((plan) => ({
    "@type": "Offer" as const,
    name: plan.schemaName,
    url: `${SITE_URL}/pricing`,
    priceCurrency: "USD",
    price: plan.priceUsd.toFixed(2),
    description: `${plan.credits} credits. ${plan.equivalents.join(" ")}`,
    eligibleRegion: {
      "@type": "Place" as const,
      name: "Worldwide",
    },
  }))
}
