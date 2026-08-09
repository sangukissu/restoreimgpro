# SEO/AEO Recovery — Change Log

**Date applied:** 2026-08-09
**Diagnosis this implements:** [SEO_DIAGNOSIS_2026-08.md](SEO_DIAGNOSIS_2026-08.md)
**Files changed:** 34 · **Deployed:** ❌ not yet — see [§ What you must do manually](#what-you-must-do-manually)

---

## Summary

Reverses the self-inflicted deindexing that ran from 2026-06-08 to 2026-07-22 and fixes the technical defects found in the audit. The single biggest item: **11 URLs that were 301'd away on 2026-07-19 are now live again**, including the page that was carrying 569 clicks at 5.08% CTR.

Nothing here is speculative. Every change is tied to a measured number in the GSC export.

---

## Changes

### 1. Restored 11 wrongly-redirected keyword pages 🔴 highest impact

**File:** `next.config.js`

Removed the `/features/*` and `/app/*` redirect block added on 2026-07-19.

**Why:** Those URLs carried **909 clicks (16.6% of sitewide) and 55,305 impressions** over the last 6 months. They were not thin duplicates — they are hand-written pages targeting distinct queries, and they were ranking positions 5–9 when they were redirected. Weighted CTR of the redirected set was **1.64%** vs **1.34%** for the pages that were kept: the consolidation systematically removed the above-average performers.

| Restored URL | Was earning | Position |
|---|---|---|
| `/features/add-deceased-loved-one-to-photo` | **569 clicks, 11,206 impr, 5.08% CTR** | 5.96 |
| `/app/back-to-life-photo-app` | 146 clicks, 3,680 impr, 3.97% CTR | 6.90 |
| `/features/photo-joiner` | 69 clicks, 4,157 impr | 8.52 |
| `/features/individual-photos-into-group` | 15 clicks, 875 impr | 7.82 |
| `/features/merge-images` | 14 clicks, 553 impr | 11.97 |
| `/features/father-and-child-portrait` | 8 clicks, 301 impr, 2.66% CTR | 5.26 |
| `/features/ai-image-combiner` | 4 clicks, 115 impr | 9.59 |
| `/features/black-and-white-composite` | 3 clicks, 509 impr | 5.25 |
| `/app/make-pictures-smile` | 3 clicks, 293 impr | 5.71 |
| `/app/animate-old-photos` | (targets "animate old photos", 603 impr query) | — |
| `/app/sharpen-wedding-photos` | (targets "sharpen wedding photos") | — |

**Verified before reverting:** the page components (`app/features/[slug]/page.tsx`, `app/app/[slug]/page.tsx`) and their content (`lib/featuresdata.ts`, `lib/appdata.ts`) were never deleted — only shadowed by the redirects. Each page still ships correct canonical, `WebApplication` + `FAQPage` JSON-LD, and `generateStaticParams`. So these come back fully formed, not as stubs.

**Deliberately NOT reverted:** `/features/add-person-to-photo` → `/add-person-to-photo`. This one *was* genuine cannibalisation — same primary query, and the `/features/` version sat at position 16.94 / 0.69% CTR against 10.97 / 4.06% for the destination. Correct consolidation, kept.

---

### 2. Unblocked AI crawlers 🔴

**File:** `app/robots.ts`

`GPTBot`, `ClaudeBot`, `anthropic-ai`, `CCBot`, and `cohere-ai` moved from blocked to allowed. Regrouped into `GEO_DISCOVERY_BOTS` (live answer engines) and `KNOWLEDGE_LAYER_BOTS` (the corpora assistants answer from when not doing a live fetch).

**Why:** blocking these removed the site from every major answer engine. CCBot (Common Crawl) in particular underpins most open AI datasets and many SEO tools. For a consumer AI product whose buyers literally ask assistants "how do I add my late dad to a photo", this was self-removal from the highest-intent surface available.

**Note:** the working tree already had this flipped to allow-**everything** before I started (uncommitted). I kept that intent but **re-blocked `Bytespider`, `Diffbot`, `ImagesiftBot`** — these feed no answer engine, send no traffic, and Bytespider in particular crawls aggressively enough to inflate serverless billing. Blocking them costs nothing in SEO or AEO terms.

---

### 3. Replaced the blanket `/restore/*` redirect with a real map 🔴

**File:** `proxy.ts`

Was: all 149 retired pSEO URLs → `/old-photo-restoration`.
Now: intent-matched destinations, with `/old-photo-restoration` as the fallback.

**Why:** a many-to-one redirect to a non-equivalent page is read by Google as a **soft 404**, so none of the retained equity transferred. The fallback is genuinely correct for the `fix-<damage>-<subject>-photo` permutations that made up the bulk of the set — but not for these:

| Pattern | Now redirects to | Impressions rescued |
|---|---|---|
| `nero-ai-photo-restoration` | `/compare/nero-ai-alternative` | 1,004 (pos 7.73) |
| `animate-old-photos` | `/ai-photo-animation` | 1,770 (pos 5.61) |
| scan/digitize slugs (6) | `/guides/scan-family-photos-safely` | ~307 |
| `colorize-black-and-white`, `old-photo-color-restoration-online` | `/colorize-photos` | ~37 |
| `fix-blurry-*`, `fix-low-resolution-*`, `enhance-photo-quality` | `/denoise-photos` | ~450 |
| `gemini-`/`chatgpt-photo-restoration`, `best-photo-restoration-app` | `/compare` | ~80 |
| everything else | `/old-photo-restoration` (unchanged) | — |

Logic unit-tested: **14/14 cases pass**, including `/restore`, `/restore/`, and unknown slugs. Verified no redirect target is itself a redirect source (no chains).

---

### 4. Fixed the `| BringBack | BringBack` title bug 🟡

**Files:** 21 × `app/**/page.tsx`, `lib/featuresdata.ts`, `lib/appdata.ts`, `app/features/[slug]/page.tsx`, `app/app/[slug]/page.tsx` — **29 titles**

`app/layout.tsx` applies `title.template = "%s | BringBack"`, but 29 page titles already ended in `| BringBack` or `| BringBack AI`, producing doubled brand tokens in the SERP:

```
before:  Add a Person to Photo AI | Insert Missing Person in Family Photos | BringBack | BringBack   (89 chars, truncated)
after:   Add a Person to Photo AI | Insert Missing Person in Family Photos | BringBack               (76 chars)
```

**Care taken:** only *top-level* `title:` fields were stripped. `openGraph.title` and `twitter.title` do **not** receive the template, so they keep their brand — verified against live HTML before changing anything. For the two dynamic routes I added an explicit `socialTitle` so OG/Twitter cards keep the brand now that `meta.title` no longer carries it.

---

### 5. Removed fake testimonial avatars 🟡

**Files:** `components/landing/Hero.tsx`, `components/old-photo-restoration/Hero.tsx`, `components/ai-family-portrait/hero.tsx`, `components/ai-photo-animation/hero.tsx`

The "Trusted by 3.1K+ Families" face pile was loading **stock strangers from `randomuser.me`** — on the homepage and three money pages. Replaced with three of your own real restoration results (`/scratched-restored.webp`, `/colorized-school-photo.webp`, `/torn-restored.webp`), plus `loading="lazy"` and explicit dimensions.

**Why:** presenting stock photos as customer social proof is a real E-E-A-T liability in a grief-adjacent niche and is trivially detectable. Secondary win: removes 6–12 render-blocking third-party image requests from your heaviest pages.

**I did not touch the "3.1K+" figure** — that's your business metric to verify, not mine to edit. See manual actions.

---

### 6. Rebuilt the sitemap 🟠

**File:** `app/sitemap.ts` — **72 → 88 URLs**

- Added the 11 restored feature/app pages (derived from `featuresData`/`appData`, filtered through a `REDIRECTED_KEYWORD_PATHS` set so a redirected URL can never leak back in)
- Added the 5 localized pages (`/es/`, `/pt-br/`, `/id/`, `/de/`, `/ru/`) — these return 200, have hand-written localized copy, and still earn "Translated results" impressions, but were dropped from the sitemap on 2026-07-19 and linked from nowhere
- Bumped `SITE_LAST_MODIFIED` to `2026-08-09` so the recrawl is signalled

---

### 7. Re-linked the restored pages internally 🟠

**File:** `app/features/page.tsx`

Added a **"Specific use cases"** section linking all 11 restored pages with keyword-matched anchor text.

**Why:** without this they'd be sitemap-only. Sitemap presence alone gives weak crawl priority and passes no internal PageRank — the restore would have been half a fix.

---

### 8. Retargeted one mismatched blog redirect 🟡

**File:** `next.config.js`

`/blog/how-to-restore-great-grandparents-wedding-photos-with-ai` → was `/add-person-to-photo`, now `/old-photo-restoration`. The post was about *restoring* wedding photos, not adding a person — a topical mismatch Google treats as a soft 404.

**Checked and left alone:** the other 6 blog redirects. I verified against the live WordPress API that **none of those slugs still exist**, so those posts really are deleted and their redirects are correct.

---

## Verification performed

| Check | Result |
|---|---|
| `npx tsc --noEmit` on all 34 changed files | ✅ clean |
| Turbopack production compile | ✅ `Compiled successfully in 24.8s` |
| `/restore/*` redirect resolver unit tests | ✅ 14/14 |
| Redirect chain audit (no target is also a source) | ✅ none |
| Sitemap composition | ✅ 88 URLs, 1 correctly excluded |
| `randomuser.me` references remaining | ✅ 0 |
| OG/Twitter titles still branded | ✅ verified against live HTML |

### ⚠️ One thing I could not fully verify

`next build` fails locally on two **pre-existing** TypeScript errors in `app/api/christmas-portrait/route.ts` and `app/api/fal/enhance/route.ts`.

**This is not a real blocker and I deliberately did not "fix" it.** Your local `node_modules` has `@fal-ai/client@1.10.1`, but `package-lock.json` pins `1.6.2`. Vercel runs `npm ci` and installs the locked version, whose looser types accept both calls — which is why your Aug 3 deploy succeeded. Editing those routes would have meant changing working AI-pipeline behaviour to satisfy a local-only artifact.

It will become a genuine blocker the day you bump `@fal-ai/client`. See manual actions.

---

## What you must do manually

### Immediately after deploying

1. **Deploy.** Nothing in this changelog is live yet.

2. **Verify the redirects are gone.** All 11 should return `200`:
```bash
for u in /features/add-deceased-loved-one-to-photo /features/photo-joiner /features/individual-photos-into-group /features/merge-images /features/father-and-child-portrait /features/ai-image-combiner /features/black-and-white-composite /app/back-to-life-photo-app /app/make-pictures-smile /app/animate-old-photos /app/sharpen-wedding-photos; do echo "$(curl -s -o /dev/null -w '%{http_code}' https://bringback.pro$u) $u"; done
```

3. **Confirm robots.txt** at `https://bringback.pro/robots.txt` — `GPTBot`, `ClaudeBot`, `CCBot`, `anthropic-ai`, `cohere-ai` should now show `Allow: /`; only `Bytespider`, `Diffbot`, `ImagesiftBot` should show `Disallow: /`.

### In Google Search Console (do this the same day)

4. **Resubmit the sitemap** — Sitemaps → re-submit `https://bringback.pro/sitemap.xml`.

5. **Request indexing individually** for the 11 restored URLs via URL Inspection → *Request Indexing*. Do `/features/add-deceased-loved-one-to-photo` first. This is the fastest lever you have; Google is mid-migration on these and manual requests can halt the swap before it completes.

6. **Run "Validate Fix"** on the *Page with redirect* report so Google recrawls that whole set.

7. **Repeat 4–6 in [Bing Webmaster Tools](https://www.bing.com/webmasters)** — Bing feeds ChatGPT's search results, so this is your AEO recovery path too.

### Business decisions only you can make

8. **Verify the "3.1K+ Families" claim** in the hero components. If it isn't defensible, change the number or drop the stat. I removed the fake faces but left your metric untouched.

9. **When you next bump `@fal-ai/client`**, the two type errors in §Verification become real build failures. Fix at that point: constrain `aspectRatio` in `app/api/christmas-portrait/route.ts` to the allowed union (it's currently unvalidated user input reaching the upstream API — a small security smell too), and check whether `upscaling` is still a valid CodeFormer parameter.

### Process — the thing that actually caused this

10. **Adopt the rule now in `next.config.js`:** never redirect or delete a URL with clicks in the last 90 days unless it targets the *same query* as the destination. All six "SEO upgrade" commits between Jul 19–22 shipped without a single check against GSC data. That process gap is what turned a core-update dip into a 49% click collapse.

### Follow-up work this change does NOT cover

11. **The restoration vertical is still lost** (weighted position 25.2; `restore old photos` at pos 40, `old photo restoration` at pos 60). The 149 deleted pSEO pages are not coming back and shouldn't — they were exactly what the March/May core updates targeted. Rebuilding needs a handful of genuinely differentiated pages, which is content work, not a config change.

12. **Restructure money pages for AI Overview citation** — direct answer in the first 40 words under a question-shaped H2, comparison tables, explicit specs. Your informational queries are dead weight now (position 4 at 0.07% CTR); the recovery is in commercial-intent terms where your CTR is already 8–12%.

13. **Consider hreflang** on the 5 localized pages now that they're back in the sitemap. They currently have no `alternates.languages` annotations.

---

## Rollback

Every change is confined to these files:

```
app/robots.ts  app/sitemap.ts  next.config.js  proxy.ts
app/features/page.tsx  app/features/[slug]/page.tsx  app/app/[slug]/page.tsx
components/{landing,old-photo-restoration,ai-family-portrait,ai-photo-animation}/[Hh]ero.tsx
lib/featuresdata.ts  lib/appdata.ts
21 × app/**/page.tsx (title strings only)
```

`git revert` of this commit fully restores prior behaviour. Note that re-applying the redirects afterwards would re-trigger the same deindexing, so revert only the specific file you need.
