import { NextResponse } from "next/server"
import { z } from "zod"
import {
  enqueueMemoryBookJob,
  requireMemoryBookUser,
  resolveMemorySource,
} from "@/lib/memory-book/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

const retrySchema = z.object({
  sourceType: z.enum(["restoration", "family_portrait", "add_person", "remove_person", "animation", "nostalgic_hug"]),
  sourceId: z.string().uuid(),
})

export async function POST(request: Request) {
  const { user } = await requireMemoryBookUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const parsed = retrySchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: "Invalid preview retry" }, { status: 400 })

  const source = await resolveMemorySource(user.id, parsed.data.sourceType, parsed.data.sourceId)
  if (!source) return NextResponse.json({ error: "Media is unavailable" }, { status: 404 })
  const previewLocator = source.mediaType === "image" ? source.locator : source.posterLocator
  if (!previewLocator) return NextResponse.json({ error: "This video has no preview image" }, { status: 409 })

  const { data: derivative, error } = await supabaseAdmin
    .from("memory_book_media_derivatives")
    .upsert({
      user_id: user.id,
      source_type: parsed.data.sourceType,
      source_id: parsed.data.sourceId,
      media_type: source.mediaType,
      source_locator: source.locator,
      preview_locator: previewLocator,
      status: "queued",
      error_message: null,
    }, { onConflict: "user_id,source_type,source_id" })
    .select("id")
    .single()
  if (error || !derivative) return NextResponse.json({ error: error?.message || "Unable to retry preview" }, { status: 500 })

  await enqueueMemoryBookJob({
    userId: user.id,
    jobType: "generate_media_derivatives",
    idempotencyKey: `retry-media-derivative:${derivative.id}:${Date.now()}`,
    payload: { derivativeId: derivative.id },
  })
  return NextResponse.json({ queued: true })
}