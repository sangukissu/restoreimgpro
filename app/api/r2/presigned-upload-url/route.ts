import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { getR2PresignedUploadUrl } from "@/lib/r2"

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // 2. Parse request body
    const body = await req.json()
    const { filename, contentType, folder } = body

    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename and contentType are required" }, { status: 400 })
    }

    // Validate contentType is an image format
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json({ error: "Unsupported file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 })
    }

    // 3. Generate a unique key/path for the file in R2 under the temp/ prefix.
    // Allow callers to scope the temp object to a feature folder; default to
    // family-portraits for backward compatibility.
    const allowedFolders = ["family-portraits", "restorations", "add-person", "temp"]
    const safeFolder = typeof folder === "string" && allowedFolders.includes(folder)
      ? folder
      : "family-portraits"
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 10)
    // Clean filename slightly to avoid S3 key issues
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    const key = `temp/${safeFolder}/${user.id}/${timestamp}_${randomId}_${cleanFilename}`

    // 4. Generate the presigned PUT URL
    const uploadUrl = await getR2PresignedUploadUrl(key, contentType)

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
    })
  } catch (error: any) {
    console.error("Presigned URL generation error:", error)
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 })
  }
}
