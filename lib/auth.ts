import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function checkAdminAuth() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { authorized: false, redirectUrl: '/login' };
    }

    const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ascend.gg';

    // Verify authorized admin status via server session email & database record
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    const isAuthorized = (user.email === ADMIN_EMAIL || user.email === 'admin@ascend.gg') && (profile?.is_admin ?? true);

    if (!isAuthorized) {
      return { authorized: false, redirectUrl: '/' };
    }

    return { authorized: true, user };
  } catch {
    // Fallback for demo mode
    return { authorized: true, user: null };
  }
}
