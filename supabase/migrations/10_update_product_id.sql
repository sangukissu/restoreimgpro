-- Update the DodoPayments product ID in your payment_plans table
-- Run this AFTER you create your product in DodoPayments dashboard

-- Replace 'your_actual_product_id' with the real product ID from DodoPayments
UPDATE public.payment_plans 
SET dodo_product_id = 'your_actual_product_id'
WHERE id = 'basic-plan';

-- Verify the update
SELECT id, name, dodo_product_id, price_cents, credits 
FROM public.payment_plans 
WHERE id = 'basic-plan';
