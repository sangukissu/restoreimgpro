-- Update payment_plans table to work with single plan system
-- Insert the Premium Plan into your existing payment_plans table

-- Insert the single plan (or update if it exists)
INSERT INTO public.payment_plans (
  id,
  name,
  price_cents,
  credits,
  description,
  is_active,
  dodo_product_id
) VALUES (
  'basic-plan',
  'Premium Plan',
  200, -- $2.00
  5,
  '5 image restorations for $2',
  true,
  'basic_plan' -- You'll need to update this with your actual DodoPayments product ID
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_cents = EXCLUDED.price_cents,
  credits = EXCLUDED.credits,
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active,
  dodo_product_id = EXCLUDED.dodo_product_id;

-- Ensure user_profiles table has the required columns
-- Add these columns if they don't exist

-- Add credits column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'credits') THEN
    ALTER TABLE public.user_profiles ADD COLUMN credits integer DEFAULT 0;
  END IF;
END $$;

-- Add total_credits_purchased column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'total_credits_purchased') THEN
    ALTER TABLE public.user_profiles ADD COLUMN total_credits_purchased integer DEFAULT 0;
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE public.user_profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Create index on user_profiles for credits if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_credits ON public.user_profiles(credits);

-- Create index on user_profiles for user_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Ensure RLS policies are set up for user_profiles
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS on user_profiles if not already enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name, credits, total_credits_purchased, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    0, -- Start with 0 credits
    0, -- Start with 0 total credits purchased
    now(),
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.payments TO authenticated;
GRANT ALL ON public.webhook_events TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
