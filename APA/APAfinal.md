# APA Final Report

## Architecture and Tech Stack

**1 Provide a current architecture diagram and data‑flow (upload → processing → storage → deletion → delivery).**

*   **Frontend**: Next.js (App Router).
*   **Processing**: Backend API routes (`/api/fal/...`) send image URLs to Fal.ai for inference (restoration, animation).
*   **Processing (2nd Pass/Analysis)**: Google Gemini API (`/api/analyze-image`, `/api/rerestore`) for checking damage severity and refining results. For Aniamtion it goes to `/api/fal/enhance/route.ts`
*   **Storage**: Media is downlaoded from fal after generation and saved to cloudflare r2 on the way.
*   **Delivery**: Stored media URLs from r2 storage are saved in supabase storage and delivered to user.
*   **Database**: Supabase (PostgreSQL) stores user credits, job status, and references to assets in tables like `video_generations`, `image_restorations`.

**2 Hosting/build: What platform(s) run the Next.js app (e.g., Vercel), CI/CD, and edge functions? Any queues/workers?**

*   **Hosting**: Next.js application, hosted on Vercel (Currently on free plan).
*   **CI/CD**: No local GitHub Actions workflows. Uses Vercel's built-in Git integration for deployments.
*   **Edge Functions**: 
    *   **Next.js**: No specific Next.js Edge Runtime routes.
    *   **Supabase**: Yes, Supabase Edge Functions (Deno) are present in `supabase/functions/` (e.g., `send-winback-email-1`).
*   **Queues/Workers**: No explicit message queue (Redis/RabbitMQ). Async jobs (video generation) use Webhooks (`/api/fal/webhook`) to handle completion.

**3 Storage/CDN: Which providers (e.g., Supabase)?**

*   **Provider**: Cloudflare R2 Storage.

**4 Inference: Where does restoration/animation run? Assume not self‑hosted GPU?**

*   **Provider**: Fal.ai (Managed Service) and Google Gemini (Managed Service).
*   **GPU**: Not self-hosted.
*   **Models**: `kling-video`, `codeformer`, `gemini-flash-lite`, `gemini-2.5-flash-image(nano-banana)`, .

**5 Environment setup: Do you have prod vs staging? Any shared resources? GitHub actions, hosting dashboard, Supabase project, monitoring/logging?**

*   **Environments**: Code supports logical separation via `NODE_ENV` and dynamic base URLs (`localhost` vs `live`).
*   **Monitoring**: Basic logging via `console.error`; no dedicated external logging service (like Sentry).
*   All resources are contained within a single vercel and supabase project.

## Third‑Party Services and Libraries

**6) Cloud/hosting/CDN**

*   **Hosting**: Next.js App (Vercel).
*   **CDN**: Vercel Global Edge Network (for App), Cloudflare R2 Storage (for assets).

**7) - Supabase (auth/db/storage/functions)??**

*   **Auth**: Yes, Supabase Auth.
*   **Database**: Yes, PostgreSQL.
*   **Storage**: No, only for storing the generated media files on Cloudflare R2 Storage.
*   **Edge Functions**: Not used yet...(However, i have coded 70% of the code to use it for scheduled tasks like win-back emails.)

**8) Email/transactional: Postmark, SendGrid, Resend?**

*   **Provider**: Resend (Not being used yet, but implemented in code).
*   **Usage**: Transactional and retention emails (e.g., "Inspiration" email), defined in `lib/resend.ts`.
*   **Cost**: Currently Free, 3,000 emails / mo
.

**9) Auth/OAuth**

*   **Provider**: Supabase Auth.

**10) Payments: Dodo Payments, Fee schedule?**

*   **Provider**: Dodo Payments.
*   **Fee Schedule**: 4% + $0.40 per transaction (MoR).

**11) Inference providers/APIs**

*   **Providers**: Fal.ai is the primary inference provider for image/video generation. Google Gemini for analysis of photo during restoration.
*   **Other**: Google GenAI (`@google/genai`) is used in `api/analyze-image` and `api/rerestore`, for prompt enhancement and image understanding to provide better restoration results if first atttempt miss anything.
*   **Cost**: No, Pay as you go or Topup credits.

**12) Analytics (GA4, GSC), session replay/heatmaps**

*   **Analytics**: Google Analytics 4.
*   **Session Replay**: No.
*   **Support Desk**: Manual email support (`support@bringback.pro`), cant be shared as it was part of my hosting features not the domain.

**13) - Any others (support desk, error monitoring)**

*   No.

**14) Libraries: Any with restrictive licenses (AGPL)? (e.g., ffmpeg.wasm, sharp)**

*   **Libraries**: Standard MIT/ISC/Apache-2.0 dependencies. No AGPL-licensed libraries.

## Models and Licensing

**15) Models: Which specific models (e.g., CodeFormer, Kling, Llama)?**

*   **Restoration**:
    *   `fal-ai/codeformer` (via Fal.ai) - Used for Free face enhancement and upscaling.
    *   `fal-ai/image-editing/photo-restoration` (via Fal.ai) - photo restoration.
*   **Animation**:
    *   `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` (via Fal.ai) - Used for generating animations from images.
*   **Analysis & Refinement**:
    *   `gemini-flash-lite-latest` (via Google Gemini API) - Used for analyzing restored images for structural damage.
    *   `gemini-2.5-flash-image` (via Google Gemini API) - Used for "2nd pass" (rerestore) refinement for any missed damage from first attempt with specific instructions generated by gemini-flash-lite-latest anlaysis.

**16) Are any models accessed via third‑party SaaS? Provide contract/ToS and per‑minute/per‑render pricing.**

*   **Models**: All models are consumed via managed APIs (Fal.ai, Google Gemini API). The code does not distribute model weights or run them locally, avoiding direct GPL/AGPL implications for the codebase itself.
    *   **Fal.ai**: Usage is governed by Fal.ai's Terms of Service.
    *   **Google Gemini**: Usage is governed by Google's Generative AI Terms of Service.


---

## 4. Existing Customers & Data Transfer

**1) Counts: total registered users** 

*   **Users** : Currently 900 Users
*   **Orders/payments** : Total 105 Successful Transactions.
*   **Refunds** : Total 03 Refunds of $12.
*   **Credits ledger** : Total 433 credits - Inhouse cost : $17-20 worth.
*   **Jobs** : Will be provided.
*   **Email list** : Will be provided along with user data.


**Payments and Unit Economics**

1) Payment processor:
- Provide 12 months of transaction‑level CSV (gross, fees, refunds, chargebacks, net, coupon code). : Attached as CSV.
- Cost per job: No job cost, we pay for what we use.
- Restoration: average cost per imageFor restoration $0.04 - $0.048$, average storage/egress per image - Free couldflare r2.
- Animation: average cost per video (length) - $0.35/ per 5 sec video, storage/egress per video - Free couldflare r2.
- Provide your own “82% profit margin” calculation sheet (exact formula and inputs). If none exists, give raw cost logs/invoices from inference providers. - 

- Payments and Unit Economics
1) Cost per Job (Unit Economics)

- Restoration (Image): The average API inference cost is $0.048 per image.

- Animation (Video): The average API inference cost is $0.35 per video generation.

- Payment Processing: The average fee (including MoR and transaction costs) is $0.60 per transaction.

2) Profit Margin Calculation (Calculation Sheet)

- Our average profit margin across our two primary tiers is approximately 84.8%. Below is the breakdown of the formula and inputs used to reach this figure:

**Scenario A: Starter Plan ($4.99 for 5 Restorations)**

- Revenue: $4.99

- Costs: $0.60 (Payment Fee) + ($0.048 × 5 Images = $0.24) = **$0.84 Total Cost**

- Net Profit: $4.15

- Profit Margin: 83.2%

**Scenario B: Pro Plan ($9.99 for 20 Restorations)**

- Revenue: $9.99

- Costs: $0.60 (Payment Fee) + ($0.048 × 20 Images = $0.96) = **$1.56 Total Cost**

- Net Profit: $8.43

- Profit Margin: 84.4%

**Scenario C: Pro Plan ($9.99 for 2 Photo Animations)**

- Revenue: $9.99

- Costs: $0.60 (Payment Fee) + ($0.35 × 2 Videos = $0.70) = **$1.30 Total Cost**

- Net Profit: $8.69

- Profit Margin: 87.0%

**User Data Source**: Supabase (PostgreSQL)

| Data Type | Database Table | Description |
| :--- | :--- | :--- |
| **User Accounts** | `auth.users` | Managed by Supabase Auth. Contains email, password hashes, last sign-in. |
| **Profiles** | `public.user_profiles` | Links to `auth.users`. Contains `credits` balance, `first_name`, `last_name`. |
| **Orders/Transactions** | `public.payments` | Records Dodo Payments transaction IDs, amounts, currency, status (`succeeded`), and credits purchased. |
| **Restoration History** | `public.image_restorations` | Logs of all restored images, `user_id`, `restored_image_url`, and status. |
| **Video History** | `public.video_generations` | Logs of video animations, inputs/outputs, and prompt used. |

**Export Instructions**:
*   **Users**: Export via Supabase Dashboard -> Authentication -> Users -> "Export to CSV".
*   **Database**: Run `pg_dump` on the production database connection string to export all table schema and data.
*   **Assets**: All user-generated artifacts are stored in Supabase Storage (`restored_photos` bucket). These must be transferred or permissioned to the new owner.

**Email List**:
*   Emails are currently sent via **Resend** using hardcoded logic (`lib/resend.ts`).
*   **No external marketing CRM** is currently integrated (e.g., Mailchimp/ConvertKit).
*   **Win-back Logic**:
    *   Email 1: Sent 4 hours after signup (Topic: Inspiration).
    *   Email 2: Sent 7 days after signup (Topic: 10% Off Discount `WELCOME10`).

## 5. Payments & Unit Economics
**Processor**: [Dodo Payments](https://dodopayments.com/)

**Pricing Tiers** (from `Pricing.tsx`):
*   **Starter**: Free (Limited to 5 restorations, likely a trial limit handled via initial credit grant).
*   **Pro**: $19.00 (One-time, 20 credits/restorations). $0.95/credit.
*   **Premium**: $45.00 (One-time, 100 credits/restorations). $0.45/credit.

**Operational Costs (COGS)**:
*   **Image Restoration**:
    *   **Provider**: Fal.ai
    *   **Model**: `fal-ai/image-editing/photo-restoration`
    *   **Cost**: [Approx. $0.005 - $0.05 per run depending on resolution/steps].
    *   **Sale Price**: ~$0.45 - $0.95 (Significant margin).
*   **Video Animation**:
    *   **Provider**: Fal.ai
    *   **Model**: `fal-ai/kling-video/v2.5-turbo/pro/image-to-video`
    *   **Cost**: This is a high-cost model. [Approx. $0.50 - $1.00+ per video].
    *   **Deduction**: 10 Credits (Value ~$4.50 - $9.50).
    *   **Margin**: Healthy, though high-risk if generation fails.

**Profit Margin Formula**:
Net Profit = Revenue - (Stripe/Dodo Fees + Fal.ai API Costs + Hosting)

## 6. Credits, Guarantees & Liabilities
**Outstanding Liabilities**:
*   **User Credits**: Stored in `user_profiles.credits`. These are a financial liability (pre-paid service not yet rendered).
    *   **Action**: Query `SUM(credits)` from `user_profiles` to calculate total outstanding service debt.
*   **Refund Policy**: "30-Day Money-Back Guarantee" is advertised.
*   **Expiration**: Credits "Never expire". This creates a perpetual liability.

**Technical Anomalies & Risks**:
1.  **Duplicate/Unsecured Route**:
    *   `app/api/restore/route.ts`: **SECURE**. Correctly checks and deducts credits (1 credit per use).
    *   `app/api/fal/enhance/route.ts`: **INSECURE**. Checks for a logged-in user but **DOES NOT DEDUCT CREDITS**. If a user hits this endpoint directly, they can generate unlimited restorations for free.
    *   **Recommendation**: Delete `app/api/fal/enhance` immediately.
2.  **Video Cost**: Animation uses the expensive `kling-video` model. Ensure the 10-credit deduction (Value ~$4.50+) covers the API cost sufficiently to avoid negative margins on that specific feature.

## 7. Transfer Checklist
*   [ ] Transfer Supabase Project (Database, Auth, Storage).
*   [ ] Transfer Dodo Payments Account.
*   [ ] Transfer Fal.ai Account (API Keys).
*   [ ] Transfer Resend Account (Transactional Emails).
*   [ ] Transfer Domain (bringback.pro).
*   [ ] Patch `api/fal/enhance` security hole before handover.


## Security and Compliance

**17) Keys/Secrets: Are `.env` files committed? Are secrets hardcoded?**

*   **Dotfiles**: `.env*` files are correctly added to `.gitignore`.
*   **Hardcoded Secrets**: No hardcoded API keys (`sk_live`, `sk_test`, `postgres://`) found in the codebase.
*   **Secret Management**: Secrets are managed via environment variables (e.g., `FAL_KEY`, `NEXT_PUBLIC_SUPABASE_URL`).

**18) Compliance: GDPR (cookie banners?), Terms of Service?**

*   **Routes**: `app/privacy` and `app/terms` routes exist, indicating adherence to basic compliance requirements.
*   **Cookie Banner**: Not explicitly found in the codebase.
*   **Data Deletion**: Users can delete their data (implied by typical Supabase usage, but no explicit "delete account" button found in main UI/components).

**19) Vulnerabilities: Run `npm audit`? Check for SQL injection risks in Supabase calls?**

*   **NPM Audit**: `npm audit` reported vulnerabilities (Exit code 1). Key dependencies to review include `jws` and `@vercel/blob` (related to `undici` versions). Recommendation: Run `npm audit fix` to address these.
*   **SQL Injection**: Most database interactions use Supabase's JS client (ORM-like), which is generally safe from SQL injection. No raw `rpc` calls with unsanitized input were observed.
*   **RLS**: Row Level Security policies (`storage_bucket_policies.sql`) suggests an attempt to secure data, but full coverage of RLS on tables needs manual verification in the Supabase dashboard.
