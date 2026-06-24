import { z } from "zod"
import { MEMORY_BOOK_MAX_PAGES } from "./limits"

export const memoryBookThemeSchema = z.literal("family_heritage_v1")
export const memoryBookMediaTypeSchema = z.enum(["image", "video"])

export const memoryBookDraftSpreadSchema = z.object({
  id: z.string().min(1).max(80),
  assetIds: z.array(z.string().uuid()).max(2),
  heading: z.string().max(80),
  body: z.string().max(420),
})

export const memoryBookDraftDocumentSchema = z
  .object({
    schemaVersion: z.literal(1),
    cover: z.object({
      title: z.string().max(90),
      periodLabel: z.string().max(80),
    }),
    spreads: z.array(memoryBookDraftSpreadSchema).max(MEMORY_BOOK_MAX_PAGES),
    closingMessage: z.string().max(600),
  })
  .superRefine((draft, context) => {
    const assigned = new Set<string>()
    draft.spreads.forEach((spread, spreadIndex) => {
      spread.assetIds.forEach((assetId, assetIndex) => {
        if (assigned.has(assetId)) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A memory can only appear on one page",
            path: ["spreads", spreadIndex, "assetIds", assetIndex],
          })
        }
        assigned.add(assetId)
      })
    })
  })

export const memoryBookAssetDocumentSchema = z.object({
  id: z.string().uuid(),
  mediaType: memoryBookMediaTypeSchema,
  caption: z.string().max(280),
  alt: z.string().min(1).max(180),
  featured: z.boolean(),
})

export const memoryBookSpreadSchema = z.object({
  id: z.string().min(1).max(80),
  left: z.object({
    kind: z.literal("botanical"),
    flower: z.literal("daisy"),
  }),
  right: z.object({
    kind: z.literal("memories"),
    heading: z.string().max(80),
    body: z.string().max(420),
    assets: z.array(memoryBookAssetDocumentSchema).min(1).max(2),
  }),
})

export const memoryBookDocumentV1Schema = z.object({
  schemaVersion: z.literal(1),
  theme: memoryBookThemeSchema,
  bookId: z.string().uuid(),
  cover: z.object({
    title: z.string().min(1).max(90),
    subtitle: z.string().max(120),
    periodLabel: z.string().max(80),
  }),
  dedication: z.string().max(600),
  spreads: z.array(memoryBookSpreadSchema).min(3).max(MEMORY_BOOK_MAX_PAGES),
  music: z.object({
    enabled: z.boolean(),
    trackId: z.literal("family-heritage-moonlight"),
    title: z.literal("Moonlight"),
    src: z.literal("/music/scott-buckley-moonlight(chosic.com).mp3"),
    attribution: z.string().max(240),
  }),
  presentation: z.object({
    downloadsEnabled: z.boolean(),
    desktopMode: z.literal("flipbook"),
    mobileMode: z.literal("swipe"),
  }),
})

export type MemoryBookDocumentV1 = z.infer<typeof memoryBookDocumentV1Schema>
export type MemoryBookAssetDocument = z.infer<typeof memoryBookAssetDocumentSchema>
export type MemoryBookDraftDocument = z.infer<typeof memoryBookDraftDocumentSchema>

export interface MemoryBookRecord {
  id: string
  user_id: string
  theme: "family_heritage_v1"
  title: string
  status: "draft" | "preparing" | "published" | "needs_attention"
  draft_version: number
  draft_document: MemoryBookDraftDocument
  preservation_consent: boolean
  share_token: string
  share_slug: string
  share_version: number
  pin_hash: string | null
  pin_updated_at: string | null
  downloads_enabled: boolean
  music_enabled: boolean
  published_revision_id: string | null
  last_activity_at: string
  expires_at: string
  created_at: string
  updated_at: string
}

export interface MemoryBookAssetRecord {
  id: string
  book_id: string
  user_id: string
  source_type: "restoration" | "family_portrait" | "animation" | "nostalgic_hug" | "upload"
  source_id: string | null
  media_type: "image" | "video"
  source_locator: string | null
  preserved_key: string | null
  poster_key: string | null
  original_label: string
  caption: string
  alt_text: string
  position: number
  is_featured: boolean
  is_hidden: boolean
  status: "pending" | "processing" | "ready" | "failed"
  metadata: Record<string, unknown>
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface MemoryBookSummary extends MemoryBookRecord {
  memory_book_assets: Array<Pick<MemoryBookAssetRecord, "id" | "status" | "is_hidden">>
}

export interface CuratorMediaOption {
  id: string
  sourceType: MemoryBookAssetRecord["source_type"]
  mediaType: MemoryBookAssetRecord["media_type"]
  title: string
  createdAt: string
  previewUrl: string
  posterUrl?: string
  fallbackUrl?: string
  previewStatus: "queued" | "processing" | "ready" | "failed"
  expiresAt?: string
}
