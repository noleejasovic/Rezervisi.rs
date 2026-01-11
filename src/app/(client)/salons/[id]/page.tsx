'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Salon, SalonType, SalonTypeLabels, Service } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  Loader2,
  Store,
  ImageIcon
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { sr } from 'date-fns/locale';

interface WorkingHour {
  day_of_week: number;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
}

const DAYS = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

// Generisanje vremenskih slotova
const generateTimeSlots = (openTime: string, closeTime: string, duration: number): string[] => {
  const slots: string[] = [];
  const [openH, openM] = openTime.split(':').map(Number);
  const [closeH, closeM] = closeTime.split(':').map(Number);

  let currentMinutes = openH * 60 + openM;
  const endMinutes = closeH * 60 + closeM - duration; // Poslednji slot mora da se završi pre zatvaranja

  while (currentMinutes <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    currentMinutes += 30; // Slotovi na svakih 30 minuta
  }

  return slots;
};

export default function SalonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isClient } = useAuth();
  const supabase = createClient();
  const salonId = params.id as string;

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNote, setBookingNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Učitaj podatke o salonu
  useEffect(() => {
    const loadSalon = async () => {
      try {
        // Učitaj salon
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('id', salonId)
          .eq('is_active', true)
          .single();

        if (salonError || !salonData) {
          setError('Salon nije pronađen');
          setIsLoading(false);
          return;
        }

        setSalon(salonData);

        // Učitaj usluge
        const { data: servicesData } = await supabase
          .from('services')
          .select('*')
          .eq('salon_id', salonId)
          .eq('is_active', true)
          .order('price', { ascending: true });

        setServices(servicesData || []);

        // Učitaj radno vreme
        const { data: hoursData } = await supabase
          .from('working_hours')
          .select('*')
          .eq('salon_id', salonId)
          .order('day_of_week', { ascending: true });

        setWorkingHours(hoursData || []);
      } catch (err) {
        console.error('Error loading salon:', err);
        setError('Greška pri učitavanju');
      } finally {
        setIsLoading(false);
      }
    };

    if (salonId) {
      loadSalon();
    }
  }, [salonId]);

  // Kada se promeni datum, izračunaj dostupne slotove i učitaj zauzete
  useEffect(() => {
    const loadAvailableSlots = async () => {
      if (!selectedDate || !selectedService) {
        setAvailableSlots([]);
        setBookedSlots([]);
        return;
      }

      setIsLoadingSlots(true);

      const dayOfWeek = (selectedDate.getDay() + 6) % 7; // Konvertuj u 0=Ponedeljak format
      const dayHours = workingHours.find((h) => h.day_of_week === dayOfWeek);

      if (!dayHours || !dayHours.is_open || !dayHours.open_time || !dayHours.close_time) {
        setAvailableSlots([]);
        setBookedSlots([]);
        setIsLoadingSlots(false);
        return;
      }

      // Generiši sve moguće slotove
      const allSlots = generateTimeSlots(
        dayHours.open_time.slice(0, 5),
        dayHours.close_time.slice(0, 5),
        selectedService.duration_minutes
      );

      // Učitaj zauzete termine za taj datum (pending ili confirmed)
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('appointment_time, service_id')
        .eq('salon_id', salonId)
        .eq('appointment_date', dateStr)
        .in('status', ['pending', 'confirmed']);

      // Pronađi zauzete slotove
      const bookedTimes: string[] = [];
      if (existingBookings) {
        for (const booking of existingBookings) {
          // Učitaj trajanje usluge za tu rezervaciju
          const { data: serviceData } = await supabase
            .from('services')
            .select('duration_minutes')
            .eq('id', booking.service_id)
            .single();

          const duration = serviceData?.duration_minutes || 30;
          const [h, m] = booking.appointment_time.split(':').map(Number);
          const startMinutes = h * 60 + m;
          const endMinutes = startMinutes + duration;

          // Markiraj sve slotove koji se preklapaju sa ovom rezervacijom
          for (const slot of allSlots) {
            const [slotH, slotM] = slot.split(':').map(Number);
            const slotStart = slotH * 60 + slotM;
            const slotEnd = slotStart + selectedService.duration_minutes;

            // Proveri da li se slotovi preklapaju
            if (slotStart < endMinutes && slotEnd > startMinutes) {
              if (!bookedTimes.includes(slot)) {
                bookedTimes.push(slot);
              }
            }
          }
        }
      }

      setBookedSlots(bookedTimes);
      setAvailableSlots(allSlots);
      setSelectedTime(null);
      setIsLoadingSlots(false);
    };

    loadAvailableSlots();
  }, [selectedDate, selectedService, workingHours, salonId]);

  const openBookingDialog = (service: Service) => {
    if (!isAuthenticated) {
      toast.error('Morate se prijaviti da biste rezervisali termin');
      router.push('/login');
      return;
    }

    if (!isClient) {
      toast.error('Samo klijenti mogu rezervisati termine');
      return;
    }

    setSelectedService(service);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setBookingNote('');
    setIsBookingOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !user) {
      toast.error('Molimo popunite sve podatke');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert([
        {
          client_id: user.id,
          salon_id: salonId,
          service_id: selectedService.id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          status: 'pending',
          notes: bookingNote || null,
        },
      ]);

      if (error) throw error;

      toast.success('Rezervacija je uspešno poslata! Čekajte potvrdu od salona.');
      setIsBookingOpen(false);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      toast.error(err.message || 'Greška pri kreiranju rezervacije');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Onemogući prošle datume
    if (isBefore(date, startOfDay(new Date()))) {
      return true;
    }
    // Onemogući datume više od 30 dana unapred
    if (isBefore(addDays(new Date(), 30), date)) {
      return true;
    }
    // Onemogući dane kada salon ne radi
    const dayOfWeek = (date.getDay() + 6) % 7;
    const dayHours = workingHours.find((h) => h.day_of_week === dayOfWeek);
    return !dayHours || !dayHours.is_open;
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !salon) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold mb-2">{error || 'Salon nije pronađen'}</h1>
          <p className="text-muted-foreground mb-6">
            Salon koji tražite ne postoji ili više nije aktivan.
          </p>
          <Button asChild>
            <Link href="/salons">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Nazad na salone
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/salons"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Nazad na salone
        </Link>

        {/* Salon Header */}
        <Card className="overflow-hidden mb-8">
          <div className="h-48 md:h-64 bg-gradient-to-r from-violet-500 to-purple-600 relative">
            {salon.image_url ? (
              <>
                <img
                  src={salon.image_url}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon className="h-20 w-20 text-white/30" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 border-0">{SalonTypeLabels[salon.type as SalonType]}</Badge>
                {salon.rating && salon.rating > 0 && (
                  <Badge className="bg-white/20 border-0">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                    {salon.rating}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{salon.name}</h1>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{salon.address}, {salon.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${salon.phone}`} className="hover:text-primary">{salon.phone}</a>
              </div>
              {salon.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${salon.email}`} className="hover:text-primary">{salon.email}</a>
                </div>
              )}
            </div>
            {salon.description && (
              <p className="mt-4 text-muted-foreground">{salon.description}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Services */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Usluge</CardTitle>
                <CardDescription>Izaberite uslugu i rezervišite termin</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length > 0 ? (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="font-semibold">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {service.duration_minutes} min
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">{formatPrice(service.price)}</span>
                          <Button
                            onClick={() => openBookingDialog(service)}
                            className="bg-gradient-to-r from-violet-600 to-purple-600"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Rezerviši
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Ovaj salon još nema dodane usluge</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Working Hours */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Radno vreme
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workingHours.length > 0 ? (
                  <div className="space-y-2">
                    {DAYS.map((day, index) => {
                      const hours = workingHours.find((h) => h.day_of_week === index);
                      const today = (new Date().getDay() + 6) % 7;
                      const isToday = index === today;

                      return (
                        <div
                          key={day}
                          className={`flex justify-between py-2 ${
                            isToday ? 'font-semibold text-primary' : ''
                          }`}
                        >
                          <span>{day}</span>
                          <span className={hours?.is_open ? '' : 'text-muted-foreground'}>
                            {hours?.is_open
                              ? `${hours.open_time?.slice(0, 5)} - ${hours.close_time?.slice(0, 5)}`
                              : 'Zatvoreno'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Radno vreme nije postavljeno
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Dialog */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Rezervacija termina</DialogTitle>
              <DialogDescription>
                {selectedService?.name} - {selectedService && formatPrice(selectedService.price)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Date Selection */}
              <div>
                <Label className="mb-2 block">Izaberite datum</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  locale={sr}
                  className="rounded-md border mx-auto"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div>
                  <Label className="mb-2 block">Izaberite vreme</Label>
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Učitavanje...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => !isBooked && setSelectedTime(slot)}
                            disabled={isBooked}
                            className={
                              selectedTime === slot
                                ? 'bg-violet-600'
                                : isBooked
                                ? 'opacity-50 cursor-not-allowed line-through text-muted-foreground'
                                : ''
                            }
                            title={isBooked ? 'Termin je zauzet' : ''}
                          >
                            {slot}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Salon ne radi na izabrani datum
                    </p>
                  )}
                  {bookedSlots.length > 0 && availableSlots.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                      * Precrtani termini su već zauzeti
                    </p>
                  )}
                </div>
              )}

              {/* Note */}
              {selectedTime && (
                <div>
                  <Label htmlFor="note" className="mb-2 block">
                    Napomena (opciono)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Dodatne napomene za salon..."
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                Otkaži
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-purple-600"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rezervacija...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Potvrdi rezervaciju
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
