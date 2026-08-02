/**
 * Single source of truth for Family Portrait How It Works (UI + HowTo JSON-LD).
 * Keep name/text identical to what users see on /ai-family-portrait#how-it-works.
 */
export const FAMILY_PORTRAIT_HOW_TO_STEPS = [
  {
    number: "01",
    name: "Upload individual portraits",
    text: "Add up to 8 clear photos from phones, scans, or family albums, then crop each one. Front-facing faces with visible features give the strongest likeness.",
    note: "JPG, PNG or WebP · up to 8 references",
  },
  {
    number: "02",
    name: "Choose style and clothing",
    text: "Pick from 24 curated portrait themes, then preserve the clothing from the source photos or coordinate it with the selected setting.",
    note: "Studio, outdoor, lifestyle and more",
  },
  {
    number: "03",
    name: "Set the group and canvas",
    text: "Confirm the number of people and pets, then choose a 1:1, 3:4, 4:3, or 16:9 canvas that gives the group enough room.",
    note: "Explicit people and pet counts",
  },
  {
    number: "04",
    name: "Generate, review, and download",
    text: "BringBack generates one new scene with shared lighting and perspective. Compare every face and detail with the references before downloading.",
    note: "Review likeness before sharing or printing",
  },
] as const

export const FAMILY_PORTRAIT_HOW_TO = {
  name: "How BringBack AI creates believable AI family portraits",
  description:
    "From choosing clear references to reviewing the result, the workflow helps you create one portrait while keeping realistic expectations about AI-generated details.",
  url: "https://bringback.pro/ai-family-portrait#how-it-works",
} as const
