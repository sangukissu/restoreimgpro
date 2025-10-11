export interface RestoreImageResponse {
  success: boolean
  restoredImageUrl?: string
  error?: string
}

export async function restoreImage(imageFile: File): Promise<RestoreImageResponse> {
  try {
    const formData = new FormData()
    formData.append("image", imageFile)

    const response = await fetch("/api/restore", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || "Failed to restore image",
      }
    }

    const data = await response.json()
    return {
      success: true,
      restoredImageUrl: data.restoredImageUrl,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
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
    console.debug('[analyzeRestoredImage] Request payload:', payload)

    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    console.debug('[analyzeRestoredImage] HTTP status:', response.status)

    let data: any
    try {
      data = await response.json()
    } catch (e) {
      console.error('[analyzeRestoredImage] Failed to parse JSON response:', e)
      return { error: 'Invalid JSON from /api/analyze-image' }
    }

    const endTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
    console.debug('[analyzeRestoredImage] Response JSON:', data, `(${Math.round(endTime - startTime)}ms)`) 

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
