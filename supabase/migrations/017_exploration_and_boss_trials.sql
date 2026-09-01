-- Exploration and boss trials
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS is_boss boolean NOT NULL DEFAULT false;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS boss_name text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS boss_lore text;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS boss_phase_count integer NOT NULL DEFAULT 1;
ALTER TABLE public.challenges ADD COLUMN IF NOT EXISTS boss_risk_multiplier numeric(5,2) NOT NULL DEFAULT 1.0;

CREATE TABLE IF NOT EXISTS public.discoveries (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE, title text NOT NULL, teaser text NOT NULL, reveal_text text NOT NULL,
  discovery_type text NOT NULL DEFAULT 'SECRET' CHECK (discovery_type IN ('SECRET','RELIC','LORE','LANDMARK')),
  rarity achievement_rarity NOT NULL DEFAULT 'RARE', xp_reward integer NOT NULL DEFAULT 100 CHECK (xp_reward >= 0),
  is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.user_discoveries (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(), user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  discovery_id uuid NOT NULL REFERENCES public.discoveries(id) ON DELETE CASCADE, discovered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, discovery_id)
);
ALTER TABLE public.discoveries ENABLE ROW LEVEL SECURITY; ALTER TABLE public.user_discoveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active discoveries" ON public.discoveries;
CREATE POLICY "Public can read active discoveries" ON public.discoveries FOR SELECT USING (is_active = true OR public.is_admin_user());
DROP POLICY IF EXISTS "Users can read own discoveries" ON public.user_discoveries;
CREATE POLICY "Users can read own discoveries" ON public.user_discoveries FOR SELECT USING (auth.uid() = user_id OR public.is_admin_user());
DROP POLICY IF EXISTS "Users can record own discoveries" ON public.user_discoveries;
CREATE POLICY "Users can record own discoveries" ON public.user_discoveries FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage discoveries" ON public.discoveries;
CREATE POLICY "Admins can manage discoveries" ON public.discoveries FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
DROP POLICY IF EXISTS "Admins can manage user discoveries" ON public.user_discoveries;
CREATE POLICY "Admins can manage user discoveries" ON public.user_discoveries FOR ALL USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
CREATE OR REPLACE FUNCTION public.discover_secret(p_discovery_id uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_xp integer; v_title text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT xp_reward,title INTO v_xp,v_title FROM public.discoveries WHERE id=p_discovery_id AND is_active=true;
  IF v_title IS NULL THEN RAISE EXCEPTION 'Discovery not found'; END IF;
  INSERT INTO public.user_discoveries(user_id,discovery_id) VALUES(auth.uid(),p_discovery_id) ON CONFLICT(user_id,discovery_id) DO NOTHING;
  IF FOUND THEN
    UPDATE public.profiles SET xp=xp+v_xp, level=GREATEST(1,FLOOR(SQRT((xp+v_xp)/500.0))::integer+1) WHERE id=auth.uid();
    INSERT INTO public.notifications(user_id,type,title,message) VALUES(auth.uid(),'SYSTEM','Secret discovered',v_title||' — +'||v_xp||' XP');
  END IF;
  RETURN true;
END; $$;
REVOKE ALL ON FUNCTION public.discover_secret(uuid) FROM PUBLIC; GRANT EXECUTE ON FUNCTION public.discover_secret(uuid) TO authenticated;
CREATE INDEX IF NOT EXISTS discoveries_game_id_idx ON public.discoveries(game_id); CREATE INDEX IF NOT EXISTS user_discoveries_user_id_idx ON public.user_discoveries(user_id);

INSERT INTO public.discoveries (game_id,slug,title,teaser,reveal_text,discovery_type,rarity,xp_reward)
SELECT g.id,x.slug,x.title,x.teaser,x.reveal_text,x.discovery_type,x.rarity::achievement_rarity,x.xp_reward::integer
FROM public.games g JOIN (VALUES
('valorant','the-silent-archive','The Silent Archive','A sealed archive sits behind the competitive noise.','Records of the first players who mapped ASCEND.','LORE','EPIC','250'),
('elden-ring','ashen-road','The Ashen Road','A road appears where the map says there should be nothing.','The stones remember every challenger who turned back.','LANDMARK','RARE','150'),
('minecraft','buried-obelisk','The Buried Obelisk','A geometric shadow breaks the surface at dusk.','Its inscription points toward an uncharted region.','RELIC','LEGENDARY','400'),
('fortnite','last-light-cache','Last Light Cache','Something glints beneath the arena lights.','A sealed cache holds a fragment of an old tournament banner.','SECRET','RARE','175'),
('rocket-league','skyline-glyph','Skyline Glyph','A strange mark is hidden above the highest route.','The glyph is one of seven marks scattered across the worlds.','LORE','EPIC','275')) AS x(game_slug,slug,title,teaser,reveal_text,discovery_type,rarity,xp_reward) ON g.slug=x.game_slug ON CONFLICT(slug) DO NOTHING;

UPDATE public.challenges SET is_boss=true,boss_name=COALESCE(boss_name,'The Warden of the First Gate'),boss_lore=COALESCE(boss_lore,'A veteran trialmaster who measures consistency rather than speed.'),boss_phase_count=GREATEST(boss_phase_count,3),boss_risk_multiplier=GREATEST(boss_risk_multiplier,1.5) WHERE id=(SELECT id FROM public.challenges ORDER BY created_at ASC LIMIT 1);
