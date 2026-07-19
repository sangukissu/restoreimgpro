import {
  ProductFeaturePage,
  productMetadata,
  type ProductFeaturePageProps,
} from "@/components/pages/product-feature-page"
import { DASHBOARD_CTA, PAGE_H1, PRIVACY_COPY } from "@/lib/site-copy"

const page: ProductFeaturePageProps = {
  slug: "/family-memory-book",
  title: "Family Memory Book — Private Photo Keepsake | BringBack",
  description:
    "Turn restored family photos, names, dates, and stories into a private shareable keepsake. Included with the Family pack. Originals stay distinct from restored versions.",
  h1: PAGE_H1.memoryBook,
  subhead:
    "A private place to keep restored photos with captions, people, and stories—so the album is not just pixels, but context the next generation can understand.",
  ctaLabel: "Open Memory Book",
  ctaHref: DASHBOARD_CTA.memoryBook,
  creditKey: "memoryBook",
  starterCanRun: false,
  beforeSrc: "/family-history.png",
  afterSrc: "/family-photo1.png",
  beforeLabel: "Your restored photos",
  afterLabel: "Stories + names together",
  timeEstimate: "Edit at your own pace",
  inputs: [
    "Restored or original photos from your BringBack library",
    "Names, dates, places, and short captions you type",
    "Optional uncertainty notes (e.g. “approx. 1952”)",
  ],
  outputs: [
    "A private digital keepsake you control",
    "Pages that keep originals and restored versions distinguishable",
    "Share options you can revoke (when you choose to share)",
  ],
  failureCases: [
    "Empty drafts abandoned without photos",
    "Missing captions that leave future relatives guessing",
    "Overwriting family stories with AI-generated text you have not verified",
  ],
  whatAiMayChange: [
    "Memory Book itself is primarily your content—AI does not invent family facts",
    "Any linked restorations still carry the usual AI reconstruction limits",
  ],
  whenNotToUse: [
    "If you only need a one-off download (use My Media instead)",
    "If you want a public social feed—this is a private keepsake, not a social network",
  ],
  nextSteps: [
    { label: "Restore photos", href: "/old-photo-restoration" },
    { label: "Family portrait", href: "/ai-family-portrait" },
    { label: "Add person", href: "/add-person-to-photo" },
    { label: "Family pack pricing", href: "/pricing" },
  ],
  faqs: [
    {
      q: "Does Memory Book cost credits?",
      a: "Editing the Memory Book does not spend generation credits. Access is included with the Family pack. Restoring or animating photos used inside the book still uses the normal feature credit costs.",
    },
    {
      q: "Is it private?",
      a: "Yes. Keepsakes are private by default. Share links are optional and can be revoked. This is intentional long-term storage you control—not a 30-minute auto-delete workspace.",
    },
    {
      q: "How is this different from My Media?",
      a: "My Media stores individual results. Memory Book organizes photos into a story with names, captions, and structure for the family archive.",
    },
    {
      q: "How is media retained?",
      a: PRIVACY_COPY.faq,
    },
  ],
}

export const metadata = productMetadata(page)

export default function FamilyMemoryBookPage() {
  return <ProductFeaturePage {...page} />
}
