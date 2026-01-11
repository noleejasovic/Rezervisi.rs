import { Service } from '@/types';

export const mockServices: Service[] = [
  // Services for Frizerski Salon Elegance (salon-1)
  {
    id: 'service-1',
    salon_id: 'salon-1',
    name: 'Žensko šišanje i feniranje',
    description: 'Profesionalno šišanje i feniranje za dame',
    duration_minutes: 60,
    price: 1500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: 'service-2',
    salon_id: 'salon-1',
    name: 'Muško šišanje',
    description: 'Klasično ili moderno muško šišanje',
    duration_minutes: 30,
    price: 800,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: 'service-3',
    salon_id: 'salon-1',
    name: 'Farbanje kose',
    description: 'Farbanje kose profesionalnom bojom',
    duration_minutes: 120,
    price: 3500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  {
    id: 'service-4',
    salon_id: 'salon-1',
    name: 'Pramenovi',
    description: 'Pravljenje pramenova i balayage tehnika',
    duration_minutes: 150,
    price: 4500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-05T10:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  // Services for Beauty Nails Studio (salon-2)
  {
    id: 'service-5',
    salon_id: 'salon-2',
    name: 'Gel lak',
    description: 'Trajni gel lak u boji po izboru',
    duration_minutes: 45,
    price: 1200,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  },
  {
    id: 'service-6',
    salon_id: 'salon-2',
    name: 'Nadogradnja noktiju',
    description: 'Nadogradnja prirodnih noktiju gelom',
    duration_minutes: 90,
    price: 2500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  },
  {
    id: 'service-7',
    salon_id: 'salon-2',
    name: 'Nail art',
    description: 'Dekoracija noktiju - dizajn po želji',
    duration_minutes: 60,
    price: 1800,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  },
  {
    id: 'service-8',
    salon_id: 'salon-2',
    name: 'Pedikir',
    description: 'Kompletan pedikir sa lakiranjem',
    duration_minutes: 60,
    price: 1500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  },
  // Services for Ink Masters Tattoo (salon-3)
  {
    id: 'service-9',
    salon_id: 'salon-3',
    name: 'Mala tetovaža (do 5cm)',
    description: 'Tetovaža male površine',
    duration_minutes: 60,
    price: 5000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-07T16:00:00Z',
    updated_at: '2024-01-07T16:00:00Z'
  },
  {
    id: 'service-10',
    salon_id: 'salon-3',
    name: 'Srednja tetovaža (5-15cm)',
    description: 'Tetovaža srednje površine',
    duration_minutes: 120,
    price: 12000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-07T16:00:00Z',
    updated_at: '2024-01-07T16:00:00Z'
  },
  {
    id: 'service-11',
    salon_id: 'salon-3',
    name: 'Velika tetovaža (preko 15cm)',
    description: 'Tetovaža velike površine',
    duration_minutes: 180,
    price: 25000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-07T16:00:00Z',
    updated_at: '2024-01-07T16:00:00Z'
  },
  {
    id: 'service-12',
    salon_id: 'salon-3',
    name: 'Cover-up tetovaža',
    description: 'Prekrivanje stare tetovaže novom',
    duration_minutes: 150,
    price: 18000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-07T16:00:00Z',
    updated_at: '2024-01-07T16:00:00Z'
  },
  // Services for Barber Shop Kings (salon-4)
  {
    id: 'service-13',
    salon_id: 'salon-4',
    name: 'Klasično šišanje',
    description: 'Tradicionalno muško šišanje',
    duration_minutes: 30,
    price: 1000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 'service-14',
    salon_id: 'salon-4',
    name: 'Šišanje i brijanje',
    description: 'Šišanje sa klasičnim brijanjem',
    duration_minutes: 45,
    price: 1500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 'service-15',
    salon_id: 'salon-4',
    name: 'Nega brade',
    description: 'Šišanje i oblikovanje brade',
    duration_minutes: 30,
    price: 800,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-10T09:00:00Z',
    updated_at: '2024-01-10T09:00:00Z'
  },
  // Services for Glamour Beauty Salon (salon-5)
  {
    id: 'service-16',
    salon_id: 'salon-5',
    name: 'Šminkanje',
    description: 'Profesionalno šminkanje za sve prilike',
    duration_minutes: 60,
    price: 2500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-11T13:00:00Z',
    updated_at: '2024-01-11T13:00:00Z'
  },
  {
    id: 'service-17',
    salon_id: 'salon-5',
    name: 'Depilacija nogu',
    description: 'Depilacija nogu toplim voskom',
    duration_minutes: 45,
    price: 1500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-11T13:00:00Z',
    updated_at: '2024-01-11T13:00:00Z'
  },
  {
    id: 'service-18',
    salon_id: 'salon-5',
    name: 'Tretman lica',
    description: 'Dubinsko čišćenje i hidratacija lica',
    duration_minutes: 90,
    price: 3000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-11T13:00:00Z',
    updated_at: '2024-01-11T13:00:00Z'
  },
  // Services for Relax Spa & Wellness (salon-6)
  {
    id: 'service-19',
    salon_id: 'salon-6',
    name: 'Relax masaža',
    description: 'Opuštajuća masaža celog tela (60 min)',
    duration_minutes: 60,
    price: 3500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-09T14:00:00Z',
    updated_at: '2024-01-09T14:00:00Z'
  },
  {
    id: 'service-20',
    salon_id: 'salon-6',
    name: 'Deep tissue masaža',
    description: 'Terapeutska masaža dubokih tkiva',
    duration_minutes: 90,
    price: 5000,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-09T14:00:00Z',
    updated_at: '2024-01-09T14:00:00Z'
  },
  {
    id: 'service-21',
    salon_id: 'salon-6',
    name: 'Sauna i jacuzzi (2h)',
    description: 'Korišćenje saune i jacuzzi-ja',
    duration_minutes: 120,
    price: 2500,
    currency: 'RSD',
    is_active: true,
    created_at: '2024-01-09T14:00:00Z',
    updated_at: '2024-01-09T14:00:00Z'
  }
];
