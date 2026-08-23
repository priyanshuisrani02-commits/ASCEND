-- ====================================================================
-- ASCEND — FULL-STACK COMPETITIVE GAMING ACHIEVEMENT PLATFORM SCHEMA
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE achievement_rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');
CREATE TYPE challenge_status AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED');
CREATE TYPE challenge_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT', 'INSANE');
CREATE TYPE record_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE notification_type AS ENUM ('ACHIEVEMENT_UNLOCKED', 'CHALLENGE_COMPLETED', 'RANK_CHANGED', 'RECORD_VERIFIED', 'RECORD_REJECTED', 'SYSTEM');

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    bio TEXT DEFAULT 'Competitive gamer ready to ASCEND.',
    level INTEGER DEFAULT 1 NOT NULL,
    xp INTEGER DEFAULT 0 NOT NULL,
    ranking_points INTEGER DEFAULT 1000 NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    favorite_games TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. GAMES TABLE
CREATE TABLE IF NOT EXISTS public.games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    genre TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    banner_url TEXT NOT NULL,
    player_count INTEGER DEFAULT 0 NOT NULL,
    achievement_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    rarity achievement_rarity DEFAULT 'COMMON' NOT NULL,
    xp_reward INTEGER DEFAULT 100 NOT NULL,
    requirements TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    unlocked_count INTEGER DEFAULT 0 NOT NULL,
    total_players_count INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. USER ACHIEVEMENTS TABLE (Junction)
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- 7. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    difficulty challenge_difficulty DEFAULT 'MEDIUM' NOT NULL,
    xp_reward INTEGER DEFAULT 500 NOT NULL,
    ranking_reward INTEGER DEFAULT 50 NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    participant_count INTEGER DEFAULT 0 NOT NULL,
    status challenge_status DEFAULT 'ACTIVE' NOT NULL,
    requirements TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. CHALLENGE PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.challenge_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'IN_PROGRESS' NOT NULL, -- IN_PROGRESS, COMPLETED
    progress INTEGER DEFAULT 0 NOT NULL,
    completed_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(challenge_id, user_id)
);

-- 9. RECORDS & SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Speedrun, High Score, Win Streak, etc.
    score_value NUMERIC NOT NULL,
    score_unit TEXT NOT NULL, -- seconds, points, wins
    evidence_url TEXT NOT NULL,
    status record_status DEFAULT 'PENDING' NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id),
    moderator_note TEXT
);

-- 10. ACTIVITY EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL, -- ACHIEVEMENT_UNLOCKED, RECORD_SUBMITTED, CHALLENGE_COMPLETED, LEVEL_UP
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type notification_type DEFAULT 'SYSTEM' NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_rp ON public.profiles(ranking_points DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_game ON public.achievements(game_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_ach ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);
CREATE INDEX IF NOT EXISTS idx_records_status ON public.records(status);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- GAMES POLICIES (Public read, admin write)
CREATE POLICY "Games are readable by everyone" ON public.games FOR SELECT USING (true);
CREATE POLICY "Admins can insert/update/delete games" ON public.games FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ACHIEVEMENTS POLICIES
CREATE POLICY "Achievements are readable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- USER ACHIEVEMENTS POLICIES
CREATE POLICY "User achievements readable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can unlock own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CHALLENGES POLICIES
CREATE POLICY "Challenges readable by everyone" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Admins can manage challenges" ON public.challenges FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- CHALLENGE PARTICIPANTS POLICIES
CREATE POLICY "Participants readable by everyone" ON public.challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can join challenges" ON public.challenge_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.challenge_participants FOR UPDATE USING (auth.uid() = user_id);

-- RECORDS POLICIES
CREATE POLICY "Verified records readable by everyone" ON public.records FOR SELECT USING (true);
CREATE POLICY "Users can submit own records" ON public.records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can verify/manage records" ON public.records FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ACTIVITY EVENTS POLICIES
CREATE POLICY "Activity events readable by everyone" ON public.activity_events FOR SELECT USING (true);
CREATE POLICY "Users can log activity" ON public.activity_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users mark notifications read" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- ====================================================================
-- TRIGGERS & AUTOMATION
-- ====================================================================
-- Auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || SUBSTRING(NEW.id::text FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'ASCEND Player'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
