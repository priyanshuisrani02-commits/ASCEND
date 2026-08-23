import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const auth = await checkAdminAuth();

  if (!auth.authorized) {
    redirect(auth.redirectUrl);
  }

  return children;
}
