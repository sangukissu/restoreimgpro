import { redirect } from "next/navigation"
import { MemoryBookLibrary } from "@/components/memory-book/memory-book-library"
import { isMemoryBookEnabled } from "@/lib/memory-book/feature"
import { buildMemoryBookSharePath } from "@/lib/memory-book/share-slug"
import type { MemoryBookSummary } from "@/lib/memory-book/types"
import { createClient } from "@/utils/supabase/server"

export const metadata = {
  title: "Memory Books | BringBack Dashboard",
  description: "Create, continue, and manage your private family memory books.",
}

const SOURCE_TYPES = new Set([
  "restoration",
  "family_portrait",
  "add_person",
  "animation",
  "nostalgic_hug",
])

export default async function MemoryBookPage({
  searchParams,
}: {
  searchParams: Promise<{
    sourceType?: string
    sourceId?: string
  }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  if (!isMemoryBookEnabled(user.id, user.email)) {
    redirect("/dashboard")
  }

  const [{ data: books, error }, { data: entitlement }, params] =
    await Promise.all([
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
      searchParams,
    ])

  if (error) {
    throw new Error(`Unable to load memory books: ${error.message}`)
  }

  const libraryBooks = ((books || []) as MemoryBookSummary[]).map((book) => ({
    ...book,
    shareUrl:
      book.status === "published"
        ? buildMemoryBookSharePath(book.share_slug)
        : null,
  }))

  const suggestedSource =
    params.sourceId &&
    SOURCE_TYPES.has(params.sourceType || "") &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      params.sourceId
    )
      ? {
          sourceId: params.sourceId,
          sourceType: params.sourceType as
            | "restoration"
            | "family_portrait"
            | "add_person"
            | "animation"
            | "nostalgic_hug",
        }
      : null

  return (
    <MemoryBookLibrary
      books={libraryBooks}
      entitlement={entitlement}
      suggestedSource={suggestedSource}
    />
  )
}
