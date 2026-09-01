import { createClient } from '@/lib/supabase/client';
import { Discovery } from '@/lib/types';

export async function getDiscoveries(gameId: string): Promise<Discovery[]> {
  const supabase = createClient();
  const { data: discoveries, error } = await supabase
    .from('discoveries')
    .select('*')
    .eq('game_id', gameId)
    .eq('is_active', true)
    .order('rarity', { ascending: false });

  if (error) throw error;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !discoveries?.length) return (discoveries ?? []) as Discovery[];

  const { data: found, error: foundError } = await supabase
    .from('user_discoveries')
    .select('discovery_id, discovered_at')
    .eq('user_id', user.id)
    .in('discovery_id', discoveries.map((item) => item.id));

  if (foundError) throw foundError;
  const foundMap = new Map((found ?? []).map((item) => [item.discovery_id, item.discovered_at]));

  return discoveries.map((item) => ({
    ...(item as Discovery),
    discovered: foundMap.has(item.id),
    discovered_at: foundMap.get(item.id),
  }));
}

export async function discoverSecret(discoveryId: string): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('discover_secret', { p_discovery_id: discoveryId });
  if (error) throw error;
  return data === true;
}
