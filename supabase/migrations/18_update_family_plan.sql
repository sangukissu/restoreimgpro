-- Upsert Family plan at $21.99 (2199 cents) for 60 credits
-- Adjusts existing 60-credit plan if present; otherwise inserts a new record

BEGIN;

-- Try to update any existing plan that offers 60 credits
UPDATE public.payment_plans
SET
  name = 'Family Plan',
  price_cents = 2199,
  credits = 60
WHERE credits = 60;

-- If no rows were updated, insert (or ensure) a family plan with id 'family-plan'
-- Note: This assumes 'id' is text in the current schema. If your schema uses UUIDs, replace 'family-plan' with gen_random_uuid().
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.payment_plans WHERE credits = 60) THEN
    INSERT INTO public.payment_plans (id, name, price_cents, credits, dodo_product_id)
    VALUES ('family-plan', 'Family Plan', 2199, 60, 'REPLACE_WITH_FAMILY_DODO_PRODUCT_ID')
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          price_cents = EXCLUDED.price_cents,
          credits = EXCLUDED.credits,
          dodo_product_id = EXCLUDED.dodo_product_id;
  END IF;
END $$;

COMMIT;

-- Verify
SELECT id, name, credits, price_cents
FROM public.payment_plans
WHERE credits = 60;
