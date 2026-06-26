import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { createClient } from "@/utils/supabase/server"
import {
  buildRestorationInput,
  getWebhookBaseUrl,
  originalProxyUrl,
  preserveOriginalForComparison,
  uploadR2ObjectToFal,
  validateOwnedTempRestoreKey,
} from "@/lib/restore-helpers"

fal.config({
  credentials: process.env.FAL_KEY,
})

type BatchRestoreItem = {
  clientId: string
  key: string
  filename: string
}

function isValidItem(value: unknown): value is BatchRestoreItem {
  if (typeof value !== "object" || value === null) return false
  const item = value as Record<string, unknown>
  return (
    typeof item.clientId === "string" &&
    item.clientId.length > 0 &&
    item.clientId.length <= 120 &&
    typeof item.key === "string" &&
    item.key.length > 0 &&
    typeof item.filename === "string" &&
    item.filename.length > 0 &&
    item.filename.length <= 255
  )
}

async function refundFailedRestoration(
  supabase: Awaited<ReturnType<typeof createClient>>,
  restorationId: string,
  message: string,
) {
  await supabase.rpc("fail_restoration_and_refund", {
    p_restoration_id: restorationId,
    p_error_message: message,
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ error: "Fal AI API key not configured" }, { status: 500 })
    }

    const body = await request.json().catch(() => ({}))
    const items = Array.isArray(body?.items) ? body.items : []

    if (items.length < 1 || items.length > 5 || !items.every(isValidItem)) {
      return NextResponse.json({ error: "Submit between 1 and 5 valid images." }, { status: 400 })
    }

    const clientIds = new Set(items.map((item: BatchRestoreItem) => item.clientId))
    if (clientIds.size !== items.length) {
      return NextResponse.json({ error: "Duplicate client image IDs are not allowed." }, { status: 400 })
    }

    for (const item of items as BatchRestoreItem[]) {
      if (!validateOwnedTempRestoreKey(item.key, user.id)) {
        return NextResponse.json({ error: "Invalid image key" }, { status: 400 })
      }
    }

    const batchId = crypto.randomUUID()
    const insertedRows = (items as BatchRestoreItem[]).map((item, index) => ({
      user_id: user.id,
      status: "processing",
      batch_id: batchId,
      batch_index: index,
      credits_charged: 1,
      credit_refunded: false,
    }))

    const { data: restorations, error: insertError } = await supabase
      .from("image_restorations")
      .insert(insertedRows)
      .select("id, batch_index")

    if (insertError || !restorations || restorations.length !== items.length) {
      return NextResponse.json({ error: "Failed to create restoration records" }, { status: 500 })
    }

    const { data: reservedCreditsRemaining, error: reserveError } = await supabase.rpc("reserve_restore_credits", {
      p_user_id: user.id,
      p_amount: items.length,
    })

    if (reserveError || typeof reservedCreditsRemaining !== "number") {
      await supabase
        .from("image_restorations")
        .update({
          status: "failed",
          error_message: "Insufficient credits",
          credits_charged: 0,
          credit_refunded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("batch_id", batchId)

      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 })
    }

    const rowByIndex = new Map<number, { id: string; batch_index: number }>()
    restorations.forEach((row) => rowByIndex.set(row.batch_index, row))
    const webhookBaseUrl = getWebhookBaseUrl(request)

    const results = await Promise.all(
      (items as BatchRestoreItem[]).map(async (item, index) => {
        const row = rowByIndex.get(index)
        if (!row) {
          return {
            clientId: item.clientId,
            restorationId: "",
            status: "failed" as const,
            originalImageUrl: "",
            error: "Restoration row was not created.",
          }
        }

        try {
          const originalKey = await preserveOriginalForComparison(item.key, user.id, batchId, index, item.filename)
          const uploadedFile = await uploadR2ObjectToFal(item.key)
          const input = buildRestorationInput(uploadedFile)

          const queueResult = await fal.queue.submit("fal-ai/nano-banana-2/edit", {
            input,
            webhookUrl: `${webhookBaseUrl}/api/fal/webhook?generationId=${row.id}&type=restoration`,
          })

          const { error: updateError } = await supabase
            .from("image_restorations")
            .update({
              fal_request_id: queueResult.request_id,
              original_image_url: originalKey,
              updated_at: new Date().toISOString(),
            })
            .eq("id", row.id)

          if (updateError) {
            throw updateError
          }

          return {
            clientId: item.clientId,
            restorationId: row.id,
            status: "processing" as const,
            originalImageUrl: originalProxyUrl(originalKey),
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to start restoration"
          await refundFailedRestoration(supabase, row.id, message)

          return {
            clientId: item.clientId,
            restorationId: row.id,
            status: "failed" as const,
            originalImageUrl: "",
            error: message,
          }
        }
      }),
    )

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      success: true,
      batchId,
      creditsRemaining: profile?.credits ?? reservedCreditsRemaining,
      restorations: results,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start batch restoration" },
      { status: 500 },
    )
  }
}
