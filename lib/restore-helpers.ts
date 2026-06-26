import { fal } from "@fal-ai/client"
import mime from "mime"
import { copyR2Object, deleteR2Object, getR2SignedUrl } from "@/lib/r2"

export const RESTORATION_PROMPT =
  "Restore this damaged or aged photograph to its original quality while maintaining complete faithfulness to the original context and historical authenticity. Remove all physical damage including scratches, tears, creases, dust spots, stains, and missing sections. target and eradicate all persistent, shiny fold artifacts, scanner glare, and deep emulsion cracks, fully reconstructing the underlying visual details. Repair fading and discoloration by restoring original colors and tones without over-saturation. Fully colorize the image, converting black-and-white or sepia originals into vibrant, lifelike, and historically accurate full color. Enhance clarity and sharpness by reconstructing blurry details into accurate physical details based on surrounding context. Apply natural lighting correction with proper shadows and highlights. Add authentic surface textures including natural skin pores, fabric properties, and material accuracy where damaged areas need reconstruction. Preserve all original composition, poses, expressions, and historical characteristics. Use proper depth of field and realistic color grading that matches the original time period. Output should appear as a clean, well-preserved version of the original photograph with all damage repaired and quality improved while remaining completely true to the source image at maximum resolution. The identity of person to be kept intact wihtout modifications. 8K resolution, ultra-high definition, UHD, HDR, razor-sharp focus, tack-sharp details, extreme micro-detailing, highly intricate surface textures, hyper-realistic, pristine image quality, flawless photographic execution."

export function getWebhookBaseUrl(request: Request) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  return configuredBaseUrl || new URL(request.url).origin
}

export function validateOwnedTempRestoreKey(key: string, userId: string): boolean {
  if (typeof key !== "string" || key.length === 0 || key.length > 1024) {
    return false
  }

  if (key.includes("..") || key.startsWith("http://") || key.startsWith("https://")) {
    return false
  }

  const parts = key.split("/")
  return parts.length >= 4 && parts[0] === "temp" && parts[1] === "restorations" && parts[2] === userId
}
export function validateOwnedTempAddPersonKey(key: string, userId: string): boolean {
  if (typeof key !== "string" || key.length === 0 || key.length > 1024) {
    return false
  }

  if (key.includes("..") || key.startsWith("http://") || key.startsWith("https://")) {
    return false
  }

  const parts = key.split("/")
  return parts.length >= 4 && parts[0] === "temp" && parts[1] === "add-person" && parts[2] === userId
}


export function validateOwnedTempRemovePersonKey(key: string, userId: string): boolean {
  if (typeof key !== "string" || key.length === 0 || key.length > 1024) {
    return false
  }

  if (key.includes("..") || key.startsWith("http://") || key.startsWith("https://")) {
    return false
  }

  const parts = key.split("/")
  return parts.length >= 4 && parts[0] === "temp" && parts[1] === "remove-person" && parts[2] === userId
}
function cleanFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 120) || "original-image"
}

export function originalProxyUrl(key: string) {
  return `/api/image-proxy?key=${encodeURIComponent(key)}`
}

export async function preserveOriginalForComparison(
  sourceKey: string,
  userId: string,
  batchId: string,
  index: number,
  filename: string,
) {
  const extension = mime.getExtension(mime.getType(sourceKey) || "") || filename.split(".").pop() || "png"
  const destinationKey = `temp/restorations/${userId}/originals/${batchId}/${index}-${Date.now()}-${cleanFilename(filename)}.${extension}`
  return copyR2Object(sourceKey, destinationKey)
}

export async function uploadR2ObjectToFal(key: string, deleteSource = true): Promise<string> {
  const signedUrl = await getR2SignedUrl(key)
  const resp = await fetch(signedUrl)
  if (!resp.ok) {
    throw new Error(`Failed to fetch uploaded image: ${resp.status}`)
  }

  const arrayBuf = await resp.arrayBuffer()
  const contentType = resp.headers.get("content-type") || mime.getType(key) || "image/png"
  const blob = new Blob([arrayBuf], { type: contentType })
  const falUrl = await fal.storage.upload(blob)

  if (deleteSource) {
    try {
      await deleteR2Object(key)
    } catch (cleanupErr) {
      console.warn(`[restore] Failed to delete temp R2 object ${key}:`, cleanupErr)
    }
  }

  return falUrl
}

export function buildRestorationInput(uploadedFile: string, options?: {
  outputFormat?: string
  safetyTolerance?: string
  seed?: number
}) {
  const input: any = {
    prompt: RESTORATION_PROMPT,
    num_images: 1,
    aspect_ratio: "auto",
    resolution: "1K",
    output_format: options?.outputFormat || "png",
    image_urls: [uploadedFile],
  }

  if (options?.safetyTolerance) {
    input.safety_tolerance = options.safetyTolerance
  }

  if (typeof options?.seed === "number" && !Number.isNaN(options.seed)) {
    input.seed = options.seed
  }

  return input
}
