-- Check if referral system is properly installed
-- This script checks for the existence of referral tables and functions

-- Check if referral tables exist
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('referral_codes', 'referrals', 'referral_settings', 'referral_analytics')
ORDER BY table_name;

-- Check if referral functions exist
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname IN ('generate_referral_code', 'create_user_referral_code', 'process_referral_reward', 'create_referral');

-- Check if referral trigger exists
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgfoid::regproc as function_name
FROM pg_trigger 
WHERE tgname = 'create_referral_code_on_user_profile';

-- Check existing referral codes (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'referral_codes') THEN
    RAISE NOTICE 'Referral codes table exists. Checking data...';
    PERFORM * FROM referral_codes LIMIT 1;
    RAISE NOTICE 'Referral codes count: %', (SELECT COUNT(*) FROM referral_codes);
  ELSE
    RAISE NOTICE 'Referral codes table does NOT exist!';
  END IF;
END $$;