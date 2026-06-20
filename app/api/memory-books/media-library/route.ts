import { NextResponse } from "next/server"
import { getCuratorMediaLibrary, requireMemoryBookUser } from "@/lib/memory-book/server"

export async function GET(request: Request) {
  const { user } = await requireMemoryBookUser()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  const cursor = new URL(request.url).searchParams.get("before")
  const before =
    cursor && !Number.isNaN(Date.parse(cursor))
      ? new Date(cursor).toISOString()
      : null
  const page = await getCuratorMediaLibrary(user.id, before)

  return NextResponse.json(page)
}
