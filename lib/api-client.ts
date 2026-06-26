export interface RestoreImageResponse {
  success: boolean
  restoredImageUrl?: string
  restorationId?: string
  status?: string
  creditsRemaining?: number
  error?: string
}

function normalizeRestoreError(message?: string) {
  if (!message) {
    return "Restoration failed. Please try again."
  }

  // Surface the platform payload-limit error clearly instead of the generic
  // "Failed to restore image" message. This is the Vercel serverless limit that
  // the direct-to-R2 upload flow is designed to avoid, but it can still appear
  // on the legacy fallback path for very large images.
  if (message.includes("FUNCTION_PAYLOAD_TOO_LARGE") || message.includes("Request Entity Too Large")) {
    return "That image is too large to process. Try a smaller image (under 4.5MB) or compress it."
  }

  if (
    message.includes("Unexpected token") ||
    message.includes("<!DOCTYPE") ||
    message.includes("not valid JSON")
  ) {
    return "Restoration failed. Please try again."
  }

  return message
}

/**
 * Upload a file directly from the browser to Cloudflare R2 using a presigned
 * PUT URL, then return the R2 key the backend uses to read it. This bypasses
 * the Vercel serverless function body (~4.5MB) entirely, so large images no
 * longer hit FUNCTION_PAYLOAD_TOO_LARGE.
 */
async function uploadDirectToR2(imageFile: File): Promise<string> {
  // 1. Request a presigned upload URL from the backend.
  const presignedRes = await fetch("/api/r2/presigned-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: imageFile.name,
      contentType: imageFile.type,
      folder: "restorations",
    }),
  })

  if (!presignedRes.ok) {
    const errData = await presignedRes.json().catch(() => ({}))
    throw new Error(errData?.error || "Failed to prepare secure storage")
  }

  const { uploadUrl, key } = await presignedRes.json()
  if (!uploadUrl || !key) {
    throw new Error("Failed to prepare secure storage")
  }

  // 2. PUT the file straight to R2 (never touches Vercel).
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": imageFile.type },
    body: imageFile,
  })

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image to storage")
  }

  return key as string
}

export async function restoreImage(imageFile: File): Promise<RestoreImageResponse> {
  try {
    let restoreBody: BodyInit
    let restoreHeaders: Record<string, string> = {}

    // Preferred flow: upload directly to R2, then send only the lightweight key.
    // If anything in the direct-upload step fails, fall back to the legacy
    // multipart path so we never hard-regress (though very large files may still
    // hit the platform payload limit on the fallback).
    try {
      const key = await uploadDirectToR2(imageFile)
      restoreBody = JSON.stringify({ key })
      restoreHeaders["Content-Type"] = "application/json"
    } catch (uploadError) {
      console.warn("[restoreImage] Direct R2 upload failed, falling back to multipart:", uploadError)
      const formData = new FormData()
      formData.append("image", imageFile)
      restoreBody = formData
      // Do not set Content-Type; the browser sets the multipart boundary.
    }

    const response = await fetch("/api/restore", {
      method: "POST",
      headers: restoreHeaders,
      body: restoreBody,
    })

    if (!response.ok) {
      let errorMessage = "Failed to restore image"

      const contentType = response.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } else {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      }

      return {
        success: false,
        error: normalizeRestoreError(errorMessage),
      }
    }

    const contentType = response.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      return {
        success: false,
        error: "Restoration failed. Please try again.",
      }
    }

    const data = await response.json()
    return {
      success: true,
      restoredImageUrl: data.restoredImageUrl,
      restorationId: data.restorationId,
      status: data.status,
      creditsRemaining: data.creditsRemaining,
    }
  } catch (error) {
    return {
      success: false,
      error: normalizeRestoreError(error instanceof Error ? error.message : "Unknown error occurred"),
    }
  }
}
export interface AnalyzeImageResponse {
  analysis?: {
    overall_quality_score: number
    confidence: number
    damage_categories: Array<{
      name: string
      severity: number
      confidence: number
      notes?: string
      regions?: Array<{ x: number; y: number; w: number; h: number }>
    }>
    recommended_second_pass_prompt: string
  }
  shouldRerestore?: boolean
  reason?: string
  secondPassAvailable?: boolean
  error?: string
}

export async function analyzeRestoredImage(originalUrl: string | null, restoredUrl: string, initialRestoredUrl?: string): Promise<AnalyzeImageResponse> {
  const startTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
  const payload: Record<string, any> = { restoredUrl }
  if (originalUrl) payload.originalUrl = originalUrl
  if (initialRestoredUrl) payload.initialRestoredUrl = initialRestoredUrl
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    let data: any
    try {
      data = await response.json()
    } catch (e) {
      console.error('[analyzeRestoredImage] Failed to parse JSON response:', e)
      return { error: 'Invalid JSON from /api/analyze-image' }
    }

    const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()

    if (!response.ok) {
      return { error: data.error || 'Failed to analyze image' }
    }

    return data
  } catch (error) {
    console.error('[analyzeRestoredImage] Request failed:', error)
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' }
  }
}

export interface RerestoreResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

export async function rerestoreImage(imageUrl: string, prompt: string, originalUrl?: string): Promise<RerestoreResponse> {
  try {
    const payload: Record<string, any> = { imageUrl, prompt }
    if (originalUrl) payload.originalUrl = originalUrl

    const response = await fetch("/api/rerestore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to re-restore image" }
    }

    return { success: true, imageUrl: data.restoredImageUrl }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" }
  }
}
