import { extname } from "node:path"
import sharp from "sharp"
import {
  copyR2Object,
  getR2ObjectBuffer,
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
export async function createMemoryBookImagePreviews(input: {
  sourceKey: string
  userId: string
  bookId: string
  assetId: string
}) {
  const { body } = await getR2ObjectBuffer(input.sourceKey)
  const smallKey = memoryBookAssetKey({
    ...input,
    assetId: `${input.assetId}-thumb-320`,
    mediaType: "image",
    extension: ".webp",
  })
  const mediumKey = memoryBookAssetKey({
    ...input,
    assetId: `${input.assetId}-preview-640`,
    mediaType: "image",
    extension: ".webp",
  })
  const image = sharp(body, { failOn: "none" }).rotate()
  const [small, medium] = await Promise.all([
    image.clone().resize({ width: 320, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer(),
    image.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
  ])
  await Promise.all([
    putR2Object(smallKey, small, "image/webp", "private, max-age=31536000, immutable"),
    putR2Object(mediumKey, medium, "image/webp", "private, max-age=31536000, immutable"),
  ])
  return { thumbnailSmallKey: smallKey, thumbnailMediumKey: mediumKey }
}

export function sharedMediaDerivativeKey(input: {
  userId: string
  sourceType: string
  sourceId: string
  width: 320 | 640
}) {
  return `media-derivatives/${input.userId}/${input.sourceType}/${input.sourceId}-${input.width}.webp`
}

export async function createSharedMediaDerivatives(input: {
  locator: string
  userId: string
  sourceType: string
  sourceId: string
}) {
  let body: Buffer
  if (/^(images|videos|memory-books|media-derivatives)\//.test(input.locator)) {
    body = (await getR2ObjectBuffer(input.locator)).body
  } else {
    const response = await fetch(input.locator, { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) {
      throw new Error(`Unable to read preview source (${response.status})`)
    }
    body = Buffer.from(await response.arrayBuffer())
  }

  const smallKey = sharedMediaDerivativeKey({ ...input, width: 320 })
  const mediumKey = sharedMediaDerivativeKey({ ...input, width: 640 })
  const image = sharp(body, { failOn: "none" }).rotate()
  const [small, medium] = await Promise.all([
    image.clone().resize({ width: 320, withoutEnlargement: true }).webp({ quality: 72 }).toBuffer(),
    image.clone().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
  ])
  await Promise.all([
    putR2Object(smallKey, small, "image/webp", "private, max-age=31536000, immutable"),
    putR2Object(mediumKey, medium, "image/webp", "private, max-age=31536000, immutable"),
  ])
  return { thumbnailSmallKey: smallKey, thumbnailMediumKey: mediumKey }
}