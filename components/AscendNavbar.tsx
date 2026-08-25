'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Compass, Menu, ScrollText, ShieldCheck, Swords, Trophy, UserRound, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Profile, NotificationItem } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export const AscendNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const loadIdentity = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !mounted) {
          if (mounted) {
            setCurrentUser(null);
            setNotifications([]);
          }
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (!mounted) return;

        if (profile) {
          setCurrentUser(profile as Profile);
        }

        // Use the authenticated Supabase user ID directly here. Do not route
        // navbar notifications through getCurrentUserId(), because auth state
        // can briefly settle between signup, email-code verification, and the
        // client-side session refresh.
        const { data: notificationRows, error: notificationError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!mounted) return;

        if (notificationError) {
          console.warn('Unable to load notifications:', notificationError);
          setNotifications([]);
        } else {
          setNotifications((notificationRows ?? []) as NotificationItem[]);
        }
      } catch (error) {
        // The navbar is non-critical UI. Authentication/session timing issues
        // must never become an application runtime error.
        console.warn('Unable to load navbar identity:', error);
        if (mounted) {
          setCurrentUser(null);
          setNotifications([]);
        }
      }
    };

    loadIdentity();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadIdentity();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  const navLinks = [
    { name: 'The World', href: '/games', icon: Compass },
    { name: 'Trials', href: '/challenges', icon: Swords },
    { name: 'Hall of Ascension', href: '/rankings', icon: Trophy },
    { name: 'Deeds', href: '/my-achievements', icon: ScrollText },
  ];
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#b89a5a]/15 bg-[#080706]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[76px]">
          <Link href="/" className="group flex items-center gap-3 shrink-0">
            <div className="ascend-seal w-10 h-10 rounded-full transition-transform duration-700 group-hover:rotate-45">
              <span className="relative z-10 ascend-display text-[#d7bd7a] text-lg -rotate-45">✦</span>
            </div>
            <div>
              <div className="ascend-display text-xl sm:text-2xl font-semibold tracking-[.28em] ascend-gold-text">ASCEND</div>
              <div className="hidden sm:block text-[8px] uppercase tracking-[.34em] text-[#756d60]">The Order of Deeds</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return <Link key={link.href} href={link.href} className={`group flex items-center gap-2 px-3.5 py-2.5 text-[11px] uppercase tracking-[.13em] transition-all ${active ? 'text-[#e8ddc5] border-b border-[#b89a5a]/60' : 'text-[#928a7b] hover:text-[#d7bd7a]'}`}><Icon className={`w-3.5 h-3.5 ${active ? 'text-[#b89a5a]' : 'text-[#625b50] group-hover:text-[#b89a5a]'}`} /><span>{link.name}</span></Link>;
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {currentUser ? <>
              <div className="relative">
                <button onClick={() => setNotificationsOpen(v => !v)} className="w-10 h-10 grid place-items-center border border-[#b89a5a]/15 bg-[#11100e] text-[#928a7b] hover:text-[#d7bd7a] hover:border-[#b89a5a]/35 transition-colors" aria-label="Notifications">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#b89a5a]" />}
                </button>
                {notificationsOpen && <div className="absolute right-0 mt-3 w-80 ascend-panel border border-[#b89a5a]/25 p-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-[#b89a5a]/10"><span className="ascend-display text-sm text-[#e8ddc5]">Messages from the Order</span>{unreadCount > 0 && <button onClick={markAllAsRead} className="text-[10px] uppercase tracking-widest text-[#b89a5a]">Mark read</button>}</div>
                  <div className="space-y-2 mt-3 max-h-72 overflow-y-auto">{notifications.length === 0 ? <p className="text-xs text-[#756d60] py-6 text-center">The chamber is silent.</p> : notifications.map(n => <div key={n.id} className={`p-3 border ${n.is_read ? 'border-[#b89a5a]/8' : 'border-[#b89a5a]/20 bg-[#b89a5a]/5'}`}><div className="text-xs text-[#e8ddc5]">{n.title}</div><p className="text-[11px] text-[#928a7b] mt-1 leading-relaxed">{n.message}</p></div>)}</div>
                </div>}
              </div>
              <Link href={`/profile/${currentUser.username}`} className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-[#b89a5a]/15 bg-[#11100e] hover:border-[#b89a5a]/35 transition-colors">
                <img src={currentUser.avatar_url} alt={currentUser.username} className="w-8 h-8 object-cover grayscale-[.25]" />
                <div className="hidden xl:block leading-tight"><div className="text-xs text-[#e8ddc5]">{currentUser.username}</div><div className="text-[9px] uppercase tracking-widest text-[#b89a5a]">{currentUser.ranking_points} RP</div></div>
              </Link>
              {currentUser.is_admin && <Link href="/admin" title="Inner Council" className="w-10 h-10 grid place-items-center border border-[#722e35]/30 text-[#b26b72] hover:bg-[#722e35]/10"><ShieldCheck className="w-4 h-4" /></Link>}
            </> : <div className="flex items-center gap-2"><Link href="/login"><Button variant="ghost" size="sm">Enter</Button></Link><Link href="/signup"><Button variant="primary" size="sm">Join the Order</Button></Link></div>}
          </div>

          <button className="md:hidden w-10 h-10 grid place-items-center border border-[#b89a5a]/15 text-[#b89a5a]" onClick={() => setMobileMenuOpen(v => !v)} aria-label="Open navigation">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>

      {mobileMenuOpen && <div className="md:hidden border-t border-[#b89a5a]/10 bg-[#0b0a09] px-4 py-4">
        <nav className="space-y-1">{navLinks.map(link => { const Icon = link.icon; return <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest border ${isActive(link.href) ? 'border-[#b89a5a]/30 text-[#d7bd7a] bg-[#b89a5a]/5' : 'border-transparent text-[#928a7b]'}`}><Icon className="w-4 h-4" />{link.name}</Link>; })}</nav>
        <div className="ascend-divider my-4" />
        {currentUser ? <Link href={`/profile/${currentUser.username}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 border border-[#b89a5a]/15"><UserRound className="w-4 h-4 text-[#b89a5a]" /><span className="text-sm text-[#e8ddc5]">{currentUser.username}</span></Link> : <div className="grid grid-cols-2 gap-2"><Link href="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="secondary" className="w-full">Enter</Button></Link><Link href="/signup" onClick={() => setMobileMenuOpen(false)}><Button variant="primary" className="w-full">Join</Button></Link></div>}
      </div>}
    </header>
  );
};
