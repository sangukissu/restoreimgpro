# APA Final Report

## Architecture and Tech Stack

**1) Provide a current architecture diagram and data‑flow (upload → processing → storage → deletion → delivery).**

*   **Frontend**: Next.js (App Router). Users upload images directly to Supabase Storage or via API routes.
*   **Processing**: Backend API routes (`/api/fal/...`) send image URLs to Fal.ai for inference (restoration, animation).
*   **Processing (2nd Pass/Analysis)**: Google Gemini API (`/api/analyze-image`, `/api/rerestore`) for checking damage severity and refining results.
*   **Storage**: Supabase Storage buckets (evidenced by `storage_bucket_policies.sql` and `next.config.js` domain `*.supabase.co`).
*   **Delivery**: Processed assets are stored/returned as URLs from Fal.ai or saved to Supabase Storage.
*   **Database**: Supabase (PostgreSQL) stores user credits, job status, and references to assets in tables like `video_generations`.

**2) Hosting/build: What platform(s) run the Next.js app (e.g., Vercel), CI/CD, and edge functions? Any queues/workers?**

*   **Hosting**: Next.js application, likely hosted on Vercel (indicated by `@vercel/blob` dependency and standard Next.js patterns).
*   **CI/CD**: No local GitHub Actions workflows found (`.github` folder missing/empty). Likely uses Vercel's built-in Git integration for deployments.
*   **Edge Functions**: 
    *   **Next.js**: No specific Next.js Edge Runtime routes identified.
    *   **Supabase**: Yes, Supabase Edge Functions (Deno) are present in `supabase/functions/` (e.g., `send-winback-email-1`).
*   **Queues/Workers**: No explicit message queue (Redis/RabbitMQ) code found. Async jobs (video generation) use Webhooks (`/api/fal/webhook`) to handle completion.

**3) Storage/CDN: Which providers (e.g., Supabase)?**

*   **Provider**: Supabase Storage.
*   **CDN**: Supabase assets are served via their CDN. Next.js Image Optimization is configured for `supabase.co` domains.

**4) Inference: Where does restoration/animation run? Assume not self‑hosted GPU?**

*   **Provider**: Fal.ai (Managed Service) and Google Gemini (Managed Service).
*   **GPU**: Not self-hosted.
*   **Models**: `kling-video`, `codeformer`, `gemini-flash-lite`, `gemini-2.5-flash-image`.

**5) Environment setup: Do you have prod vs staging? Any shared resources? GitHub actions, hosting dashboard, Supabase project, monitoring/logging?**

*   **Environments**: Code supports logical separation via `NODE_ENV` and dynamic base URLs (`localhost` vs `live`).
*   **Project**: Single Supabase project identified in config (`ddbpucrrposyyfpwpigq`).
*   **Monitoring**: Basic logging via `console.error`; no dedicated external logging service (like Sentry) found in dependencies.

## Third‑Party Services and Libraries

**6) Cloud/hosting/CDN: Which providers?**

*   **Hosting**: Next.js App (likely Vercel).
*   **CDN**: Vercel Edge Network (for App), Supabase Storage CDN (for assets).

**7) Supabase: Used for auth, db, AND storage? Any edge functions being used?**

*   **Auth**: Yes, Supabase Auth.
*   **Database**: Yes, PostgreSQL.
*   **Storage**: Yes, Supabase Storage.
*   **Edge Functions**: Yes, Supabase Edge Functions (Deno) are used for scheduled tasks like win-back emails.

**8) Email/transactional: Postmark, SendGrid, Resend? (Average monthly cost?)**

*   **Provider**: Resend.
*   **Usage**: Transactional and retention emails (e.g., "Inspiration" email), defined in `lib/resend.ts`.
*   **Cost**: Not Known.

**9) Auth/OAuth: Are we using Supabase Auth or something else (Clerk)?**

*   **Provider**: Supabase Auth.

**10) Payments: Dodo Payments right? Fee schedule?**

*   **Provider**: Dodo Payments.
*   **Fee Schedule**: Not Known (not in code).

**11) Inference providers/APIs: Just Fal.ai? Any OpenAI/Replicate? (Per‑use cost?)**

*   **Providers**: Fal.ai is the primary inference provider for image/video generation. Google Gemini for analysis.
*   **Other**: Google GenAI (`@google/genai`) is used in `api/analyze-image` and `api/rerestore`, likely for prompt enhancement or image understanding.
*   **Cost**: Not Known.

**12) Analytics (GA4, GSC), session replay/heatmaps (Hotjar, PostHog), support desk?**

*   **Analytics**: Google Analytics 4 (Measurement ID: `G-184H988WCE`) and Google Tag Manager.
*   **Session Replay**: None found.
*   **Support Desk**: Manual email support (`support@bringback.pro`).

**13) Any others? (Sentry for error monitoring?)**

*   **Error Monitoring**: None found.

**14) Libraries: Any with restrictive licenses (AGPL)? (e.g., ffmpeg.wasm, sharp)**

*   **Libraries**: Standard MIT/ISC/Apache-2.0 dependencies found. No AGPL-licensed libraries (like `ffmpeg.wasm` or `sharp`) detected in `package.json`.

## Models and Licensing

**15) Models: Which specific models (e.g., CodeFormer, Kling, Llama)?**

*   **Restoration**:
    *   `fal-ai/codeformer` (via Fal.ai) - Used for face enhancement and upscaling.
    *   `fal-ai/image-editing/photo-restoration` (via Fal.ai) - General photo restoration.
*   **Animation**:
    *   `fal-ai/kling-video/v2.5-turbo/pro/image-to-video` (via Fal.ai) - Used for generating animations from images.
*   **Analysis & Refinement**:
    *   `gemini-flash-lite-latest` (via Google Gemini API) - Used for analyzing restored images for structural damage.
    *   `gemini-2.5-flash-image` (via Google Gemini API) - Used for "2nd pass" (rerestore) refinement prompts.

**16) Licensing: Any AGPL or non‑commercial restrictions? Check `package.json` vs model licenses.**

*   **Models**: All models are consumed via managed APIs (Fal.ai, Google Cloud). The code does not distribute model weights or run them locally, avoiding direct GPL/AGPL implications for the codebase itself.
    *   **Fal.ai**: Usage is governed by Fal.ai's Terms of Service.
    *   **Google Gemini**: Usage is governed by Google's Generative AI Terms of Service.
*   **Dependencies**: No AGPL libraries found in `package.json`. Standard compatible licenses (MIT, Apache-2.0, ISC).

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

---

## 4. Existing Customers & Data Transfer
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
