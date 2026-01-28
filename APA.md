
Here are the questions I have for you as part of due diligence (some items you already informed me, so the questions are just verification for my understanding). Additionally, some questions to prepare APA and transfer plan.

Architecture and Tech Stack

1) Provide a current architecture diagram and data‑flow (upload → processing → storage → deletion → delivery).
2) Hosting/build: What platform(s) run the Next.js app (e.g., Vercel), CI/CD, and edge functions? Any queues/workers?
3) Storage/CDN: Which providers (e.g., Supabase)?
4) Inference: Where does restoration/animation run? Assume not self‑hosted GPU?
5) Environment setup: Do you have prod vs staging? Any shared resources? GitHub actions, hosting dashboard, Supabase project, monitoring/logging?

Third‑Party Services and Libraries

For each provider/library, include: name, purpose, where used (frontend/backend), plan/tier, average monthly cost, per‑use cost (Y/N).

- Cloud/hosting/CDN
- Supabase (auth/db/storage/functions)
- Email/transactional (e.g., Postmark/SendGrid/Resend)
- Auth/OAuth
- Payments (Dodopayments): fee schedule
- Inference providers/APIs
- Analytics (GA4, GSC), session replay/heatmaps
- Any others (support desk, error monitoring)
- Libraries with restrictive licenses (list all copyleft/AGPL/MPL and usage)

Models and Licensing

List every model used (restoration, colorization, face enhancement, animation, “hug” video): model name/version, source URL, any fine‑tunes/checkpoints included in the sale, rights to redistribute/transfer, and any training data used.

Are any models accessed via third‑party SaaS? Provide contract/ToS and per‑minute/per‑render pricing.

Existing Customers and Data Transfer

1) Counts: total registered users
10:32 AM
Users (id, email, createdat, country if known)
Orders/payments (id, userid, SKU, gross, fees, net, status, createdat)
Credits ledger (userid, creditsin, creditsout, createdat)
Jobs (id, userid, type, startedat, completedat, status, errorcode)
Email list: proof of opt‑in, unsubscribe/complaint rates, and provider ToS permitting list transfer.

Payments and Unit Economics

1) Payment processor:
- Provide 12 months of transaction‑level CSV (gross, fees, refunds, chargebacks, net, coupon code).
- Cost per job (by product)
- Restoration: average cost per image, average storage/egress per image.
- Animation: average cost per video (length), storage/egress per video.
- Provide your own “82% profit margin” calculation sheet (exact formula and inputs). If none exists, give raw cost logs/invoices from inference providers.

Product Performance (only essentials)

1) Average processing time per job (restoration vs animation) over the last 60 days; P50/P95.
2) Failure rate (%) and top 3 error reasons.

Credits, Guarantees, and Liabilities

1) Outstanding credits: total by user and in aggregate (provide CSV or query result).
2) “Credits never expire”: confirm policy. Any legal terms limiting changes?
3) money‑back guarantee: usage rate and criteria.
4) Any open disputes/chargebacks and their amounts.

Security (minimal but critical)

1) Who currently has production access (names/roles)? MFA enabled?
2) Secrets management: where are API keys stored
3) Any known security incidents or data leaks? If yes, brief description and mitigation.

Transition and Non‑Transferables

1) Which accounts cannot be assigned (Dodopayments, email, etc.)? Will you assist in recreating our accounts and mapping configs/keys?
2.a) Transfer domain registrar and DNS; install SSL in Buyer account.
2.b) Transfer GitHub ownership; archive immutable snapshot.
2.c) Transfer/replicate Supabase: either org transfer or import of schema/data; validate RLS and storage rules.
2.b) GA4 and GSC ownership tran