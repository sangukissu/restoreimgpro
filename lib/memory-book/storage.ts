import { extname } from "node:path"
import {
  copyR2Object,
  getR2ObjectStream,
  putR2Object,
} from "@/lib/r2"

function extensionFromContentType(contentType: string | null, locator: string) {
  if (contentType?.includes("png")) return ".png"
  if (contentType?.includes("webp")) return ".webp"
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return ".jpg"
  if (contentType?.includes("mp4")) return ".mp4"
  return extname(new URL(locator, "https://bringback.pro").pathname) || ".bin"
}

export function memoryBookAssetKey(input: {
  userId: string
  bookId: string
  assetId: string
  mediaType: "image" | "video"
  extension?: string
}) {
  const extension = input.extension || (input.mediaType === "video" ? ".mp4" : ".png")
  return `memory-books/${input.userId}/${input.bookId}/${input.assetId}${extension}`
}

export async function preserveMemoryBookLocator(input: {
  locator: string
  userId: string
  bookId: string
  assetId: string
  mediaType: "image" | "video"
}) {
  const defaultExtension = input.mediaType === "video" ? ".mp4" : ".png"
  const destinationKey = memoryBookAssetKey({ ...input, extension: defaultExtension })

  if (/^(images|videos|memory-books)\//.test(input.locator)) {
    await copyR2Object(input.locator, destinationKey)
    return destinationKey
  }

  const response = await fetch(input.locator, {
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) {
    throw new Error(`Unable to preserve source media (${response.status})`)
  }

  const contentType = response.headers.get("content-type")
  const extension = extensionFromContentType(contentType, input.locator)
  const resolvedDestination = memoryBookAssetKey({ ...input, extension })
  const body = Buffer.from(await response.arrayBuffer())
  await putR2Object(
    resolvedDestination,
    body,
    contentType || (input.mediaType === "video" ? "video/mp4" : "image/png"),
    "private, max-age=31536000, immutable"
  )
  return resolvedDestination
}

export async function readMemoryBookAsset(key: string, range?: string | null) {
  return getR2ObjectStream(key, range)
}
