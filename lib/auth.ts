import { User } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '@/lib/supabase/server';

type AdminAuthResult =
  | { authorized: true; user: User }
  | { authorized: false; redirectUrl: string };

/**
 * Server-side admin gate.
 *
 * This is intentionally fail-closed. An email address or client-side flag
 * is never treated as proof of administrative access.
 */
export async function checkAdminAuth(): Promise<AdminAuthResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { authorized: false, redirectUrl: '/login' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.is_admin) {
      return { authorized: false, redirectUrl: '/' };
    }

    return { authorized: true, user };
  } catch {
    // Never authorize on unexpected failures.
    return { authorized: false, redirectUrl: '/' };
  }
}
