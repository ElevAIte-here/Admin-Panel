'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FileText, LogOut, BookOpen, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin/blogs', label: 'Blogs', icon: FileText, enabled: true },
  { href: '/admin/case-studies', label: 'Case Studies', icon: Layers, enabled: true },
  { href: '/admin/knowledge-hub', label: 'Knowledge Hub', icon: BookOpen, enabled: false },
];

export function Sidebar({ email }: { email?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-black text-white">
      <div className="px-6 py-6">
        <span className="text-xl font-extrabold tracking-tight">
          Elev<span className="text-brand-red">AIte</span>
        </span>
        <p className="mt-0.5 text-xs uppercase tracking-widest text-white/40">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          if (!item.enabled) {
            return (
              <span
                key={item.href}
                className="flex cursor-not-allowed items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/25"
                title="Coming in a later phase"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" /> {item.label}
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase">Soon</span>
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-brand-red text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        {email ? <p className="truncate px-3 pb-2 text-xs text-white/40">{email}</p> : null}
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
