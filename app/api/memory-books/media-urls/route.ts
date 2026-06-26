import { NextResponse } from "next/server"
import { z } from "zod"
import { MEMORY_BOOK_MAX_ASSIGNED_MEMORIES } from "@/lib/memory-book/limits"
import {
  getOwnerCuratorMediaUrls,
  getOwnerMemoryBookAssetSources,
  requireMemoryBookUser,
} from "@/lib/memory-book/server"
import type { MemoryBookAssetRecord } from "@/lib/memory-book/types"
import { supabaseAdmin } from "@/utils/supabase/admin"

const requestSchema = z.object({
  assetIds: z.array(z.string().uuid()).max(MEMORY_BOOK_MAX_ASSIGNED_MEMORIES).default([]),
  sources: z.array(z.object({
    sourceType: z.enum(["restoration", "family_portrait", "add_person", "animation", "nostalgic_hug"]),
    sourceId: z.string().uuid(),
  })).max(500).default([]),
})

export async function POST(request: Request) {
  const { user } = await requireMemoryBookUser()
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const parsed = requestSchema.safeParse(await request.json().catch(() => ({})))
  if (!parsed.success) return NextResponse.json({ error: "Invalid media refresh" }, { status: 400 })

  const requestedAssets = new Set(parsed.data.assetIds)
  const { data } = requestedAssets.size
    ? await supabaseAdmin
        .from("memory_book_assets")
        .select("*")
        .eq("user_id", user.id)
        .in("id", [...requestedAssets])
    : { data: [] }
  const assets = (data || []) as MemoryBookAssetRecord[]
  const [assetSources, libraryItems] = await Promise.all([
    getOwnerMemoryBookAssetSources(assets),
    getOwnerCuratorMediaUrls(user.id, parsed.data.sources),
  ])
  return NextResponse.json({ assetSources, libraryItems })
}