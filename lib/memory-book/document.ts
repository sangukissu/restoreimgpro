import {
  memoryBookDocumentV1Schema,
  type MemoryBookAssetRecord,
  type MemoryBookDocumentV1,
  type MemoryBookRecord,
} from "./types"
import { parseMemoryBookDraft, reconcileMemoryBookDraft } from "./draft"

export function limitWords(text: string, maxWords: number): string {
  if (!text) return ""
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ")
}

export function buildMemoryBookDocument(
  book: MemoryBookRecord,
  assets: MemoryBookAssetRecord[],
  options: { requireReady?: boolean } = {}
): MemoryBookDocumentV1 {
  const requireReady = options.requireReady ?? true
  const draft = reconcileMemoryBookDraft(
    parseMemoryBookDraft(book.draft_document),
    assets
  )
  const assignedIds = draft.spreads.flatMap((spread) => spread.assetIds)
  if (
    assignedIds.length < 6 ||
    assignedIds.length > 12 ||
    draft.spreads.some((spread) => spread.assetIds.length === 0) ||
    new Set(assignedIds).size !== assignedIds.length
  ) {
    throw new Error(
      "A published book requires 6 to 12 uniquely assigned memories and no empty pages"
    )
  }

  const assetMap = new Map(
    assets
      .filter((asset) => !asset.is_hidden)
      .map((asset) => [asset.id, asset])
  )

  const spreads = draft.spreads.map((draftSpread) => {
    const spreadAssets = draftSpread.assetIds
      .map((assetId) => assetMap.get(assetId))
      .filter((asset): asset is MemoryBookAssetRecord => Boolean(asset))
    if (
      spreadAssets.length !== draftSpread.assetIds.length ||
      (requireReady && spreadAssets.some((asset) => asset.status !== "ready"))
    ) {
      throw new Error("Every assigned memory must be prepared before publishing")
    }

    return {
      id: draftSpread.id,
      left: {
        kind: "botanical" as const,
        flower: "daisy" as const,
      },
      right: {
        kind: "memories" as const,
        heading: draftSpread.heading,
        body: limitWords(draftSpread.body, 40).slice(0, 420),
        assets: spreadAssets.map((asset) => ({
          id: asset.id,
          mediaType: asset.media_type,
          caption: limitWords(asset.caption, 15).trim().slice(0, 280),
          alt: asset.alt_text.trim().slice(0, 180) || "Family memory",
          featured: asset.is_featured,
        })),
      },
    }
  })

  return memoryBookDocumentV1Schema.parse({
    schemaVersion: 1,
    theme: "family_heritage_v1",
    bookId: book.id,
    cover: {
      title: draft.cover.title.trim() || "Our Family Heritage",
      subtitle: "",
      periodLabel: draft.cover.periodLabel,
    },
    dedication: draft.closingMessage,
    spreads,
    music: {
      enabled: book.music_enabled,
      trackId: "family-heritage-moonlight",
      title: "Moonlight",
      src: "/music/scott-buckley-moonlight(chosic.com).mp3",
      attribution:
        "'Moonlight' by Scott Buckley, released under CC BY 4.0. scottbuckley.com.au",
    },
    presentation: {
      downloadsEnabled: book.downloads_enabled,
      desktopMode: "flipbook",
      mobileMode: "swipe",
    },
  })
}
