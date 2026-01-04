'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  MessageSquare,
  Settings,
  TrendingUp,
  LogOut,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Trade Journal', href: '/dashboard/journal', icon: BookOpen },
  { name: 'New Trade', href: '/dashboard/journaling', icon: Upload },
  { name: 'Analytics', href: '/dashboard/analysis', icon: BarChart3 },
  { name: 'Tradeo', href: '/dashboard/chat', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'TR';
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!user) return 'Trader';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader';
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 h-screen bg-card border-r border-border/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full max-h-screen overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 shrink-0">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Mechify</span>
          </div>

          <Separator className="opacity-50 shrink-0" />

          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <Separator className="opacity-50 shrink-0" />

          {/* Footer - Fixed at bottom */}
          <div className="p-4 space-y-3 shrink-0 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-muted text-xs">{getUserInitials()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate max-w-25">{getDisplayName()}</span>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-start text-muted-foreground"
                asChild
              >
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
