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

// Live answer engines: these fetch at query time to build AI answers. Blocking
// them removes bringback.pro from Perplexity, ChatGPT Search and Claude — where
// a large share of "how do I add my late father to a photo" demand now lands.
const GEO_DISCOVERY_BOTS = [
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ChatGPT-User",
  "Claude-Web",
  "ClaudeBot",
]

// Knowledge-layer crawlers: these feed the corpora assistants answer from when
// they are NOT doing a live fetch. Absent here, assistants recommend
// competitors from memory even when we are the better answer. CCBot (Common
// Crawl) additionally underpins most open AI datasets and many SEO tools.
const KNOWLEDGE_LAYER_BOTS = [
  "GPTBot",
  "anthropic-ai",
  "CCBot",
  "cohere-ai",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
]

// Genuinely zero-ROI scrapers: these feed no answer engine and send no traffic.
// They resell content/images or crawl aggressively enough to inflate serverless
// billing. Blocking these costs us nothing in SEO or AEO terms.
const BLOCKED_SCRAPER_BOTS = [
  "Bytespider",
  "Diffbot",
  "ImagesiftBot",
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
      // Live answer engines: full access minus private paths.
      ...GEO_DISCOVERY_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
      // Knowledge-layer crawlers: same as above.
      ...KNOWLEDGE_LAYER_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
      // Zero-ROI scrapers: blocked site-wide.
      ...BLOCKED_SCRAPER_BOTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    ],
    sitemap: "https://bringback.pro/sitemap.xml",
  }
}