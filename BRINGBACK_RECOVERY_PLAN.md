# BringBack Recovery and Growth Plan

Prepared: 19 July 2026

## Executive verdict

**Keep BringBack. Kill the current SEO/content system around it.**

The product has real demand: it has generated about $2.2K, has 161 known paying customers, repeat purchases, very low refunds, and rising monthly revenue before the latest partial month. The restoration, animation, and family-photo workflows solve emotionally important jobs.

The site around the product is undermining it:

- The main restoration page declares the homepage as its canonical URL.
- Google indexed URLs fell from 90–91 to 39 while known non-indexed URLs rose to 131.
- The sitemap submits large clusters of orphaned, templated pages.
- Several pages make claims the implementation cannot support.
- Fictional-looking reviews and RandomUser avatars conflict with the weak real review profile.
- Pricing, credits, privacy, retention, and product capabilities disagree across pages.
- The strongest current differentiators—original preservation, batch processing, direct comparison, and the family-memory workflow—are poorly presented or not presented publicly.

There is no legitimate plan that can guarantee “100% SERP ownership.” Search engines do not offer that guarantee. This plan aims to make BringBack the clearest, most trustworthy family-photo preservation product in its attainable search and AI-answer niches.

Also, this is a one-time-project product, so the honest business target is **$5K in monthly revenue**, not conventional subscription MRR.

At the historical $8.95 average order value, $5K requires about 559 purchases per month. A plausible later-stage equation is:

`15,000 qualified visits × 3% purchase rate × $11 blended order value = $4,950/month`

That is roughly a 25× increase over the latest $195 month. SEO alone will not produce it quickly. The path needs technical recovery, conversion repair, useful content, proof, and repeatable distribution.

## What the audit found

### Indexing and crawl health

The Coverage export reports:

| Date | Indexed | Not indexed | Daily impressions |
|---|---:|---:|---:|
| 20 Apr 2026 | 90 | 64 | 2,582 |
| 1 May 2026 | 77 | 77 | 2,976 |
| 1 Jun 2026 | 57 | 95 | 2,075 |
| 10 Jun 2026 | 49 | 103 | 1,337 |
| 1 Jul 2026 | 39 | 131 | 994 |
| 10 Jul 2026 | 39 | 131 | 1,024 |

Current reasons:

- 70 crawled, currently not indexed
- 22 discovered, currently not indexed
- 22 not found
- 15 redirects
- 1 blocked by robots.txt
- 1 alternate page with a proper canonical

The redirected `/restore` pages are excluded from the content recommendations below, as requested. The remaining index contraction is still serious.

### Live-site technical defects

1. `/old-photo-restoration` emits `https://bringback.pro` as its canonical.
2. Its WebApplication structured data also uses the homepage URL and homepage `@id`.
3. `/refunds` also inherits the homepage canonical.
4. The sitemap contains 69 URLs:
   - 25 blog posts
   - 14 comparison pages
   - 8 feature pages
   - 5 localized pages
   - 4 “app” pages
   - 13 other pages
5. Thirty-three sitemap URLs have no internal links from any other submitted URL.
6. A deleted WordPress post remains in the sitemap and resolves as a near-empty 200/noindex placeholder.
7. Every sitemap request assigns `new Date()` as `lastModified`, even when the page did not change.
8. Localized `hreflang` omits German and Russian, lacks English/x-default, and does not form a complete reciprocal cluster.

Google describes redirects and `rel=canonical` as strong canonical signals, while sitemap inclusion is only a weak signal. The restoration page is therefore explicitly telling Google to consolidate its signals into the homepage. See [Google’s canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

### Thin, overlapping, and orphaned page clusters

The feature-page cluster includes:

- `/features/individual-photos-into-group`
- `/features/add-deceased-loved-one-to-photo`
- `/features/black-and-white-composite`
- `/features/father-and-child-portrait`
- `/features/merge-images`
- `/features/ai-image-combiner`
- `/features/photo-joiner`
- `/features/add-person-to-photo`

Most target the same “combine people/photos” job through the same template and repeat the same assets. The most obvious collision is “merge images,” “AI image combiner,” and “photo joiner.”

The app cluster similarly creates three overlapping animation intents:

- `/app/back-to-life-photo-app`
- `/app/make-pictures-smile`
- `/app/animate-old-photos`

The screenshot’s “Why search the app store for a BacktoLife app?” section comes from this system. It is search-engine-facing copy, not useful product communication.

The current pages were added shortly before the index began contracting. That is correlation, not proof of causation, but the timing plus orphaning, repeated templates, and contradictory claims makes the cluster a high-priority cleanup target.

### Media and credibility defects

- At least 31 referenced local media files do not exist.
- `/features/photo-joiner` uses the same `vintage-street.webp` as both input images and the output.
- Six feature pages reuse the same four family inputs and mostly the same family portrait result.
- The “make pictures smile” page shows a static wedding-photo colorization instead of a smile animation.
- `family-heritage-book.webp`, used on the dashboard, is missing.
- The code contains about 50 RandomUser references and 23 Unsplash references.
- Comparison pages contain invented-looking customer names, quotes, and stock avatars.
- The main public pages show polished 4.8–5.0 testimonials while the real Trustpilot profile is 3.3 from two reviews.

The existing real negative review identifies two concrete issues: credit-use confusion and facial likeness. These should be product and copy priorities, not hidden by fictional social proof. See the [current Trustpilot profile](https://www.trustpilot.com/review/bringback.pro).

### Claim, privacy, and pricing contradictions

Examples found in public copy:

- “proprietary animation engine”
- “zero retention”
- all media deleted in 30 minutes
- TLS 1.3, AES-256, isolated containers, and end-to-end encryption
- competitor tests on 30–50 images

Many are unsupported or contradicted by the implementation. Generated R2 media is retained until user deletion; the cleanup job does not implement the public promise; third-party inference storage has its own lifecycle; and Memory Book is intentionally persistent.

Pricing is also inconsistent:

- The production database is the checkout source of truth.
- Landing/pricing components still assume 10/30/60 credits.
- public pages have shown 4, 5, and 10-credit starter descriptions.
- FAQ and Terms copy contains old $2.49, $5.99, and $12.99 values.
- structured data is being changed manually per page.

The $4.99 entry offer should remain. The evidence supports it as a low-risk trust purchase. The issue is not the existence of the starter pack; it is inconsistent quantities and unclear feature costs.

### Analytics and consent

The root layout loads Google Analytics and Microsoft Clarity before consent. GA is still in `debug_mode`. Crisp loads after interaction or 15 seconds. YouTube embeds can contact Google before a visitor has made a privacy choice.

Google Consent Mode does not create a banner; it receives choices from a banner/CMP. Microsoft now expects a valid consent signal for Clarity users in the EEA, UK, and Switzerland. See [Google Consent Mode](https://support.google.com/analytics/answer/10000067) and [Microsoft Clarity Consent Mode](https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode).

This is not legal advice. The implementation and policy should be reviewed against the countries served.

## Positioning

### Category

Do not position BringBack as a general AI photo editor or “the best AI model.”

Position it as:

> **The family-photo preservation workspace: restore damage, reunite people, and pass the story on.**

Public promise:

> **Restore, reunite, and preserve the family photos that matter.**

Supporting promise:

> Repair old photos, bring family members into one picture, add subtle motion, and keep the story together in a private family keepsake.

### Primary audience

The primary buyer is not “anyone with an image.” It is the family archivist or gift-maker who has an emotionally important photo project:

- adult children preserving parents’ or grandparents’ photos
- family-history and genealogy hobbyists
- people preparing an anniversary, memorial, reunion, birthday, or family gift
- someone who has discovered an album or box of fragile photographs

Their central fear is not resolution. It is: **“Will this tool change the person I remember?”**

### Defensible differentiation

1. Original-first restoration: users choose whether to preserve black-and-white/sepia or colorize.
2. Identity-conscious workflow: comparison, honest limitations, and a guided rerun when likeness drifts.
3. One family project across tools: restore → reunite → animate → preserve in a private keepsake.
4. Pay once, no forced subscription; keep the $4.99 trust entry.
5. The original and the edited version remain clearly distinguished.

Do not lead with “historically accurate color,” “4K,” “8K,” “proprietary,” or “100% photorealistic.” Those are either generic, unverifiable, or technically misleading.

## Information architecture and URL decisions

### Core pages to keep and rebuild

| URL | Owner intent | Required action |
|---|---|---|
| `/` | Brand/category | Reposition as the family-photo preservation suite; stop targeting the exact restoration query as heavily as the dedicated page |
| `/old-photo-restoration` | restore old/damaged photos | Self-canonical, unique schema, original-first proof, damage examples, honest limits |
| `/ai-photo-animation` | animate old photos | Keep; emphasize subtle motion and input requirements |
| `/ai-family-portrait` | family portrait from separate photos | Keep; explain source-image requirements and identity limitations |
| `/colorize-photos` | colorize black-and-white photo | Keep only as an explicit opt-in workflow |
| `/denoise-photos` | remove noise/grain | Keep if GSC or conversions justify it; otherwise merge into restoration capabilities |
| `/examples` | real output proof | Rebuild into filterable, consented case studies with original, result, mode, and limitations |
| `/pricing` | plans and credit costs | Render from one source of truth and show exact equivalent uses |

### Public product pages to build properly

| Proposed URL | Public job | Primary CTA |
|---|---|---|
| `/add-person-to-photo` | Add a loved one or missing family member to a specific photo | `/dashboard/add-person` |
| `/remove-person-from-photo` | Remove an unwanted person and reconstruct the nearby background | `/dashboard/remove-person` |
| `/family-memory-book` | Turn restored family photos, captions, names, and stories into a private shareable keepsake | `/dashboard/memory-book` |
| `/nostalgic-hug-video` | Create an AI hug/reunion video | `/dashboard/nostalgic-hug` |

The Hug page is last in this build order. Before promoting it, test at least 10 representative inputs, publish limitations, verify failure refunds, and confirm the real credit cost everywhere.

### Pages to consolidate or remove

1. Redirect the equivalent family-composition feature pages to `/ai-family-portrait` or `/add-person-to-photo`.
2. Convert genuinely useful narrow examples—father/child, black-and-white composite, deceased loved one—into case studies or guides, not separate templated product pages.
3. Remove “photo joiner” if BringBack does not actually create side-by-side collages or panoramas. Do not redirect a non-equivalent intent just to preserve a URL.
4. Redirect the three animation app pages to `/ai-photo-animation`.
5. Redirect “sharpen wedding photos” to a real wedding-photo restoration guide or the restoration page.
6. Keep only competitor pages that can be rebuilt from genuine hands-on testing. Likely candidates: MyHeritage, Remini, and PixReunion. Remove/noindex the rest until they have verified, dated evidence.
7. Keep localized pages only where GSC shows demand and a fluent reviewer approves the copy. Otherwise noindex/remove them until ready.

Before final redirects, export GSC page-level performance for the affected URLs. Use a 301 only when the destination satisfies the same intent; use 404/410 for pages that have no equivalent.

## Page-quality standard

Every indexable product page must have:

1. One user intent and one primary H1.
2. A real result above the fold.
3. Inputs and output that match the feature exactly.
4. A CTA to the exact dashboard tool, not the generic dashboard.
5. Exact credit cost and whether the starter pack can perform the action.
6. Supported inputs, expected time, output format, and known failure cases.
7. “What AI may change” and “When not to use this” sections.
8. Real FAQs based on support, reviews, and search queries.
9. Unique internal links to the next useful step.
10. Only factual, provable trust and privacy claims.

Suggested user-facing copy:

- Homepage: **“Restore, reunite, and preserve your family photos.”**
- Restoration: **“Repair old photos while keeping their original character.”**
- Animation: **“Add a subtle smile or movement to an old photo.”**
- Family portrait: **“Bring separate family photos into one natural portrait.”**
- Add person: **“Add someone you love to a family photo.”**
- Memory Book: **“Turn restored photos and family stories into a private keepsake.”**
- Remove person: **“Remove an unwanted person and rebuild the background.”**

## Flagship restoration-page brief

The restoration page should own the restoration query. Its structure:

1. H1 and direct upload CTA.
2. One heavy-damage before/after and one “keep black-and-white” example.
3. Two clear modes:
   - **Restore only — keep the original black-and-white, sepia, or color look**
   - **Restore and colorize**
4. Damage coverage: scratches, tears, fading, water marks, blur, scan glare.
5. A visible disclaimer that missing facial details may be reconstructed rather than recovered.
6. A “best input” guide: flat scan, phone scan, photo behind glass, low-resolution copy.
7. Print/export facts based on actual pixel dimensions, not a blanket “300 DPI” or “8K” claim.
8. Real, consented cases with input condition, chosen mode, output, and a short note about what changed.
9. Exact pricing: what one credit does and what happens on failure.
10. Links to animation, add person, and Memory Book as optional next steps.

Technical fixes:

- Add a self-referential canonical.
- Give the page its own WebPage/WebApplication `@id` and URL.
- Remove the homepage `@id` collision.
- Ensure Open Graph URL and image match the page.
- Request reindexing only after the canonical, content, links, and sitemap are fixed.

## Content strategy

### Stop publishing generic long-form volume

The current 5,000+ word scanning article repeats points, drifts into vendor pricing, and tries to cover scanning, outsourcing, file naming, storage, restoration, and tools in one page. Word count is not authority.

Google recommends original, people-first information and warns against mass-produced, search-first content. See [Google’s helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).

### Build four small topic clusters

#### 1. Restore faithfully

- how to scan a family photo without damaging it
- restore only vs colorize: how to choose
- why AI changes faces and how to reduce identity drift
- water, mold, tears, creases, and stuck-to-glass input guidance
- when AI is not enough and a conservator is safer

#### 2. Reunite a family

- create a family portrait from separate photos
- add a late loved one to a wedding/family photo respectfully
- choose source photos that preserve likeness
- black-and-white composite vs color composite

#### 3. Add motion respectfully

- subtle animation vs exaggerated motion
- input requirements for old portraits
- ethical and emotional considerations
- common animation artifacts

#### 4. Preserve the story

- scan the backs of photographs and save handwritten notes
- record names, dates, places, and uncertainty
- create a family keepsake that keeps originals and restored versions distinct
- invite relatives to identify unknown people

Each cluster needs one hub, two to four excellent supporting pages, and contextual links. Do not create a URL merely for a keyword variant.

### Original research for authority and citations

Publish a transparent restoration benchmark:

- use licensed or public-domain old photographs
- disclose the sample and exact evaluation method
- score identity drift, damage repair, texture preservation, unwanted colorization, and visible artifacts
- show every input and result, including failures
- date model/version changes
- separate observable results from opinion

This replaces fabricated competitor tests with an asset other sites and answer engines can actually cite.

For preservation claims, cite primary sources such as the [US National Archives family digitization guidance](https://www.archives.gov/preservation/family-archives/digitizing) and [FADGI technical guidelines](https://www.digitizationguidelines.gov/guidelines/digitize-technical.html).

## AI citations and mentions

There is no special “AI SEO” markup that guarantees citations. Google states that AI Overviews and AI Mode use the same SEO fundamentals and require an indexed, snippet-eligible page; it specifically says no special AI text file or schema is required. See [Google’s AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

Actions:

1. Make the important pages indexable, self-canonical, internally linked, and textually clear.
2. Keep `OAI-SearchBot` allowed. Blocking `GPTBot` for training is a separate choice and does not require blocking search discovery.
3. Confirm the CDN/WAF does not return a challenge or 403 to OAI-SearchBot.
4. Use a stable Organization entity: brand name, logo, domain, About page, contact, and real external profiles.
5. Add author bios, editorial policy, update dates, and cited sources.
6. Publish original benchmarks, public examples, definitions, and concise answer blocks.
7. Make structured data match visible content. Do not add fake Review/AggregateRating data.
8. Add Bing Webmaster Tools and IndexNow for actual additions, updates, and deletions. IndexNow improves discovery speed but does not guarantee indexing.
9. Track ChatGPT referrals through `utm_source=chatgpt.com` and manually sample target questions monthly.
10. Do not spend time on `llms.txt` until the core index and content are healthy.

OpenAI confirms that allowing OAI-SearchBot is important for inclusion but does not guarantee placement. See [ChatGPT Search guidance](https://help.openai.com/en/articles/9237897-chatgpt-search0).


### Feature priority

1. Restoration fidelity and credit clarity
2. Family portrait/add person
3. Memory Book preservation workflow
4. Animation
5. Remove person
6. Hug experiment

## Trust and conversion repair

1. Remove every fictional testimonial, RandomUser avatar, unsupported user count, and unsupported “winner” table.
3. Ask for a review after a successful download or positive quality response—not merely after payment.
4. Never reveal internal founder notes, revenue, database counts, model vendors, or implementation language in customer copy unless it helps the customer make a decision.
5. Define any public count:
   - “accounts created” is not “families served”
   - “images processed” is not “customers”
   - only show a number if it is current, defensible, and useful
6. Keep the $4.99 starter.
7. Show feature equivalents on every plan, for example:
   - X restorations
   - Y family portraits
   - whether an animation can be created
   - whether Hug is possible
8. If the starter cannot create one animation, label it “Restoration Starter” and do not imply otherwise.
9. Render all plans, schema offers, FAQ answers, and checkout labels from one shared source backed by the production plan configuration.
10. Explain credit deduction before the generation button and show the remaining balance afterward.

## Consent and privacy implementation

### Consent categories

- **Necessary:** Supabase authentication/session, security/Turnstile, checkout state, requested Memory Book access.
- **Analytics:** Google Analytics and Microsoft Clarity.
- **Support/functional:** Crisp chat.
- **External media:** YouTube embeds.

### Required behavior

1. Show “Accept all,” “Reject non-essential,” and “Manage choices” with equal clarity.
2. Default non-essential categories to denied.
3. Do not load GA, Clarity, Crisp, or YouTube until the relevant category is allowed.
4. Send Google Consent Mode and Clarity consent signals.
5. Remove GA `debug_mode` in production.
6. Store the choice with a policy/version timestamp.
7. Add “Cookie settings” to the footer so choices can be changed.
8. Use privacy-enhanced/local thumbnails for blocked YouTube embeds and load the iframe only after consent.
9. Test first visit, accept, reject, revoke, and expired-consent flows.

### Policy rewrite

The Privacy Policy must list actual processors and purposes, including:

- Supabase
- Cloudflare/R2
- fal or other inference providers
- Dodo Payments
- Resend
- Google Analytics
- Microsoft Clarity
- Crisp

Document:

- what is uploaded
- why it is processed
- actual retention per feature and vendor
- saved-media behavior
- account deletion
- contact and applicable rights
- international transfers where applicable

Do not publish “deleted in 30 minutes” until the entire pipeline—including temporary uploads, inference providers, generated R2 files, backups, logs, and scheduled cleanup—actually meets it. Memory Book needs a separate, explicit preservation policy.

Also replace the dynamic “last updated today” Terms date with the real version date and remove hard-coded pricing.

## Technical SEO worklist

### P0

- fix restoration and refunds canonicals
- fix restoration structured-data URL/`@id`
- remove dead/noindex URLs from the sitemap
- use real `lastModified` values
- remove login and low-value utility URLs from the sitemap
- verify every submitted URL returns 200, self-canonical, index/follow, and substantive content
- submit a smaller clean sitemap after consolidation

### P1

- create a Features hub and topic hubs
- add breadcrumbs and contextual internal links
- eliminate all zero-inlink pages
- give each product page unique Open Graph media
- fix missing assets and misleading alt text
- replace raw third-party/remote images with owned, licensed, product-relevant media
- convert heavy images to properly sized WebP/AVIF
- replace unnecessary raw `<img>` usage with optimized responsive images
- lazy-load below-fold videos; no autoplay for costly media on mobile
- test mobile Core Web Vitals after the content rebuild

### P2

- fix complete reciprocal `hreflang` or remove incomplete language clusters
- consolidate structured data into one coherent graph per page
- add BreadcrumbList where visible
- keep FAQ schema only when the same FAQ is visible; do not expect it to create a rich result
- implement IndexNow for true content changes

### Referral/partner loop

The existing referral system has produced no completed referrals. Kill It.

### Link-earning assets

- transparent restoration benchmark
- original-first preservation checklist
- photo scanning and stuck-to-glass safety guide
- downloadable family-photo metadata template
- public-domain restoration case library

These are more linkable and citable than generic “best AI restorer” articles.


## Twelve-Phase execution

### Phase 1 — Stop active damage

- canonical/schema fix
- sitemap cleanup
- remove dead WordPress URL
- pricing source-of-truth repair
- remove fake reviews/counts/claims
- replace false privacy wording with verified wording
- direct feature CTAs
- verify animation/Hug failure refunds

### Phase 2 — Consent and crawl architecture

- implement consent manager
- gate GA, Clarity, Crisp, and YouTube
- update privacy/cookie/terms text
- define final URL map
- create Features hub and internal-link map
- use GSC affected URLs and page/query performance

### Phases 3–4 — Fix the content of the proven pages

- old-photo restoration
- animation
- family portrait
- real media and examples

### Phases 5–6 — Launch the unmarketed features

- add-person page
- remove-person page
- Memory Book page
- feature-level attribution

### Phases 7–8 — Consolidate and publish authority content

- redirect/remove old templated clusters

### Phases 9–10 — Citation and partner assets

- publish transparent restoration benchmark
- add About, methodology, author, and editorial-policy pages
- enable Bing Webmaster Tools/IndexNow

### Phases 11–12 — Distribution and iteration

- improve pages based on queries, objections, and conversion data
- evaluate feature/page kill gates

## Success and kill gates

### Technical recovery

Within 30–45 days:

- Google-selected canonical for `/old-photo-restoration` equals itself
- no dead, redirected, canonicalized-away, or noindex URLs in the sitemap
- every strategic page has multiple relevant internal links
- at least 80% of the deliberately reduced sitemap is indexed or has a clearly understood reason not to be

### Core-page performance

Within 90 days:

- restoration impressions and non-brand clicks reverse their decline
- restoration page enters the top 30 for at least one primary commercial cluster before a top-10 goal is set
- family portrait and animation do not lose traffic from consolidation
- organic landing-to-upload and landing-to-purchase rates can be measured reliably

### New product-page gates

Evaluate only after each page has at least 300 qualified visits or 90 days:

- If a page generates no meaningful uploads, purchases, or assisted conversions, merge/de-emphasize it.
- If Remove Person attracts generic editing traffic that does not buy the family-photo product, noindex or separate it from the core navigation.
- If Hug cannot reach reliable quality and at least 20 real paid uses without excessive support/refunds, keep it inside the dashboard as an experiment rather than a growth pillar.
- After 100 eligible Family-plan customers see Memory Book, fewer than 10 starts or fewer than 3 publishes means onboarding/value needs rework before further expansion.

### Business ladder

- Stage 1: recover to $500–$1K monthly revenue through technical, trust, and conversion repair.
- Stage 2: reach $2K through the three proven search/product pages and real case-study distribution.
- Stage 3: target $5K through 15K–20K qualified monthly visits, about 3% purchase conversion, and an $11 blended order value.

Keep the $4.99 entry. Improve blended order value through a trustworthy post-result upgrade to the existing larger packs, not by blocking the first purchase.

## Work that should not be done

- no new keyword-variant page factory
- no invented testimonials, user counts, benchmark data, or competitor claims
- no generic 3,000–6,000 word articles for word count
- no promise of historical color accuracy
- no mass Facebook group link posting
- no backlinks bought from random directories
- no `llms.txt` project presented as an AI-citation solution
- no physical-photo conservation advice beyond sourced, safety-first guidance
- no new feature until its failure/refund path, analytics, public explanation, and real media are ready

## First implementation batch

The first code batch should touch only the high-leverage foundations:

- `app/old-photo-restoration/page.tsx`
- `app/sitemap.ts`
- `app/layout.tsx`
- `components/clarity-provider.tsx`
- `components/crisp-chat.tsx`
- YouTube embed components
- shared pricing data/components
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `lib/featuresdata.ts`
- `lib/appdata.ts`
- `lib/comparedata.ts`
- navigation/footer/internal-link components

Preserve the current uncommitted pricing-schema edits and fold them into the single-source pricing repair.
