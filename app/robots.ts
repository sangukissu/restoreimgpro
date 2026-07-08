import { MetadataRoute } from "next"

// Paths that should never be crawlable by any user agent (dashboard, API,
// share links, auth, internal Next assets, admin).
const PRIVATE_PATHS = [
  "/api/",
  "/api/memory-books/share/",
  "/dashboard/",
  "/m/",
  "/private/",
  "/auth/",
  "/_next/",
  "/admin/",
]

// GEO-friendly discovery engines: these power real-time AI search & answer
// experiences. Blocking them would remove bringback.pro from Perplexity,
// ChatGPT search, Claude URL analysis, etc. Allow broadly, but keep private
// paths off-limits.
const GEO_DISCOVERY_BOTS = [
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ChatGPT-User",
  "Claude-Web",
]

// Legacy/extended assistants: control whether our content feeds their AI
// training and conversational surfaces. Allow so we surface cleanly in their
// next-gen search UIs, while still keeping private paths off-limits.
const LEGACY_ASSISTANT_BOTS = [
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
]

// Aggressive, zero-ROI scrapers: vacuum content for bulk training or
// commercial arbitrage, send no traffic, and can spike serverless costs.
// Block site-wide.
const BLOCKED_SCRAPER_BOTS = [
  "CCBot",
  "Bytespider",
  "Diffbot",
  "ImagesiftBot",
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "cohere-ai",
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default policy for every other bot.
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // GEO discovery engines: full access minus private paths.
      ...GEO_DISCOVERY_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
      // Legacy assistants: same as above.
      ...LEGACY_ASSISTANT_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
      // Block scrapers site-wide.
      ...BLOCKED_SCRAPER_BOTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
    sitemap: "https://bringback.pro/sitemap.xml",
  }
}