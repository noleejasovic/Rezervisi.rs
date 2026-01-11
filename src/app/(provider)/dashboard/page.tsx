'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Calendar,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Store,
  MapPin,
  Phone,
  Settings
} from 'lucide-react';
import { Salon, SalonTypeLabels, SalonType } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
  const { user, supabaseUser, loading } = useAuth();
  const supabase = createClient();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [isLoadingSalon, setIsLoadingSalon] = useState(true);

  // Učitaj salon iz Supabase
  useEffect(() => {
    const loadSalon = async () => {
      if (!supabaseUser) {
        setIsLoadingSalon(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('provider_id', supabaseUser.id)
          .single();

        if (data && !error) {
          setSalon(data);
        }
      } catch (error) {
        console.error('Error loading salon:', error);
      } finally {
        setIsLoadingSalon(false);
      }
    };

    loadSalon();
  }, [supabaseUser]);

  if (loading || isLoadingSalon) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Placeholder stats - will be replaced with real data later
  const stats = [
    {
      title: 'Ukupne rezervacije',
      value: '0',
      icon: Calendar,
      color: 'text-violet-600',
      bgColor: 'bg-violet-100 dark:bg-violet-900/50',
    },
    {
      title: 'Na čekanju',
      value: '0',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/50',
    },
    {
      title: 'Prihod ovog meseca',
      value: formatPrice(0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/50',
    },
    {
      title: 'Ocena salona',
      value: salon?.rating?.toString() || '0',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Dobrodošli, {user?.full_name?.split(' ')[0] || 'Korisniče'}!
        </h1>
        <p className="text-muted-foreground">
          {salon ? `Upravljajte salonom "${salon.name}"` : 'Evo pregleda vašeg salona za danas'}
        </p>
      </div>

      {/* Check if salon is set up */}
      {!salon ? (
        <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Store className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Podesite vaš salon</h3>
              <p className="text-sm text-muted-foreground">
                Dodajte informacije o vašem salonu da biste počeli da primate rezervacije
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
              <Link href="/salon-setup">
                Podesi salon
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Salon Info Card */
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-violet-500 to-purple-600 relative">
            {salon.image_url && (
              <img
                src={salon.image_url}
                alt={salon.name}
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/80 to-purple-600/80" />
          </div>
          <CardContent className="p-6 -mt-8 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="w-20 h-20 rounded-xl bg-background border-4 border-background shadow-lg flex items-center justify-center">
                {salon.image_url ? (
                  <img
                    src={salon.image_url}
                    alt={salon.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Store className="h-8 w-8 text-violet-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{salon.name}</h2>
                  <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                    {SalonTypeLabels[salon.type as SalonType]}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {salon.address}, {salon.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {salon.phone}
                  </span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/salon-setup">
                  <Settings className="h-4 w-4 mr-2" />
                  Uredi salon
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Najnovije rezervacije</CardTitle>
              <CardDescription>Rezervacije koje čekaju vašu potvrdu</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/bookings">
                Sve rezervacije
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Nema rezervacija na čekanju</p>
              <p className="text-sm mt-1">Rezervacije će se pojaviti ovde kada klijenti zakažu termine</p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Brze akcije</CardTitle>
            <CardDescription>Upravljajte vašim salonom</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link href="/services">
                <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mr-4">
                  <Store className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Upravljaj uslugama</p>
                  <p className="text-sm text-muted-foreground">Dodajte ili izmenite usluge</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link href="/working-hours">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-4">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Radno vreme</p>
                  <p className="text-sm text-muted-foreground">Podesite dostupnost</p>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4" asChild>
              <Link href="/bookings">
                <div className="w-10 h-10 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center mr-4">
                  <Calendar className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Sve rezervacije</p>
                  <p className="text-sm text-muted-foreground">Pregledajte i upravljajte</p>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
