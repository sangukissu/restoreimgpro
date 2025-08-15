import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"

// Configure Fal AI client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Allowed file types and size limits
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Input sanitization function
function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "")
  }
  if (typeof input === "number") {
    return Math.max(0, Math.min(input, Number.MAX_SAFE_INTEGER))
  }
  return input
}

// File validation function
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File too large. Maximum size is 10MB.",
    }
  }

  // Check if file name is reasonable
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "File name too long.",
    }
  }

  return { valid: true }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check user credits from user_profiles table
    console.log('[Restore API] Checking credits for user:', user.id)
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    console.log('[Restore API] Credits check result:', { 
      userProfile, 
      profileError, 
      hasCredits: userProfile?.credits > 0 
    })

    if (profileError) {
      console.error('[Restore API] Profile query error:', profileError)
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    if (!userProfile || userProfile.credits <= 0) {
      console.log('[Restore API] Insufficient credits:', { 
        userId: user.id, 
        creditsRemaining: userProfile?.credits || 0 
      })
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Check if Fal AI API key is configured
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "Fal AI API key not configured" }, { status: 500 })
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get("image") as File
    const seed = formData.get("seed") as string
    const outputFormat = formData.get("output_format") as string
    const safetyTolerance = formData.get("safety_tolerance") as string

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 })
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 })
    }

    // Upload file to Fal AI for processing
    console.log('[Restore API] Processing file:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type 
    })
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert buffer to Blob for Fal AI storage
    const blob = new Blob([buffer], { type: file.type })
    
    // Upload file to Fal AI storage
    const uploadedFile = await fal.storage.upload(blob)
    
    console.log('[Restore API] File uploaded to Fal AI:', uploadedFile)

    // Prepare input for Fal AI photo restoration API with sanitization
    const input: any = {
      image_url: uploadedFile,
    }

    // Add optional parameters if provided
    if (seed) {
      const sanitizedSeed = sanitizeInput(Number.parseInt(seed))
      if (!isNaN(sanitizedSeed)) {
        input.seed = sanitizedSeed
      }
    }

    if (outputFormat) {
      const sanitizedFormat = sanitizeInput(outputFormat)
      if (["jpeg", "png"].includes(sanitizedFormat)) {
        input.output_format = sanitizedFormat
      }
    }

    if (safetyTolerance) {
      const sanitizedTolerance = sanitizeInput(safetyTolerance)
      if (["1", "2", "3", "4", "5", "6"].includes(sanitizedTolerance)) {
        input.safety_tolerance = sanitizedTolerance
      }
    }

    
    console.log('[Restore API] Final input object:', { 
      hasImageUrl: !!input.image_url,
      imageUrl: input.image_url,
      allParams: Object.keys(input),
      seed: input.seed,
      outputFormat: input.output_format,
      safetyTolerance: input.safety_tolerance
    })

    // Call Fal AI photo restoration API
    console.log('[Restore API] Calling Fal AI photo restoration with input:', input)
    
    let output: any
    try {
      // Use Fal AI photo restoration model
      const result = await fal.subscribe("fal-ai/image-editing/photo-restoration", {
        input: input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('[Restore API] Fal AI processing update:', update.logs?.map(log => log.message))
          }
        },
      })
      
      output = result.data
      console.log('[Restore API] Fal AI response:', output)
      
    } catch (falError) {
      console.error('[Restore API] Fal AI API call failed:', falError)
      if (falError instanceof Error) {
        if (falError.message.includes('authentication') || falError.message.includes('401')) {
          return NextResponse.json({ error: "Authentication failed with restoration service. Please check your API key." }, { status: 401 })
        }
        if (falError.message.includes('rate limit') || falError.message.includes('429')) {
          return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
        }
        if (falError.message.includes('timeout') || falError.message.includes('408')) {
          return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
        }
        if (falError.message.includes('model not found') || falError.message.includes('404')) {
          return NextResponse.json({ error: "Restoration model not available. Please try again later." }, { status: 503 })
        }
      }
      return NextResponse.json({ error: "Restoration service temporarily unavailable. Please try again." }, { status: 503 })
    }

    console.log('[Restore API] Fal AI response:', { 
      output, 
      outputType: typeof output,
      hasImages: output?.images && Array.isArray(output.images),
      imagesLength: output?.images?.length || 0
    })

    // Validate output - According to Fal AI docs, output should have images array
    if (!output || !output.images || !Array.isArray(output.images) || output.images.length === 0) {
      console.error('[Restore API] No valid output from Fal AI:', output)
      return NextResponse.json({ error: "No response from restoration service" }, { status: 500 })
    }

    // Extract the restored image URL from Fal AI response
    const restoredImageUrl = output.images[0].url
    console.log('[Restore API] Extracted restored image URL:', restoredImageUrl)

    // Validate that the restored image URL is a valid URI
    if (!restoredImageUrl || typeof restoredImageUrl !== "string") {
      console.error('[Restore API] Invalid restored image URL:', restoredImageUrl)
      return NextResponse.json({ error: "Invalid response from restoration service" }, { status: 500 })
    }

    // Check if it's a valid URI (should start with http:// or https://)
    if (!restoredImageUrl.startsWith('http://') && !restoredImageUrl.startsWith('https://')) {
      console.error('[Restore API] Invalid URI format:', restoredImageUrl)
      return NextResponse.json({ error: "Invalid URI format from restoration service" }, { status: 500 })
    }

    // Download the restored image and save it to Supabase storage
    console.log('[Restore API] Downloading restored image from:', restoredImageUrl)
    let finalImageUrl: string

    
    try {
      // Download the image from Fal AI
      const imageResponse = await fetch(restoredImageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`)
      }
      
      const imageBuffer = await imageResponse.arrayBuffer()
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
      const imageBlob = new Blob([imageBuffer], { type: contentType })
      
      // Generate a unique filename with user folder structure
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = restoredImageUrl.split('.').pop() || 'png'
      const fileName = `${user.id}/${timestamp}_${randomId}.${fileExtension}`
      
      console.log('[Restore API] Uploading to Supabase storage:', fileName)
      
      // Upload directly to the restored_photos bucket (bucket already exists with policies)
      console.log('[Restore API] Starting upload to restored_photos bucket')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('restored_photos')
        .upload(fileName, imageBlob, {
          contentType: contentType,
          cacheControl: '3600'
        })
      
      if (uploadError) {
        console.error('[Restore API] Storage upload error:', uploadError)
        console.error('[Restore API] Upload error details:', {
          code: uploadError.message,
          details: uploadError,
          fileName,
          fileSize: imageBlob.size,
          contentType: contentType,
          bucketName: 'restored_photos'
        })
        throw new Error(`Storage upload failed: ${uploadError.message}`)
      }
      
      console.log('[Restore API] Upload successful, upload data:', uploadData)
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('restored_photos')
        .getPublicUrl(fileName)
      
      finalImageUrl = urlData.publicUrl
      console.log('[Restore API] Image uploaded successfully to storage:', finalImageUrl)
      console.log('[Restore API] Public URL generated:', urlData.publicUrl)
      
      // Verify the file actually exists in storage
      const { data: fileExists, error: checkError } = await supabase.storage
        .from('restored_photos')
        .list(user.id)
      
      if (checkError) {
        console.error('[Restore API] Error checking if file exists:', checkError)
      } else {
        console.log('[Restore API] Files in user folder:', fileExists)
        const uploadedFile = fileExists?.find(f => f.name.includes(timestamp.toString()))
        if (uploadedFile) {
          console.log('[Restore API] File confirmed in storage:', uploadedFile)
        } else {
          console.warn('[Restore API] Warning: File not found in storage after upload')
        }
      }
      
    } catch (storageError) {
      console.error('[Restore API] Error saving to storage:', storageError)
      
      // Try to understand what went wrong
      if (storageError instanceof Error) {
        if (storageError.message.includes('policy') || storageError.message.includes('permission')) {
          console.error('[Restore API] This appears to be a storage policy issue')
          console.error('[Restore API] User ID:', user.id)
          console.error('[Restore API] Bucket name: restored_photos')
        }
      }
      
      // Fallback: use the original Fal AI URL if storage fails
      finalImageUrl = restoredImageUrl
      console.log('[Restore API] Using fallback URL due to storage error:', finalImageUrl)
      console.log('[Restore API] Note: Image is NOT saved to Supabase storage, only Fal AI URL saved')
    }

    // Save restoration record to database (matching your actual schema)
    const { error: insertError } = await supabase.from("image_restorations").insert({
      user_id: user.id,
      restored_image_url: finalImageUrl,
      status: "completed",
    })

    if (insertError) {
      console.error("Error saving restoration record:", insertError)
      return NextResponse.json({ error: "Failed to save restoration record" }, { status: 500 })
    }

    console.log('[Restore API] Restoration record saved to database')

    // Update user credits in user_profiles table
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ credits: userProfile.credits - 1 })
      .eq("user_id", user.id)

    if (updateError) {
      console.error("Error updating credits:", updateError)
    }

    // Return the final image URL (from Supabase storage)
    return NextResponse.json({
      success: true,
      restoredImageUrl: finalImageUrl,
      originalFileName: file.name,
      processedAt: new Date().toISOString(),
      creditsRemaining: userProfile.credits - 1,
    })
  } catch (error) {
    console.error("Error in image restoration:", error)

    // Handle specific Fal AI errors
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return NextResponse.json({ error: "Authentication failed with restoration service" }, { status: 401 })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
      }
      if (error.message.includes("timeout")) {
        return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
      }
    }

    return NextResponse.json({ error: "Failed to restore image. Please try again." }, { status: 500 })
  }
}

// Health check endpoint
export async function GET() {
  const hasKey = !!process.env.FAL_KEY
  const keyPreview = hasKey ? `${process.env.FAL_KEY?.substring(0, 8)}...` : 'Not set'
  
  return NextResponse.json({
    status: "healthy",
    service: "BringBack API",
    timestamp: new Date().toISOString(),
    falConfigured: hasKey,
    keyPreview,
    environment: process.env.NODE_ENV || 'development'
  })
}
