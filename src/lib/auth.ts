import { User, UserRole, RegisterData, LoginData } from '@/types';
import { mockUsers, MOCK_PASSWORD } from '@/data';

// LocalStorage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'booking_app_current_user',
  ALL_USERS: 'booking_app_all_users'
};

// Helper funkcija za dobijanje svih korisnika
function getAllUsers(): User[] {
  if (typeof window === 'undefined') return mockUsers;

  const stored = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return mockUsers;
    }
  }
  // Ako nema u localStorage, sačuvaj mock users
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(mockUsers));
  return mockUsers;
}

// Helper funkcija za čuvanje svih korisnika
function saveAllUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
}

export const mockAuth = {
  // Login funkcija
  login: async (data: LoginData): Promise<User> => {
    // Simulacija API poziva
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getAllUsers();
    const user = users.find(u => u.email === data.email);

    if (!user) {
      throw new Error('Korisnik sa ovom email adresom ne postoji');
    }

    // Mock password provera
    if (data.password !== MOCK_PASSWORD) {
      throw new Error('Pogrešna lozinka');
    }

    // Sačuvaj trenutnog korisnika
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    return user;
  },

  // Registracija funkcija
  register: async (data: RegisterData): Promise<User> => {
    // Simulacija API poziva
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getAllUsers();

    // Proveri da li email već postoji
    if (users.find(u => u.email === data.email)) {
      throw new Error('Korisnik sa ovom email adresom već postoji');
    }

    // Kreiraj novog korisnika
    const newUser: User = {
      id: `${data.role}-${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Dodaj u listu i sačuvaj
    users.push(newUser);
    saveAllUsers(users);

    // Sačuvaj kao trenutnog korisnika
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    }

    return newUser;
  },

  // Logout funkcija
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Dobavi trenutnog korisnika
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  // Proveri da li je korisnik ulogovan
  isAuthenticated: (): boolean => {
    return mockAuth.getCurrentUser() !== null;
  },

  // Proveri tip korisnika
  getUserRole: (): UserRole | null => {
    const user = mockAuth.getCurrentUser();
    return user ? user.role : null;
  }
};
