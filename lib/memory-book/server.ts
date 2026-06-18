import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import type {
  CuratorMediaOption,
  MemoryBookAssetRecord,
  MemoryBookRecord,
} from "./types"

export function ownerMediaUrl(locator: string, mediaType: "image" | "video") {
  if (
    locator.startsWith("images/") ||
    (locator.startsWith("memory-books/") && mediaType === "image")
  ) {
    return `/api/image-proxy?key=${encodeURIComponent(locator)}`
  }

  if (
    locator.startsWith("videos/") ||
    (locator.startsWith("memory-books/") && mediaType === "video")
  ) {
    return `/api/video-proxy?key=${encodeURIComponent(locator)}`
  }

  return locator
}

export async function requireMemoryBookUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null }
  }

  return { supabase, user }
}

export async function getOwnedMemoryBook(bookId: string, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("memory_books")
    .select("*")
    .eq("id", bookId)
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return null
  }

  return data as MemoryBookRecord
}

export async function getMemoryBookAssets(bookId: string, userId: string) {
  const { data } = await supabaseAdmin
    .from("memory_book_assets")
    .select("*")
    .eq("book_id", bookId)
    .eq("user_id", userId)
    .order("position", { ascending: true })

  return (data || []) as MemoryBookAssetRecord[]
}

export async function getCuratorMediaLibrary(userId: string): Promise<CuratorMediaOption[]> {
  const [
    { data: restorations },
    { data: portraits },
    { data: animations },
    { data: hugs },
  ] = await Promise.all([
    supabaseAdmin
      .from("image_restorations")
      .select("id, restored_image_url, created_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("restored_image_url", "is", null)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("family_portraits")
      .select("id, composed_image_url, created_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("video_generations")
      .select("id, video_url, original_image_url, preset_name, created_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("video_url", "is", null)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("nostalgic_hug_generations")
      .select("id, video_url, hug_image_url, created_at")
      .eq("user_id", userId)
      .eq("status", "completed")
      .not("video_url", "is", null)
      .order("created_at", { ascending: false }),
  ])

  return [
    ...(restorations || []).map((item) => ({
      id: item.id,
      sourceType: "restoration" as const,
      mediaType: "image" as const,
      title: "Restored photograph",
      createdAt: item.created_at,
      previewUrl: ownerMediaUrl(item.restored_image_url, "image"),
    })),
    ...(portraits || []).map((item) => ({
      id: item.id,
      sourceType: "family_portrait" as const,
      mediaType: "image" as const,
      title: "Family portrait",
      createdAt: item.created_at,
      previewUrl: ownerMediaUrl(item.composed_image_url, "image"),
    })),
    ...(animations || []).map((item) => ({
      id: item.id,
      sourceType: "animation" as const,
      mediaType: "video" as const,
      title: item.preset_name || "Animated memory",
      createdAt: item.created_at,
      previewUrl: ownerMediaUrl(item.video_url, "video"),
      posterUrl: item.original_image_url || undefined,
    })),
    ...(hugs || []).map((item) => ({
      id: item.id,
      sourceType: "nostalgic_hug" as const,
      mediaType: "video" as const,
      title: "Nostalgic Hug",
      createdAt: item.created_at,
      previewUrl: ownerMediaUrl(item.video_url, "video"),
      posterUrl: item.hug_image_url || undefined,
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function resolveMemorySource(
  userId: string,
  sourceType: MemoryBookAssetRecord["source_type"],
  sourceId: string
) {
  if (sourceType === "restoration") {
    const { data } = await supabaseAdmin
      .from("image_restorations")
      .select("restored_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.restored_image_url
      ? {
          mediaType: "image" as const,
          locator: data.restored_image_url as string,
          posterLocator: null,
          label: "Restored photograph",
        }
      : null
  }

  if (sourceType === "family_portrait") {
    const { data } = await supabaseAdmin
      .from("family_portraits")
      .select("composed_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.composed_image_url
      ? {
          mediaType: "image" as const,
          locator: data.composed_image_url as string,
          posterLocator: null,
          label: "Family portrait",
        }
      : null
  }

  if (sourceType === "animation") {
    const { data } = await supabaseAdmin
      .from("video_generations")
      .select("video_url, original_image_url, preset_name")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.video_url
      ? {
          mediaType: "video" as const,
          locator: data.video_url as string,
          posterLocator: (data.original_image_url as string | null) || null,
          label: (data.preset_name as string | null) || "Animated memory",
        }
      : null
  }

  if (sourceType === "nostalgic_hug") {
    const { data } = await supabaseAdmin
      .from("nostalgic_hug_generations")
      .select("video_url, hug_image_url")
      .eq("id", sourceId)
      .eq("user_id", userId)
      .eq("status", "completed")
      .single()
    return data?.video_url
      ? {
          mediaType: "video" as const,
          locator: data.video_url as string,
          posterLocator: (data.hug_image_url as string | null) || null,
          label: "Nostalgic Hug",
        }
      : null
  }

  return null
}

export async function enqueueMemoryBookJob(input: {
  userId: string
  bookId?: string | null
  assetId?: string | null
  jobType:
    | "preserve_asset"
    | "polish_copy"
    | "reaction_email"
    | "delete_storage"
    | "draft_expiry_warning"
  idempotencyKey: string
  payload?: Record<string, unknown>
}) {
  const { data, error } = await supabaseAdmin
    .from("memory_book_jobs")
    .upsert(
      {
        user_id: input.userId,
        book_id: input.bookId || null,
        asset_id: input.assetId || null,
        job_type: input.jobType,
        idempotency_key: input.idempotencyKey,
        payload: input.payload || {},
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}
