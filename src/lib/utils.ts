import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { sr } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatiranje cene u RSD
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Formatiranje datuma na srpskom
export function formatDate(date: string | Date, formatStr: string = 'dd.MM.yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: sr });
}

// Formatiranje vremena
export function formatTime(time: string): string {
  return time; // Already in HH:MM format
}

// Dobijanje današnjeg datuma
export function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
