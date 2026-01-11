export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export const BookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Na čekanju',
  [BookingStatus.CONFIRMED]: 'Potvrđeno',
  [BookingStatus.REJECTED]: 'Odbijeno',
  [BookingStatus.CANCELLED]: 'Otkazano',
  [BookingStatus.COMPLETED]: 'Završeno'
};

export interface Booking {
  id: string;
  client_id: string;
  salon_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingInput {
  salon_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

export interface BookingWithDetails extends Booking {
  salon_name?: string;
  service_name?: string;
  client_name?: string;
  client_phone?: string;
}
