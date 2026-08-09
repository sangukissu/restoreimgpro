# URL Registry — what is live, what is retired, and why

**Purpose:** one place that answers "is this URL live or redirected, and who decided that?"
**Machine-readable source:** [`config/url-policy.json`](config/url-policy.json) — edit that, never `next.config.js`.
**Last updated:** 2026-08-09

---

## How this works

`config/url-policy.json` is read by three consumers, so they can never disagree:

```
config/url-policy.json
   ├─→ next.config.js        builds redirects()
   ├─→ app/sitemap.ts        excludes retired paths from the sitemap
   └─→ app/features/page.tsx excludes retired paths from internal links
```

Add a path to `retiredKeywordPaths` → it redirects, leaves the sitemap, and loses its internal link **in one edit**. Remove it → it comes back everywhere.

The July 2026 incident happened because these three were maintained by hand and drifted apart.

---

## ⚖️ The rule for retiring a URL

> **A URL may only be retired if it targets the SAME primary query as its destination.**

**Low CTR is not a valid reason to retire a page.** This is the single most important line in this document.

Sitewide non-brand CTR is running at **0.09x–0.68x of benchmark at every position** because AI Overviews sit above the organic results (`SEO_DIAGNOSIS_2026-08.md` §2.3). Position 1 pulls 3.85% where ~28% is normal. So a page at position 5 with 0.6% CTR is not a weak page — that is what *every* page on the site looks like right now, including the money pages you would redirect it into.

Judge a page on **duplication**, not CTR:

| Signal | Retire? |
|---|---|
| Targets the same primary query as another page | ✅ yes — real cannibalisation |
| Two of your URLs alternate in GSC for one query | ✅ yes |
| Low CTR at a decent position | ❌ no — that's the SERP, not the page |
| Low click volume but a distinct query | ⚠️ judgement — see below |
| Content is templated permutation spam (the old `/restore/*` set) | ✅ yes — delete, don't just redirect |

For the "low volume but distinct query" case, ask: *does an existing page already rank for this exact term?* If yes, retire. If no, the page is your only claim on that term — keep it, even at 3 clicks.

---

## Decision log

### 2026-08-09 · Reverted the July consolidation (6 URLs back live)

Restored because each targets a query no money page targets, and they were ranking positions 5–9 when redirected.

| URL | Status | 6-mo clicks | Impr | Pos | Rationale |
|---|---|---:|---:|---:|---|
| `/features/add-deceased-loved-one-to-photo` | 🟢 **live** | 569 | 11,206 | 5.96 | Was the #4 page sitewide at 5.08% CTR. Competitors all run a dedicated page for this term. |
| `/app/back-to-life-photo-app` | 🟢 **live** | 146 | 3,680 | 6.90 | "back to life app" is its own query (630 impr) |
| `/features/photo-joiner` | 🟢 **live** | 69 | 4,157 | 8.52 | "photo joiner" cluster = 2,052 impr across variants |
| `/features/individual-photos-into-group` | 🟢 **live** | 15 | 875 | 7.82 | "create group photo from individual photos" — task query, distinct |
| `/features/merge-images` | 🟢 **live** | 14 | 553 | 11.97 | "merge images" — distinct tool-name query |
| `/features/father-and-child-portrait` | 🟢 **live** | 8 | 301 | 5.26 | Distinct niche, healthy position |

### 2026-08-09 · Re-retired 5 URLs after review

Initially restored in the same batch, then reversed. **Correctly challenged** on the grounds that they never produced meaningful clicks — and on inspection each duplicates an intent an existing page already owns. Combined they earned **10 clicks in 6 months**.

| URL | Status | 6-mo clicks | Redirects to | Why retired |
|---|---|---:|---|---|
| `/features/ai-image-combiner` | 🔴 retired | 4 | `/features/photo-joiner` | Third page competing for "combine/join photos" alongside photo-joiner and merge-images |
| `/features/black-and-white-composite` | 🔴 retired | 3 | `/ai-family-portrait` | Dominant intent is "family portrait from separate photos"; B&W is only a modifier |
| `/app/make-pictures-smile` | 🔴 retired | 3 | `/ai-photo-animation` | Same intent as the animation money page |
| `/app/animate-old-photos` | 🔴 retired | ~0 | `/ai-photo-animation` | Direct duplicate — `/ai-photo-animation` already targets this term |
| `/app/sharpen-wedding-photos` | 🔴 retired | ~0 | `/denoise-photos` | Same intent as the unblur/sharpen page |

Two destinations were **improved** vs the original July mapping: `black-and-white-composite` now goes to `/ai-family-portrait` instead of `/colorize-photos`, and `sharpen-wedding-photos` to `/denoise-photos` instead of `/old-photo-restoration`. Both are closer topical matches, which matters because a mismatched redirect is treated as a soft 404 and passes no equity.

### 2026-08-09 · Kept retired (unchanged from July)

| URL | 6-mo clicks | Pos | Why this one was correct |
|---|---:|---:|---|
| `/features/add-person-to-photo` | 3 | 16.94 | Genuine cannibalisation — same query as `/add-person-to-photo`, which sits at 10.97 with 4.06% CTR vs this page's 0.69% |

### 2026-08-09 · Blog posts — verified genuinely deleted

All 7 checked against the live WordPress API on 2026-08-09: **none of these slugs are still returned**, so the posts really are gone and the redirects are correct. Do not revive without republishing content first.

`can-ai-truly-restore-original-colors-to-old-photos` · `are-ai-upscalers-making-up-details` · `photoshop-generative-fill-vs-purpose-built-ai` · `what-is-ai-photo-restoration` · `why-bringback-ai-is-the-ultimate-choice-...` · `upscale-old-photos-for-prints-...` · `how-to-restore-great-grandparents-wedding-photos-with-ai`

One retargeted: `how-to-restore-great-grandparents-wedding-photos-with-ai` was pointing at `/add-person-to-photo` (the post was about *restoration*) → now `/old-photo-restoration`.

---

## The `/restore/*` cluster — 149 pages, permanently gone

Handled separately in `proxy.ts`, not in `url-policy.json`, because it's pattern-based rather than a fixed list.

| Period | Behaviour | Consequence |
|---|---|---|
| 2025-11-02 → 2026-06-08 | 149 live pSEO pages | Peak traffic, then demoted by the Mar + May 2026 core updates |
| **2026-06-08 → 2026-07-04** | **HTTP 410 Gone** | Hardest possible deindex signal, applied to all 149 at once |
| 2026-07-04 → 2026-08-09 | Blanket 301 → `/old-photo-restoration` | Many-to-one redirect = soft 404, no equity transferred |
| **2026-08-09 →** | **Intent-matched map + fallback** | Topically honest destinations |

Current mapping in `proxy.ts` (`RESTORE_SLUG_REDIRECTS`):

| Slug pattern | → Destination | Impressions |
|---|---|---:|
| `animate-old-photos` | `/ai-photo-animation` | 1,770 |
| `nero-ai-photo-restoration` | `/compare/nero-ai-alternative` | 1,004 |
| 6 scan/digitize slugs | `/guides/scan-family-photos-safely` | ~307 |
| `fix-blurry-*`, `fix-low-resolution-*`, `enhance-photo-quality` | `/denoise-photos` | ~450 |
| `colorize-black-and-white`, `old-photo-color-restoration-online` | `/colorize-photos` | ~37 |
| `gemini-`/`chatgpt-photo-restoration`, `best-photo-restoration-app` | `/compare` | ~80 |
| *everything else* | `/old-photo-restoration` | — |

**Do not resurrect these pages.** They were templated permutations (`fix-<damage>-<subject>-photo`) and are exactly what the March and May 2026 core updates demoted. Rebuilding the restoration vertical needs a small number of genuinely differentiated pages instead.

---

## Live URL inventory

**Sitemap total: 83** (was 72 before 2026-08-09)

| Group | Count | Notes |
|---|---:|---|
| Core money pages | 9 | `/`, restoration, animation, family portrait, add/remove person, memory book, colorize, denoise |
| Pricing / examples / compare hub / features hub / guides hub | 5 | |
| Guides | 6 | |
| Compare — alternative pages | 14 | incl. `pixreunion-alternative`, `kinpict-alternative` |
| Trust & legal | 6 | about, methodology, editorial policy, privacy, terms, refunds |
| Benchmark | 1 | |
| **Feature/app keyword pages** | **6** | restored 2026-08-09 |
| **Localized pages** | **5** | `/es/`, `/pt-br/`, `/id/`, `/de/`, `/ru/` — restored 2026-08-09, were orphaned |
| Blog (from WordPress) | ~31 | dynamic |

**Deliberately excluded from the sitemap:** `/dashboard/*`, `/admin/*`, `/api/*`, `/m/*` (private share links), `/auth/*`, `/login`, `/referral`, and everything in `retiredKeywordPaths`.

---

## Changing a URL — the checklist

Before you retire anything:

1. **Pull GSC data for that URL** — Performance → Pages → filter. Note clicks, impressions, position.
2. **Apply the rule above.** Same primary query as the destination? If not, stop.
3. **Check the destination actually ranks for that query.** Redirecting into a page at position 20 loses the position-5 ranking you had.
4. Add the path to `config/url-policy.json` → `retiredKeywordPaths`. Nothing else.
5. Add a row to the decision log above with the date, the numbers, and the reason.
6. After deploy, run **Validate Fix** on the *Page with redirect* report in GSC.

Before you revive anything:

1. Remove it from `config/url-policy.json`.
2. Confirm the page still renders — check `lib/featuresdata.ts` / `lib/appdata.ts` still has the slug.
3. Add it to `USE_CASE_PAGES` in `app/features/page.tsx` so it isn't orphaned.
4. Request indexing in GSC.

---

## Related documents

| Doc | What it covers |
|---|---|
| [SEO_DIAGNOSIS_2026-08.md](SEO_DIAGNOSIS_2026-08.md) | Root-cause analysis of the 69% impression / 49% click decline |
| [SEO_CHANGELOG_2026-08-09.md](SEO_CHANGELOG_2026-08-09.md) | Every code change made on 2026-08-09 + manual follow-ups |
| **SEO_URL_REGISTRY.md** (this file) | Live/retired state of every URL and the reasoning |
