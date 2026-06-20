import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MemoryBookPinGate } from "@/components/memory-book/memory-book-pin-gate"
import { PublicMemoryBook } from "@/components/memory-book/public-memory-book"
import { getPublishedMemoryBookShare } from "@/lib/memory-book/share"
import { supabaseAdmin } from "@/utils/supabase/admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "A private Family Heritage keepsake | BringBack",
  description: "A private family keepsake shared with BringBack.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "A private Family Heritage keepsake",
    description: "Someone shared a private family keepsake with you.",
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
  if (!signature) notFound()

  const shared = await getPublishedMemoryBookShare(shareId, signature)
  if (!shared) notFound()

  if (!shared.unlocked || !shared.document) {
    return <MemoryBookPinGate shareId={shareId} signature={signature} />
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
      const base = `/api/memory-books/share/${shareId}/media/${asset.id}?s=${encodeURIComponent(signature)}`
      const storedAsset = storedAssetMap.get(asset.id)
      const hasPreview =
        typeof storedAsset?.metadata?.thumbnailMediumKey === "string"
      return {
        id: asset.id,
        mediaType: asset.mediaType,
        src: base,
        poster: hasPreview
          ? `${base}&preview=1`
          : asset.mediaType === "video" && storedAsset?.poster_key
            ? `${base}&poster=1`
            : null,
        downloadUrl: shared.book.downloads_enabled ? `${base}&download=1` : null,
      }
    })

  return (
    <PublicMemoryBook
      document={shared.document}
      assetSources={assetSources}
      shareId={shareId}
      signature={signature}
    />
  )
}
