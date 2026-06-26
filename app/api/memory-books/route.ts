import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { requireMemoryBookUser } from "@/lib/memory-book/server"
import { createMemoryBookDraft } from "@/lib/memory-book/draft"
import { isMemoryBookEnabled } from "@/lib/memory-book/feature"
import { createMemoryBookSlugCandidates } from "@/lib/memory-book/share-slug"

const createBookSchema = z.object({
  title: z.string().trim().min(1).max(90).optional(),
  sourceType: z
    .enum(["restoration", "family_portrait", "add_person", "animation", "nostalgic_hug"])
    .optional(),
  sourceId: z.string().uuid().optional(),
})

export async function GET() {
  const { supabase, user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }
  if (!isMemoryBookEnabled(user.id, user.email)) {
    return NextResponse.json({ error: "Feature unavailable" }, { status: 404 })
  }

  const [{ data: books, error }, { data: entitlement }] = await Promise.all([
    supabase
      .from("memory_books")
      .select("*, memory_book_assets(id, status, is_hidden)")
      .eq("user_id", user.id)
      .order("last_activity_at", { ascending: false }),
    supabase
      .from("memory_book_entitlements")
      .select("live_book_id, source, granted_at")
      .eq("user_id", user.id)
      .maybeSingle(),
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ books: books || [], entitlement })
}

export async function POST(request: Request) {
  const { supabase, user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }
  if (!isMemoryBookEnabled(user.id, user.email)) {
    return NextResponse.json({ error: "Feature unavailable" }, { status: 404 })
  }

  const parsed = createBookSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid memory book details" }, { status: 400 })
  }

  const title = parsed.data.title || "Our Family Heritage"
  const bookId = randomUUID()
  const [preferredSlug] = createMemoryBookSlugCandidates(title)
  const { data: existingSlug } = await supabase
    .from("memory_books")
    .select("id")
    .eq("share_slug", preferredSlug)
    .maybeSingle()
  const shareSlug = existingSlug
    ? `${preferredSlug.slice(0, 52)}-${bookId.slice(0, 7)}`
    : preferredSlug

  const draftDocument = createMemoryBookDraft(parsed.data.title)
  let { data: book, error } = await supabase
    .from("memory_books")
    .insert({
      id: bookId,
      user_id: user.id,
      title,
      theme: "family_heritage_v1",
      share_slug: shareSlug,
      draft_document: draftDocument,
    })
    .select("*")
    .single()

  if (error?.code === "23505" && shareSlug === preferredSlug) {
    const fallbackSlug = `${preferredSlug.slice(0, 52)}-${bookId.slice(0, 7)}`
    const retry = await supabase
      .from("memory_books")
      .insert({
        id: bookId,
        user_id: user.id,
        title,
        theme: "family_heritage_v1",
        share_slug: fallbackSlug,
        draft_document: draftDocument,
      })
      .select("*")
      .single()
    book = retry.data
    error = retry.error
  }

  if (error || !book) {
    return NextResponse.json(
      { error: error?.message || "Unable to create memory book" },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      book,
      suggestedSource:
        parsed.data.sourceType && parsed.data.sourceId
          ? { sourceType: parsed.data.sourceType, sourceId: parsed.data.sourceId }
          : null,
    },
    { status: 201 }
  )
}
