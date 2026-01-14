-- Migration: Update pricing plans to Starter $2.49 (5 credits) and Plus $4.99 (15 credits)
-- Purpose: Align database payment_plans with new pricing model for testing and production
-- IMPORTANT: Replace the placeholder dodo_product_id values with your actual DodoPayments Product IDs before running.

BEGIN;

-- 1) Update existing 5-credit plan to the new Starter pricing and name
--    Targets the default plan created by earlier migrations: id = 'premium-plan'
UPDATE public.payment_plans
SET
  name = 'Starter Plan',
  price_cents = 249 -- $2.49
WHERE id = 'premium-plan';

-- Fallback: if the 'premium-plan' row doesn't exist, ensure any 5-credit plan is set to Starter pricing/name
UPDATE public.payment_plans
SET
  name = 'Starter Plan',
  price_cents = 249 -- $2.49
WHERE credits = 5
  AND name <> 'Starter Plan';

-- Optional: If your Starter plan still has a placeholder product ID, set it to a valid one
-- REPLACE 'REPLACE_WITH_STARTER_DODO_PRODUCT_ID' with your actual Product ID
UPDATE public.payment_plans
SET dodo_product_id = 'REPLACE_WITH_STARTER_DODO_PRODUCT_ID'
WHERE credits = 5
  AND name = 'Starter Plan'
  AND dodo_product_id IN ('your_dodo_product_id_here', 'REPLACE_ME', '');

-- 2) Upsert the new Plus plan: 15 credits for $4.99
-- REPLACE 'REPLACE_WITH_PLUS_DODO_PRODUCT_ID' with your actual Product ID
INSERT INTO public.payment_plans (id, name, price_cents, credits, dodo_product_id)
VALUES ('plus-plan', 'Plus Plan', 499, 15, 'REPLACE_WITH_PLUS_DODO_PRODUCT_ID')
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  credits = EXCLUDED.credits,
  dodo_product_id = EXCLUDED.dodo_product_id;

COMMIT;

-- 3) Verify results
SELECT id, name, credits, price_cents, dodo_product_id
FROM public.payment_plans
ORDER BY credits, price_cents;