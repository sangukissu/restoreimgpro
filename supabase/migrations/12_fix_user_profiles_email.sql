-- Fix user_profiles email field to ensure it's always populated
-- This script ensures that all user profiles have valid email addresses

-- First, let's check current state
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as profiles_without_email,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as profiles_with_email
FROM public.user_profiles;

-- Update user profiles that have empty or NULL emails
UPDATE public.user_profiles 
SET email = (
  SELECT email 
  FROM auth.users 
  WHERE auth.users.id = user_profiles.user_id
)
WHERE email IS NULL OR email = '';

-- Verify the fix
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as profiles_without_email,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as profiles_with_email
FROM public.user_profiles;

-- Add constraint to prevent future empty emails
ALTER TABLE public.user_profiles ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_email_not_empty CHECK (email != '' AND email IS NOT NULL);

-- Update the trigger function to ensure email is always populated
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

-- Verify the trigger function
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Show final state
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as valid_emails,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as invalid_emails
FROM public.user_profiles
UNION ALL
SELECT 
  'auth.users' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN email IS NOT NULL AND email != '' THEN 1 END) as valid_emails,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as invalid_emails
FROM auth.users;
