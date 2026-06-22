import { cookies } from "next/headers"
import { supabaseAdmin } from "@/utils/supabase/admin"
import {
  getMemoryBookViewerCookieName,
  verifyMemoryBookShare,
  verifyMemoryBookViewerSession,
} from "./security"
import { memoryBookDocumentV1Schema } from "./types"

export async function getPublishedMemoryBookShare(
  shareId: string,
  signature = "",
  _requireUnlocked = true
) {
  const isLegacyToken =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      shareId
    )
  let query = supabaseAdmin
    .from("memory_books")
    .select(
      "id, user_id, title, status, share_token, share_slug, share_version, pin_hash, pin_updated_at, downloads_enabled, music_enabled, published_revision_id"
    )
    .eq("status", "published")

  query = isLegacyToken
    ? query.eq("share_token", shareId)
    : query.eq("share_slug", shareId)
  const { data: book } = await query.maybeSingle()

  if (
    !book ||
    !book.pin_hash ||
    !book.published_revision_id ||
    (isLegacyToken &&
      !verifyMemoryBookShare(book.share_token, book.share_version, signature))
  ) {
    return null
  }

  const cookieStore = await cookies()
  const unlocked = verifyMemoryBookViewerSession(
    cookieStore.get(getMemoryBookViewerCookieName(book.share_token))?.value,
    book.share_token,
    book.share_version,
    book.pin_updated_at
  )

  if (!unlocked) {
    return {
      book,
      document: null,
      unlocked: false,
      legacy: isLegacyToken,
    }
  }

  const { data: revision } = await supabaseAdmin
    .from("memory_book_revisions")
    .select("id, revision_number, document, created_at")
    .eq("id", book.published_revision_id)
    .eq("book_id", book.id)
    .single()

  const parsed = memoryBookDocumentV1Schema.safeParse(revision?.document)
  if (!revision || !parsed.success) {
    return null
  }

  return {
    book,
    revision: {
      ...revision,
      document: parsed.data,
    },
    document: parsed.data,
    unlocked: true,
    legacy: isLegacyToken,
  }
}