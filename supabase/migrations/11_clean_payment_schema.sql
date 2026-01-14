-- Clean Payment System Schema Migration
-- This will migrate from the old complex payment system to a minimal, clean payment system for $2 = 5 credits

-- Drop existing indexes first to avoid conflicts
DROP INDEX IF EXISTS public.idx_payments_user_id;
DROP INDEX IF EXISTS public.idx_payments_dodo_payment_id;
DROP INDEX IF EXISTS public.idx_webhook_events_event_id;
DROP INDEX IF EXISTS public.idx_webhook_events_processed;
DROP INDEX IF EXISTS public.idx_user_profiles_user_id;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.payment_plans CASCADE;

-- Create simplified payment_plans table with only required columns
CREATE TABLE public.payment_plans (
  id text PRIMARY KEY DEFAULT 'premium-plan',
  name text NOT NULL,
  price_cents integer NOT NULL,
  credits integer NOT NULL,
  dodo_product_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert the single plan
INSERT INTO public.payment_plans (id, name, price_cents, credits, dodo_product_id) VALUES
('premium-plan', 'Premium Plan', 200, 5, 'your_dodo_product_id_here');

-- Create simplified payments table with only required columns
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dodo_payment_id text NOT NULL UNIQUE,
  amount_cents integer NOT NULL,
  credits_purchased integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_link text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create simplified webhook_events table with only required columns
CREATE TABLE public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  payment_id uuid REFERENCES public.payments(id),
  processed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Ensure user_profiles has only required columns
-- Drop unnecessary columns if they exist
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS total_credits_purchased;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS updated_at;

-- Add credits column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'credits') THEN
    ALTER TABLE public.user_profiles ADD COLUMN credits integer DEFAULT 0;
  END IF;
END $$;

-- Ensure email field is never empty and add constraint
ALTER TABLE public.user_profiles ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_email_not_empty CHECK (email != '' AND email IS NOT NULL);

-- Create indexes for performance (using IF NOT EXISTS to be safe)
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_dodo_payment_id ON public.payments(dodo_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_user_profiles_credits ON public.user_profiles(credits);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Set up RLS policies
ALTER TABLE public.payment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view payment plans" ON public.payment_plans;
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;

-- Payment plans - anyone can view
CREATE POLICY "Anyone can view payment plans" ON public.payment_plans
  FOR SELECT USING (true);

-- Payments - users can only see their own
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Webhook events - only service role can access
CREATE POLICY "Service role can manage webhook events" ON public.webhook_events
  FOR ALL USING (auth.role() = 'service_role');

-- User profiles - users can only see their own
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name, credits, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''), -- Ensure email is always populated
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
    0, -- Start with 0 credits
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.payments TO authenticated;
GRANT SELECT ON public.payment_plans TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant service role permissions for webhooks
GRANT ALL ON public.webhook_events TO service_role;

-- Function to update existing user profiles with missing emails
CREATE OR REPLACE FUNCTION public.update_missing_emails()
RETURNS void AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Update user profiles that have empty or NULL emails
  FOR user_record IN 
    SELECT up.user_id, up.id
    FROM public.user_profiles up
    WHERE up.email IS NULL OR up.email = ''
  LOOP
    -- Get email from auth.users table
    UPDATE public.user_profiles 
    SET email = (
      SELECT email 
      FROM auth.users 
      WHERE id = user_record.user_id
    )
    WHERE id = user_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to fix existing data
SELECT public.update_missing_emails();

-- Clean up the temporary function
DROP FUNCTION public.update_missing_emails();
