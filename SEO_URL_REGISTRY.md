# URL Registry — what is live, what is retired, and why

**Purpose:** one place that answers "is this URL live or redirected, and who decided that?"
**Machine-readable source:** [`config/url-policy.json`](config/url-policy.json) — edit that, never `next.config.js`.
**Last updated:** 2026-08-09 (revision 5)

---

## How this works

`config/url-policy.json` is read by three consumers, so they can never disagree:

```
config/url-policy.json
   │   retiredKeywordPaths  +  retiredBlogPaths
   ├─→ next.config.js        builds redirects() from BOTH maps
   ├─→ app/sitemap.ts        excludes BOTH maps — keyword pages and blog slugs
   └─→ app/features/page.tsx excludes retired paths from internal links
```

Add a path to `retiredKeywordPaths` → it redirects, leaves the sitemap, and loses its internal link **in one edit**. Remove it → it comes back everywhere.

**Both maps are excluded from the sitemap**, including `retiredBlogPaths`. Those blog slugs cannot appear today because the WordPress API no longer returns them — but that is a property of the CMS, not a guarantee. Republishing one of those posts would otherwise put a 301'd URL straight back into the sitemap. `app/sitemap.ts` filters WordPress slugs through `isRetired('/blog/' + slug)` for exactly that reason.

> Fixed 2026-08-09 (rev 5). The first implementation excluded only `retiredKeywordPaths`; the blog filter it relied on was `slug.length > 2`, which despite its comment excluded nothing. Caught on review.

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

### 2026-08-09 · Final state — 3 keyword pages live

After two rounds of review, only pages backed by a **distinct query cluster with real demand** survive. Decided by pulling the query cluster for each page from `Queries.csv`, not by page-level impressions (which credit a page for queries a money page actually owns).

| URL | Status | Own query cluster | Page clicks | Rationale |
|---|---|---:|---:|---|
| `/features/add-deceased-loved-one-to-photo` | 🟢 **live** | — | 569 | Was the #4 page sitewide at 5.08% CTR / pos 5.96. Every competitor runs a dedicated page for this term. |
| `/features/photo-joiner` | 🟢 **live** | **2,786 impr**, 15 queries, wPos 7.35 | 69 | "photo joiner" / "pic joiner" is tool-category language, not family-portrait language. "old photo joiner" alone = 1,624 impr at pos 6.38. No money page targets it. |
| `/app/back-to-life-photo-app` | 🟢 **live** | **900 impr**, 9 queries, wPos 5.64 | 146 | "back to life app" = 630 impr at pos 5.33. Distinct product-category query. |

#### Round 2 — 3 more retired on query-cluster evidence

Challenged on the grounds that duplication applied to these too. **Correct.** The query data settled it:

| URL | Own query cluster | Verdict |
|---|---|---|
| `/features/merge-images` | **25 impr**, 2 queries, wPos 24.80 | Retired — essentially zero demand for "merge" language. Its 553 page impressions came from queries it does not own. |
| `/features/individual-photos-into-group` | cluster is **5,687 impr** but `/ai-family-portrait` already ranks pos 5.00–6.01 on every head term in it | Retired — competing against a money page that is already winning. Only "create a group photo from individual photos" (164 impr) was uniquely its own. |
| `/features/father-and-child-portrait` | **0 queries** in the entire 1,000-row export | Retired — no measurable demand at all. |

**Kept `/features/photo-joiner` against the same challenge.** Its query cluster is **2,786 impressions — 111× `merge-images`** — and "photo joiner" is a different search vocabulary from "family portrait", so `/ai-family-portrait` does not and will not rank for it. Retiring it would forfeit a distinct category with no page to inherit it. ⚠️ Was ~205 words and described a product that does not exist — **rewritten 2026-08-09**, now 532 words describing the real one. See the content section below.

### 2026-08-09 · Content defects found in the keyword pages

Investigating a report of keyword-spammed copy on `/app/back-to-life-photo-app` surfaced three measurable problems across the whole keyword-page set:

| Defect | Measurement | Action |
|---|---|---|
| **Image duplication** | Only **12 distinct images across 12 pages**. `/family-photo1.png` appeared on 7 pages, `/family-photo2.jpg` on 6. | Resolved as a side effect of the retirements — the 3 surviving pages now share **0 assets**. Verified. |
| **Encoding corruption** | 4 instances of UTF-8 em-dash mis-decoded as Windows-1252 (`â€"`) plus one U+FFFD replacement char, rendering as visible mojibake in the hero copy. | Fixed in `lib/appdata.ts`. 0 remaining sitewide. |
| **Keyword stuffing / fabricated claims** | See rewrite below. | `/app/back-to-life-photo-app` rewritten. |
| **Thin content** | Surviving pages ran 205–332 words of prose. | Rewritten: `photo-joiner` 205→532, `back-to-life` rewritten. `add-deceased-loved-one-to-photo` (299 words) still open. |

Notably, **text similarity between pages was under 35% for every pair** — the prose was genuinely distinct, not spun. The duplication was in the *images and template*, not the words. That distinction matters: this was not doorway-page spam, it was thin pages sharing a stock asset pool.

#### `/app/back-to-life-photo-app` rewrite

Removed:
- `"To truly create a realistic back to life app experience, our AI identifies over 100 micro-expressions"` — keyword inserted mid-sentence, and the "100 micro-expressions" figure is fabricated specificity
- `"Unlike some native apps that scrape your phone's camera roll"` — unsubstantiated accusation against unnamed competitors
- `"The Ultimate Back to Life App for Your Cherished Memories"` (H1) and `Why search the app store for a "BacktoLife app"?` (H2) — exact-match keyword bait
- `"Can I use this to bring my loved ones back to life (app feature)?"` — the `(app feature)` parenthetical was a stuffing artifact that read as broken English

Added: honest capability limits ("it reconstructs plausible motion from one still frame, so it is an interpretation, not footage"), the restore-before-animate guidance that is genuinely useful, and direct first-sentence answers in the FAQ so the page is quotable by AI Overviews.

#### 🚨 `/features/photo-joiner` was advertising a product that does not exist

The most serious content finding of the whole audit. The page described, in detail, a **panorama-stitching and collage tool**:

> "Seamless Panoramic Stitching" · "Overlap Detection" · "Exposure Compensation" · "Distortion Correction" · "Ghost Removal" · "Choose 'Panorama' for seamless stitching or 'Grid' for clean, structured layouts" · "you can add a customizable border with any color or thickness" · "we can even upscale the result"

**None of it exists.** A codebase search for panorama/stitch/collage/grid functionality returns exactly two hits, and both are prompt instructions doing the opposite:

```
lib/family-portrait/prompt-builder.ts:68
  DO NOT create a collage, "cut-and-paste," or "photoshop" composite.
```

On top of that, all three images on the page — `Left View`, `Right View`, and `Wide Panorama` — were **the same file** (`/vintage-street.webp`).

This is worse than keyword stuffing. Someone arriving from "photo joiner online" was promised a panorama stitcher and handed a family-portrait generator. It explains the page's 1.66% CTR and why 4,157 impressions produced only 69 clicks: the traffic was real, the promise was not, and it almost certainly bounced.

**Rewritten** to describe the actual product, with the intent mismatch handled head-on rather than papered over — the first FAQ is *"Is this a collage maker or a panorama stitcher?"* answered "Neither", and points people wanting a grid or panorama to a different class of tool. Expected effect: fewer impressions (the panorama queries will drop away) but materially better CTR and conversion on the "old photo joiner" intent, which is 58% of the cluster and is genuinely this product.

Prose 205 → 532 words. Images now three real composites (`fam-case1-inputA/inputB/combined`), unique to this page.

**Lesson for the registry:** before keeping a page on demand data, check that the page describes something you actually sell. Query demand justifies the URL; it does not justify the copy.

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

**Sitemap total: ~70** (was 72 before 2026-08-09; 9 keyword pages retired, 5 localized pages restored)

| Group | Count | Notes |
|---|---:|---|
| Core money pages | 9 | `/`, restoration, animation, family portrait, add/remove person, memory book, colorize, denoise |
| Pricing / examples / compare hub / features hub / guides hub | 5 | |
| Guides | 6 | |
| Compare — alternative pages | 14 | incl. `pixreunion-alternative`, `kinpict-alternative` |
| Trust & legal | 6 | about, methodology, editorial policy, privacy, terms, refunds |
| Benchmark | 1 | |
| **Feature/app keyword pages** | **3** | restored 2026-08-09, narrowed to those with their own query cluster |
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
