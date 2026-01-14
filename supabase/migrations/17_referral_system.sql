-- Customer Referral System Database Schema
-- This system allows users to refer friends and earn credits when friends make purchases

-- 1. Referral codes table - stores unique referral codes for each user
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT referral_codes_code_format CHECK (
    code ~ '^[A-Z0-9]{6,12}$' -- Alphanumeric, 6-12 characters
  )
);

-- 2. Referrals table - tracks successful referrals and their status
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL REFERENCES public.referral_codes(code),
  
  -- Referral status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'completed', 'credited', 'expired')
  ),
  
  -- Credit tracking
  referrer_credits_earned INTEGER DEFAULT 0,
  referred_credits_earned INTEGER DEFAULT 0,
  
  -- Purchase tracking
  first_purchase_amount_cents INTEGER,
  first_purchase_date TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  referred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  credited_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT referrals_different_users CHECK (referrer_user_id != referred_user_id),
  CONSTRAINT referrals_credits_positive CHECK (
    referrer_credits_earned >= 0 AND referred_credits_earned >= 0
  )
);

-- 3. Referral settings table - configurable referral program settings
CREATE TABLE IF NOT EXISTS public.referral_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Credit rewards
  referrer_credits_reward INTEGER NOT NULL DEFAULT 2, -- Credits for referrer
  referred_credits_reward INTEGER NOT NULL DEFAULT 1, -- Credits for new user
  
  -- Program settings
  is_active BOOLEAN DEFAULT true,
  minimum_purchase_cents INTEGER DEFAULT 0, -- Minimum purchase to trigger reward
  expiry_days INTEGER DEFAULT 30, -- Days before referral expires
  max_referrals_per_user INTEGER DEFAULT 50, -- Max referrals per user
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default referral settings
INSERT INTO public.referral_settings (
  referrer_credits_reward,
  referred_credits_reward,
  minimum_purchase_cents,
  expiry_days,
  max_referrals_per_user
) VALUES (2, 1, 0, 30, 50)
ON CONFLICT DO NOTHING;

-- 4. Referral analytics table - tracks referral program performance
CREATE TABLE IF NOT EXISTS public.referral_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Daily metrics
  total_referrals_created INTEGER DEFAULT 0,
  total_referrals_completed INTEGER DEFAULT 0,
  total_credits_awarded INTEGER DEFAULT 0,
  total_revenue_generated_cents INTEGER DEFAULT 0,
  
  -- User metrics
  new_users_from_referrals INTEGER DEFAULT 0,
  active_referrers INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint on date
  CONSTRAINT referral_analytics_date_unique UNIQUE (date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_active ON public.referral_codes(is_active);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at);

CREATE INDEX IF NOT EXISTS idx_referral_analytics_date ON public.referral_analytics(date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
CREATE POLICY "Users can view own referral codes" ON public.referral_codes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own referral codes" ON public.referral_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own referral codes" ON public.referral_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view referrals they're involved in" ON public.referrals
  FOR SELECT USING (
    auth.uid() = referrer_user_id OR auth.uid() = referred_user_id
  );

CREATE POLICY "System can insert referrals" ON public.referrals
  FOR INSERT WITH CHECK (true); -- Controlled by application logic

CREATE POLICY "System can update referrals" ON public.referrals
  FOR UPDATE USING (true); -- Controlled by application logic

-- RLS Policies for referral_settings (read-only for users)
CREATE POLICY "Anyone can view referral settings" ON public.referral_settings
  FOR SELECT USING (true);

-- RLS Policies for referral_analytics (read-only for authenticated users)
CREATE POLICY "Authenticated users can view analytics" ON public.referral_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := upper(
      substring(
        encode(gen_random_bytes(6), 'base64')
        from 1 for 8
      )
    );
    
    -- Replace non-alphanumeric characters
    code := regexp_replace(code, '[^A-Z0-9]', '', 'g');
    
    -- Ensure it's exactly 8 characters
    IF length(code) >= 8 THEN
      code := substring(code from 1 for 8);
      
      -- Check if code already exists
      SELECT COUNT(*) INTO exists_check
      FROM public.referral_codes
      WHERE referral_codes.code = code;
      
      IF exists_check = 0 THEN
        RETURN code;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create referral code for new users
CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate unique referral code
  new_code := public.generate_referral_code();
  
  -- Insert referral code for new user
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.user_id, new_code);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create referral code when user profile is created
CREATE OR REPLACE TRIGGER create_referral_code_on_user_profile
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_referral_code();

-- Function to process referral when user makes first purchase
CREATE OR REPLACE FUNCTION public.process_referral_reward(
  p_user_id UUID,
  p_purchase_amount_cents INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  referral_record RECORD;
  settings_record RECORD;
  referrer_reward INTEGER;
  referred_reward INTEGER;
BEGIN
  -- Get referral settings
  SELECT * INTO settings_record
  FROM public.referral_settings
  WHERE is_active = true
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND OR NOT settings_record.is_active THEN
    RETURN false;
  END IF;
  
  -- Check if purchase meets minimum requirement
  IF p_purchase_amount_cents < settings_record.minimum_purchase_cents THEN
    RETURN false;
  END IF;
  
  -- Find pending referral for this user
  SELECT * INTO referral_record
  FROM public.referrals
  WHERE referred_user_id = p_user_id
    AND status = 'pending'
    AND created_at > NOW() - INTERVAL '1 day' * settings_record.expiry_days
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Calculate rewards
  referrer_reward := settings_record.referrer_credits_reward;
  referred_reward := settings_record.referred_credits_reward;
  
  -- Update referral record
  UPDATE public.referrals
  SET 
    status = 'completed',
    first_purchase_amount_cents = p_purchase_amount_cents,
    first_purchase_date = NOW(),
    completed_at = NOW(),
    referrer_credits_earned = referrer_reward,
    referred_credits_earned = referred_reward,
    updated_at = NOW()
  WHERE id = referral_record.id;
  
  -- Award credits to referrer
  UPDATE public.user_profiles
  SET credits = credits + referrer_reward
  WHERE user_id = referral_record.referrer_user_id;
  
  -- Award credits to referred user
  UPDATE public.user_profiles
  SET credits = credits + referred_reward
  WHERE user_id = referral_record.referred_user_id;
  
  -- Mark as credited
  UPDATE public.referrals
  SET 
    status = 'credited',
    credited_at = NOW(),
    updated_at = NOW()
  WHERE id = referral_record.id;
  
  -- Update analytics
  INSERT INTO public.referral_analytics (
    date,
    total_referrals_completed,
    total_credits_awarded,
    total_revenue_generated_cents
  ) VALUES (
    CURRENT_DATE,
    1,
    referrer_reward + referred_reward,
    p_purchase_amount_cents
  )
  ON CONFLICT (date) DO UPDATE SET
    total_referrals_completed = referral_analytics.total_referrals_completed + 1,
    total_credits_awarded = referral_analytics.total_credits_awarded + (referrer_reward + referred_reward),
    total_revenue_generated_cents = referral_analytics.total_revenue_generated_cents + p_purchase_amount_cents;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create referral relationship
CREATE OR REPLACE FUNCTION public.create_referral(
  p_referral_code TEXT,
  p_referred_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  referrer_id UUID;
  settings_record RECORD;
  existing_referral_count INTEGER;
BEGIN
  -- Get referral settings
  SELECT * INTO settings_record
  FROM public.referral_settings
  WHERE is_active = true
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF NOT FOUND OR NOT settings_record.is_active THEN
    RETURN false;
  END IF;
  
  -- Find referrer by code
  SELECT user_id INTO referrer_id
  FROM public.referral_codes
  WHERE code = p_referral_code
    AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if user is trying to refer themselves
  IF referrer_id = p_referred_user_id THEN
    RETURN false;
  END IF;
  
  -- Check if user already has a referral
  SELECT COUNT(*) INTO existing_referral_count
  FROM public.referrals
  WHERE referred_user_id = p_referred_user_id;
  
  IF existing_referral_count > 0 THEN
    RETURN false;
  END IF;
  
  -- Check referrer's referral limit
  SELECT COUNT(*) INTO existing_referral_count
  FROM public.referrals
  WHERE referrer_user_id = referrer_id
    AND status IN ('pending', 'completed', 'credited');
  
  IF existing_referral_count >= settings_record.max_referrals_per_user THEN
    RETURN false;
  END IF;
  
  -- Create referral record
  INSERT INTO public.referrals (
    referrer_user_id,
    referred_user_id,
    referral_code,
    status
  ) VALUES (
    referrer_id,
    p_referred_user_id,
    p_referral_code,
    'pending'
  );
  
  -- Update analytics
  INSERT INTO public.referral_analytics (
    date,
    total_referrals_created,
    new_users_from_referrals
  ) VALUES (
    CURRENT_DATE,
    1,
    1
  )
  ON CONFLICT (date) DO UPDATE SET
    total_referrals_created = referral_analytics.total_referrals_created + 1,
    new_users_from_referrals = referral_analytics.new_users_from_referrals + 1;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.referral_codes TO authenticated;
GRANT ALL ON public.referrals TO authenticated;
GRANT SELECT ON public.referral_settings TO authenticated;
GRANT SELECT ON public.referral_analytics TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant service role permissions for system operations
GRANT ALL ON public.referral_codes TO service_role;
GRANT ALL ON public.referrals TO service_role;
GRANT ALL ON public.referral_settings TO service_role;
GRANT ALL ON public.referral_analytics TO service_role;