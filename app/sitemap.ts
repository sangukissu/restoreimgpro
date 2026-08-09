import { MetadataRoute } from "next"
import { getAllPostSlugs } from "@/lib/wordpress"
import { listComparePages } from "@/lib/comparedata"
import { featuresData } from "@/lib/featuresdata"
import { appData } from "@/lib/appdata"
import { countryPages } from "@/lib/countrypages"
import urlPolicy from "@/config/url-policy.json"

const BASE = "https://bringback.pro"

/** Stable lastModified so every crawl does not look like a full-site rewrite. */
const SITE_LAST_MODIFIED = new Date("2026-08-09T00:00:00.000Z")

/**
 * Every retired URL — keyword pages AND deleted blog posts — read from the same
 * file next.config.js builds its redirects from. A redirected URL sitting in the
 * sitemap is a contradictory signal (crawl this / go away), so these must never
 * drift apart; hence the shared source rather than a hand-maintained list.
 *
 * Both maps are included deliberately. The blog paths currently cannot appear
 * anyway because the WordPress API no longer returns those slugs, but that is a
 * property of the CMS, not a guarantee — republishing one of those posts would
 * otherwise put a 301'd URL straight back into the sitemap.
 */
const RETIRED_PATHS = new Set([
  ...Object.keys(urlPolicy.retiredKeywordPaths),
  ...Object.keys(urlPolicy.retiredBlogPaths),
])

/** True if `path` is 301'd and must never be emitted as a sitemap entry. */
function isRetired(path: string): boolean {
  return RETIRED_PATHS.has(path)
}

/**
 * Feature and app keyword pages, restored to the sitemap on 2026-08-09 after
 * the 2026-07-19 consolidation was reverted. These target distinct queries from
 * the money pages and were ranking positions 5–9 before being redirected away.
 */
function keywordPageEntries(): MetadataRoute.Sitemap {
  return [...Object.values(featuresData), ...Object.values(appData)]
    .map((page) => page.slug)
    .filter((slug) => !isRetired(slug))
    .map((slug) => entry(slug, 0.75))
}

/**
 * Localized landing pages (es, pt-br, id, de, ru), restored 2026-08-09.
 *
 * These return 200, carry hand-written localized copy (not machine
 * translation), and still earn "Translated results" impressions in GSC — but
 * they were dropped from the sitemap on 2026-07-19 and are not linked from
 * anywhere, leaving them fully orphaned.
 */
function localizedPageEntries(): MetadataRoute.Sitemap {
  return Object.values(countryPages).map((page) => entry(page.slug, 0.6))
}

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] = "weekly"
): MetadataRoute.Sitemap[0] {
  return {
    url: path === "/" ? BASE : `${BASE}${path}`,
    lastModified: SITE_LAST_MODIFIED,
    changeFrequency,
    priority,
  }
}

/**
 * Indexable product, guide, comparison, and feature/app keyword pages.
 * Login, referral, dashboard, and genuinely redirected URLs stay out.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const comparePages = listComparePages()

  const staticPages: MetadataRoute.Sitemap = [
    entry("/", 1, "daily"),
    entry("/old-photo-restoration", 0.95),
    entry("/ai-photo-animation", 0.9),
    entry("/ai-family-portrait", 0.9),
    entry("/add-person-to-photo", 0.85),
    entry("/remove-person-from-photo", 0.85),
    entry("/family-memory-book", 0.85),
    entry("/colorize-photos", 0.75),
    entry("/denoise-photos", 0.7),
    entry("/pricing", 0.85),
    entry("/features", 0.8),
    entry("/examples", 0.8),
    entry("/compare", 0.8),
    entry("/guides", 0.75),
    entry("/guides/scan-family-photos-safely", 0.65),
    entry("/guides/restore-only-vs-colorize", 0.65),
    entry("/guides/why-ai-changes-faces", 0.65),
    entry("/guides/choose-source-photos-for-likeness", 0.6),
    entry("/guides/subtle-vs-exaggerated-animation", 0.6),
    entry("/guides/family-photo-metadata-checklist", 0.6),
    entry("/restoration-benchmark", 0.7),
    entry("/methodology", 0.55, "monthly"),
    entry("/about", 0.5, "monthly"),
    entry("/editorial-policy", 0.4, "monthly"),
    entry("/blog", 0.7, "daily"),
    entry("/privacy", 0.3, "monthly"),
    entry("/terms", 0.3, "monthly"),
    entry("/refunds", 0.3, "monthly"),
    // All comparison tools (hub + every alternative page)
    ...comparePages.map((p) => entry(p.href, 0.6, "monthly")),
    // Feature/app keyword pages (restored 2026-08-09)
    ...keywordPageEntries(),
    // Localized landing pages (restored 2026-08-09)
    ...localizedPageEntries(),
  ]

  let blogPages: MetadataRoute.Sitemap = []

  try {
    const slugs = await getAllPostSlugs()
    blogPages = slugs
      .filter((slug) => !slug.includes("#") && !slug.includes("?") && slug.trim() === slug)
      .filter((slug) => slug.length > 2)
      // Deleted posts that are 301'd in next.config.js. The WP API does not
      // return these today, but if one is ever republished this stops the
      // sitemap from advertising a URL that redirects away.
      .filter((slug) => !isRetired(`/blog/${slug}`))
      .map((slug) => ({
        url: `${BASE}/blog/${slug}`,
        lastModified: SITE_LAST_MODIFIED,
        changeFrequency: "weekly" as const,
        priority: 0.55,
      }))
  } catch (error) {
    console.error("Error generating blog sitemap:", error)
  }

  return [...staticPages, ...blogPages]
}
