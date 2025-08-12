import { type NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { createClient } from "@/utils/supabase/server"

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
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

    // Check user credits
    console.log('[Restore API] Checking credits for user:', user.id)
    const { data: credits, error: creditsError } = await supabase
      .from("credits")
      .select("credits_remaining")
      .eq("user_id", user.id)
      .single()

    console.log('[Restore API] Credits check result:', { 
      credits, 
      creditsError, 
      hasCredits: credits?.credits_remaining > 0 
    })

    if (creditsError) {
      console.error('[Restore API] Credits query error:', creditsError)
      return NextResponse.json({ error: "Failed to check credits" }, { status: 500 })
    }

    if (!credits || credits.credits_remaining <= 0) {
      console.log('[Restore API] Insufficient credits:', { 
        userId: user.id, 
        creditsRemaining: credits?.credits_remaining || 0 
      })
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    // Check if Replicate API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 })
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

    // Convert file to base64 for Replicate
    console.log('[Restore API] Processing file:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type 
    })
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`
    
    console.log('[Restore API] File converted to data URL:', { 
      dataUrlLength: dataUrl.length,
      dataUrlPrefix: dataUrl.substring(0, 50) + '...'
    })

    // Prepare input for Replicate API with sanitization
    const input: any = {
      input_image: dataUrl,
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
      if (["png", "jpg", "webp"].includes(sanitizedFormat)) {
        input.output_format = sanitizedFormat
      }
    }

    if (safetyTolerance) {
      const sanitizedTolerance = sanitizeInput(Number.parseInt(safetyTolerance))
      if (!isNaN(sanitizedTolerance) && sanitizedTolerance >= 0 && sanitizedTolerance <= 2) {
        input.safety_tolerance = sanitizedTolerance
      }
    }

    
    console.log('[Restore API] Final input object:', { 
      hasInputImage: !!input.input_image,
      inputImageType: typeof input.input_image,
      inputImageLength: input.input_image?.length || 0,
      allParams: Object.keys(input),
      seed: input.seed,
      outputFormat: input.output_format,
      safetyTolerance: input.safety_tolerance
    })

    // Call Replicate API
    // Using the documented FLUX Kontext restore-image model
    // Model: flux-kontext-apps/restore-image
    // Input parameter: input_image (required)
    console.log('[Restore API] Calling Replicate with input:', { 
      hasImage: !!input.input_image, 
      imageType: typeof input.input_image,
      imageLength: input.input_image?.length || 0,
      otherParams: Object.keys(input).filter(key => key !== 'input_image')
    })
    
    let output: any
    try {
      // Use the correct model and input structure
      output = await replicate.run("flux-kontext-apps/restore-image", {
        input: input, // Pass the input object directly as documented
      })
      
      // If the output is a ReadableStream, try to get the result differently
      if (output instanceof ReadableStream) {
        console.log('[Restore API] Got ReadableStream, trying alternative approach...')
        // Try using the newer API method that might return the result directly
        try {
          const prediction = await replicate.predictions.create({
            version: "flux-kontext-apps/restore-image",
            input: input,
          })
          
          // Wait for the prediction to complete
          let result = prediction
          while (result.status !== "succeeded" && result.status !== "failed") {
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
            result = await replicate.predictions.get(prediction.id)
          }
          
          if (result.status === "succeeded" && result.output) {
            output = result.output
            console.log('[Restore API] Alternative approach successful:', output)
          } else {
            console.error('[Restore API] Alternative approach failed:', result)
          }
        } catch (altError) {
          console.log('[Restore API] Alternative approach failed, using ReadableStream:', altError)
          // Continue with ReadableStream processing
        }
      }
    } catch (replicateError) {
      console.error('[Restore API] Replicate API call failed:', replicateError)
      if (replicateError instanceof Error) {
        if (replicateError.message.includes('authentication') || replicateError.message.includes('401')) {
          return NextResponse.json({ error: "Authentication failed with restoration service. Please check your API token." }, { status: 401 })
        }
        if (replicateError.message.includes('rate limit') || replicateError.message.includes('429')) {
          return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
        }
        if (replicateError.message.includes('timeout') || replicateError.message.includes('408')) {
          return NextResponse.json({ error: "Request timeout. Please try again." }, { status: 408 })
        }
        if (replicateError.message.includes('model not found') || replicateError.message.includes('404')) {
          return NextResponse.json({ error: "Restoration model not available. Please try again later." }, { status: 503 })
        }
      }
      return NextResponse.json({ error: "Restoration service temporarily unavailable. Please try again." }, { status: 503 })
    }

    console.log('[Restore API] Replicate response:', { 
      output, 
      outputType: typeof output,
      isArray: Array.isArray(output),
      outputLength: Array.isArray(output) ? output.length : 'N/A',
      isUri: typeof output === 'string' && (output.startsWith('http://') || output.startsWith('https://')),
      isReadableStream: output instanceof ReadableStream
    })

    // Validate output - According to docs, output should be a URI string
    if (!output) {
      console.error('[Restore API] No output from Replicate')
      return NextResponse.json({ error: "No response from restoration service" }, { status: 500 })
    }

    // Handle different output formats from Replicate
    let restoredImageUrl: string
    
    // Handle ReadableStream response (newer Replicate API format)
    if (output instanceof ReadableStream) {
      console.log('[Restore API] Output is ReadableStream, processing...')
      try {
        const reader = output.getReader()
        const chunks: Uint8Array[] = []
        
        // Add timeout for ReadableStream processing
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('ReadableStream processing timeout')), 30000)
        )
        
        const readPromise = (async () => {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            if (value) chunks.push(value)
          }
        })()
        
        await Promise.race([readPromise, timeoutPromise])
        
        // Combine chunks and convert to string
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const combined = new Uint8Array(totalLength)
        let offset = 0
        for (const chunk of chunks) {
          combined.set(chunk, offset)
          offset += chunk.length
        }
        
        const responseText = new TextDecoder().decode(combined)
        console.log('[Restore API] ReadableStream decoded:', responseText)
        
        // Try to parse as JSON or use as string
        try {
          const parsed = JSON.parse(responseText)
          restoredImageUrl = parsed.output || parsed.url || parsed.image || responseText
          console.log('[Restore API] Parsed JSON response:', parsed)
        } catch {
          // If not JSON, use as plain text
          restoredImageUrl = responseText
          console.log('[Restore API] Using plain text response')
        }
        
        console.log('[Restore API] Extracted URL from ReadableStream:', restoredImageUrl)
        
        // Validate the extracted URL immediately
        if (!restoredImageUrl || typeof restoredImageUrl !== 'string') {
          console.error('[Restore API] Invalid URL extracted from ReadableStream:', restoredImageUrl)
          return NextResponse.json({ error: "Failed to extract valid URL from restoration service" }, { status: 500 })
        }
        
        // Check if it's a valid URI format
        if (!restoredImageUrl.startsWith('http://') && !restoredImageUrl.startsWith('https://')) {
          console.error('[Restore API] Invalid URI format from ReadableStream:', restoredImageUrl)
          return NextResponse.json({ error: "Invalid URI format from restoration service" }, { status: 500 })
        }
        
        console.log('[Restore API] ReadableStream processing successful, URL:', restoredImageUrl)
      } catch (streamError) {
        console.error('[Restore API] Error processing ReadableStream:', streamError)
        return NextResponse.json({ error: "Failed to process restoration service response" }, { status: 500 })
      }
    } else if (Array.isArray(output)) {
      // If output is an array, take the first item
      restoredImageUrl = output[0]
      console.log('[Restore API] Output is array, using first item:', restoredImageUrl)
    } else if (typeof output === "string") {
      // If output is a string, use it directly
      restoredImageUrl = output
      console.log('[Restore API] Output is string:', restoredImageUrl)
    } else {
      // If output is an object or other type, try to extract URL
      console.error('[Restore API] Unexpected output format:', output)
      return NextResponse.json({ error: "Unexpected response format from restoration service" }, { status: 500 })
    }

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
    let restoredBucket: any = null
    
    try {
      // Download the image from Replicate
      const imageResponse = await fetch(restoredImageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`)
      }
      
      const imageBuffer = await imageResponse.arrayBuffer()
      const imageBlob = new Blob([imageBuffer])
      
      // Generate a unique filename with user folder structure
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const fileExtension = restoredImageUrl.split('.').pop() || 'png'
      const fileName = `${user.id}/${timestamp}_${randomId}.${fileExtension}`
      
      console.log('[Restore API] Uploading to Supabase storage:', fileName)
      
      // First, check what storage buckets are available
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
      if (bucketsError) {
        console.error('[Restore API] Error listing buckets:', bucketsError)
        throw new Error(`Failed to list storage buckets: ${bucketsError.message}`)
      }
      
      console.log('[Restore API] Available buckets:', buckets?.map(b => b.name))
      
      // Find the correct bucket for restored photos
      restoredBucket = buckets?.find(b => 
        b.name === 'restored_photos' || 
        b.name === 'restored-photos' || 
        b.name.includes('restored') || 
        b.name.includes('photos')
      )
      
      if (!restoredBucket) {
        console.error('[Restore API] No suitable bucket found for restored photos')
        console.log('[Restore API] Available buckets:', buckets?.map(b => ({ name: b.name, public: b.public })))
        throw new Error('No storage bucket found for restored photos')
      }
      
      console.log('[Restore API] Using bucket:', restoredBucket.name)
      
      // Upload to the found bucket
      console.log('[Restore API] Starting upload to bucket:', restoredBucket.name)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(restoredBucket.name)
        .upload(fileName, imageBlob, {
          contentType: imageResponse.headers.get('content-type') || 'image/png',
          cacheControl: '3600'
        })
      
      if (uploadError) {
        console.error('[Restore API] Storage upload error:', uploadError)
        console.error('[Restore API] Upload error details:', {
          code: uploadError.message,
          details: uploadError,
          fileName,
          fileSize: imageBlob.size,
          contentType: imageResponse.headers.get('content-type'),
          bucketName: restoredBucket.name
        })
        throw new Error(`Storage upload failed: ${uploadError.message}`)
      }
      
      console.log('[Restore API] Upload successful, upload data:', uploadData)
      
      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from(restoredBucket.name)
        .getPublicUrl(fileName)
      
      finalImageUrl = urlData.publicUrl
      console.log('[Restore API] Image uploaded successfully to storage:', finalImageUrl)
      console.log('[Restore API] Public URL generated:', urlData.publicUrl)
      
      // Verify the file actually exists in storage
      const { data: fileExists, error: checkError } = await supabase.storage
        .from(restoredBucket.name)
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
          console.error('[Restore API] Bucket name:', restoredBucket?.name)
        }
      }
      
      // Fallback: use the original Replicate URL if storage fails
      finalImageUrl = restoredImageUrl
      console.log('[Restore API] Using fallback URL due to storage error:', finalImageUrl)
      console.log('[Restore API] Note: Image is NOT saved to Supabase storage, only Replicate URL saved')
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

    // Update user credits
    const { error: updateError } = await supabase
      .from("credits")
      .update({ credits_remaining: credits.credits_remaining - 1 })
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
      creditsRemaining: credits.credits_remaining - 1,
    })
  } catch (error) {
    console.error("Error in image restoration:", error)

    // Handle specific Replicate errors
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
  const hasToken = !!process.env.REPLICATE_API_TOKEN
  const tokenPreview = hasToken ? `${process.env.REPLICATE_API_TOKEN?.substring(0, 8)}...` : 'Not set'
  
  return NextResponse.json({
    status: "healthy",
    service: "Restore.me API",
    timestamp: new Date().toISOString(),
    replicateConfigured: hasToken,
    tokenPreview,
    environment: process.env.NODE_ENV || 'development'
  })
}
