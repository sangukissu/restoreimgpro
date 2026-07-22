import { FEATURE_CREDIT_COSTS } from "@/lib/pricing"
import { PRIVACY_COPY } from "@/lib/site-copy"

export interface FAQItem {
  question: string
  answer: string
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
