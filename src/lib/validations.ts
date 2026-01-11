import { z } from 'zod';
import { SalonType, UserRole } from '@/types';

// Auth validacije
export const loginSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera')
});

export const registerSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
  full_name: z.string().min(2, 'Unesite ime i prezime'),
  phone: z.string().regex(/^\+381 \d{2} \d{3} \d{4}$/, 'Format: +381 XX XXX XXXX').optional().or(z.literal('')),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Izaberite tip korisnika' })
  })
});

// Salon validacije
export const salonSchema = z.object({
  name: z.string().min(2, 'Naziv salona mora imati najmanje 2 karaktera'),
  type: z.nativeEnum(SalonType, {
    errorMap: () => ({ message: 'Izaberite tip salona' })
  }),
  description: z.string().min(10, 'Opis mora imati najmanje 10 karaktera'),
  address: z.string().min(5, 'Unesite adresu'),
  city: z.string().min(2, 'Unesite grad'),
  phone: z.string().regex(/^\+381 \d{2} \d{3} \d{4}$/, 'Format: +381 XX XXX XXXX'),
  email: z.string().email('Unesite validnu email adresu').optional().or(z.literal('')),
  image_url: z.string().url('Unesite validnu URL adresu').optional().or(z.literal(''))
});

// Service validacije
export const serviceSchema = z.object({
  name: z.string().min(2, 'Naziv usluge mora imati najmanje 2 karaktera'),
  description: z.string().optional(),
  duration_minutes: z.number()
    .min(15, 'Trajanje mora biti najmanje 15 minuta')
    .max(480, 'Trajanje ne može biti duže od 8 sati'),
  price: z.number()
    .min(0, 'Cena mora biti pozitivan broj')
    .max(100000, 'Cena ne može biti veća od 100,000 RSD')
});

// Booking validacije
export const bookingSchema = z.object({
  service_id: z.string().min(1, 'Izaberite uslugu'),
  appointment_date: z.string().min(1, 'Izaberite datum'),
  appointment_time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM'),
  notes: z.string().max(500, 'Napomena ne može biti duža od 500 karaktera').optional()
});

// Working hours validacije
export const workingHoursSchema = z.object({
  is_open: z.boolean(),
  open_time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM').optional(),
  close_time: z.string().regex(/^\d{2}:\d{2}$/, 'Format: HH:MM').optional()
}).refine(
  (data) => {
    if (data.is_open) {
      return data.open_time && data.close_time;
    }
    return true;
  },
  {
    message: 'Ako je salon otvoren, vreme početka i kraja je obavezno',
    path: ['open_time']
  }
).refine(
  (data) => {
    if (data.is_open && data.open_time && data.close_time) {
      return data.open_time < data.close_time;
    }
    return true;
  },
  {
    message: 'Vreme zatvaranja mora biti posle vremena otvaranja',
    path: ['close_time']
  }
);
