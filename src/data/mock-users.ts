import { User, UserRole } from '@/types';

export const mockUsers: User[] = [
  // Klijenti
  {
    id: 'client-1',
    email: 'marko.petrovic@gmail.com',
    full_name: 'Marko Petrović',
    phone: '+381 62 123 4567',
    role: UserRole.CLIENT,
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-10T10:00:00Z'
  },
  {
    id: 'client-2',
    email: 'ana.jovanovic@gmail.com',
    full_name: 'Ana Jovanović',
    phone: '+381 63 234 5678',
    role: UserRole.CLIENT,
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: 'client-3',
    email: 'nikola.nikolic@gmail.com',
    full_name: 'Nikola Nikolić',
    phone: '+381 64 345 6789',
    role: UserRole.CLIENT,
    created_at: '2024-01-15T09:15:00Z',
    updated_at: '2024-01-15T09:15:00Z'
  },
  // Provideri
  {
    id: 'provider-1',
    email: 'salon.elegance@gmail.com',
    full_name: 'Milica Stanković',
    phone: '+381 11 123 4567',
    role: UserRole.PROVIDER,
    created_at: '2024-01-05T08:00:00Z',
    updated_at: '2024-01-05T08:00:00Z'
  },
  {
    id: 'provider-2',
    email: 'nails.beauty@gmail.com',
    full_name: 'Jelena Đorđević',
    phone: '+381 21 234 5678',
    role: UserRole.PROVIDER,
    created_at: '2024-01-08T11:00:00Z',
    updated_at: '2024-01-08T11:00:00Z'
  },
  {
    id: 'provider-3',
    email: 'ink.masters@gmail.com',
    full_name: 'Stefan Kostić',
    phone: '+381 18 345 6789',
    role: UserRole.PROVIDER,
    created_at: '2024-01-07T16:00:00Z',
    updated_at: '2024-01-07T16:00:00Z'
  }
];

// Mock password za sve usere je "password123"
export const MOCK_PASSWORD = 'password123';
