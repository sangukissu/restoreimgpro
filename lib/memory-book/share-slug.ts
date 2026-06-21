import { z } from "zod"

const RESERVED_SHARE_SLUGS = new Set([
  "api",
  "app",
  "admin",
  "dashboard",
  "login",
  "logout",
  "memory-book",
  "new",
  "privacy",
  "settings",
  "share",
  "support",
  "terms",
])

export const memoryBookShareSlugSchema = z
  .string()
  .trim()
  .min(3, "Use at least 3 characters")
  .max(60, "Use no more than 60 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and single hyphens"
  )
  .refine((value) => !RESERVED_SHARE_SLUGS.has(value), {
    message: "That address is reserved",
  })

export function normalizeMemoryBookShareSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 60)
    .replace(/-+$/g, "")
}

export function createMemoryBookSlugCandidates(
  title: string,
  subtitle = "",
  year = new Date().getFullYear()
) {
  const titleSlug = normalizeMemoryBookShareSlug(title)
  const subtitleSlug = normalizeMemoryBookShareSlug(subtitle)
  const base =
    titleSlug.length >= 3 && !RESERVED_SHARE_SLUGS.has(titleSlug)
      ? titleSlug
      : "family-keepsake"
  const candidates = [
    base,
    subtitleSlug ? normalizeMemoryBookShareSlug(`${base}-${subtitleSlug}`) : "",
    normalizeMemoryBookShareSlug(`${base}-${year}`),
    normalizeMemoryBookShareSlug(`${base}-memories`),
  ].filter((value) => memoryBookShareSlugSchema.safeParse(value).success)

  return Array.from(new Set(candidates))
}

export function buildMemoryBookSharePath(slug: string, signature: string) {
  return `/m/${slug}?s=${encodeURIComponent(signature)}`
}

