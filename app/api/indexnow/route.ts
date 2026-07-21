import { NextRequest, NextResponse } from "next/server"

/**
 * Notify IndexNow when strategic URLs change.
 * Set INDEXNOW_KEY in env and host the key file at /{key}.txt (or use keyLocation).
 * Does not guarantee indexing — only speeds discovery for supporting engines.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.INDEXNOW_SUBMIT_SECRET
  const key = process.env.INDEXNOW_KEY || "c98a37f2081d43eb8b52479e0a12e8b9"

  // Optional shared secret so the endpoint is not an open proxy
  if (secret) {
    const provided = req.headers.get("x-indexnow-secret")
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  let body: { urls?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const urls = (body.urls || [])
    .filter((u) => typeof u === "string" && u.startsWith("https://bringback.pro/"))
    .slice(0, 100)

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "Provide urls[] under https://bringback.pro/" },
      { status: 400 }
    )
  }

  const payload = {
    host: "bringback.pro",
    key,
    keyLocation: `https://bringback.pro/${key}.txt`,
    urlList: urls,
  }

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })

    const text = await res.text()
    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        submitted: urls.length,
        body: text.slice(0, 500),
      },
      { status: res.ok ? 200 : 502 }
    )
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "IndexNow request failed" },
      { status: 502 }
    )
  }
}
