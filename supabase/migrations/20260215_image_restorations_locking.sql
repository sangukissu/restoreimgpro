ALTER TABLE public.image_restorations
ADD COLUMN IF NOT EXISTS preview_image_path text,
ADD COLUMN IF NOT EXISTS clean_image_path text,
ADD COLUMN IF NOT EXISTS is_unlocked boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS was_trial boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS unlocked_at timestamp with time zone;

UPDATE public.image_restorations
SET is_unlocked = true,
    unlocked_at = COALESCE(unlocked_at, now())
WHERE is_unlocked = false
  AND restored_image_url IS NOT NULL
  AND preview_image_path IS NULL
  AND clean_image_path IS NULL;

CREATE INDEX IF NOT EXISTS idx_image_restorations_user_unlocked
  ON public.image_restorations (user_id, is_unlocked);

