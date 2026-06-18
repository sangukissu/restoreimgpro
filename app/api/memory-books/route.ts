import { NextResponse } from "next/server"
import { z } from "zod"
import { requireMemoryBookUser } from "@/lib/memory-book/server"
import { isMemoryBookEnabled } from "@/lib/memory-book/feature"

const createBookSchema = z.object({
  title: z.string().trim().min(1).max(90).optional(),
  sourceType: z
    .enum(["restoration", "family_portrait", "animation", "nostalgic_hug"])
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

  const { data: book, error } = await supabase
    .from("memory_books")
    .insert({
      user_id: user.id,
      title: parsed.data.title || "Our Family Heritage",
      theme: "family_heritage_v1",
    })
    .select("*")
    .single()

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
