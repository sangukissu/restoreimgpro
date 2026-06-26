import { NextResponse } from "next/server"
import { deleteR2PrefixOlderThan } from "@/lib/r2"

// Cron jobs must never be cached or statically rendered.
export const dynamic = "force-dynamic"
// R2 list + batch delete can take a while on large buckets; allow up to 60s.
export const maxDuration = 60

// Temp staging prefixes that hold one-shot uploads (presigned-upload-url writes
// under these). They are safe to sweep once older than the retention window.
const TEMP_PREFIXES = ["temp/family-portraits/", "temp/restorations/", "temp/add-person/"]

// Keep temp objects for this long before deleting, so in-flight uploads and
// retries have a comfortable window. Temp files are consumed within seconds of
// upload, so 6h is a generous safety margin.
const RETENTION_MS = 6 * 60 * 60 * 1000

/**
 * Verify the request is authorized. Vercel Cron automatically sends the
 * configured CRON_SECRET as `Authorization: Bearer <CRON_SECRET>`. We also
 * accept the header via `x-vercel-cron-secret` for manual/ad-hoc invocation.
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // If no secret is configured, refuse to run rather than execute unguarded.
    return false
  }
  const authHeader = request.headers.get("authorization") || ""
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
  const altHeader = request.headers.get("x-vercel-cron-secret") || ""
  return bearer === secret || altHeader === secret
}

/**
 * Sweep stale temp staging objects from R2.
 *
 * Called hourly by Vercel Cron (see vercel.json). The 6h retention is enforced
 * inside this handler regardless of how often the cron actually fires, so a
 * missed/delayed run never deletes objects too early.
 */
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const startedAt = new Date().toISOString()
  const totals = { scanned: 0, deleted: 0, skipped: 0, errors: [] as string[] }

  for (const prefix of TEMP_PREFIXES) {
    try {
      const result = await deleteR2PrefixOlderThan(prefix, RETENTION_MS)
      totals.scanned += result.scanned
      totals.deleted += result.deleted
      totals.skipped += result.skipped
      totals.errors.push(...result.errors)
    } catch (err) {
      totals.errors.push(
        `Sweep failed for prefix "${prefix}": ${
          err instanceof Error ? err.message : String(err)
        }`
      )
    }
  }

  if (totals.errors.length > 0) {
    console.warn("[cleanup-temp] completed with errors:", totals.errors)
  }

  return NextResponse.json({
    ok: true,
    startedAt,
    finishedAt: new Date().toISOString(),
    retentionHours: RETENTION_MS / (60 * 60 * 1000),
    prefixes: TEMP_PREFIXES,
    ...totals,
  })
}
