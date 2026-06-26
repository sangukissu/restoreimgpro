ALTER TABLE public.image_restorations
ADD COLUMN IF NOT EXISTS original_image_url text,
ADD COLUMN IF NOT EXISTS batch_id uuid,
ADD COLUMN IF NOT EXISTS batch_index integer,
ADD COLUMN IF NOT EXISTS credits_charged integer NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS credit_refunded boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_image_restorations_batch_id
  ON public.image_restorations (batch_id);

CREATE OR REPLACE FUNCTION public.reserve_restore_credits(
  p_user_id uuid,
  p_amount integer
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_remaining integer;
BEGIN
  IF p_amount IS NULL OR p_amount < 1 OR p_amount > 5 THEN
    RAISE EXCEPTION 'INVALID_CREDIT_AMOUNT';
  END IF;

  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'FORBIDDEN';
  END IF;

  UPDATE public.user_profiles
  SET credits = credits - p_amount
  WHERE user_id = p_user_id
    AND COALESCE(credits, 0) >= p_amount
  RETURNING credits INTO v_remaining;

  IF v_remaining IS NULL THEN
    RAISE EXCEPTION 'INSUFFICIENT_CREDITS';
  END IF;

  RETURN v_remaining;
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_restoration_and_refund(
  p_restoration_id uuid,
  p_error_message text DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_restoration public.image_restorations%ROWTYPE;
  v_refunded integer := 0;
BEGIN
  SELECT *
  INTO v_restoration
  FROM public.image_restorations
  WHERE id = p_restoration_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'RESTORATION_NOT_FOUND';
  END IF;

  IF v_restoration.credit_refunded = false
     AND COALESCE(v_restoration.credits_charged, 0) > 0 THEN
    UPDATE public.user_profiles
    SET credits = COALESCE(credits, 0) + v_restoration.credits_charged
    WHERE user_id = v_restoration.user_id;

    v_refunded := v_restoration.credits_charged;
  END IF;

  UPDATE public.image_restorations
  SET status = 'failed',
      error_message = COALESCE(p_error_message, error_message),
      credit_refunded = true,
      updated_at = now()
  WHERE id = p_restoration_id;

  RETURN v_refunded;
END;
$$;

GRANT EXECUTE ON FUNCTION public.reserve_restore_credits(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fail_restoration_and_refund(uuid, text) TO authenticated;
