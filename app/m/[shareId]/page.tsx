import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MemoryBookPinGate } from "@/components/memory-book/memory-book-pin-gate"
import { PublicMemoryBook } from "@/components/memory-book/public-memory-book"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"
import { supabaseAdmin } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "A private Family Heritage keepsake | BringBack",
  description: "A private family keepsake protected by a PIN.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      nosnippet: true,
    },
  },
  openGraph: {
    title: "A private Family Heritage keepsake",
    description: "A private keepsake protected by a PIN.",
    type: "website",
    images: ["/og-image.png"],
  },
}

export default async function SharedMemoryBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ shareId: string }>
  searchParams: Promise<{ s?: string }>
}) {
  const [{ shareId }, query] = await Promise.all([params, searchParams])
  const signature = query.s || ""
  const shared = await getPublishedMemoryBookShare(shareId, signature)

  if (shared?.legacy) {
    redirect(`/m/${shared.book.share_slug}`)
  }

  if (!shared?.unlocked || !shared.document) {
    return <MemoryBookPinGate shareId={shareId} />
  }

  const documentAssets = shared.document.spreads.flatMap(
    (spread) => spread.right.assets
  )
  const { data: storedAssets } = await supabaseAdmin
    .from("memory_book_assets")
    .select("id, poster_key, metadata")
    .eq("book_id", shared.book.id)
    .in(
      "id",
      documentAssets.map((asset) => asset.id)
    )
  const storedAssetMap = new Map(
    (storedAssets || []).map((asset) => [asset.id, asset])
  )

  const assetSources = documentAssets.map((asset) => {
    const base = `/api/memory-books/share/${encodeURIComponent(shared.book.share_slug)}/media/${asset.id}`
    const storedAsset = storedAssetMap.get(asset.id)
    const canPreview =
      typeof storedAsset?.metadata?.thumbnailMediumKey === "string" ||
      Boolean(storedAsset?.poster_key) ||
      asset.mediaType === "image"
    return {
      id: asset.id,
      mediaType: asset.mediaType,
      src: base,
      poster: canPreview ? `${base}?preview=1` : null,
      downloadUrl: shared.book.downloads_enabled
        ? `${base}?download=1`
        : null,
    }
  })

  return (
    <PublicMemoryBook
      document={shared.document}
      assetSources={assetSources}
      shareId={shared.book.share_slug}
    />
  )
}