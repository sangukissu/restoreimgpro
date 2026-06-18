import { notFound, redirect } from "next/navigation"
import { MemoryBookCurator } from "@/components/memory-book/memory-book-curator"
import {
  getCuratorMediaLibrary,
  getMemoryBookAssets,
  getOwnedMemoryBook,
  ownerMediaUrl,
} from "@/lib/memory-book/server"
import { signMemoryBookShare } from "@/lib/memory-book/security"
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

  const [assets, mediaLibrary, { data: reactions }, { data: entitlement }] =
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

  const assetSources = assets.map((asset) => ({
    id: asset.id,
    mediaType: asset.media_type,
    src: ownerMediaUrl(
      asset.preserved_key || asset.source_locator || "",
      asset.media_type
    ),
    poster: asset.poster_key
      ? ownerMediaUrl(asset.poster_key, "image")
      : typeof asset.metadata.posterLocator === "string"
        ? asset.metadata.posterLocator
        : null,
    downloadUrl: asset.preserved_key
      ? ownerMediaUrl(asset.preserved_key, asset.media_type)
      : null,
  }))

  return (
    <MemoryBookCurator
      initialBook={book}
      initialAssets={assets}
      initialAssetSources={assetSources}
      mediaLibrary={mediaLibrary}
      reactions={reactions || []}
      entitlement={entitlement}
      initialShareUrl={
        book.status === "published"
          ? `/m/${book.share_token}?s=${signMemoryBookShare(
              book.share_token,
              book.share_version
            )}`
          : null
      }
    />
  )
}
