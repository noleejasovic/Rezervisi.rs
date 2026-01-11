'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Salon, SalonType, SalonTypeLabels, Service } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Settings,
  Plus,
  Star,
  ArrowRight,
  Loader2,
  ImageIcon
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function MySalonPage() {
  const { supabaseUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!supabaseUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Ucitaj salon
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('provider_id', supabaseUser.id)
          .single();

        if (salonData && !salonError) {
          setSalon(salonData);

          // Ucitaj usluge za salon
          const { data: servicesData } = await supabase
            .from('services')
            .select('*')
            .eq('salon_id', salonData.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          setServices(servicesData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabaseUser]);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  // Ako nema salona, prikazi CTA za kreiranje
  if (!salon) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Moj salon</h1>
          <p className="text-muted-foreground">
            Informacije o vašem salonu
          </p>
        </div>

        <Card className="border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-6">
              <Store className="h-10 w-10 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nemate kreiran salon</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Kreirajte profil vašeg salona da biste mogli da primate rezervacije od klijenata
            </p>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
              <Link href="/salon-setup">
                <Plus className="mr-2 h-4 w-4" />
                Kreiraj salon
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activeServicesCount = services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Moj salon</h1>
          <p className="text-muted-foreground">
            Pregled i upravljanje informacijama o salonu
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/salon-setup">
            <Settings className="mr-2 h-4 w-4" />
            Uredi salon
          </Link>
        </Button>
      </div>

      {/* Salon Info Card */}
      <Card className="overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-violet-500 to-purple-600 relative">
          {salon.image_url ? (
            <>
              <img
                src={salon.image_url}
                alt={salon.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/60 to-purple-600/60" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-white/30" />
            </div>
          )}
        </div>
        <CardContent className="p-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Salon Image/Icon */}
            <div className="w-24 h-24 rounded-xl bg-background border-4 border-background shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {salon.image_url ? (
                <img
                  src={salon.image_url}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Store className="h-10 w-10 text-violet-600" />
              )}
            </div>

            {/* Salon Details */}
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{salon.name}</h2>
                <Badge className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                  {SalonTypeLabels[salon.type as SalonType]}
                </Badge>
                {salon.is_active ? (
                  <Badge variant="default" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    Aktivan
                  </Badge>
                ) : (
                  <Badge variant="secondary">Neaktivan</Badge>
                )}
              </div>

              {salon.description && (
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {salon.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{salon.address}, {salon.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span>{salon.phone}</span>
                </div>
                {salon.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span>{salon.email}</span>
                  </div>
                )}
                {salon.rating && salon.rating > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                    <span>{salon.rating} / 5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Store className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aktivne usluge</p>
                <p className="text-2xl font-bold">{activeServicesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ocena salona</p>
                <p className="text-2xl font-bold">{salon.rating || 0} / 5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">{salon.is_active ? 'Otvoren' : 'Zatvoren'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Usluge</CardTitle>
            <CardDescription>
              {activeServicesCount > 0
                ? `${activeServicesCount} aktivnih usluga`
                : 'Nema aktivnih usluga'}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/services">
              Sve usluge
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <div className="space-y-3">
              {services.slice(0, 5).map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration_minutes} min
                    </p>
                  </div>
                  <p className="font-semibold">{formatPrice(service.price)}</p>
                </div>
              ))}
              {services.length > 5 && (
                <p className="text-sm text-muted-foreground text-center pt-2">
                  + još {services.length - 5} usluga
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground mb-4">Nema dodanih usluga</p>
              <Button asChild>
                <Link href="/services">
                  <Plus className="mr-2 h-4 w-4" />
                  Dodaj prvu uslugu
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/services" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                <Settings className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Upravljaj uslugama</p>
                <p className="text-sm text-muted-foreground">Dodaj, izmeni ili obriši usluge</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link href="/working-hours" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Radno vreme</p>
                <p className="text-sm text-muted-foreground">Podesi dostupnost salona</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
