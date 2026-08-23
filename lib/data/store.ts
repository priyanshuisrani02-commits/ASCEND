import { Game, Achievement, Challenge, Profile, RecordSubmission, ActivityEvent, NotificationItem } from '../types';
import { MOCK_GAMES, MOCK_ACHIEVEMENTS, MOCK_CHALLENGES, MOCK_PROFILES, MOCK_RECORDS, MOCK_ACTIVITIES } from './mockData';
import { createClient } from '../supabase/client';

// Local reactive memory cache for fallback / seed operations
let localGames: Game[] = [...MOCK_GAMES];
let localAchievements: Achievement[] = [...MOCK_ACHIEVEMENTS];
let localChallenges: Challenge[] = [...MOCK_CHALLENGES];
let localProfiles: Profile[] = [...MOCK_PROFILES];
let localRecords: RecordSubmission[] = [...MOCK_RECORDS];
let localActivities: ActivityEvent[] = [...MOCK_ACTIVITIES];
let localNotifications: NotificationItem[] = [
  {
    id: 'n-01',
    user_id: 'u-apex-01',
    type: 'ACHIEVEMENT_UNLOCKED',
    title: 'Achievement Unlocked!',
    message: 'You earned Goddess of Rot (Hitless) (+3,500 XP).',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'n-02',
    user_id: 'u-apex-01',
    type: 'RANK_CHANGED',
    title: 'Rank Up!',
    message: 'Your Global Rank increased to #1.',
    is_read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  }
];

function isSupabaseConfigured() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
  );
}

// ---------------------- GAMES ----------------------
export async function getGames(): Promise<Game[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('games').select('*').order('player_count', { ascending: false });
      if (!error && data && data.length > 0) return data as Game[];
    } catch {
      // Fallback
    }
  }
  return localGames;
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const games = await getGames();
  return games.find(g => g.slug.toLowerCase() === slug.toLowerCase());
}

export async function addGame(game: Omit<Game, 'id' | 'created_at'>): Promise<Game> {
  const newGame: Game = {
    ...game,
    id: `g-custom-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('games').insert(newGame);
    } catch {
      // Handled
    }
  }
  localGames.unshift(newGame);
  return newGame;
}

// ---------------------- ACHIEVEMENTS ----------------------
export async function getAchievements(gameSlug?: string): Promise<Achievement[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('achievements').select('*, games(title, slug)');
      if (gameSlug) {
        query = query.eq('games.slug', gameSlug);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          game_title: item.games?.title,
          game_slug: item.games?.slug,
        })) as Achievement[];
      }
    } catch {
      // Fallback
    }
  }
  if (gameSlug) {
    return localAchievements.filter(a => a.game_slug?.toLowerCase() === gameSlug.toLowerCase());
  }
  return localAchievements;
}

export async function getMyAchievements(userId: string): Promise<Achievement[]> {
  const all = await getAchievements();
  // Return marked unlocked achievements
  return all.map(a => ({
    ...a,
    is_unlocked: a.is_unlocked ?? (a.rarity === 'COMMON' || a.rarity === 'UNCOMMON'),
    unlocked_at: new Date().toISOString()
  }));
}

export async function createAchievement(ach: Omit<Achievement, 'id' | 'created_at' | 'unlocked_count' | 'total_players_count'>): Promise<Achievement> {
  const newAch: Achievement = {
    ...ach,
    id: `ach-custom-${Date.now()}`,
    unlocked_count: 0,
    total_players_count: 1000,
    created_at: new Date().toISOString(),
  };
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('achievements').insert(newAch);
    } catch {
      // Handled
    }
  }
  localAchievements.unshift(newAch);
  return newAch;
}

// ---------------------- CHALLENGES ----------------------
export async function getChallenges(): Promise<Challenge[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('challenges').select('*, games(title, slug)');
      if (!error && data && data.length > 0) {
        return data.map(item => ({
          ...item,
          game_title: item.games?.title,
          game_slug: item.games?.slug,
        })) as Challenge[];
      }
    } catch {
      // Fallback
    }
  }
  return localChallenges;
}

export async function getChallengeById(id: string): Promise<Challenge | undefined> {
  const challenges = await getChallenges();
  return challenges.find(c => c.id === id);
}

export async function joinChallenge(challengeId: string, userId: string): Promise<boolean> {
  const challenge = localChallenges.find(c => c.id === challengeId);
  if (challenge) {
    challenge.user_joined = true;
    challenge.participant_count += 1;
  }
  return true;
}

export async function createChallenge(ch: Omit<Challenge, 'id' | 'created_at' | 'participant_count'>): Promise<Challenge> {
  const newCh: Challenge = {
    ...ch,
    id: `ch-custom-${Date.now()}`,
    participant_count: 0,
    created_at: new Date().toISOString(),
  };
  localChallenges.unshift(newCh);
  return newCh;
}

// ---------------------- PROFILES & RANKINGS ----------------------
export async function getRankings(): Promise<Profile[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('profiles').select('*').order('ranking_points', { ascending: false });
      if (!error && data && data.length > 0) return data as Profile[];
    } catch {
      // Fallback
    }
  }
  return [...localProfiles].sort((a, b) => b.ranking_points - a.ranking_points);
}

export async function getProfileByUsername(username: string): Promise<Profile | undefined> {
  const profiles = await getRankings();
  return profiles.find(p => p.username.toLowerCase() === username.toLowerCase());
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
  const index = localProfiles.findIndex(p => p.id === userId || p.username.toLowerCase() === userId.toLowerCase());
  if (index !== -1) {
    localProfiles[index] = { ...localProfiles[index], ...updates };
    return localProfiles[index];
  }
  return undefined;
}

// ---------------------- RECORDS & MODERATION ----------------------
export async function getRecords(status?: string): Promise<RecordSubmission[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('records').select('*, profiles(username, avatar_url), games(title)');
      if (status) {
        query = query.eq('status', status);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as RecordSubmission[];
    } catch {
      // Fallback
    }
  }
  if (status) {
    return localRecords.filter(r => r.status === status);
  }
  return localRecords;
}

export async function submitRecord(record: Omit<RecordSubmission, 'id' | 'submitted_at' | 'status'>): Promise<RecordSubmission> {
  const newRecord: RecordSubmission = {
    ...record,
    id: `rec-custom-${Date.now()}`,
    status: 'PENDING',
    submitted_at: new Date().toISOString(),
  };
  localRecords.unshift(newRecord);
  
  // Add activity event
  localActivities.unshift({
    id: `act-${Date.now()}`,
    user_id: record.user_id,
    username: record.username || 'Player',
    user_avatar: record.user_avatar || '',
    event_type: 'RECORD_SUBMITTED',
    title: `Submitted record for ${record.game_title || 'Game'}`,
    description: `Submitted ${record.title} (${record.score_value} ${record.score_unit}). Pending moderation.`,
    created_at: 'Just now',
  });

  return newRecord;
}

export async function moderateRecord(recordId: string, status: 'VERIFIED' | 'REJECTED', note?: string): Promise<boolean> {
  const rec = localRecords.find(r => r.id === recordId);
  if (rec) {
    rec.status = status;
    rec.verified_at = new Date().toISOString();
    rec.moderator_note = note;
    if (status === 'VERIFIED') {
      // Boost ranking points for player
      const profile = localProfiles.find(p => p.id === rec.user_id || p.username === rec.username);
      if (profile) {
        profile.ranking_points += 150;
        profile.xp += 500;
      }
    }
    return true;
  }
  return false;
}

// ---------------------- ACTIVITIES & NOTIFICATIONS ----------------------
export async function getActivities(): Promise<ActivityEvent[]> {
  return localActivities;
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  return localNotifications.filter(n => n.user_id === userId || userId === 'current');
}
