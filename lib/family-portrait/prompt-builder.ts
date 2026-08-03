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
 * Keeps the production template stable while injecting the selected subject
 * counts, background/scene, and clothing direction.
 */
export function buildAdvancedFamilyPortraitPrompt(options: PromptBuilderOptions): string {
  const { themeId, clothingMode = "preserve" } = options
  const theme = getThemeById(themeId)

  const personCount =
    typeof options.personCount === "number" && Number.isFinite(options.personCount) && options.personCount > 0
      ? Math.floor(options.personCount)
      : 0
  const petCount =
    typeof options.petCount === "number" && Number.isFinite(options.petCount) && options.petCount > 0
      ? Math.floor(options.petCount)
      : 0

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

  // 4. Explicit subject counts
  const peopleIdentityTarget = personCount > 0
    ? `all ${personCount} unique human individual${personCount === 1 ? "" : "s"}`
    : "every unique individual"
  const peopleCompositionTarget = personCount > 0
    ? `all ${personCount} identified human individual${personCount === 1 ? "" : "s"}`
    : "all identified individuals"
  const petClause = petCount > 0
    ? ` Include exactly ${petCount} pet${petCount === 1 ? "" : "s"} from the provided input images.`
    : ""
  const petCompositionClause = petCount > 0
    ? ` and exactly ${petCount} pet${petCount === 1 ? "" : "s"}`
    : ""

  // 5. Pose & Composition hint
  const compositionPose = theme.compositionHint || "Generate new, appropriate, three-quarter (half-body) or full-body studio poses for all subjects. Subjects should be posed naturally as a group, oriented toward the camera."

  return `You are an experienced, expert photographer and compositor.
Generate a single, high-resolution, photorealistic family portrait.
Identity & Subjects: Identify ${peopleIdentityTarget} from the provided input images. Use the exact facial identity of each person.${petClause}
Scene & Composition: Place ${peopleCompositionTarget}${petCompositionClause} together in a classic, cohesive group portrait arrangement against ${background}
${compositionPose}
Anatomy & Limb Ownership (Critical): When people overlap in a source photo, first determine which face, torso, clothing, arm, and hand belongs to each person. Use the source images to bind visible features and limbs to the correct person, not to reuse pose or limb placement. Re-pose every subject with anatomically connected limbs and unambiguous hand ownership. keep hands away from other subjects' faces and necks. Never create floating, detached, duplicated, fused, or transferred arms or hands.
Synthesis Requirements (Critical): Apply ${lighting} Style must be studio-quality, high-detail, and photorealistic.
Constraints & Negative Prompts: CRITICAL: IGNORE all original poses, backgrounds, props, and lighting from the input images. DO NOT create a collage, "cut-and-paste," or "photoshop" composite. AVOID mismatched lighting, shadows, scale, or perspective. The final output must be a single, newly synthesized photograph. ${clothingLine}`
}
