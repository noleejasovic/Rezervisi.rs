export interface Service {
  id: string;
  salon_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
  currency: string; // 'RSD'
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  duration_minutes: number;
  price: number;
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  is_active?: boolean;
}
