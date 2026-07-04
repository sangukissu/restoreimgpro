import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { uploadImageToR2 } from "@/lib/r2"
import { normalizeToPng } from "@/lib/watermark"

fal.config({
  credentials: process.env.FAL_KEY,
})

const RESTORATION_ENDPOINT = "fal-ai/nano-banana-2/edit"
const MAX_RECONCILE_IDS = 10

type RestorationRecord = {
  id: string
  user_id: string
  status: string
  restored_image_url: string | null
  original_image_url: string | null
  error_message: string | null
  fal_request_id: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function proxiedImageUrl(value?: string | null) {
  if (!value) return undefined
  if (value.startsWith("images/") || value.startsWith("temp/")) {
    return `/api/image-proxy?key=${encodeURIComponent(value)}`
  }
  return value
}

function getRestorationImageUrl(payload: unknown) {
  if (!isRecord(payload)) return null

  if (Array.isArray(payload.images) && isRecord(payload.images[0]) && typeof payload.images[0].url === "string") {
    return payload.images[0].url
  }

  if (isRecord(payload.image) && typeof payload.image.url === "string") {
    return payload.image.url
  }

  return null
}

async function downloadImageFromUrl(imageUrl: string) {
  const response = await fetch(imageUrl)

  if (!response.ok) {
    throw new Error(`Failed to download restored image: ${response.status}`)
  }

  return Buffer.from(await response.arrayBuffer())
}

async function completeRestorationFromFal(restoration: RestorationRecord) {
  if (!restoration.fal_request_id) return restoration
  if (restoration.status === "completed" || restoration.restored_image_url) return restoration

  const queueStatus = await fal.queue.status(RESTORATION_ENDPOINT, {
    requestId: restoration.fal_request_id,
  })

  if (queueStatus.status !== "COMPLETED") {
    return restoration
  }

  const result = await fal.queue.result(RESTORATION_ENDPOINT, {
    requestId: restoration.fal_request_id,
  })
  const restoredImageUrl = getRestorationImageUrl(result.data)

  if (!restoredImageUrl) {
    await supabaseAdmin.rpc("fail_restoration_and_refund", {
      p_restoration_id: restoration.id,
      p_error_message: "Restoration payload did not contain an image URL",
    })

    return {
      ...restoration,
      status: "failed",
      error_message: "Restoration payload did not contain an image URL",
    }
  }

  const imageBuffer = await downloadImageFromUrl(restoredImageUrl)
  const pngBuffer = await normalizeToPng(imageBuffer)
  const r2Key = await uploadImageToR2(
    pngBuffer,
    `restored-${restoration.id}.png`,
    restoration.user_id,
    "image/png",
  )

  const { data, error } = await supabaseAdmin
    .from("image_restorations")
    .update({
      status: "completed",
      restored_image_url: r2Key,
      updated_at: new Date().toISOString(),
    })
    .eq("id", restoration.id)
    .eq("user_id", restoration.user_id)
    .eq("fal_request_id", restoration.fal_request_id)
    .select("id, user_id, status, restored_image_url, original_image_url, error_message, fal_request_id")
    .single()

  if (error || !data) {
    throw error || new Error("Unable to update restoration after Fal completion")
  }

  return data as RestorationRecord
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  if (!process.env.FAL_KEY) {
    return NextResponse.json({ error: "Fal AI API key not configured" }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0).slice(0, MAX_RECONCILE_IDS)
    : []

  if (ids.length === 0) {
    return NextResponse.json({ restorations: [] })
  }

  const { data: restorations, error } = await supabaseAdmin
    .from("image_restorations")
    .select("id, user_id, status, restored_image_url, original_image_url, error_message, fal_request_id")
    .eq("user_id", user.id)
    .in("id", ids)

  if (error) {
    return NextResponse.json({ error: "Unable to fetch restorations" }, { status: 500 })
  }

  const reconciled = await Promise.all(
    (restorations || []).map(async (restoration) => {
      try {
        return await completeRestorationFromFal(restoration as RestorationRecord)
      } catch (error) {
        console.error("[restore/reconcile] Unable to reconcile restoration", restoration.id, error)
        return restoration as RestorationRecord
      }
    }),
  )

  return NextResponse.json({
    restorations: reconciled.map((restoration) => ({
      id: restoration.id,
      status: restoration.status,
      restored_image_url: restoration.restored_image_url,
      original_image_url: restoration.original_image_url,
      error_message: restoration.error_message,
      restoredImageUrl: proxiedImageUrl(restoration.restored_image_url),
      originalImageUrl: proxiedImageUrl(restoration.original_image_url),
    })),
  })
}