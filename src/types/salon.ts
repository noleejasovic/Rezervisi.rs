export enum SalonType {
  HAIR_SALON = 'hair_salon',
  NAIL_SALON = 'nail_salon',
  TATTOO_STUDIO = 'tattoo_studio',
  BARBERSHOP = 'barbershop',
  BEAUTY_SALON = 'beauty_salon',
  SPA = 'spa'
}

export const SalonTypeLabels: Record<SalonType, string> = {
  [SalonType.HAIR_SALON]: 'Frizerski salon',
  [SalonType.NAIL_SALON]: 'Nail salon',
  [SalonType.TATTOO_STUDIO]: 'Tetovažna radnja',
  [SalonType.BARBERSHOP]: 'Berberin',
  [SalonType.BEAUTY_SALON]: 'Beauty salon',
  [SalonType.SPA]: 'Spa'
};

export interface Salon {
  id: string;
  provider_id: string;
  name: string;
  type: SalonType;
  description: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  image_url?: string;
  rating?: number;
  total_reviews?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSalonInput {
  name: string;
  type: SalonType;
  description: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  image_url?: string;
}

export interface SalonFilters {
  type?: SalonType;
  city?: string;
  search?: string;
  minRating?: number;
}
