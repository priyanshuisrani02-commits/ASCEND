import { createClient } from '@/lib/supabase/client';

export type Season = {
  id: string; name: string; slug: string; description: string | null;
  start_date: string; end_date: string; status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'; created_at: string;
};

export type Badge = {
  id: string; slug: string; title: string; description: string; icon_url: string | null;
  rarity: string; requirements: string | null; is_active: boolean; created_at: string;
};

export async function getSeasons() {
  const supabase = createClient();
  const { data, error } = await supabase.from('seasons').select('*').order('start_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Season[];
}

export async function getActiveSeason() {
  const supabase = createClient();
  const { data, error } = await supabase.from('seasons').select('*').eq('status', 'ACTIVE').order('start_date', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return data as Season | null;
}

export async function getBadges() {
  const supabase = createClient();
  const { data, error } = await supabase.from('badges').select('*').eq('is_active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Badge[];
}

export async function getUserBadges(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('user_badges').select('*, badges(*), seasons(*)').eq('user_id', userId).order('awarded_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function followUser(followingId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');
  if (user.id === followingId) throw new Error('You cannot follow yourself');
  const { error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: followingId });
  if (error) throw error;
}

export async function unfollowUser(followingId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');
  const { error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', followingId);
  if (error) throw error;
}

export async function isFollowing(followingId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.from('follows').select('follower_id').eq('follower_id', user.id).eq('following_id', followingId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function reportContent(targetType: 'PROFILE' | 'RECORD' | 'ACHIEVEMENT' | 'CHALLENGE', targetId: string, reason: string, details?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');
  const { error } = await supabase.from('reports').insert({ reporter_id: user.id, target_type: targetType, target_id: targetId, reason, details: details ?? null });
  if (error) throw error;
}
