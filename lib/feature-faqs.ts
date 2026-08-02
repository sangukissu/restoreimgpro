import { FEATURE_CREDIT_COSTS, STARTER_PLAN } from "@/lib/pricing"
import { LIMITATIONS_COPY, PRIVACY_COPY } from "@/lib/site-copy"

export interface FAQItem {
  question: string
  /** Plain string, or bullet points rendered as a list in the UI */
  answer: string | string[]
}

/** Flatten FAQ answers for JSON-LD / FAQPage schema text. */
export function faqAnswerText(answer: string | string[]): string {
  return Array.isArray(answer) ? answer.join(" ") : answer
}

export const ADD_PERSON_FAQS: FAQItem[] = [
  {
    question: "How many credits does the Add Person tool use?",
    answer: `Add Person uses ${FEATURE_CREDIT_COSTS.addPerson.credits} credits per successful run. Our Restoration Starter pack includes 4 credits, which covers up to 2 full add-person compositing runs.`,
  },
  {
    question: "How do I ensure the person's face looks natural and accurate?",
    answer:
      "For best results, upload a clear, front-facing reference photo with good lighting. Photos taken from a similar camera angle and lighting direction as the target group scene yield the most authentic results. If identity details feel slightly off, compare side-by-side in your dashboard before downloading.",
  },
  {
    question: "What is the difference between 'Add Person' and 'AI Family Portrait'?",
    answer:
      "'Add Person' takes an existing group photo you choose and inserts a specific individual into that exact scene. 'AI Family Portrait' generates an entirely new group scene from scratch using individual photos of separate family members.",
  },
  {
    question: "Can I add someone into a black-and-white historical photo?",
    answer:
      "Yes! If your target photo is black-and-white, BringBack automatically desaturates, matches contrast, and applies matching film grain to the reference photo so the addition blends seamlessly into the historical print.",
  },
  {
    question: "Is my uploaded family photo safe and private?",
    answer: PRIVACY_COPY.faq,
  },
  {
    question: "What happens if the reference photo quality is too low?",
    answer:
      "If the reference photo is extremely small, blurry, or heavily damaged, we recommend using our 'Old Photo Restoration' tool on the reference face first to sharpen features before running the Add Person tool.",
  },
]

export const REMOVE_PERSON_FAQS: FAQItem[] = [
  {
    question: "How many credits does the Remove Person tool cost?",
    answer: `Remove Person uses ${FEATURE_CREDIT_COSTS.removePerson.credits} credits per successful run. Your generated file remains stored securely in your private My Media dashboard.`,
  },
  {
    question: "Will the background look blurry or smudged after removal?",
    answer:
      "No. Unlike traditional brush erasers that leave smudges, BringBack uses context-aware generative inpainting. It analyzes the surrounding brick, foliage, or furniture patterns to reconstruct a realistic, sharp background in place of the removed figure.",
  },
  {
    question: "Can it remove people who are tightly hugging or touching someone I want to keep?",
    answer:
      "If the person being removed is heavily overlapping or holding hands with someone you want to keep, the AI will synthesize missing clothing or edges. For best results, choose photos where figures are reasonably distinct.",
  },
  {
    question: "Can I remove background objects like cars, signs, or clutter?",
    answer:
      "Yes! While optimized for human figures, the tool works exceptionally well for removing distracting background items like telephone poles, trash cans, or stray furniture.",
  },
  {
    question: "Is my original photo preserved?",
    answer:
      "Always. BringBack never overwrites your original uploaded image. The cleaned version is saved as a new file in your dashboard alongside the original.",
  },
  {
    question: "What happens to my uploaded family photos?",
    answer: PRIVACY_COPY.faq,
  },
]

export const COLORIZE_FAQS: FAQItem[] = [
  {
    question: "How does AI photo colorization actually work?",
    answer:
      "Our AI analyzes the grayscale values, textures, and context in your black and white photo to predict realistic colors.",
  },
  {
    question: "Are the colors historically accurate?",
    answer:
      "Yes! We analyze clothing styles, architectural elements, and cultural context to apply colors authentic to the time period.",
  },
  {
    question: "What types of black and white photos work best?",
    answer:
      "We can colorize family portraits, wedding photos, military pictures, childhood photos, historical images, and vintage postcards.",
  },
  {
    question: "How much does photo colorization cost?",
    answer:
      "We offer 4 high-quality photo colorizations for just $4.99 — no subscription required.",
  },
  {
    question: "Will colorization damage or change my original photo?",
    answer:
      "Not at all! We work with a copy of your photo, leaving the original black and white image completely unchanged.",
  },
  {
    question: "Is my family history safe during processing?",
    answer: PRIVACY_COPY.faq,
  },
]

export const DENOISE_FAQS: FAQItem[] = [
  {
    question: "How does AI photo denoising work?",
    answer:
      "Our AI analyzes the patterns of noise in your photo and distinguishes between unwanted grain and important image details.",
  },
  {
    question: "What types of noise can BringBack remove?",
    answer:
      "We can remove high-ISO grain, color noise, digital artifacts, compression artifacts, and low-light noise.",
  },
  {
    question: "Will denoising make my photos look plastic or fake?",
    answer:
      "No! Our AI is specifically designed to maintain natural texture and detail while removing noise.",
  },
  {
    question: "How much does photo denoising cost?",
    answer:
      "We offer 4 high-quality photo denoising cleanups for just $4.99 — no subscription required.",
  },
  {
    question: "Does BringBack preserve fine details when denoising?",
    answer:
      "Yes. Our AI is trained to remove noise while intelligently retaining key details like textures and edges.",
  },
  {
    question: "Is my uploaded photo secure?",
    answer: PRIVACY_COPY.faq,
  },
]

export const FAMILY_PORTRAIT_FAQS: FAQItem[] = [
  {
    question: "Can I create a family photo from individual photos?",
    answer:
      "Yes. Upload up to 8 reference photos and BringBack generates one new group image with a shared setting, lighting direction, and composition. It can help when relatives live far apart, generations never met, or each person was photographed at a different time.",
  },
  {
    question: "Will the final photo look fake or like a collage?",
    answer:
      "The result is generated as one new scene rather than assembled from pasted cutouts. This can make lighting and perspective more consistent, but the quality still depends on the references and every face should be reviewed.",
  },
  {
    question: "Does the AI change what my family members look like?",
    answer: LIMITATIONS_COPY.faces,
  },
  {
    question: "What are the best photos to upload?",
    answer: [
      "Use JPG, PNG, or WebP images under 20MB each.",
      "Choose clear, well-lit face photos where the person is looking toward the camera.",
      "Avoid heavy shadows, sunglasses, covered faces, or very tiny faces in a large group photo.",
      "For old, torn, faded, or blurry images, run Old Photo Restoration first and upload the restored version.",
    ],
  },
  {
    question: "How many people can I combine into one group photo?",
    answer:
      "You can upload up to 8 reference photos, then specify a group of up to 12 people and up to 5 pets across those references. A single reference may contain more than one subject. Larger groups are more demanding, so use clear faces, choose 4:3 or 16:9, and review every identity carefully.",
  },
  {
    question: "Can I include my dog, cat, or another pet in the family portrait?",
    answer:
      "Yes. Upload clear pet photos with the family references, then set Number of Pets from 1 to 5 before generating. Keep the eyes, ears, muzzle, and distinctive coat markings visible, and use a wider canvas for a large mixed group. Because the result is newly generated, check the pet's markings, eye color, size, paws, and collar against the source photo.",
  },
  {
    question: "Can I combine black-and-white photos with color photos?",
    answer:
      "Yes. You can combine black-and-white and color photos in one portrait. If the older photo is damaged, faded, scratched, or blurry, restoring it first usually gives the generator a clearer likeness reference. The final color treatment remains an AI interpretation.",
  },
  {
    question: "Can I add a deceased person to a family photo?",
    answer:
      "Yes. A clear portrait of a loved one who has passed can be used with current family references to create a memorial keepsake. The result is a new AI-generated image, not a historical photograph.",
  },
  {
    question: "Can I create a generational portrait with ancestors?",
    answer:
      "Yes. You can combine a grandparent or ancestor from an older portrait with children or grandchildren photographed today. Restore severe damage first and check age, facial details, pose, and scale in the generated result.",
  },
  {
    question: "Can I choose the background or aspect ratio?",
    answer:
      "Yes. BringBack supports 1:1, 3:4, 4:3, and 16:9 canvases plus 24 curated themes across studio, formal, cozy, outdoor, lifestyle, retro, holiday, royal, and fine-art categories. You can also preserve the clothing in the references or let the chosen theme coordinate it.",
  },
  {
    question: "Does this replace Old Photo Restoration?",
    answer:
      "No. Family Portrait is for composing people into one new image. Old Photo Restoration is for repairing scratches, tears, fading, blur, and damage. If your source image is old or low quality, restore it first, then use it here.",
  },
  {
    question: "Is BringBack a free family portrait creator?",
    answer: `BringBack is a pay-once credit product, not a free unlimited generator. Family portrait costs ${FEATURE_CREDIT_COSTS.familyPortrait.credits} credits. The ${STARTER_PLAN.priceDisplay} ${STARTER_PLAN.name} includes ${STARTER_PLAN.credits} credits (enough for up to ${Math.floor(STARTER_PLAN.credits / FEATURE_CREDIT_COSTS.familyPortrait.credits)} portraits). Credits never expire.`,
  },
  {
    question: "What happens to my photos?",
    answer: PRIVACY_COPY.faq,
  },
  {
    question: "When should I not use this tool?",
    answer:
      "Skip it for legal or forensic identification, when you only have tiny or heavily damaged face crops, or when a simple side-by-side collage is enough. For inserting someone into an existing scene (not a new studio portrait), use Add Person instead.",
  },
  {
    question: "How is this different from Photoshop or a manual artist?",
    answer: `A manual artist edits individual pixels and can make detailed, directed corrections. BringBack instead generates a new themed family portrait automatically for ${FEATURE_CREDIT_COSTS.familyPortrait.credits} credits. Choose manual work when exact placement or historically precise details matter.`,
  },
  {
    question: "Is this better than free apps that merge photos?",
    answer:
      "Some tools make collages, while others generate a new scene. BringBack is built around identity references, explicit people and pet counts, 24 curated portrait themes, clothing control, four canvas ratios, and a My Media account where you can review and delete results.",
  },
]

export const MEMORY_BOOK_FAQS: FAQItem[] = [
  {
    question: "Does creating or editing a Memory Book cost credits?",
    answer:
      "No. Editing, organizing, and typing captions inside your Memory Book does not spend generation credits. Access is included with the Family plan. Restoring, colorizing, or animating new photos still uses regular feature credit costs.",
  },
  {
    question: "Is my Memory Book private?",
    answer:
      "Yes. Your Memory Book is 100% private by default and visible only to you. If you choose to share a keepsake link with relatives, you can generate a private share link or revoke it anytime.",
  },
  {
    question: "How is Memory Book different from 'My Media'?",
    answer:
      "'My Media' is your raw media vault storing individual restored images and videos. 'Memory Book' allows you to group those media assets into structured albums with family stories, dates, locations, and lineage context.",
  },
  {
    question: "Are original photos separated from AI restorations?",
    answer:
      "Yes. We believe in preserving historical truth. Your raw scanned originals are kept distinct from AI-restored versions so viewers can always compare original film texture against enhanced versions.",
  },
  {
    question: "How are my files retained?",
    answer: PRIVACY_COPY.faq,
  },
  {
    question: "Can I export or print my Memory Book?",
    answer:
      "You can download high-resolution versions of all original and restored photos in your library at any time to print locally or compile into physical print albums.",
  },
]
