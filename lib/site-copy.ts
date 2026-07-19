/**
 * Positioning and honest product copy used across marketing pages.
 * Keep claims factual; do not invent user counts, ratings, or retention promises.
 */

export const BRAND = {
  name: "BringBack",
  legalName: "BringBack",
  domain: "bringback.pro",
  url: "https://bringback.pro",
  supportEmail: "support@bringback.pro",
  twitter: "https://x.com/AINotSoSmart",
  trustpilot: "https://www.trustpilot.com/review/bringback.pro",
} as const

export const POSITIONING = {
  category:
    "The family-photo preservation workspace: restore damage, reunite people, and pass the story on.",
  publicPromise: "Restore, reunite, and preserve the family photos that matter.",
  supportingPromise:
    "Repair old photos, bring family members into one picture, add subtle motion, and keep the story together in a private family keepsake.",
} as const

export const PAGE_H1 = {
  home: "Restore, reunite, and preserve your family photos.",
  restoration: "Repair old photos while keeping their original character.",
  animation: "Add a subtle smile or movement to an old photo.",
  familyPortrait: "Bring separate family photos into one natural portrait.",
  addPerson: "Add someone you love to a family photo.",
  removePerson: "Remove an unwanted person and rebuild the background.",
  memoryBook: "Turn restored photos and family stories into a private keepsake.",
  colorize: "Colorize a black-and-white photo only when you choose to.",
  denoise: "Remove noise and grain from old or scanned photos.",
  nostalgicHug: "Create a short AI hug or reunion video from two photos.",
} as const

export const DASHBOARD_CTA = {
  restore: "/dashboard/restore",
  animate: "/dashboard/animate",
  familyPortrait: "/dashboard/family-portrait",
  addPerson: "/dashboard/add-person",
  removePerson: "/dashboard/remove-person",
  memoryBook: "/dashboard/memory-book",
  nostalgicHug: "/dashboard/nostalgic-hug",
  login: "/login",
  pricing: "/pricing",
} as const

/** Honest privacy language — do not promise 30-minute deletion until the full pipeline meets it. */
export const PRIVACY_COPY = {
  short:
    "Photos are processed securely for the feature you request. Generated files stay in your account until you delete them. Memory Book keepsakes are stored only when you explicitly save them. We do not use your family photos to train general-purpose AI models.",
  faq:
    "We process uploads to deliver the feature you requested (restore, animate, reunite, etc.). Generated media is stored in your account so you can download it later; you can delete media anytime from My Media. Family Memory Book content is stored only when you explicitly create a keepsake. Third-party processors (hosting, payments, AI inference) handle data only as needed to run the service. See our Privacy Policy for processors and retention details.",
  noZeroRetention:
    "We do not claim zero retention. Temporary processing and generated outputs have different lifecycles; Memory Book is intentionally persistent while you keep it.",
} as const

export const LIMITATIONS_COPY = {
  faces:
    "When facial detail is missing, damaged, or very low resolution, AI may reconstruct plausible features rather than recover the exact original face. Always compare the result to the original before sharing or printing.",
  colorize:
    "AI color is an interpretation, not historical proof of original colors. Prefer restore-only when you want to keep black-and-white or sepia character.",
  identity:
    "If a result does not look like the person you remember, do not force a download—adjust inputs, try again, or keep the original.",
} as const

/** Feature URLs being consolidated away (301 targets live in next.config). */
export const CONSOLIDATED_FEATURE_SLUGS = [
  "individual-photos-into-group",
  "add-deceased-loved-one-to-photo",
  "black-and-white-composite",
  "father-and-child-portrait",
  "merge-images",
  "ai-image-combiner",
  "photo-joiner",
  "add-person-to-photo",
] as const

export const CONSOLIDATED_APP_SLUGS = [
  "back-to-life-photo-app",
  "make-pictures-smile",
  "animate-old-photos",
  "sharpen-wedding-photos",
] as const
