'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Salon } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Check,
  X,
  Store,
  AlertCircle,
  CalendarDays,
  Loader2
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { sr } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface BookingWithDetails {
  id: string;
  client_id: string;
  salon_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  client: {
    full_name: string;
    phone: string;
    email: string;
  };
  service: {
    name: string;
    duration_minutes: number;
    price: number;
  };
}

const STATUS_CONFIG = {
  pending: {
    label: 'Na čekanju',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  confirmed: {
    label: 'Potvrđeno',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
  },
  completed: {
    label: 'Završeno',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
  cancelled: {
    label: 'Otkazano',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
};

export default function ProviderBookingsPage() {
  const { supabaseUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [actionBooking, setActionBooking] = useState<BookingWithDetails | null>(null);
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | 'complete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!supabaseUser) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('provider_id', supabaseUser.id)
          .single();

        if (salonError || !salonData) {
          setSalon(null);
          setIsLoading(false);
          return;
        }

        setSalon(salonData);

        // Učitaj rezervacije
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('salon_id', salonData.id)
          .order('appointment_date', { ascending: true })
          .order('appointment_time', { ascending: true });

        if (bookingsError) throw bookingsError;

        // Učitaj dodatne podatke za svaku rezervaciju
        const bookingsWithDetails = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            // Učitaj klijenta
            const { data: clientData } = await supabase
              .from('profiles')
              .select('full_name, phone, email')
              .eq('id', booking.client_id)
              .single();

            // Učitaj uslugu
            const { data: serviceData } = await supabase
              .from('services')
              .select('name, duration_minutes, price')
              .eq('id', booking.service_id)
              .single();

            return {
              ...booking,
              client: clientData || { full_name: 'Nepoznat', phone: '', email: '' },
              service: serviceData || { name: 'Nepoznata usluga', duration_minutes: 0, price: 0 },
            };
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Greška pri učitavanju podataka');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabaseUser]);

  const handleAction = async () => {
    if (!actionBooking || !actionType) return;

    setIsProcessing(true);

    try {
      let newStatus: string;
      switch (actionType) {
        case 'confirm':
          newStatus = 'confirmed';
          break;
        case 'cancel':
          newStatus = 'cancelled';
          break;
        case 'complete':
          newStatus = 'completed';
          break;
        default:
          return;
      }

      const { error } = await supabase
        .from('bookings')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', actionBooking.id);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((b) =>
          b.id === actionBooking.id ? { ...b, status: newStatus as any } : b
        )
      );

      const messages = {
        confirm: 'Rezervacija je potvrđena',
        cancel: 'Rezervacija je otkazana',
        complete: 'Rezervacija je označena kao završena',
      };
      toast.success(messages[actionType]);
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error(error.message || 'Greška pri ažuriranju rezervacije');
    } finally {
      setIsProcessing(false);
      setActionBooking(null);
      setActionType(null);
    }
  };

  const openActionDialog = (booking: BookingWithDetails, type: 'confirm' | 'cancel' | 'complete') => {
    setActionBooking(booking);
    setActionType(type);
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Danas';
    if (isTomorrow(date)) return 'Sutra';
    return format(date, 'd. MMMM yyyy.', { locale: sr });
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'today') {
      return isToday(parseISO(b.appointment_date)) && b.status !== 'cancelled';
    }
    return b.status === activeTab;
  });

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const todayCount = bookings.filter(
    (b) => isToday(parseISO(b.appointment_date)) && b.status !== 'cancelled'
  ).length;

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Rezervacije</h1>
          <p className="text-muted-foreground">Upravljajte rezervacijama vašeg salona</p>
        </div>

        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Najpre podesite salon</h3>
              <p className="text-sm text-muted-foreground">
                Pre pregleda rezervacija, morate kreirati profil vašeg salona
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
              <Link href="/salon-setup">
                <Store className="mr-2 h-4 w-4" />
                Podesi salon
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Rezervacije</h1>
        <p className="text-muted-foreground">
          Upravljajte rezervacijama za "{salon.name}"
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Na čekanju</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Danas</p>
              <p className="text-2xl font-bold">{todayCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ukupno</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending" className="relative">
            Na čekanju
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="today">Danas</TabsTrigger>
          <TabsTrigger value="confirmed">Potvrđeno</TabsTrigger>
          <TabsTrigger value="completed">Završeno</TabsTrigger>
          <TabsTrigger value="all">Sve</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nema rezervacija</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'pending'
                    ? 'Nema rezervacija koje čekaju potvrdu'
                    : activeTab === 'today'
                    ? 'Nemate rezervacije za danas'
                    : 'Nema rezervacija u ovoj kategoriji'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-muted/50 p-4 md:p-6 md:w-48 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2">
                        <div className="text-center md:text-left">
                          <p className="text-sm text-muted-foreground">
                            {formatDate(booking.appointment_date)}
                          </p>
                          <p className="text-2xl font-bold">
                            {booking.appointment_time.slice(0, 5)}
                          </p>
                        </div>
                        <Badge className={STATUS_CONFIG[booking.status].color}>
                          {STATUS_CONFIG[booking.status].label}
                        </Badge>
                      </div>

                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.service.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {booking.service.duration_minutes} min • {formatPrice(booking.service.price)}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4 text-muted-foreground" />
                                {booking.client.full_name}
                              </span>
                              {booking.client.phone && (
                                <a
                                  href={`tel:${booking.client.phone}`}
                                  className="flex items-center gap-1 hover:text-primary"
                                >
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {booking.client.phone}
                                </a>
                              )}
                            </div>

                            {booking.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                "{booking.notes}"
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => openActionDialog(booking, 'confirm')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Potvrdi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openActionDialog(booking, 'cancel')}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Odbij
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => openActionDialog(booking, 'complete')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Check className="mr-1 h-4 w-4" />
                                  Završi
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openActionDialog(booking, 'cancel')}
                                >
                                  Otkaži
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <AlertDialog open={!!actionBooking} onOpenChange={() => setActionBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'confirm' && 'Potvrdite rezervaciju'}
              {actionType === 'cancel' && 'Otkažite rezervaciju'}
              {actionType === 'complete' && 'Završite rezervaciju'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'confirm' &&
                `Da li želite da potvrdite rezervaciju za ${actionBooking?.client.full_name}?`}
              {actionType === 'cancel' &&
                `Da li ste sigurni da želite da otkažete rezervaciju za ${actionBooking?.client.full_name}?`}
              {actionType === 'complete' &&
                `Da li želite da označite rezervaciju za ${actionBooking?.client.full_name} kao završenu?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Nazad</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isProcessing}
              className={
                actionType === 'cancel'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : actionType === 'confirm'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionType === 'confirm' ? (
                'Potvrdi'
              ) : actionType === 'cancel' ? (
                'Otkaži'
              ) : (
                'Završi'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
