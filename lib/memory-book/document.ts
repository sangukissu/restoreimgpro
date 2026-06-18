import {
  memoryBookDocumentV1Schema,
  type MemoryBookAssetRecord,
  type MemoryBookDocumentV1,
  type MemoryBookRecord,
} from "./types"

export const SPREAD_HEADINGS = [
  "Where our story begins",
  "The faces we carry",
  "Days worth remembering",
  "Love, passed forward",
  "The little family archive",
  "Still with us",
]

export const SPREAD_BODIES = [
  "A few photographs can hold an entire generation: its tenderness, its courage, and the ordinary days that became precious.",
  "These are the people whose expressions, rituals, and stories continue to shape the family we know today.",
  "Time changes the paper, but it does not take away the warmth inside the moment.",
  "Every generation leaves something gentle behind: a gesture, a saying, a familiar smile, a way of caring.",
  "Gathered here are the fragments that deserve to remain together, close enough to be revisited.",
  "The years move forward. What mattered stays, ready to be shared again.",
]

export function limitWords(text: string, maxWords: number): string {
  if (!text) return ""
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ")
}

export function buildMemoryBookDocument(
  book: MemoryBookRecord,
  assets: MemoryBookAssetRecord[]
): MemoryBookDocumentV1 {
  const visibleAssets = assets
    .filter((asset) => asset.status === "ready" && !asset.is_hidden)
    .sort((a, b) => a.position - b.position)
    .slice(0, 12)

  const spreads = Array.from({ length: Math.ceil(visibleAssets.length / 2) }, (_, index) => {
    const spreadAssets = visibleAssets.slice(index * 2, index * 2 + 2)
    const firstAsset = spreadAssets[0]

    // Read custom overrides from first asset's metadata JSON
    const metadata = (firstAsset?.metadata || {}) as Record<string, unknown>
    const customHeading = metadata.customHeading as string | undefined
    const customBody = metadata.customBody as string | undefined

    const heading = customHeading !== undefined
      ? customHeading
      : (SPREAD_HEADINGS[index] || `Family memory ${index + 1}`)

    const rawBody = index === 0 && book.notes.trim()
      ? book.notes.trim()
      : (customBody !== undefined ? customBody : SPREAD_BODIES[index])

    const body = limitWords(rawBody, 40).slice(0, 420)

    return {
      id: `heritage-spread-${index + 1}`,
      left: {
        kind: "botanical" as const,
        flower: "daisy" as const,
      },
      right: {
        kind: "memories" as const,
        heading,
        body,
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
      title: book.title.trim() || "Our Family Heritage",
      subtitle: book.honoree.trim() ? `For ${book.honoree.trim()}` : "",
      periodLabel: book.period_label.trim(),
    },
    dedication: book.dedication.trim(),
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
