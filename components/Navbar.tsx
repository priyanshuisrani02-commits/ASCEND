'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Gamepad2, Swords, Flame, Shield, Menu, X, Bell, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';
import { Profile, NotificationItem } from '@/lib/types';
import { getRankings, getNotifications } from '@/lib/data/store';
import { createClient } from '@/lib/supabase/client';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      const user = data?.user;
      if (!user) return;

      if (user.email) setUserEmail(user.email);

      try {
        const notificationData = await getNotifications(user.id);
        setNotifications(notificationData);
      } catch {
        // Notifications are non-critical; don't let them break the navbar.
        setNotifications([]);
      }
    });

    getRankings().then(rankings => { if (rankings.length > 0) setCurrentUser(rankings[0]); });
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const markAllAsRead = () => setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@ascend.gg';
  const isAuthorizedAdmin = currentUser?.is_admin && (userEmail === ADMIN_EMAIL || userEmail === 'admin@ascend.gg' || currentUser.username === 'ValkyriePrime');
  const navLinks = [
    { name: 'Home', href: '/', icon: Flame },
    { name: 'Games Realm', href: '/games', icon: Gamepad2 },
    { name: 'Weekly Trials', href: '/challenges', icon: Swords },
    { name: 'Global Rankings', href: '/rankings', icon: Trophy },
    { name: 'My Achievements', href: '/my-achievements', icon: Shield },
  ];
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl bg-slate-950/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-20">
        <Link href="/" className="flex items-center space-x-3 group"><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform"><Trophy className="w-5 h-5 text-white animate-pulse" /></div><div><span className="text-2xl font-black tracking-widest violet-gradient-text">ASCEND</span><span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Competitive Gaming Realm</span></div></Link>
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">{navLinks.map(link => { const Icon = link.icon; const active = isActive(link.href); return <Link key={link.href} href={link.href} className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}><Icon className={`w-4 h-4 ${active ? 'text-violet-400' : 'text-slate-400'}`} /><span>{link.name}</span></Link>; })}</nav>
        <div className="hidden md:flex items-center space-x-4">{currentUser ? <div className="flex items-center space-x-3 relative"><div className="relative"><button onClick={() => setNotificationsOpen(!notificationsOpen)} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-violet-500/50 transition-all relative group" title="Realm Notifications"><Bell className="w-4.5 h-4.5 text-violet-300 group-hover:scale-110 transition-transform" />{unreadCount > 0 && <><span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 animate-ping" /><span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 border border-slate-950" /></>}</button>{notificationsOpen && <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-violet-500/40 shadow-[0_0_35px_rgba(124,58,237,0.3)] p-4 z-50 animate-in fade-in slide-in-from-top-2"><div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800"><div className="flex items-center space-x-2"><Sparkles className="w-4 h-4 text-violet-400" /><span className="text-xs font-bold text-white uppercase tracking-wider">Realm Notifications</span>{unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] font-bold font-mono">{unreadCount} NEW</span>}</div>{unreadCount > 0 && <button onClick={markAllAsRead} className="text-[11px] font-bold text-violet-400 hover:underline flex items-center space-x-1"><Check className="w-3 h-3" /><span>Mark read</span></button>}</div><div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">{notifications.map(n => <div key={n.id} className={`p-3 rounded-xl border transition-all text-xs space-y-1 ${!n.is_read ? 'bg-violet-950/40 border-violet-500/40 text-slate-100' : 'bg-slate-900/60 border-slate-800 text-slate-400'}`}><div className="font-bold text-white flex items-center justify-between"><span>{n.title}</span><span className="text-[9px] text-slate-500 font-mono">Just now</span></div><p className="text-[11px] text-slate-300 leading-relaxed">{n.message}</p></div>)}</div><div className="pt-3 mt-3 border-t border-slate-800 text-center"><button onClick={() => setNotificationsOpen(false)} className="text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-wider">Close Panel</button></div></div>}</div><div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs font-bold text-slate-300">LVL {currentUser.level}</span><span className="text-xs font-semibold text-violet-400 font-mono">({currentUser.ranking_points} RP)</span></div><Link href={`/profile/${currentUser.username}`} className="flex items-center space-x-2 p-1 pl-2 pr-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/40 transition-all"><img src={currentUser.avatar_url || undefined} alt={currentUser.username} className="w-8 h-8 rounded-lg object-cover border border-violet-500/50" /><span className="text-sm font-bold text-slate-200">{currentUser.username}</span></Link>{isAuthorizedAdmin && <Link href="/admin" className="px-2.5 py-1.5 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-bold hover:bg-violet-900/60 flex items-center space-x-1" title="Authorized Admin Access"><ShieldCheck className="w-3.5 h-3.5 text-violet-400" /><span>ADMIN</span></Link>}</div> : <div className="flex items-center space-x-3"><Link href="/login"><Button variant="ghost" size="sm">Enter Realm (Sign In)</Button></Link><Link href="/signup"><Button variant="primary" size="sm">Join ASCEND</Button></Link></div>}</div>
        <div className="flex md:hidden items-center space-x-2"><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button></div>
      </div></div>
      {mobileMenuOpen && <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-6 space-y-3"><nav className="space-y-1">{navLinks.map(link => { const Icon = link.icon; const active = isActive(link.href); return <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${active ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40' : 'text-slate-300 hover:bg-white/5'}`}><Icon className="w-5 h-5 text-violet-400" /><span>{link.name}</span></Link>; })}</nav><div className="pt-4 border-t border-slate-800/80 flex flex-col space-y-2">{currentUser ? <><Link href={`/profile/${currentUser.username}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800"><img src={currentUser.avatar_url || undefined} alt={currentUser.username} className="w-9 h-9 rounded-lg" /><div><div className="text-sm font-bold text-white">{currentUser.username}</div><div className="text-xs text-violet-400 font-mono">Level {currentUser.level} • {currentUser.ranking_points} RP</div></div></Link>{isAuthorizedAdmin && <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-2.5 rounded-xl bg-violet-950/60 border border-violet-500/40 text-violet-300 text-sm font-bold">Admin Control Dashboard</Link>}</> : <div className="grid grid-cols-2 gap-2 pt-2"><Link href="/login" onClick={() => setMobileMenuOpen(false)}><Button variant="secondary" className="w-full">Sign In</Button></Link><Link href="/signup" onClick={() => setMobileMenuOpen(false)}><Button variant="primary" size="sm">Join ASCEND</Button></Link></div>}</div></div>}
    </header>
  );
};