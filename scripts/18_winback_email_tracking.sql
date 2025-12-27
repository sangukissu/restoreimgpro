-- Win-back Email Tracking Columns
-- Adds columns to user_profiles to track which win-back emails have been sent
-- This prevents duplicate emails from being sent to the same user

-- Add tracking columns for win-back emails
ALTER TABLE public.user_profiles 
  ADD COLUMN IF NOT EXISTS winback_email_1_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS winback_email_2_sent_at timestamptz;

-- Create index for efficient querying of users who haven't received emails yet
CREATE INDEX IF NOT EXISTS idx_user_profiles_winback 
  ON public.user_profiles(winback_email_1_sent_at, winback_email_2_sent_at);

-- Grant service role access to update these columns (for edge functions)
GRANT UPDATE (winback_email_1_sent_at, winback_email_2_sent_at) ON public.user_profiles TO service_role;
