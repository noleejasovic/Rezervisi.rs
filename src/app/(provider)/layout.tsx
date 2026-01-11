'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Scissors,
  LayoutDashboard,
  Store,
  Settings,
  Calendar,
  Clock,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-salon', label: 'Moj salon', icon: Store },
  { href: '/services', label: 'Usluge', icon: Settings },
  { href: '/bookings', label: 'Rezervacije', icon: Calendar },
  { href: '/working-hours', label: 'Radno vreme', icon: Clock },
];

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <Link href="/" className="flex items-center gap-2 font-bold text-xl ml-4">
          <Scissors className="h-6 w-6 text-primary" />
          <span>Rezerviši</span>
        </Link>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out lg:transform-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Scissors className="h-6 w-6 text-primary" />
              <span>Rezerviši</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white">
                  {user?.full_name ? getInitials(user.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.full_name || 'Korisnik'}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
              Odjava
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
