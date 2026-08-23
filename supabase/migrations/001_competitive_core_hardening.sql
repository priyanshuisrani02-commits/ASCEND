-- ASCEND competitive core hardening
-- Apply after supabase/schema.sql.
-- This migration makes player-controlled progression trustworthy and makes admin actions fail closed.

-- ---------------------------------------------------------------------
-- Helper: admin check. SECURITY DEFINER avoids recursive RLS checks.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;

-- ---------------------------------------------------------------------
-- Protect competitive/profile fields. Normal players may edit identity
-- fields only; XP, RP, level and admin status are system controlled.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = OLD.id AND NOT OLD.is_admin THEN
    IF NEW.xp IS DISTINCT FROM OLD.xp
       OR NEW.ranking_points IS DISTINCT FROM OLD.ranking_points
       OR NEW.level IS DISTINCT FROM OLD.level
       OR NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      RAISE EXCEPTION 'Competitive and role fields are system controlled';
    END IF;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profile_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_fields();

-- ---------------------------------------------------------------------
-- Replace permissive user-achievement/challenge policies.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can unlock own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can update own progress" ON public.challenge_participants;
DROP POLICY IF EXISTS "Users can log activity" ON public.activity_events;
DROP POLICY IF EXISTS "Verified records readable by everyone" ON public.records;
DROP POLICY IF EXISTS "Users can submit own records" ON public.records;

-- Achievement ownership is readable publicly, but only trusted server
-- functions/admin workflows can create unlocks.
CREATE POLICY "Users can read achievement ownership" ON public.user_achievements
  FOR SELECT USING (true);

-- Challenge participants can be read publicly; joining is allowed only for
-- the authenticated player and progress is never client-writable.
CREATE POLICY "Users can join active challenges" ON public.challenge_participants
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.challenges c
      WHERE c.id = challenge_id
        AND c.status = 'ACTIVE'
        AND NOW() BETWEEN c.start_date AND c.end_date
    )
  );

-- Records: public can see verified records, owners can see their own,
-- moderators can see everything.
CREATE POLICY "Public can read verified records" ON public.records
  FOR SELECT USING (status = 'VERIFIED' OR auth.uid() = user_id OR public.is_admin_user());

CREATE POLICY "Users can submit own pending records" ON public.records
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND status = 'PENDING'
  );

-- Users may never directly create activity events because that would allow
-- fabricated competitive history.

-- ---------------------------------------------------------------------
-- Join challenge safely and atomically increment the participant counter.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.join_challenge(p_challenge_id uuid)
RETURNS public.challenge_participants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.challenge_participants;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.challenge_participants (challenge_id, user_id)
  SELECT id, auth.uid()
  FROM public.challenges
  WHERE id = p_challenge_id
    AND status = 'ACTIVE'
    AND NOW() BETWEEN start_date AND end_date
  ON CONFLICT (challenge_id, user_id) DO NOTHING
  RETURNING * INTO v_row;

  IF v_row.id IS NULL THEN
    SELECT * INTO v_row
    FROM public.challenge_participants
    WHERE challenge_id = p_challenge_id AND user_id = auth.uid();

    IF v_row.id IS NULL THEN
      RAISE EXCEPTION 'Challenge is not active or does not exist';
    END IF;
  ELSE
    UPDATE public.challenges
    SET participant_count = participant_count + 1
    WHERE id = p_challenge_id;
  END IF;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.join_challenge(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_challenge(uuid) TO authenticated;

-- ---------------------------------------------------------------------
-- Admin-only achievement grant. This is the trusted primitive that future
-- automated verification can call as well.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.grant_achievement(p_user_id uuid, p_achievement_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reward integer;
BEGIN
  IF NOT public.is_admin_user() THEN
    RAISE EXCEPTION 'Admin authorization required';
  END IF;

  SELECT xp_reward INTO v_reward
  FROM public.achievements
  WHERE id = p_achievement_id AND is_active = true;

  IF v_reward IS NULL THEN
    RAISE EXCEPTION 'Achievement not found or inactive';
  END IF;

  INSERT INTO public.user_achievements (user_id, achievement_id)
  VALUES (p_user_id, p_achievement_id)
  ON CONFLICT (user_id, achievement_id) DO NOTHING;

  IF FOUND THEN
    UPDATE public.achievements
    SET unlocked_count = unlocked_count + 1
    WHERE id = p_achievement_id;

    UPDATE public.profiles
    SET xp = xp + v_reward,
        level = GREATEST(1, FLOOR(SQRT((xp + v_reward) / 500.0))::integer + 1)
    WHERE id = p_user_id;

    INSERT INTO public.notifications (user_id, type, title, message)
    VALUES (p_user_id, 'ACHIEVEMENT_UNLOCKED', 'Achievement Unlocked!',
            'You unlocked a new ASCEND achievement and earned ' || v_reward || ' XP.');

    INSERT INTO public.activity_events (user_id, event_type, title, description)
    VALUES (p_user_id, 'ACHIEVEMENT_UNLOCKED', 'Achievement unlocked',
            'A new achievement was verified for this player.');
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_achievement(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.grant_achievement(uuid, uuid) TO authenticated;

-- ---------------------------------------------------------------------
-- Admin moderation is atomic: verify record + award RP/XP + notify.
-- ---------------------------------------------------------------------
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
      verified_at = CASE WHEN p_status IN ('VERIFIED','REJECTED') THEN NOW() ELSE NULL END,
      verified_by = CASE WHEN p_status IN ('VERIFIED','REJECTED') THEN auth.uid() ELSE NULL END,
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

-- ---------------------------------------------------------------------
-- Ensure admin policies use the fail-closed helper instead of recursive
-- profile queries. Existing policies are replaced where relevant.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can insert/update/delete games" ON public.games;
CREATE POLICY "Admins can insert/update/delete games" ON public.games
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can manage challenges" ON public.challenges;
CREATE POLICY "Admins can manage challenges" ON public.challenges
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "Admins can verify/manage records" ON public.records;
CREATE POLICY "Admins can manage records" ON public.records
  FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- Admins may manage participant progress only through moderation/admin UI.
CREATE POLICY "Admins can manage challenge participants" ON public.challenge_participants
  FOR UPDATE USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- Keep notification writes server-controlled.
DROP POLICY IF EXISTS "Users mark notifications read" ON public.notifications;
CREATE POLICY "Users mark notifications read" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Public ranking view: only non-sensitive profile fields are exposed.
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_rankings
WITH (security_invoker = true) AS
SELECT
  id,
  username,
  display_name,
  avatar_url,
  level,
  xp,
  ranking_points,
  favorite_games,
  created_at
FROM public.profiles;
