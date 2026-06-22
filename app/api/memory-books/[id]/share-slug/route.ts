import { NextResponse } from "next/server"
import { z } from "zod"
import {
  getOwnedMemoryBook,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import {
  buildMemoryBookSharePath,
  createMemoryBookSlugCandidates,
  memoryBookShareSlugSchema,
  normalizeMemoryBookShareSlug,
} from "@/lib/memory-book/share-slug"
import { supabaseAdmin } from "@/utils/supabase/admin"

const updateSlugSchema = z.object({
  slug: memoryBookShareSlugSchema,
})

async function isAvailable(slug: string, bookId: string) {
  const { data } = await supabaseAdmin
    .from("memory_books")
    .select("id")
    .eq("share_slug", slug)
    .neq("id", bookId)
    .maybeSingle()
  return !data
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }

  const requested = new URL(request.url).searchParams.get("slug")
  if (requested !== null) {
    const slug = normalizeMemoryBookShareSlug(requested)
    const parsed = memoryBookShareSlugSchema.safeParse(slug)
    return NextResponse.json({
      slug,
      valid: parsed.success,
      available: parsed.success ? await isAvailable(slug, id) : false,
      message: parsed.success ? null : parsed.error.issues[0]?.message,
    })
  }

  const candidates = createMemoryBookSlugCandidates(
    book.draft_document.cover.title,
    book.draft_document.cover.periodLabel
  )
  const suggestions: string[] = []
  for (const candidate of candidates) {
    if (await isAvailable(candidate, id)) suggestions.push(candidate)
  }
  if (!suggestions.length) {
    suggestions.push(
      `${candidates[0] || "family-keepsake"}-${book.id.slice(0, 7)}`
    )
  }

  return NextResponse.json({ suggestions: suggestions.slice(0, 3) })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const parsed = updateSlugSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Choose a valid address" },
      { status: 400 }
    )
  }

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) {
    return NextResponse.json({ error: "Memory book not found" }, { status: 404 })
  }
  if (book.share_slug === parsed.data.slug) {
    return NextResponse.json({
      shareSlug: book.share_slug,
      displayUrl: `/m/${book.share_slug}`,
      shareUrl: buildMemoryBookSharePath(book.share_slug),
    })
  }

  const { data: updated, error } = await supabaseAdmin
    .from("memory_books")
    .update({
      share_slug: parsed.data.slug,
      share_version: book.share_version + 1,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("share_slug, share_token, share_version")
    .single()

  if (error?.code === "23505") {
    return NextResponse.json(
      { error: "That address was just taken. Try another one." },
      { status: 409 }
    )
  }
  if (error || !updated) {
    return NextResponse.json(
      { error: error?.message || "Unable to update the address" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    shareSlug: updated.share_slug,
    displayUrl: `/m/${updated.share_slug}`,
    shareUrl: buildMemoryBookSharePath(updated.share_slug),
  })
}
