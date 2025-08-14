-- Email Field Fix Script - Only Updates (No Table Recreation)
-- This script fixes the user_profiles email field issue without recreating existing tables

-- Step 1: Check current state of user_profiles table
SELECT 
  'Current State' as status,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as profiles_without_email,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as profiles_with_email
FROM public.user_profiles;

-- Step 2: Update existing user profiles with missing emails
-- This gets the email from auth.users table for profiles that have empty emails
UPDATE public.user_profiles 
SET email = (
  SELECT email 
  FROM auth.users 
  WHERE auth.users.id = user_profiles.user_id
)
WHERE email IS NULL OR email = '';

-- Step 3: Verify the fix worked
SELECT 
  'After Fix' as status,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as profiles_without_email,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as profiles_with_email
FROM public.user_profiles;

-- Step 4: Add NOT NULL constraint to email column
-- First, check if constraint already exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_email_not_empty'
  ) THEN
    -- Add constraint to prevent empty emails
    ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_email_not_empty 
    CHECK (email != '' AND email IS NOT NULL);
    
    RAISE NOTICE 'Added email constraint successfully';
  ELSE
    RAISE NOTICE 'Email constraint already exists';
  END IF;
END $$;

-- Step 5: Update the trigger function to ensure email is always populated
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

-- Step 6: Verify the trigger function was updated
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Step 7: Final verification - show the complete state
SELECT 
  'Final State' as status,
  COUNT(*) as total_records,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as valid_emails,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as invalid_emails
FROM public.user_profiles
UNION ALL
SELECT 
  'auth.users' as status,
  COUNT(*) as total_records,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as valid_emails,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as invalid_emails
FROM auth.users;

-- Step 8: Show sample of fixed user profiles
SELECT 
  user_id,
  email,
  name,
  credits,
  created_at
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 10;
