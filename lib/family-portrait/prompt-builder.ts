import { getThemeById, ClothingMode } from "./themes"

export interface PromptBuilderOptions {
  themeId: string
  personCount?: number
  petCount?: number
  aspectRatio?: string
  clothingMode?: ClothingMode
  imageCount?: number
}

/**
 * Builds the exact proven BringBack.pro family portrait prompt.
 * Restores the exact 6-month production template verbatim, swapping ONLY
 * the background/scene and clothing lines for preset themes.
 */
export function buildAdvancedFamilyPortraitPrompt(options: PromptBuilderOptions): string {
  const { themeId, petCount = 0, clothingMode = "preserve" } = options
  const theme = getThemeById(themeId)

  // 1. Background scene
  const background = theme.environment

  // 2. Lighting
  const lighting = theme.lighting || "unified, professional studio lighting (e.g., softbox) consistently across all subjects."

  // 3. Clothing directive
  let clothingLine = "Ensure facial identities and clothing are preserved accurately."
  if (clothingMode === "restyle") {
    if (theme.outfit) {
      clothingLine = `Dress all subjects in: ${theme.outfit}.`
    }
  }

  // 4. Pet clause
  const petClause = petCount > 0 ? ` Include exactly ${petCount} pet(s) naturally positioned near the family.` : ""

  // 5. Pose & Composition hint
  const compositionPose = theme.compositionHint || "Generate new, appropriate, three-quarter (half-body) or full-body studio poses for all subjects. Subjects should be posed naturally as a group, oriented toward the camera."

  return `You are an experienced, expert photographer and compositor.
Generate a single, high-resolution, photorealistic family portrait.
Identity & Subjects: Identify every unique individual from the provided input images. Use the exact facial identity of each person.${petClause}
Scene & Composition: Place all identified individuals together in a classic, cohesive group portrait arrangement against ${background}
${compositionPose}
Synthesis Requirements (Critical): Apply ${lighting} Style must be studio-quality, high-detail, and photorealistic.
Constraints & Negative Prompts: CRITICAL: IGNORE all original poses, backgrounds, props, and lighting from the input images. DO NOT create a collage, "cut-and-paste," or "photoshop" composite. AVOID mismatched lighting, shadows, scale, or perspective. The final output must be a single, newly synthesized photograph. ${clothingLine}`
}
