import { Booking, BookingStatus } from '@/types';

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    client_id: 'client-1',
    salon_id: 'salon-1',
    service_id: 'service-2',
    appointment_date: '2024-01-20',
    appointment_time: '10:00',
    status: BookingStatus.CONFIRMED,
    notes: 'Kratko šišanje molim',
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-01-15T15:00:00Z'
  },
  {
    id: 'booking-2',
    client_id: 'client-2',
    salon_id: 'salon-2',
    service_id: 'service-5',
    appointment_date: '2024-01-22',
    appointment_time: '14:30',
    status: BookingStatus.PENDING,
    notes: 'Crvena boja molim',
    created_at: '2024-01-16T10:30:00Z',
    updated_at: '2024-01-16T10:30:00Z'
  },
  {
    id: 'booking-3',
    client_id: 'client-3',
    salon_id: 'salon-6',
    service_id: 'service-19',
    appointment_date: '2024-01-18',
    appointment_time: '16:00',
    status: BookingStatus.COMPLETED,
    notes: '',
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-18T17:30:00Z'
  },
  {
    id: 'booking-4',
    client_id: 'client-1',
    salon_id: 'salon-4',
    service_id: 'service-14',
    appointment_date: '2024-01-25',
    appointment_time: '11:00',
    status: BookingStatus.PENDING,
    notes: 'Prvi put dolazim',
    created_at: '2024-01-17T12:00:00Z',
    updated_at: '2024-01-17T12:00:00Z'
  },
  {
    id: 'booking-5',
    client_id: 'client-2',
    salon_id: 'salon-5',
    service_id: 'service-16',
    appointment_date: '2024-01-19',
    appointment_time: '15:00',
    status: BookingStatus.CONFIRMED,
    notes: 'Šminkanje za svadbu',
    created_at: '2024-01-14T16:00:00Z',
    updated_at: '2024-01-14T17:00:00Z'
  },
  {
    id: 'booking-6',
    client_id: 'client-3',
    salon_id: 'salon-3',
    service_id: 'service-9',
    appointment_date: '2024-01-23',
    appointment_time: '13:00',
    status: BookingStatus.REJECTED,
    notes: 'Minimalistička tetovaža na zglobu',
    created_at: '2024-01-16T11:00:00Z',
    updated_at: '2024-01-16T13:00:00Z'
  }
];
