import {
  ProductFeaturePage,
  productMetadata,
  type ProductFeaturePageProps,
} from "@/components/pages/product-feature-page"
import { DASHBOARD_CTA, PAGE_H1, PRIVACY_COPY } from "@/lib/site-copy"
import { FEATURE_CREDIT_COSTS } from "@/lib/pricing"

const page: ProductFeaturePageProps = {
  slug: "/add-person-to-photo",
  title: "Add a Person to a Family Photo | BringBack",
  description:
    "Add a loved one or missing family member into a specific photo. Uses 2 credits. Compare the result to the original and review identity carefully.",
  h1: PAGE_H1.addPerson,
  subhead:
    "Place someone into a family photo when you have a clear face reference and a suitable target scene. Always review likeness before you download or share.",
  ctaLabel: "Open Add Person tool",
  ctaHref: DASHBOARD_CTA.addPerson,
  creditKey: "addPerson",
  starterCanRun: true,
  beforeSrc: "/add-person.webp",
  afterSrc: "/family-portrait.png",
  beforeLabel: "Example workflow",
  afterLabel: "Composited result (illustrative)",
  timeEstimate: "Usually under a minute",
  inputs: [
    "A target family photo with space for another person",
    "A clear, front-facing reference photo of the person to add",
    "Similar lighting and era when possible (helps identity)",
    "JPG or PNG uploads from a scan or phone photo",
  ],
  outputs: [
    "A single still image with the person composited into the scene",
    "Side-by-side comparison in the dashboard",
    "Downloadable result stored in My Media until you delete it",
  ],
  failureCases: [
    "Very small, blurry, or side-profile reference faces",
    "Heavy occlusion (hats, hands, dense groups)",
    "Strong style mismatch between modern and historical photos",
    "Scenes with no natural place for a person to stand",
  ],
  whatAiMayChange: [
    "Clothing fit, body scale, and pose to match the scene",
    "Lighting and color on the inserted person",
    "Facial detail when the reference is low quality (reconstruction, not recovery)",
    "Background edges near the insertion area",
  ],
  whenNotToUse: [
    "When you need a forensically accurate historical record",
    "When you only have a tiny or heavily damaged face crop",
    "When surviving relatives would find a composite distressing without consent",
    "For legal, identification, or evidentiary use",
  ],
  nextSteps: [
    { label: "Restore damaged photos first", href: "/old-photo-restoration" },
    { label: "Full family portrait from separate photos", href: "/ai-family-portrait" },
    { label: "Save stories in Memory Book", href: "/family-memory-book" },
    { label: "Pricing & credits", href: "/pricing" },
  ],
  faqs: [
    {
      q: "How many credits does add person use?",
      a: `Add person costs ${FEATURE_CREDIT_COSTS.addPerson.credits} credits. The Restoration Starter pack has 4 credits, so it can cover up to two add-person runs (or four single-credit restorations).`,
    },
    {
      q: "Will the person look exactly like my loved one?",
      a: "Likeness depends on reference quality. Clear, well-lit faces work best. Missing detail may be reconstructed. Always compare to the original photos; if identity feels wrong, do not force a download.",
    },
    {
      q: "Is this the same as AI family portrait?",
      a: "Related but different. Family portrait builds a new group scene from separate photos. Add person inserts someone into an existing photo you choose.",
    },
    {
      q: "What happens to my uploads?",
      a: PRIVACY_COPY.faq,
    },
  ],
}

export const metadata = productMetadata(page)

export default function AddPersonToPhotoPage() {
  return <ProductFeaturePage {...page} />
}
