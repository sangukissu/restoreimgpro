-- Migration: Update pricing plans to Margin Protector model
-- Starter: $4.99 for 4 credits
-- Pro: $9.99 for 20 credits
-- Family: $21.99 for 60 credits (unchanged)

BEGIN;

-- 1) Update Starter plan: 4 credits for $4.99 (499 cents)
-- Targets premium-plan if present, otherwise any 4-credit or low-credit plan
UPDATE public.payment_plans
SET
  name = 'Starter Plan',
  price_cents = 499,
  credits = 4
WHERE id = 'premium-plan'
   OR credits <= 5;

-- Fallback: ensure any remaining small plan is set to Starter
UPDATE public.payment_plans
SET
  name = 'Starter Plan',
  price_cents = 499,
  credits = 4
WHERE credits < 10
  AND name NOT IN ('Family Plan', 'Pro Plan');

-- 2) Update Pro plan: 20 credits for $9.99 (999 cents)
-- Targets plus-plan if present, otherwise any plan in the 10-30 credit range
UPDATE public.payment_plans
SET
  name = 'Pro Plan',
  price_cents = 999,
  credits = 20
WHERE id = 'plus-plan'
   OR (credits BETWEEN 10 AND 30 AND name NOT IN ('Starter Plan', 'Family Plan'));

-- 3) Ensure Family plan remains at $21.99 (2199 cents) for 60 credits
UPDATE public.payment_plans
SET
  name = 'Family Plan',
  price_cents = 2199,
  credits = 60
WHERE credits = 60
   OR name = 'Family Plan';

-- 4) Clean up any stray plans that don't fit the model (optional safety)
-- DELETE FROM public.payment_plans
-- WHERE credits NOT IN (4, 20, 60)
--   AND name NOT IN ('Starter Plan', 'Pro Plan', 'Family Plan');

COMMIT;

-- Verify results
SELECT id, name, credits, price_cents, dodo_product_id
FROM public.payment_plans
ORDER BY credits, price_cents;
