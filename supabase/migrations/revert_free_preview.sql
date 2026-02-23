-- Revert changes from 20260215_trial_credits.sql and 20260215_image_restorations_locking.sql

-- 1. Revert user_profiles changes
ALTER TABLE public.user_profiles
DROP COLUMN IF EXISTS trial_credits;

-- Restore the original handle_new_user function (without trial_credits)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, name, credits, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
    0,
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Revert image_restorations changes
DROP INDEX IF EXISTS idx_image_restorations_user_unlocked;

ALTER TABLE public.image_restorations
DROP COLUMN IF EXISTS preview_image_path,
DROP COLUMN IF EXISTS clean_image_path,
DROP COLUMN IF EXISTS is_unlocked,
DROP COLUMN IF EXISTS was_trial,
DROP COLUMN IF EXISTS unlocked_at;
