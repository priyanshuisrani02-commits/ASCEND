-- Remove legacy policies from the original schema that would otherwise
-- remain permissive after 001_competitive_core_hardening.sql.

DROP POLICY IF EXISTS "Users can join challenges" ON public.challenge_participants;
DROP POLICY IF EXISTS "Users can update own progress" ON public.challenge_participants;
DROP POLICY IF EXISTS "Users can unlock own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can log activity" ON public.activity_events;

-- Only VERIFIED or REJECTED are valid moderator outcomes. Pending records
-- are created by players and cannot be self-approved.
CREATE OR REPLACE FUNCTION public.moderate_record(
  p_record_id uuid,
  p_status record_status,
  p_note text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record public.records;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin authorization required';
  END IF;

  IF p_status NOT IN ('VERIFIED', 'REJECTED') THEN
    RAISE EXCEPTION 'Invalid moderation outcome';
  END IF;

  SELECT * INTO v_record
  FROM public.records
  WHERE id = p_record_id
  FOR UPDATE;

  IF v_record.id IS NULL THEN
    RAISE EXCEPTION 'Record not found';
  END IF;

  IF v_record.status <> 'PENDING' THEN
    RAISE EXCEPTION 'Only pending records can be moderated';
  END IF;

  UPDATE public.records
  SET status = p_status,
      verified_at = NOW(),
      verified_by = auth.uid(),
      moderator_note = p_note
  WHERE id = p_record_id;

  IF p_status = 'VERIFIED' THEN
    UPDATE public.profiles
    SET ranking_points = ranking_points + 150,
        xp = xp + 500,
        level = GREATEST(1, FLOOR(SQRT((xp + 500) / 500.0))::integer + 1)
    WHERE id = v_record.user_id;

    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_record.user_id, 'RECORD_VERIFIED', 'Record Verified',
            'Your competitive record was verified. +150 Ranking Points and +500 XP.');

    INSERT INTO public.activity_events (user_id, event_type, title, description)
    VALUES (v_record.user_id, 'RECORD_SUBMITTED', 'Record verified',
            'A submitted record was verified by ASCEND moderation.');
  ELSE
    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (v_record.user_id, 'RECORD_REJECTED', 'Record Rejected',
            COALESCE(p_note, 'Your submitted record was not verified.'));
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.moderate_record(uuid, record_status, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.moderate_record(uuid, record_status, text) TO authenticated;
