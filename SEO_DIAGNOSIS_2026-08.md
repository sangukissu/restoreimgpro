# BringBack.pro — SEO/AEO Root-Cause Diagnosis

**Date:** 2026-08-09
**Data:** GSC export, last 6 months (2026-02-08 → 2026-08-07), Web search type
**Method:** GSC time-series + page/query attribution, git forensics on every SEO commit, live production crawl as Googlebot, competitor SERP analysis

---

## TL;DR — the one-paragraph answer

Two Google core updates (March 27–Apr 8 and May 21–Jun 2, 2026) demoted your thin programmatic `/restore/*` cluster. That was the *original* wound and it was largely unavoidable. **The fatal damage was the response.** Between June 8 and July 22 you deleted or 301'd away roughly 40 URLs — including the four best-converting pages on the entire site — and served **HTTP 410 Gone** to 149 pages for 26 days. Impressions are down 69%, but the number that matters is this: **clicks went from 32.0/day (Jul 11–24) to 16.4/day (Aug 1–7) — a 49% collapse in three weeks**, timed exactly to the July 19–22 redirect deployment. You didn't get penalized. You amputated the healthy limb.

---

## 1. What the data actually says

### 1.1 The headline numbers

| Window | Clicks/day | Impressions/day | CTR | Avg pos |
|---|---:|---:|---:|---:|
| Peak (Mar 9 – Apr 5) | 33.8 | 3,173 | 1.06% | 7.2 |
| Jun 12 – Jul 10 | 28.4 | 1,178 | 2.41% | 10.8 |
| Jul 11 – Jul 24 | 32.0 | 1,037 | 3.09% | 9.5 |
| **Aug 1 – Aug 7** | **16.4** | **878** | 1.87% | 10.6 |

Impressions: **−69%**. Clicks over the full 6 months: −23%. **Clicks in the last 3 weeks: −49%.**

The impression decline alone was *not* the emergency. Through July you were converting a smaller index into roughly the same number of clicks — CTR nearly tripled (1.06% → 3.09%) because low-quality long-tail impressions fell away. That is what healthy pruning looks like.

**Then clicks fell off a cliff in the last two weeks.** That is new, it is not pruning, and it is the thing to fix.

### 1.2 The event timeline

| Date | Event | Source |
|---|---|---|
| Mar 27 – Apr 8 | **Google March 2026 core update** | external |
| Mar 30 | `8416c03` "removed crawled but not indexed URLs" | self |
| May 18 | `c23d0fd` 165 redirect rules added for `/restore/*` | self |
| **May 21 – Jun 2** | **Google May 2026 core update** | external |
| **Jun 8** | `8712f2c` **HTTP 410 Gone served to ALL `/restore/*` (149 pages)**; entire pSEO codebase deleted (`generate-pages.ts`, `pseo-data.ts`, `schema-generator.ts` — 1,327 lines) | self |
| Jun 22 | `b77ee93` robots.txt **blocks every AI crawler** | self |
| Jul 2 | `2b21e8b` 7 blog posts 301'd to product pages | self |
| Jul 4 | `589ac65` `/restore/*` switched from 410 → blanket 301 to one page | self |
| Jul 8 | `6ebb634` robots.txt partially reopened (GPTBot/ClaudeBot/CCBot still blocked) | self |
| **Jul 19–22** | `5183c44`/`6b8f973` **all `/features/*` and `/app/*` 301'd away**, removed from sitemap | self |
| Jul 25 – Aug 7 | **clicks −49%** | consequence |

The lag between the July 19–22 deploy and the late-July/August click collapse is exactly the 1–3 weeks Google needs to process 301s and swap the indexed URL.

---

## 2. Root causes, ranked by damage

### 🔴 #1 — You redirected away your best-performing pages

909 clicks (**16.6% of all clicks**) and 55,305 impressions (**14.0% of all impressions**) in the last 6 months sat on URLs that now 301 or 404.

The worst single decision:

| | URL | Clicks | Impr | CTR | Position |
|---|---|---:|---:|---:|---:|
| **Source (killed)** | `/features/add-deceased-loved-one-to-photo` | **569** | 11,206 | **5.08%** | **5.96** |
| **Destination** | `/add-person-to-photo` | 38 | 936 | 4.06% | 10.97 |

That page was your **#4 page sitewide and your single best CTR asset** — 5.08% CTR at position 6 is excellent. It was 308'd into a page sitting at position 11 with 1/25th the impressions.

Others in the same wave:

| URL | Clicks | Impr | CTR | Pos | Now → |
|---|---:|---:|---:|---:|---|
| `/app/back-to-life-photo-app` | 146 | 3,680 | 3.97% | 6.90 | `/ai-photo-animation` |
| `/features/photo-joiner` | 69 | 4,157 | 1.66% | 8.52 | `/ai-family-portrait` |
| `/features/individual-photos-into-group` | 15 | 875 | 1.71% | 7.82 | `/ai-family-portrait` |
| `/features/father-and-child-portrait` | 8 | 301 | 2.66% | 5.26 | `/add-person-to-photo` |

**Weighted CTR of the pages you killed: 1.64%. Weighted CTR of the pages you kept: 1.34%.** You systematically removed the above-average performers.

**Why this is strategically wrong, not just tactically:** every competitor winning these terms uses a *dedicated exact-match page*, not a consolidated one — [animateoldphotos.org/add-loved-one-to-photo](https://animateoldphotos.org/add-loved-one-to-photo), [lovedonephoto.com](https://lovedonephoto.com/) (an entire EMD for this keyword), [media.io](https://www.media.io/ai/explore/zone/add-loved-one-to-photo), [Vondy](https://vondy.com/add-deceased-loved-one-to-photo-free-online). PixReunion ranks #2–6 across dozens of "add person" queries on one tightly-scoped `/add-person-to-photo` page. You had the winning structure and consolidated out of it.

As of today Google still shows `bringback.pro/features/add-deceased-loved-one-to-photo` in live results with its old title. That listing is mid-migration to a page ranked 5 positions worse. **The click decline has not finished landing.**

### 🔴 #2 — 410 Gone on 149 pages for 26 days

`proxy.ts` returned `410 Gone` + `X-Robots-Tag: noindex` for every `/restore/*` URL from Jun 8 to Jul 4.

410 is the most aggressive deindexing signal that exists — Google drops 410s far faster than 404s and does not retry them for a long time. Applied to 149 URLs at once, three days after a core update finished, this told Google to purge a third of your site's crawlable surface immediately.

It was then switched to a **blanket 301 pointing every one of those 149 URLs at a single page** (`/old-photo-restoration`). Google treats mass many-to-one redirects to a non-equivalent destination as **soft 404s** — no equity passes. So the cluster was destroyed twice: first purged, then redirected in a way that recovers nothing.

The result is visible in the query data:

| Cluster | Queries | Clicks | Impressions | CTR | Weighted avg position |
|---|---:|---:|---:|---:|---:|
| family portrait | 199 | 403 | 25,142 | 1.60% | **8.28** |
| animation | 307 | 414 | 19,317 | 2.14% | **12.61** |
| **restoration** | 284 | 138 | 18,521 | 0.75% | **25.23** |

Restoration — your namesake vertical — now averages **position 25**. Specifics: `how to restore old photos` pos 31.9, `restore old photos` pos 40.2, `old photo restoration` pos 60.5. You are functionally absent from the restoration SERP, and `/old-photo-restoration` (4,479 impressions, pos 10.52) never absorbed the traffic it inherited.

### 🟠 #3 — AI Overviews are eating your clicks (external, but you must adapt)

Non-brand CTR versus rough industry benchmarks by position:

| Position | Impressions | Actual CTR | Benchmark | Ratio |
|---:|---:|---:|---:|---:|
| 1 | 728 | 3.85% | ~28% | **0.14x** |
| 2 | 1,795 | 1.34% | ~15% | **0.09x** |
| 3 | 1,518 | 1.98% | ~11% | 0.18x |
| 4 | 3,971 | 1.11% | ~8% | 0.14x |
| 5 | 4,908 | 2.14% | ~6% | 0.36x |
| 7 | 7,047 | 2.02% | ~3.5% | 0.58x |
| 10 | 4,498 | 1.49% | ~2.2% | 0.68x |

(Benchmarks are directional industry averages, not exact.)

The shape is the tell. **The deficit is worst at position 1–4 and improves as you go deeper.** In a normal SERP that is impossible. It is the exact fingerprint of an AI Overview occupying the entire above-the-fold: being "ranked #1" underneath an AIO is worth almost nothing, while position 10 was already below the fold so it loses relatively less.

Corroborating evidence:

- **Desktop: 211,240 impressions, 0.68% CTR. Mobile: 151,104 impressions, 2.59% CTR.** Desktop gets *more* impressions and *one quarter* the CTR. AIOs render larger on desktop.
- **US = 45.1% of impressions at 0.83% CTR**, vs India 3.29% and Philippines 2.34%. AIO coverage is heaviest in the US.
- Your own competitor export (`analysis/pixreunionkeywords.md`) lists `AI Overview` as a SERP feature on **nearly every money query** in this niche, and shows rows where the AIO itself is the ranking entity with 0 clicks.

Worst-hit individual queries — high impressions, position 4–10, effectively zero clicks:

| Query | Impr | Clicks | CTR | Pos |
|---|---:|---:|---:|---:|
| how to edit a family picture together | 3,725 | 1 | 0.03% | 9.69 |
| how to make family photo into individual photos | 1,847 | 1 | 0.05% | 10.33 |
| how to create a family portrait with ai | 1,502 | 1 | **0.07%** | **4.29** |
| old photo joiner | 1,624 | 7 | 0.43% | 6.38 |
| back to life app | 630 | 2 | 0.32% | 5.33 |
| ai photo restoration techniques 2025 2026 | 417 | 0 | 0.00% | 4.27 |

Every one is informational phrasing. **Informational intent is now answered by the AIO and never clicked.** Published research puts CTR compression on AIO-present queries at 58–61% ([Seer](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update), [Search Engine Land](https://searchengineland.com/google-ai-overviews-ctr-recovery-study-475566)).

### 🔴 #4 — Your robots.txt destroys your AEO

Live at `bringback.pro/robots.txt` right now:

```
User-Agent: GPTBot        Disallow: /
User-Agent: ClaudeBot     Disallow: /
User-Agent: anthropic-ai  Disallow: /
User-Agent: CCBot         Disallow: /
User-Agent: cohere-ai     Disallow: /
```

You asked for an AEO assessment, so bluntly: **this is self-inflicted removal from answer engines.**

- **CCBot** = Common Crawl. It is the single largest open corpus feeding LLM training *and* many AI search products. Blocking it removes you from the substrate a huge share of AI answers are built on.
- **GPTBot** feeds OpenAI's model/knowledge layer. `OAI-SearchBot` (which you allow) covers live ChatGPT Search, but blocking GPTBot removes you from the persistent knowledge layer.
- **ClaudeBot / anthropic-ai** removes you from Anthropic's index entirely.

The comment in `app/robots.ts` calls these "zero-ROI scrapers." For a consumer AI tool whose competitors are actively being recommended inside ChatGPT and Perplexity answers, that framing is backwards. Your buyers are *exactly* the people asking an assistant "how do I add my late dad to my wedding photo." **Between Jun 22 and Jul 8 you also blocked PerplexityBot, OAI-SearchBot, ChatGPT-User and Google-Extended** — a full 16-day blackout from every answer engine simultaneously.

### 🟡 #5 — Title tag template bug on 24 files

`app/layout.tsx` sets `title.template = "%s | BringBack"`, but 24 page files already end their title with `| BringBack`. Live result:

- `/add-person-to-photo` → `Add a Person to Photo AI | Insert Missing Person in Family Photos | BringBack | BringBack` (89 chars — truncated in SERP)
- `/colorize-photos` → `Colorize Black and White Photos AI | BringBack | BringBack`

Doubled brand tokens look spammy, waste pixel width, and push the keyword out of the visible title. On a site already suffering CTR compression this is free damage.

### 🟡 #6 — Fake testimonial avatars on money pages

`components/landing/Hero.tsx`, `components/old-photo-restoration/Hero.tsx`, `components/ai-family-portrait/hero.tsx`, and `components/ai-photo-animation/hero.tsx` preload social-proof avatars from **`randomuser.me`** — 6 to 12 per page, including the homepage.

These are stock placeholder faces presented as customer social proof. That is a genuine E-E-A-T and trust-signal liability in a YMYL-adjacent, grief-related niche, and it is trivially detectable. It also adds render-blocking third-party requests to your largest pages (`/ai-family-portrait` ships **315 KB of HTML**).

---

## 3. What I would do, in order

### Immediate — this week

**1. Restore the four pages you should never have redirected.**
Remove these from `next.config.js` `redirects()` and republish the original content at the original URLs:

- `/features/add-deceased-loved-one-to-photo` ← highest priority by a wide margin
- `/app/back-to-life-photo-app`
- `/features/photo-joiner`
- `/features/individual-photos-into-group`

Add them back to `app/sitemap.ts`. Request indexing in GSC. These URLs still hold their history; Google has not fully swapped them yet, so reverting now is far cheaper than in a month. Differentiate them properly from the money pages rather than treating them as duplicates — they target different queries (`add deceased loved one to photo` vs `add person to photo` are distinct intents with distinct SERPs).

**2. Unblock the answer engines.**
In `app/robots.ts`, move `GPTBot`, `ClaudeBot`, `anthropic-ai`, `CCBot`, and `cohere-ai` out of `BLOCKED_SCRAPER_BOTS` and into the allowed groups. Keep `Bytespider`, `Diffbot`, and `ImagesiftBot` blocked — those genuinely are zero-ROI.

**3. Fix the title template.**
Strip the trailing `| BringBack` from the 24 page-level `title:` strings and let the layout template append it once.

**4. Replace the randomuser.me avatars** with real customer photos, illustrated avatars, or remove the social-proof block entirely.

### Short term — 2 to 4 weeks

**5. Replace the blanket `/restore/*` 301 with a real mapping.**
The current rule sends 149 URLs to one page — Google reads that as soft 404. Either map each URL to a genuinely equivalent destination, or restore the 20–30 `/restore/*` pages that still show impressions in the GSC export (`/restore/animate-old-photos` alone: 1,770 impressions at position 5.61) as properly-written pages. Blanket-redirect only the true zero-value remainder.

**6. Rebuild the restoration cluster.**
At weighted position 25.23 you have effectively conceded your core vertical. `/old-photo-restoration` is one page carrying what 149 pages used to. It needs supporting depth — a handful of genuinely useful, differentiated pages, not regenerated boilerplate.

### Structural — the strategy that matters

**7. Stop optimizing for informational queries. Optimize for the answer box, then the click.**

Your informational queries are dead weight — position 4 at 0.07% CTR converts nothing and never will again. Reallocate:

- **Chase commercial-intent queries.** Your best CTR is exactly there: `add deceased loved one to photo free` (8.45%), `create family portrait from multiple photos ai` (7.84%), `make photo move ai free` (12.12%). These convert because AIOs answer questions but don't *do the job*.
- **Structure pages to be cited by AI Overviews**, not to rank beneath them: direct answer in the first 40 words under a question-shaped H2, comparison tables, explicit specs (credits, resolution, formats, limits), and the `FAQPage`/`HowTo` schema you already ship.
- **Build brand demand.** Brand queries pull **4.97% CTR vs 1.61% non-brand** — 3x. Brand search is the one channel AI Overviews cannot intercept, and 26.2% of your clicks already come from it.

**8. Institute a rule: never redirect or delete a URL with clicks in the last 90 days without a documented reason.** Every one of the six "SEO upgrade" commits between Jul 19–22 shipped without a check against GSC performance data. That is the process failure underneath all of this.

---

## 4. Honest caveats

- The March and May 2026 core updates are real external events that coincide with the first two declines. Some of the impression loss was going to happen regardless — core updates target exactly the thin programmatic content the `/restore/*` cluster consisted of.
- CTR benchmarks in §2.3 are directional industry averages. The *shape* of the deficit is the robust finding, not the exact multiples.
- I could not measure backlinks, Core Web Vitals field data, or index coverage totals from the exports provided. `/ai-family-portrait` at 315 KB of HTML is worth a CrUX check.
- The August click drop is 7 days of data. It is consistent with the July 19–22 deploy and with the pages Google is still mid-migration on, but confirm with another 2 weeks before treating the magnitude as settled.

---

## 5. Evidence appendix

- Impression/click series: `GSC/Performance-on-Search/Chart.csv`
- Page attribution: `GSC/Performance-on-Search/Pages.csv`
- Query clusters: `GSC/Performance-on-Search/Queries.csv` (1,000 rows)
- Device split: `GSC/Performance-on-Search/Devices.csv`
- 410/404 casualties: `GSC/analysis/not-found/Table.csv`
- Redirect casualties: `GSC/page-with-redirect/Table.csv`
- Deindexed: `GSC/analysis/crawled-currently-not-indexed-bringback/Table.csv`
- Competitor SERP features: `analysis/pixreunionkeywords.md`, `analysis/kinpictkeywords.md`
- Live verification: `robots.txt`, `sitemap.xml` (72 URLs), Googlebot status checks on 9 URLs
