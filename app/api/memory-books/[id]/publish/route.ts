import { NextResponse } from "next/server"
import { z } from "zod"
import { buildMemoryBookDocument } from "@/lib/memory-book/document"
import {
  getMemoryBookAssets,
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import { hashMemoryBookPin, signMemoryBookShare } from "@/lib/memory-book/security"
import { supabaseAdmin } from "@/utils/supabase/admin"

const publishSchema = z.object({
  expectedVersion: z.number().int().positive(),
  preservationConsent: z.literal(true),
  downloadsEnabled: z.boolean(),
  musicEnabled: z.boolean(),
  pin: z.string().regex(/^\d{4,8}$/).optional().or(z.literal("")),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = publishSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Review the preservation and privacy settings" },
      { status: 400 }
    )
  }

  const { id } = await params
  const current = await getOwnedMemoryBook(id, user.id)
  if (!current) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }
  if (current.draft_version !== parsed.data.expectedVersion) {
    return NextResponse.json(
      { error: "This draft changed elsewhere", book: current },
      { status: 409 }
    )
  }

  const assets = await getMemoryBookAssets(id, user.id)
  let document
  try {
    document = buildMemoryBookDocument(
      {
        ...current,
        preservation_consent: true,
        downloads_enabled: parsed.data.downloadsEnabled,
        music_enabled: parsed.data.musicEnabled,
      },
      assets
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Complete every page and prepare every assigned memory before publishing",
      },
      { status: 409 }
    )
  }
  const pinHash = parsed.data.pin
    ? await hashMemoryBookPin(parsed.data.pin)
    : null
  const nextVersion = current.draft_version + 1
  const { data: preparedBook, error: preparationError } = await supabaseAdmin
    .from("memory_books")
    .update({
      preservation_consent: true,
      downloads_enabled: parsed.data.downloadsEnabled,
      music_enabled: parsed.data.musicEnabled,
      pin_hash: pinHash,
      pin_updated_at: pinHash ? new Date().toISOString() : null,
      draft_version: nextVersion,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("draft_version", current.draft_version)
    .select("*")
    .maybeSingle()

  if (preparationError) {
    return NextResponse.json({ error: preparationError.message }, { status: 500 })
  }
  if (!preparedBook) {
    return NextResponse.json(
      { error: "This draft changed elsewhere" },
      { status: 409 }
    )
  }

  const { data, error } = await supabase.rpc("publish_memory_book", {
    p_book_id: id,
    p_expected_version: nextVersion,
    p_document: document,
  })

  if (error) {
    const status =
      error.message.includes("purchase") || error.message.includes("one published")
        ? 402
        : error.message.includes("STALE_VERSION")
          ? 409
          : 400
    return NextResponse.json({ error: error.message }, { status })
  }

  const result = Array.isArray(data) ? data[0] : data
  const signature = signMemoryBookShare(
    result.share_token,
    result.share_version
  )
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin

  return NextResponse.json({
    published: true,
    revisionId: result.revision_id,
    revisionNumber: result.revision_number,
    shareUrl: `${baseUrl}/m/${result.share_token}?s=${signature}`,
  })
}
