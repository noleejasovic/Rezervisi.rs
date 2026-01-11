export enum UserRole {
  CLIENT = 'client',
  PROVIDER = 'provider'
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}
