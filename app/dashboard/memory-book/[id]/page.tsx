import { notFound, redirect } from "next/navigation"
import { MemoryBookCurator } from "@/components/memory-book/memory-book-curator"
import {
  getCuratorMediaLibrary,
  getMemoryBookAssets,
  getOwnedMemoryBook,
  getOwnerMemoryBookAssetSources,
} from "@/lib/memory-book/server"
import { signMemoryBookShare } from "@/lib/memory-book/security"
import { buildMemoryBookSharePath } from "@/lib/memory-book/share-slug"
import { isMemoryBookEnabled } from "@/lib/memory-book/feature"
import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"

export default async function MemoryBookCuratorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  if (!isMemoryBookEnabled(user.id, user.email)) redirect("/dashboard")

  const { id } = await params
  const book = await getOwnedMemoryBook(id, user.id)
  if (!book) notFound()

  const [assets, mediaLibraryPage, { data: reactions }, { data: entitlement }] =
    await Promise.all([
      getMemoryBookAssets(id, user.id),
      getCuratorMediaLibrary(user.id),
      supabaseAdmin
        .from("memory_book_reactions")
        .select("id, reaction, display_name, note, created_at")
        .eq("book_id", id)
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("memory_book_entitlements")
        .select("live_book_id, source, granted_at")
        .eq("user_id", user.id)
        .maybeSingle(),
    ])

  const assetSources = await getOwnerMemoryBookAssetSources(assets)

  return (
    <MemoryBookCurator
      initialBook={book}
      initialAssets={assets}
      initialAssetSources={assetSources}
      mediaLibrary={mediaLibraryPage.items}
      initialMediaCursor={mediaLibraryPage.nextCursor}
      reactions={reactions || []}
      entitlement={entitlement}
      initialShareUrl={
        book.status === "published"
          ? buildMemoryBookSharePath(
            book.share_slug,
            signMemoryBookShare(book.share_token, book.share_version)
          )
          : null
      }
    />
  )
}
