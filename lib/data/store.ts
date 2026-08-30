import {
  Game,
  Achievement,
  Challenge,
  Profile,
  RecordSubmission,
  ActivityEvent,
  NotificationItem,
} from '../types';
import {
  MOCK_GAMES,
  MOCK_ACHIEVEMENTS,
  MOCK_CHALLENGES,
  MOCK_PROFILES,
  MOCK_RECORDS,
  MOCK_ACTIVITIES,
} from './mockData';
import { createClient } from '../supabase/client';

/**
 * ASCEND data access layer.
 *
 * Production behavior is Supabase-first and fail-closed: database failures
 * are surfaced to the UI instead of silently switching to fake competitive
 * state. Local mocks are available only when explicitly enabled with
 * NEXT_PUBLIC_ASCEND_DEMO_MODE=true.
 */

const demoMode = process.env.NEXT_PUBLIC_ASCEND_DEMO_MODE === 'true';

let localGames: Game[] = [...MOCK_GAMES];
let localAchievements: Achievement[] = [...MOCK_ACHIEVEMENTS];
let localChallenges: Challenge[] = [...MOCK_CHALLENGES];
let localProfiles: Profile[] = [...MOCK_PROFILES];
let localRecords: RecordSubmission[] = [...MOCK_RECORDS];
let localActivities: ActivityEvent[] = [...MOCK_ACTIVITIES];

function demoOrThrow<T>(fallback: T, message: string): T {
  if (demoMode) return fallback;
  throw new Error(message);
}

async function getCurrentUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user?.id ?? null;
}

// ---------------------- GAMES ----------------------
export async function getGames(): Promise<Game[]> {
  if (demoMode) return localGames;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .order('player_count', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Game[];
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  if (demoMode) {
    return localGames.find((g) => g.slug.toLowerCase() === slug.toLowerCase());
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Game | undefined;
}

export async function addGame(game: Omit<Game, 'id' | 'created_at'>): Promise<Game> {
  if (demoMode) {
    const newGame: Game = {
      ...game,
      id: `g-demo-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    localGames.unshift(newGame);
    return newGame;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select()
    .single();

  if (error) throw error;
  return data as Game;
}

// ---------------------- ACHIEVEMENTS ----------------------
export async function getAchievements(gameSlug?: string): Promise<Achievement[]> {
  if (demoMode) {
    return gameSlug
      ? localAchievements.filter((a) => a.game_slug?.toLowerCase() === gameSlug.toLowerCase())
      : localAchievements;
  }

  const supabase = createClient();
  let query = supabase
    .from('achievements')
    .select('*, games!inner(title, slug)')
    .order('created_at', { ascending: false });

  if (gameSlug) query = query.eq('games.slug', gameSlug);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    ...item,
    game_title: item.games?.title,
    game_slug: item.games?.slug,
  })) as Achievement[];
}

export async function getMyAchievements(userId: string): Promise<Achievement[]> {
  if (demoMode) {
    return localAchievements.map((a) => ({
      ...a,
      is_unlocked: a.is_unlocked ?? false,
      unlocked_at: a.unlocked_at,
    }));
  }

  const supabase = createClient();
  const [achievementsResult, unlockedResult] = await Promise.all([
    supabase
      .from('achievements')
      .select('*, games!inner(title, slug)')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('user_achievements')
      .select('achievement_id, unlocked_at')
      .eq('user_id', userId),
  ]);

  if (achievementsResult.error) throw achievementsResult.error;
  if (unlockedResult.error) throw unlockedResult.error;

  const unlocked = new Map(
    (unlockedResult.data ?? []).map((item) => [item.achievement_id, item.unlocked_at])
  );

  return (achievementsResult.data ?? []).map((item: any) => ({
    ...item,
    game_title: item.games?.title,
    game_slug: item.games?.slug,
    is_unlocked: unlocked.has(item.id),
    unlocked_at: unlocked.get(item.id),
  })) as Achievement[];
}

export async function createAchievement(
  ach: Omit<Achievement, 'id' | 'created_at' | 'unlocked_count' | 'total_players_count'>
): Promise<Achievement> {
  if (demoMode) {
    const newAch: Achievement = {
      ...ach,
      id: `ach-demo-${Date.now()}`,
      unlocked_count: 0,
      total_players_count: localProfiles.length,
      created_at: new Date().toISOString(),
    };
    localAchievements.unshift(newAch);
    return newAch;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('achievements')
    .insert({
      slug: ach.slug,
      game_id: ach.game_id,
      title: ach.title,
      description: ach.description,
      icon_url: ach.icon_url,
      rarity: ach.rarity,
      xp_reward: ach.xp_reward,
      requirements: ach.requirements,
      is_active: ach.is_active,
      unlocked_count: 0,
      total_players_count: 1,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
}

// ---------------------- CHALLENGES ----------------------
export async function getChallenges(): Promise<Challenge[]> {
  if (demoMode) return localChallenges;

  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('challenges')
    .select('*, games(title, slug)')
    .order('start_date', { ascending: false });

  if (error) throw error;

  let joinedIds = new Set<string>();
  let completedIds = new Set<string>();

  if (userId) {
    const { data: participants, error: participantError } = await supabase
      .from('challenge_participants')
      .select('challenge_id, status')
      .eq('user_id', userId);

    if (participantError) throw participantError;
    joinedIds = new Set((participants ?? []).map((p) => p.challenge_id));
    completedIds = new Set(
      (participants ?? [])
        .filter((p) => p.status === 'COMPLETED')
        .map((p) => p.challenge_id)
    );
  }

  return (data ?? []).map((item: any) => ({
    ...item,
    game_title: item.games?.title,
    game_slug: item.games?.slug,
    user_joined: joinedIds.has(item.id),
    user_completed: completedIds.has(item.id),
  })) as Challenge[];
}

export async function getChallengeById(id: string): Promise<Challenge | undefined> {
  if (demoMode) return localChallenges.find((c) => c.id === id);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('challenges')
    .select('*, games(title, slug)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return undefined;

  const userId = await getCurrentUserId();
  let userJoined = false;
  let userCompleted = false;

  if (userId) {
    const { data: participant, error: participantError } = await supabase
      .from('challenge_participants')
      .select('status')
      .eq('challenge_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (participantError) throw participantError;
    userJoined = Boolean(participant);
    userCompleted = participant?.status === 'COMPLETED';
  }

  const item: any = data;
  return {
    ...item,
    game_title: item.games?.title,
    game_slug: item.games?.slug,
    user_joined: userJoined,
    user_completed: userCompleted,
  } as Challenge;
}

export async function joinChallenge(challengeId: string, userId: string): Promise<boolean> {
  if (demoMode) {
    const challenge = localChallenges.find((c) => c.id === challengeId);
    if (!challenge) return false;
    challenge.user_joined = true;
    challenge.participant_count += 1;
    return true;
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId || currentUserId !== userId) throw new Error('Authentication mismatch');

  const supabase = createClient();
  const { error } = await supabase.rpc('join_challenge', {
    p_challenge_id: challengeId,
  });

  if (error) throw error;
  return true;
}

export async function createChallenge(
  ch: Omit<Challenge, 'id' | 'created_at' | 'participant_count'>
): Promise<Challenge> {
  if (demoMode) {
    const newCh: Challenge = {
      ...ch,
      id: `ch-demo-${Date.now()}`,
      participant_count: 0,
      created_at: new Date().toISOString(),
    };
    localChallenges.unshift(newCh);
    return newCh;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('challenges')
    .insert({
      title: ch.title,
      description: ch.description,
      game_id: ch.game_id,
      difficulty: ch.difficulty,
      xp_reward: ch.xp_reward,
      ranking_reward: ch.ranking_reward,
      start_date: ch.start_date,
      end_date: ch.end_date,
      status: ch.status,
      requirements: ch.requirements,
      participant_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Challenge;
}

// ---------------------- PROFILES & RANKINGS ----------------------
export async function getRankings(): Promise<Profile[]> {
  if (demoMode) return [...localProfiles].sort((a, b) => b.ranking_points - a.ranking_points);

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('ranking_points', { ascending: false })
    .order('xp', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function getProfileByUsername(username: string): Promise<Profile | undefined> {
  if (demoMode) {
    return localProfiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return data as Profile | undefined;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | undefined> {
  const allowed = {
    username: updates.username,
    display_name: updates.display_name,
    avatar_url: updates.avatar_url,
    bio: updates.bio,
    favorite_games: updates.favorite_games,
  };

  const safeUpdates = Object.fromEntries(
    Object.entries(allowed).filter(([, value]) => value !== undefined)
  );

  if (demoMode) {
    const index = localProfiles.findIndex((p) => p.id === userId || p.username.toLowerCase() === userId.toLowerCase());
    if (index === -1) return undefined;
    localProfiles[index] = { ...localProfiles[index], ...safeUpdates };
    return localProfiles[index];
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId || currentUserId !== userId) throw new Error('Authentication required');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(safeUpdates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

// ---------------------- RECORDS & MODERATION ----------------------
export async function getRecords(status?: string): Promise<RecordSubmission[]> {
  if (demoMode) {
    return status ? localRecords.filter((r) => r.status === status) : localRecords;
  }

  const supabase = createClient();
  let query = supabase
    .from('records')
    .select('*, profiles!records_user_id_fkey(username, avatar_url), games!records_game_id_fkey(title)')
    .order('submitted_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    ...item,
    username: item.profiles?.username,
    user_avatar: item.profiles?.avatar_url,
    game_title: item.games?.title,
  })) as RecordSubmission[];
}

export async function submitRecord(
  record: Omit<RecordSubmission, 'id' | 'submitted_at' | 'status'>
): Promise<RecordSubmission> {
  if (demoMode) {
    const newRecord: RecordSubmission = {
      ...record,
      id: `rec-demo-${Date.now()}`,
      status: 'PENDING',
      submitted_at: new Date().toISOString(),
    };
    localRecords.unshift(newRecord);
    return newRecord;
  }

  const currentUserId = await getCurrentUserId();
  if (!currentUserId || currentUserId !== record.user_id) throw new Error('Authentication required');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('records')
    .insert({
      user_id: record.user_id,
      game_id: record.game_id,
      title: record.title,
      category: record.category,
      score_value: record.score_value,
      score_unit: record.score_unit,
      evidence_url: record.evidence_url,
      status: 'PENDING',
    })
    .select('*, profiles!records_user_id_fkey(username, avatar_url), games!records_game_id_fkey(title)')
    .single();

  if (error) throw error;

  const item: any = data;
  return {
    ...item,
    username: item.profiles?.username,
    user_avatar: item.profiles?.avatar_url,
    game_title: item.games?.title,
  } as RecordSubmission;
}

export async function moderateRecord(
  recordId: string,
  status: 'VERIFIED' | 'REJECTED',
  note?: string
): Promise<boolean> {
  if (demoMode) {
    const rec = localRecords.find((r) => r.id === recordId);
    if (!rec) return false;
    rec.status = status;
    rec.verified_at = new Date().toISOString();
    rec.moderator_note = note;
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase.rpc('moderate_record', {
    p_record_id: recordId,
    p_status: status,
    p_note: note ?? null,
  });

  if (error) throw error;
  return true;
}

// ---------------------- ACTIVITIES & NOTIFICATIONS ----------------------
export async function getActivities(): Promise<ActivityEvent[]> {
  if (demoMode) return localActivities;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('activity_events')
    .select('*, profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;

  return (data ?? []).map((item: any) => ({
    ...item,
    username: item.profiles?.username ?? 'Player',
    user_avatar: item.profiles?.avatar_url ?? '',
  })) as ActivityEvent[];
}

export async function getNotifications(userId: string): Promise<NotificationItem[]> {
  if (demoMode) return [];

  const currentUserId = await getCurrentUserId();
  if (!currentUserId || currentUserId !== userId) throw new Error('Authentication required');

  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as NotificationItem[];
}