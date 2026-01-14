# Operational Manual: RestoreImgPro Platform

## 1. System Overview
**RestoreImgPro** is a high-availability biological image restoration platform leveraging Generative AI. This document outlines the technical requirements, deployment strategies, and operational procedures required for maintaining the application in a production environment.

---

## 2. Infrastructure Requirements
The platform is designed to be cloud-agnostic but is optimized for the Vercel Edge Network and serverless architecture.

### 2.1 Runtime Environment
-   **Node.js**: v20.x (LTS) or higher.
-   **Package Management**: npm v9+.

### 2.2 External Service Dependencies
The application architecture relies on a microservices approach for specialized tasks. Ensure valid SLAs are in place for the following providers:

| Service | Purpose | Criticality |
| :--- | :--- | :--- |
| **Supabase** | Relational Database (PostgreSQL), Auth, & Realtime | **Critical** |
| **Fal.ai** | GPU Infrastructure for Image Inference | **Critical** |
| **Dodo Payments** | Payment Gateway & Ledger | **Critical** |
| **Cloudflare R2** | Media Storage (Origin) | High |
| **Resend** | Transactional Email Delivery | High |

---

## 3. Configuration Management
All environment configurations are managed via 12-factor app principles using environment variables.

### 3.1 Production Variables
Create a securely scoped `.env.local` file for local development. For production, these values must be injected via the CI/CD pipeline (e.g., Vercel Project Settings).

#### Application Core
```bash
NEXT_PUBLIC_APP_URL="https://bringback.pro"
NEXT_PUBLIC_SITE_URL="https://bringback.pro"
```

#### Authentication & Database (Supabase)
```bash
NEXT_PUBLIC_SUPABASE_URL="[SECURE_ENDPOINT]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PUBLIC_API_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SECRET_ADMIN_KEY]" # CAUTION: Never expose to client
```

#### AI Compute (Fal.ai)
```bash
FAL_KEY="[API_KEY]"
```

#### Commerce Engine (Dodo Payments)
```bash
DODO_ENV="live" # Set to 'test' for sandbox environments
DODO_PRODUCT_ID="[PRODUCT_ID]"
DODO_PAYMENTS_API_KEY="[SECRET_KEY]"
DODO_WEBHOOK_SECRET="[WEBHOOK_SIGNING_SECRET]"
```

#### Image and Video Storage
```bash
# Cloudflare R2
R2_ACCOUNT_ID="[ID]"
R2_BUCKET_NAME="bringback"
R2_ACCESS_KEY_ID="[KEY_ID]"
R2_SECRET_ACCESS_KEY="[SECRET]"


#### Security
```bash
# Cloudflare Turnstile (Bot Protection)
NEXT_PUBLIC_TURNSTILE_SITE_KEY="[SITE_KEY]"
sec="[SECRET_KEY]" # Internal reference for server-side validation
```

---

## 4. Deployment Strategy

### 4.1 Recommended Pipeline (Vercel)
This repository is configured for zero-downtime deployments via Vercel.

1.  **Repository Connection**: Connect the production branch (e.g., `main`) to a Vercel Project.
2.  **Environment Configuration**: Navigate to **Settings > Environment Variables** and populate the secrets defined in Section 3.1.
3.  **Build Command Override**: None required (Defaults to `next build`).
4.  **Output Directory**: None required (Defaults to `.next`).

### 4.2 Database Migrations
Migrations are managed via the Supabase CLI.

1.  **Initialize**: Ensure the target Supabase project is empty or compatible with the current schema.
2.  **Schema Sync**: Apply any pending SQL definitions found in `supabase/migrations`.
3.  **Policy Review**: Verify Row Level Security (RLS) policies are active for the `restorations` and `profiles` tables.

---

## 5. Local Development Protocol

To establish a local development instance:

1.  **Clone Repository**:
    ```bash
    git clone [REPO_URL]
    ```
2.  **Install Dependencies**:
    ```bash
    npm ci
    ```
3.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
    Health check available at `http://localhost:3000`.

---

## 6. Security & Compliance
-   **Data Storage**: User images are stored in R2 buckets with private ACLs. Signed URLs are generated on-demand for client access.
-   **Authentication**: All protected routes enforce server-side session validation via `middleware.ts`.
-   **Payment Data**: No credit card information touches the application servers; all processing is offloaded to Dodo Payments (PCI-DSS Compliant).
