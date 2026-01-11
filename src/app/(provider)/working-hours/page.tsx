'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Salon } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Clock, Store, AlertCircle, Save, Loader2, Copy } from 'lucide-react';
import Link from 'next/link';

// Dani u nedelji (0 = Ponedeljak, 6 = Nedelja)
const DAYS = [
  { value: 0, label: 'Ponedeljak', short: 'Pon' },
  { value: 1, label: 'Utorak', short: 'Uto' },
  { value: 2, label: 'Sreda', short: 'Sre' },
  { value: 3, label: 'Četvrtak', short: 'Čet' },
  { value: 4, label: 'Petak', short: 'Pet' },
  { value: 5, label: 'Subota', short: 'Sub' },
  { value: 6, label: 'Nedelja', short: 'Ned' },
];

// Generisanje vremenskih opcija (od 00:00 do 23:30)
const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

interface DaySchedule {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map((day) => ({
  day_of_week: day.value,
  is_open: day.value < 5, // Pon-Pet otvoreno, Sub-Ned zatvoreno
  open_time: '09:00',
  close_time: '18:00',
}));

export default function WorkingHoursPage() {
  const { supabaseUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Ucitaj salon i radno vreme
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

        if (salonError || !salonData) {
          setSalon(null);
          setIsLoading(false);
          return;
        }

        setSalon(salonData);

        // Ucitaj radno vreme
        const { data: hoursData, error: hoursError } = await supabase
          .from('working_hours')
          .select('*')
          .eq('salon_id', salonData.id)
          .order('day_of_week', { ascending: true });

        if (hoursData && hoursData.length > 0) {
          // Mapiraj postojece podatke
          const existingSchedule = DAYS.map((day) => {
            const existing = hoursData.find((h: any) => h.day_of_week === day.value);
            if (existing) {
              return {
                day_of_week: existing.day_of_week,
                is_open: existing.is_open,
                open_time: existing.open_time?.slice(0, 5) || '09:00',
                close_time: existing.close_time?.slice(0, 5) || '18:00',
              };
            }
            return {
              day_of_week: day.value,
              is_open: day.value < 5,
              open_time: '09:00',
              close_time: '18:00',
            };
          });
          setSchedule(existingSchedule);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Greška pri učitavanju podataka');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabaseUser]);

  const updateDay = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, [field]: value } : day
      )
    );
    setHasChanges(true);
  };

  const copyToAllDays = (sourceDay: DaySchedule) => {
    setSchedule((prev) =>
      prev.map((day) => ({
        ...day,
        is_open: sourceDay.is_open,
        open_time: sourceDay.open_time,
        close_time: sourceDay.close_time,
      }))
    );
    setHasChanges(true);
    toast.success('Primenjeno na sve dane');
  };

  const copyToWeekdays = (sourceDay: DaySchedule) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.day_of_week < 5
          ? {
              ...day,
              is_open: sourceDay.is_open,
              open_time: sourceDay.open_time,
              close_time: sourceDay.close_time,
            }
          : day
      )
    );
    setHasChanges(true);
    toast.success('Primenjeno na radne dane (Pon-Pet)');
  };

  const handleSave = async () => {
    if (!salon) return;

    setIsSaving(true);

    try {
      // Pripremi podatke za upsert
      const workingHoursData = schedule.map((day) => ({
        salon_id: salon.id,
        day_of_week: day.day_of_week,
        is_open: day.is_open,
        open_time: day.is_open ? day.open_time : null,
        close_time: day.is_open ? day.close_time : null,
        updated_at: new Date().toISOString(),
      }));

      // Prvo obrisi postojece zapise
      await supabase
        .from('working_hours')
        .delete()
        .eq('salon_id', salon.id);

      // Zatim unesi nove
      const { error } = await supabase
        .from('working_hours')
        .insert(workingHoursData);

      if (error) throw error;

      toast.success('Radno vreme je uspešno sačuvano');
      setHasChanges(false);
    } catch (error: any) {
      console.error('Error saving working hours:', error);
      toast.error(error.message || 'Greška pri čuvanju radnog vremena');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Ako nema salona
  if (!salon) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Radno vreme</h1>
          <p className="text-muted-foreground">Podesite radno vreme vašeg salona</p>
        </div>

        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Najpre podesite salon</h3>
              <p className="text-sm text-muted-foreground">
                Pre podešavanja radnog vremena, morate kreirati profil vašeg salona
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Radno vreme</h1>
          <p className="text-muted-foreground">
            Podesite radno vreme za "{salon.name}"
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="bg-gradient-to-r from-violet-600 to-purple-600"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Čuvanje...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Sačuvaj izmene
            </>
          )}
        </Button>
      </div>

      {/* Schedule Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Raspored rada
          </CardTitle>
          <CardDescription>
            Podesite za svaki dan da li je salon otvoren i u koje vreme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedule.map((day, index) => (
            <div
              key={day.day_of_week}
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${
                day.is_open
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                  : 'bg-muted/50 border-muted'
              }`}
            >
              {/* Dan */}
              <div className="w-full sm:w-32 flex items-center justify-between sm:justify-start">
                <span className="font-medium">{DAYS[index].label}</span>
                <div className="sm:hidden">
                  <Switch
                    checked={day.is_open}
                    onCheckedChange={(checked) => updateDay(index, 'is_open', checked)}
                  />
                </div>
              </div>

              {/* Switch (desktop) */}
              <div className="hidden sm:flex items-center gap-2">
                <Switch
                  id={`is-open-${index}`}
                  checked={day.is_open}
                  onCheckedChange={(checked) => updateDay(index, 'is_open', checked)}
                />
                <Label
                  htmlFor={`is-open-${index}`}
                  className={`text-sm ${day.is_open ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
                >
                  {day.is_open ? 'Otvoreno' : 'Zatvoreno'}
                </Label>
              </div>

              {/* Vreme */}
              {day.is_open && (
                <div className="flex items-center gap-2 flex-1">
                  <Select
                    value={day.open_time}
                    onValueChange={(value) => updateDay(index, 'open_time', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={`open-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground">-</span>

                  <Select
                    value={day.close_time}
                    onValueChange={(value) => updateDay(index, 'close_time', value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={`close-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Copy buttons */}
                  <div className="hidden lg:flex items-center gap-1 ml-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToWeekdays(day)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Radni dani
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToAllDays(day)}
                      className="text-xs"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Svi dani
                    </Button>
                  </div>
                </div>
              )}

              {!day.is_open && (
                <span className="text-sm text-muted-foreground italic">
                  Salon ne radi ovog dana
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Brze akcije</CardTitle>
          <CardDescription>Primenite isto radno vreme na više dana</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              setSchedule((prev) =>
                prev.map((day) => ({
                  ...day,
                  is_open: day.day_of_week < 5,
                  open_time: '09:00',
                  close_time: '17:00',
                }))
              ) || setHasChanges(true)
            }
          >
            Standardno (Pon-Pet 9-17)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSchedule((prev) =>
                prev.map((day) => ({
                  ...day,
                  is_open: day.day_of_week < 6,
                  open_time: '09:00',
                  close_time: '18:00',
                }))
              ) || setHasChanges(true)
            }
          >
            Sa subotom (Pon-Sub 9-18)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSchedule((prev) =>
                prev.map((day) => ({
                  ...day,
                  is_open: true,
                  open_time: '08:00',
                  close_time: '20:00',
                }))
              ) || setHasChanges(true)
            }
          >
            Svaki dan (8-20)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
