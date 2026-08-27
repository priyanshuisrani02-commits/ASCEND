'use client';

import { ReactNode } from 'react';

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="ascend-admin-world min-h-screen">
      <div className="ascend-admin-ambient" aria-hidden="true" />
      <div className="ascend-admin-grid" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
