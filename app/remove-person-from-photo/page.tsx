import {
  ProductFeaturePage,
  productMetadata,
  type ProductFeaturePageProps,
} from "@/components/pages/product-feature-page"
import { DASHBOARD_CTA, PAGE_H1, PRIVACY_COPY } from "@/lib/site-copy"
import { FEATURE_CREDIT_COSTS } from "@/lib/pricing"

const page: ProductFeaturePageProps = {
  slug: "/remove-person-from-photo",
  title: "Remove a Person from a Photo | BringBack",
  description:
    "Remove an unwanted person from a family photo and rebuild the nearby background. Uses 2 credits. Review edges and identity carefully.",
  h1: PAGE_H1.removePerson,
  subhead:
    "Erase a photobomber or unwanted figure and reconstruct the surrounding background. Best when the person is not heavily overlapping faces you want to keep.",
  ctaLabel: "Open Remove Person tool",
  ctaHref: DASHBOARD_CTA.removePerson,
  creditKey: "removePerson",
  starterCanRun: true,
  beforeSrc: "/remove-person.webp",
  afterSrc: "/family.webp",
  beforeLabel: "Example input",
  afterLabel: "Cleaned scene (illustrative)",
  timeEstimate: "Usually under a minute",
  inputs: [
    "A photo where the person to remove is clearly separable",
    "Enough surrounding background for the AI to sample texture",
    "JPG or PNG from scan or camera",
  ],
  outputs: [
    "A still image with the selected person removed",
    "Reconstructed background in the cleared area",
    "Dashboard comparison and My Media download",
  ],
  failureCases: [
    "People tightly overlapping the faces you want to keep",
    "Complex patterned backgrounds (busy wallpaper, crowds)",
    "Very low resolution or heavy compression",
    "Large regions with no nearby texture to copy",
  ],
  whatAiMayChange: [
    "Background texture and geometry behind the removed person",
    "Edges of clothing or objects that were touching the person",
    "Fine detail that must be invented when nothing remains underneath",
  ],
  whenNotToUse: [
    "When you need a forensically unaltered original",
    "When removal would require inventing large missing architecture or people",
    "For legal, news, or evidentiary editing",
    "When a simple crop would solve the problem without AI",
  ],
  nextSteps: [
    { label: "Restore damage first", href: "/old-photo-restoration" },
    { label: "Add someone to a photo", href: "/add-person-to-photo" },
    { label: "Family portrait", href: "/ai-family-portrait" },
    { label: "Pricing", href: "/pricing" },
  ],
  faqs: [
    {
      q: "How many credits does remove person use?",
      a: `Remove person costs ${FEATURE_CREDIT_COSTS.removePerson.credits} credits per successful run.`,
    },
    {
      q: "Can it remove objects too?",
      a: "The tool is optimized for people. Small objects sometimes work; large structural edits often fail or look artificial.",
    },
    {
      q: "Will credits be refunded if it fails?",
      a: "Failed generations that never produce a usable result are handled by our refund/failure path where the system can detect failure. If something looks wrong after download, contact support@bringback.pro with the job details.",
    },
    {
      q: "Privacy?",
      a: PRIVACY_COPY.faq,
    },
  ],
}

export const metadata = productMetadata(page)

export default function RemovePersonFromPhotoPage() {
  return <ProductFeaturePage {...page} />
}
