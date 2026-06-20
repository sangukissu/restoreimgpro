import {
  memoryBookDraftDocumentSchema,
  type MemoryBookAssetRecord,
  type MemoryBookDraftDocument,
} from "./types"

export const DEFAULT_SPREAD_HEADINGS = [
  "Where our story begins",
  "The faces we carry",
  "Days worth remembering",
  "Love, passed forward",
  "The little family archive",
  "Still with us",
]

export const DEFAULT_SPREAD_BODIES = [
  "A few photographs can hold an entire generation: its tenderness, its courage, and the ordinary days that became precious.",
  "These are the people whose expressions, rituals, and stories continue to shape the family we know today.",
  "Time changes the paper, but it does not take away the warmth inside the moment.",
  "Every generation leaves something gentle behind: a gesture, a saying, a familiar smile, a way of caring.",
  "Gathered here are the fragments that deserve to remain together, close enough to be revisited.",
  "The years move forward. What mattered stays, ready to be shared again.",
]

export function createMemoryBookDraft(
  title = "Our Family Heritage"
): MemoryBookDraftDocument {
  return {
    schemaVersion: 1,
    cover: {
      title: title.trim() || "Our Family Heritage",
      periodLabel: "",
    },
    spreads: [],
    closingMessage: "",
  }
}

export function parseMemoryBookDraft(value: unknown): MemoryBookDraftDocument {
  const parsed = memoryBookDraftDocumentSchema.safeParse(value)
  if (parsed.success) return parsed.data

  const candidate =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {}
  const cover =
    candidate.cover && typeof candidate.cover === "object"
      ? (candidate.cover as Record<string, unknown>)
      : {}
  const rawSpreads = Array.isArray(candidate.spreads)
    ? candidate.spreads.slice(0, 6)
    : []
  const seen = new Set<string>()

  const spreads = rawSpreads.map((spread, index) => {
    const item =
      spread && typeof spread === "object"
        ? (spread as Record<string, unknown>)
        : {}
    const assetIds: string[] = []
    if (Array.isArray(item.assetIds)) {
      for (const assetId of item.assetIds) {
        if (
          typeof assetId === "string" &&
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assetId) &&
          !seen.has(assetId)
        ) {
          seen.add(assetId)
          assetIds.push(assetId)
        }
        if (assetIds.length === 2) break
      }
    }

    return {
      id:
        typeof item.id === "string" && item.id.trim()
          ? item.id.slice(0, 80)
          : `heritage-spread-${index + 1}`,
      assetIds,
      heading:
        typeof item.heading === "string"
          ? item.heading.slice(0, 80)
          : DEFAULT_SPREAD_HEADINGS[index] || `Family memory ${index + 1}`,
      body:
        typeof item.body === "string"
          ? item.body.slice(0, 420)
          : DEFAULT_SPREAD_BODIES[index] ||
            "A family memory worth keeping close.",
    }
  })

  return memoryBookDraftDocumentSchema.parse({
    schemaVersion: 1,
    cover: {
      title:
        typeof cover.title === "string"
          ? cover.title.slice(0, 90)
          : "Our Family Heritage",
      periodLabel:
        typeof cover.periodLabel === "string"
          ? cover.periodLabel.slice(0, 80)
          : "",
    },
    spreads,
    closingMessage:
      typeof candidate.closingMessage === "string"
        ? candidate.closingMessage.slice(0, 600)
        : "",
  })
}

export function reconcileMemoryBookDraft(
  draft: MemoryBookDraftDocument,
  assets: MemoryBookAssetRecord[]
): MemoryBookDraftDocument {
  const availableAssets = assets
    .filter((asset) => !asset.is_hidden)
    .sort((a, b) => a.position - b.position)
    .slice(0, 12)
  const availableIds = new Set(availableAssets.map((asset) => asset.id))
  const seen = new Set<string>()

  const spreads = draft.spreads.map((spread) => ({
    ...spread,
    assetIds: spread.assetIds.filter((assetId) => {
      if (!availableIds.has(assetId) || seen.has(assetId)) return false
      seen.add(assetId)
      return true
    }),
  }))

  // Legacy drafts did not own page assignments. Seed them once, then preserve
  // the user's page structure from that point forward.
  if (!spreads.length && availableAssets.length) {
    for (
      let index = 0;
      index < Math.ceil(availableAssets.length / 2);
      index += 1
    ) {
      spreads.push(
        makeSpread(
          index,
          availableAssets
            .slice(index * 2, index * 2 + 2)
            .map((asset) => asset.id),
          `heritage-spread-${index + 1}`
        )
      )
    }
  }

  return memoryBookDraftDocumentSchema.parse({ ...draft, spreads })
}

export function assignAssetToMemoryBookDraft(
  draft: MemoryBookDraftDocument,
  assetId: string
): MemoryBookDraftDocument {
  if (draft.spreads.some((spread) => spread.assetIds.includes(assetId))) {
    return draft
  }

  const openIndex = draft.spreads.findIndex(
    (spread) => spread.assetIds.length < 2
  )
  if (openIndex >= 0) {
    return memoryBookDraftDocumentSchema.parse({
      ...draft,
      spreads: draft.spreads.map((spread, index) =>
        index === openIndex
          ? { ...spread, assetIds: [...spread.assetIds, assetId] }
          : spread
      ),
    })
  }

  if (draft.spreads.length >= 6) return draft
  return memoryBookDraftDocumentSchema.parse({
    ...draft,
    spreads: [
      ...draft.spreads,
      makeSpread(draft.spreads.length, [assetId], createSpreadId()),
    ],
  })
}

export function createEmptyMemoryBookSpread(
  draft: MemoryBookDraftDocument
): MemoryBookDraftDocument {
  if (draft.spreads.length >= 6) return draft
  return memoryBookDraftDocumentSchema.parse({
    ...draft,
    spreads: [
      ...draft.spreads,
      makeSpread(draft.spreads.length, [], createSpreadId()),
    ],
  })
}

function makeSpread(index: number, assetIds: string[], id: string) {
  return {
    id,
    assetIds,
    heading: DEFAULT_SPREAD_HEADINGS[index] ?? `Family memory ${index + 1}`,
    body:
      DEFAULT_SPREAD_BODIES[index] ??
      "A family memory worth keeping close.",
  }
}

function createSpreadId() {
  return `heritage-spread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}