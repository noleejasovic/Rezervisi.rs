'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
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
  MapPin,
  Phone,
  X,
  Store,
  ArrowRight,
  Loader2,
  CalendarPlus
} from 'lucide-react';
import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns';
import { sr } from 'date-fns/locale';
import { formatPrice } from '@/lib/utils';

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
  salon: {
    name: string;
    address: string;
    city: string;
    phone: string;
    image_url: string | null;
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
    description: 'Čeka potvrdu salona',
  },
  confirmed: {
    label: 'Potvrđeno',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    description: 'Rezervacija je potvrđena',
  },
  completed: {
    label: 'Završeno',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    description: 'Usluga je obavljena',
  },
  cancelled: {
    label: 'Otkazano',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    description: 'Rezervacija je otkazana',
  },
};

export default function MyBookingsPage() {
  const { user, supabaseUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelBooking, setCancelBooking] = useState<BookingWithDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      if (!supabaseUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Učitaj rezervacije
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('client_id', supabaseUser.id)
          .order('appointment_date', { ascending: false })
          .order('appointment_time', { ascending: false });

        if (error) throw error;

        // Učitaj dodatne podatke za svaku rezervaciju
        const bookingsWithDetails = await Promise.all(
          (bookingsData || []).map(async (booking) => {
            // Učitaj salon
            const { data: salonData } = await supabase
              .from('salons')
              .select('name, address, city, phone, image_url')
              .eq('id', booking.salon_id)
              .single();

            // Učitaj uslugu
            const { data: serviceData } = await supabase
              .from('services')
              .select('name, duration_minutes, price')
              .eq('id', booking.service_id)
              .single();

            return {
              ...booking,
              salon: salonData || { name: 'Nepoznat salon', address: '', city: '', phone: '', image_url: null },
              service: serviceData || { name: 'Nepoznata usluga', duration_minutes: 0, price: 0 },
            };
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Error loading bookings:', error);
        toast.error('Greška pri učitavanju rezervacija');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, [supabaseUser]);

  const handleCancel = async () => {
    if (!cancelBooking) return;

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', cancelBooking.id);

      if (error) throw error;

      setBookings((prev) =>
        prev.map((b) =>
          b.id === cancelBooking.id ? { ...b, status: 'cancelled' } : b
        )
      );

      toast.success('Rezervacija je uspešno otkazana');
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message || 'Greška pri otkazivanju rezervacije');
    } finally {
      setIsProcessing(false);
      setCancelBooking(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Danas';
    if (isTomorrow(date)) return 'Sutra';
    return format(date, 'EEEE, d. MMMM yyyy.', { locale: sr });
  };

  const filteredBookings = bookings.filter((b) => {
    const appointmentDate = parseISO(b.appointment_date);

    if (activeTab === 'upcoming') {
      return (isFuture(appointmentDate) || isToday(appointmentDate)) &&
             b.status !== 'cancelled' &&
             b.status !== 'completed';
    }
    if (activeTab === 'past') {
      return isPast(appointmentDate) && !isToday(appointmentDate) ||
             b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const upcomingCount = bookings.filter((b) => {
    const appointmentDate = parseISO(b.appointment_date);
    return (isFuture(appointmentDate) || isToday(appointmentDate)) &&
           b.status !== 'cancelled' &&
           b.status !== 'completed';
  }).length;

  if (authLoading || isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold mb-2">Prijavite se</h1>
          <p className="text-muted-foreground mb-6">
            Morate biti prijavljeni da biste videli svoje rezervacije
          </p>
          <Button asChild>
            <Link href="/login">Prijava</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Moje rezervacije</h1>
            <p className="text-muted-foreground">
              Pregled i upravljanje vašim rezervacijama
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
            <Link href="/salons">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Nova rezervacija
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="upcoming" className="relative">
              Predstojeće
              {upcomingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs rounded-full flex items-center justify-center">
                  {upcomingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Prošle</TabsTrigger>
            <TabsTrigger value="cancelled">Otkazane</TabsTrigger>
            <TabsTrigger value="all">Sve</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nema rezervacija</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    {activeTab === 'upcoming'
                      ? 'Nemate predstojeće rezervacije'
                      : activeTab === 'past'
                      ? 'Nemate prošle rezervacije'
                      : activeTab === 'cancelled'
                      ? 'Nemate otkazane rezervacije'
                      : 'Nemate nijednu rezervaciju'}
                  </p>
                  <Button asChild>
                    <Link href="/salons">
                      Pronađi salon
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const canCancel =
                    (booking.status === 'pending' || booking.status === 'confirmed') &&
                    (isFuture(parseISO(booking.appointment_date)) || isToday(parseISO(booking.appointment_date)));

                  return (
                    <Card key={booking.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Salon Image/Info */}
                          <div className="md:w-48 bg-gradient-to-br from-violet-500 to-purple-600 p-4 md:p-6 flex flex-row md:flex-col items-center md:items-start gap-4 text-white">
                            {booking.salon.image_url ? (
                              <img
                                src={booking.salon.image_url}
                                alt={booking.salon.name}
                                className="w-16 h-16 md:w-full md:h-24 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-16 h-16 md:w-full md:h-24 bg-white/20 rounded-lg flex items-center justify-center">
                                <Store className="h-8 w-8 text-white/70" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{booking.salon.name}</h3>
                              <p className="text-sm text-white/80">{booking.salon.city}</p>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="space-y-3">
                                {/* Date & Time */}
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDate(booking.appointment_date)}
                                  </p>
                                  <p className="text-2xl font-bold">
                                    {booking.appointment_time.slice(0, 5)}
                                  </p>
                                </div>

                                {/* Service */}
                                <div>
                                  <h4 className="font-semibold">{booking.service.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.service.duration_minutes} min • {formatPrice(booking.service.price)}
                                  </p>
                                </div>

                                {/* Location & Contact */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    {booking.salon.address}
                                  </span>
                                  <a
                                    href={`tel:${booking.salon.phone}`}
                                    className="flex items-center gap-1 hover:text-primary"
                                  >
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {booking.salon.phone}
                                  </a>
                                </div>

                                {/* Notes */}
                                {booking.notes && (
                                  <p className="text-sm text-muted-foreground italic">
                                    "{booking.notes}"
                                  </p>
                                )}
                              </div>

                              {/* Status & Actions */}
                              <div className="flex flex-col items-start md:items-end gap-3">
                                <Badge className={STATUS_CONFIG[booking.status].color}>
                                  {STATUS_CONFIG[booking.status].label}
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                  {STATUS_CONFIG[booking.status].description}
                                </p>

                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                  >
                                    <Link href={`/salons/${booking.salon_id}`}>
                                      Vidi salon
                                    </Link>
                                  </Button>
                                  {canCancel && (
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => setCancelBooking(booking)}
                                    >
                                      <X className="mr-1 h-4 w-4" />
                                      Otkaži
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Cancel Dialog */}
        <AlertDialog open={!!cancelBooking} onOpenChange={() => setCancelBooking(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Otkažite rezervaciju?</AlertDialogTitle>
              <AlertDialogDescription>
                Da li ste sigurni da želite da otkažete rezervaciju za{' '}
                <strong>{cancelBooking?.service.name}</strong> u salonu{' '}
                <strong>{cancelBooking?.salon.name}</strong>?
                <br />
                <br />
                Datum: {cancelBooking && formatDate(cancelBooking.appointment_date)} u{' '}
                {cancelBooking?.appointment_time.slice(0, 5)}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>Nazad</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                disabled={isProcessing}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Otkaži rezervaciju'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
