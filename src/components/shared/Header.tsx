'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Calendar,
  Store,
  Clock,
  Settings,
  Sparkles,
  ChevronDown,
  Search,
  Heart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, isAuthenticated, isProvider, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-lg shadow-sm border-b"
          : "bg-background border-b border-transparent"
      )}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/salons"
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              isActive('/salons')
                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Pronađi salon
          </Link>

          {isAuthenticated && !isProvider && (
            <Link
              href="/my-bookings"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                isActive('/my-bookings')
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Moje rezervacije
            </Link>
          )}

          {isProvider && (
            <Link
              href="/dashboard"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                pathname.startsWith('/dashboard') || pathname.startsWith('/bookings') || pathname.startsWith('/services') || pathname.startsWith('/working-hours')
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 gap-2 pl-2 pr-3 rounded-full hover:bg-muted"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white text-xs font-medium">
                      {user?.full_name ? getInitials(user.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {user?.full_name?.split(' ')[0] || 'Korisnik'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-medium">
                      {user?.full_name ? getInitials(user.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                {isProvider ? (
                  <>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Dashboard</p>
                          <p className="text-xs text-muted-foreground">Pregled poslovanja</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/bookings" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Rezervacije</p>
                          <p className="text-xs text-muted-foreground">Upravljaj rezervacijama</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/services" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">Usluge</p>
                          <p className="text-xs text-muted-foreground">Dodaj i uredi usluge</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/working-hours" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium">Radno vreme</p>
                          <p className="text-xs text-muted-foreground">Podesi raspored</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/salon-setup" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center">
                          <Store className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium">Podešavanja salona</p>
                          <p className="text-xs text-muted-foreground">Uredi profil salona</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/my-bookings" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Moje rezervacije</p>
                          <p className="text-xs text-muted-foreground">Pregled termina</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/salons" className="flex items-center gap-3 py-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Search className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium">Pronađi salon</p>
                          <p className="text-xs text-muted-foreground">Pretraži salone</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-lg cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Odjava
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="rounded-full">
                <Link href="/login">Prijava</Link>
              </Button>
              <Button asChild className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-violet-500/25">
                <Link href="/register">Registracija</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[500px] border-t" : "max-h-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          <Link
            href="/salons"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
              isActive('/salons')
                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                : "hover:bg-muted"
            )}
          >
            <Search className="h-5 w-5" />
            <span className="font-medium">Pronađi salon</span>
          </Link>

          {isAuthenticated ? (
            <>
              {isProvider ? (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      pathname.startsWith('/dashboard')
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href="/bookings"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive('/bookings')
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Rezervacije</span>
                  </Link>
                  <Link
                    href="/services"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive('/services')
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <Sparkles className="h-5 w-5" />
                    <span className="font-medium">Usluge</span>
                  </Link>
                  <Link
                    href="/working-hours"
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      isActive('/working-hours')
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "hover:bg-muted"
                    )}
                  >
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Radno vreme</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/my-bookings"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                    isActive('/my-bookings')
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                      : "hover:bg-muted"
                  )}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="font-medium">Moje rezervacije</span>
                </Link>
              )}

              {/* User Card */}
              <div className="pt-2 mt-2 border-t">
                <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white font-medium">
                      {user?.full_name ? getInitials(user.full_name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user?.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-2 border-t space-y-2">
              <Button variant="outline" asChild className="w-full rounded-xl h-12">
                <Link href="/login">Prijava</Link>
              </Button>
              <Button asChild className="w-full rounded-xl h-12 bg-gradient-to-r from-violet-600 to-purple-600">
                <Link href="/register">Registracija</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
