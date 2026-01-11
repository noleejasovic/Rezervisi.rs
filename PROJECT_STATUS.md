# Rezerviši - Status Projekta

## Pregled
Aplikacija za online rezervaciju termina u salonima (frizeri, nail artisti, tattoo studiji, spa centri) za srpsko tržište.

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Auth + Database)
- next-themes (Dark mode)

---

## Završeno

### 1. Inicijalizacija Projekta
- [x] Next.js projekat sa TypeScript i Tailwind
- [x] shadcn/ui komponente instalirane (21+ komponenta)
- [x] Folder struktura kreirana
- [x] Konfiguracija (site config, utils)

### 2. TypeScript Tipovi (`src/types/`)
- [x] `user.ts` - User, UserRole (CLIENT/PROVIDER), RegisterData, LoginData
- [x] `salon.ts` - Salon, SalonType enum, SalonTypeLabels (srpski), SalonFilters
- [x] `service.ts` - Service, CreateServiceInput, UpdateServiceInput
- [x] `booking.ts` - Booking, BookingStatus enum sa srpskim labelama
- [x] `working-hours.ts` - WorkingHours, DayOfWeek sa srpskim labelama
- [x] `index.ts` - barrel export

### 3. Supabase Integracija
- [x] Supabase klijent konfiguracija (`src/lib/supabase/`)
  - `client.ts` - Browser client
  - `server.ts` - Server client sa cookie handling
  - `middleware.ts` - Session management
- [x] `.env.local` sa credentials
- [x] `profiles` tabela sa RLS policies
- [x] `salons` tabela sa RLS policies
- [x] `services` tabela sa RLS policies
- [x] `working_hours` tabela sa RLS policies
- [x] `bookings` tabela sa RLS policies
- [x] Trigger za auto-kreiranje profila na signup

### 4. Autentifikacija (`src/contexts/AuthContext.tsx`)
- [x] Supabase Auth integracija
- [x] Login/Logout/Register funkcije
- [x] User state management sa retry logikom
- [x] Role-based helpers (isClient, isProvider)
- [x] Custom hook `useAuth`

### 5. UI/UX
- [x] Violet/Purple color scheme
- [x] Dark mode podrška (next-themes)
- [x] ThemeToggle komponenta
- [x] Responsive design

### 6. Stranice - Implementirano

#### Landing Page (`src/app/page.tsx`)
- [x] Hero sekcija sa CTA
- [x] Statistike (500+ salona, 10,000+ rezervacija, itd.)
- [x] Kategorije salona sa ikonama
- [x] "Kako funkcioniše" sekcija (3 koraka)
- [x] Najpopularniji saloni (top 4)
- [x] CTA za vlasnike salona
- [x] Dark mode podrška

#### Auth Pages (`src/app/(auth)/`)
- [x] Layout sa jednostavnim headerom
- [x] Login stranica (`/login`)
  - [x] Email/password forma
  - [x] Zod validacija
  - [x] Error handling
  - [x] Toast notifikacije
- [x] Register stranica (`/register`)
  - [x] Izbor tipa korisnika (Klijent/Vlasnik salona)
  - [x] Sva polja (ime, email, telefon, lozinka)
  - [x] Zod validacija
  - [x] Dark mode podrška

#### Client Pages (`src/app/(client)/`)
- [x] Layout sa Header i Footer
- [x] Salons listing (`/salons`)
  - [x] Grid prikaz salona
  - [x] Filteri (tip salona, grad)
  - [x] Search
  - [x] Salon kartice sa ocenom i cenom
  - [x] Supabase integracija
  - [x] Dark mode podrška
- [x] **Salon Detail Page** (`/salons/[id]`)
  - [x] Prikaz informacija o salonu
  - [x] Lista usluga sa cenama i trajanjem
  - [x] Radno vreme prikaz
  - [x] Booking forma (izbor usluge, datuma, vremena)
  - [x] Calendar za izbor datuma
  - [x] Time slots generisanje
- [x] **My Bookings Page** (`/my-bookings`)
  - [x] Lista svih rezervacija korisnika
  - [x] Tabs (Predstojeće, Prošle, Otkazane, Sve)
  - [x] Status rezervacije sa badge-ovima
  - [x] Mogućnost otkazivanja
  - [x] Salon info sa slikom

#### Provider Pages (`src/app/(provider)/`)
- [x] Layout sa sidebar navigacijom
- [x] Dashboard (`/dashboard`)
  - [x] Statistike (rezervacije, prihod, ocena)
  - [x] Brze akcije
  - [x] Prikaz salona
  - [x] Supabase integracija
- [x] **Moj Salon** (`/my-salon`)
  - [x] Pregled informacija o salonu
  - [x] Statistike (usluge, ocena, status)
  - [x] Lista usluga preview
  - [x] Brze akcije
- [x] **Salon Setup** (`/salon-setup`)
  - [x] Multi-step forma za kreiranje/izmenu salona
  - [x] Osnovne informacije (naziv, tip, opis)
  - [x] Kontakt (adresa, grad, telefon)
  - [x] Upload slike
  - [x] Supabase integracija (CRUD)
- [x] **Services Management** (`/services`)
  - [x] CRUD za usluge
  - [x] Tabela sa svim uslugama (desktop)
  - [x] Card prikaz (mobile)
  - [x] Dialog za dodavanje/izmenu
  - [x] Brisanje usluge sa potvrdom
  - [x] Toggle active/inactive status
- [x] **Working Hours** (`/working-hours`)
  - [x] Forma za svaki dan u nedelji
  - [x] Switch za otvoreno/zatvoreno
  - [x] Time picker za početak/kraj
  - [x] Brze akcije (standardno, sa subotom, svaki dan)
  - [x] Copy na radne dane / sve dane
- [x] **Bookings Management** (`/bookings`)
  - [x] Lista svih rezervacija
  - [x] Tabs po statusu (Na čekanju, Danas, Potvrđeno, Završeno, Sve)
  - [x] Statistike (na čekanju, danas, ukupno)
  - [x] Potvrdi/Odbij dugmad za pending
  - [x] Završi/Otkaži za confirmed
  - [x] Detalji klijenta (ime, telefon)

### 7. Shared Komponente (`src/components/shared/`)
- [x] `Header.tsx` - Navigacija, auth dugmad, theme toggle
- [x] `Footer.tsx` - Linkovi, kontakt info
- [x] `ThemeProvider.tsx` - next-themes wrapper
- [x] `ThemeToggle.tsx` - Dropdown za izbor teme

---

## Nije Završeno (TODO)

### Prioritet: SREDNJI

#### Funkcionalnosti
- [ ] Route protection middleware
- [ ] Error boundaries
- [ ] Email notifikacije na rezervaciju

### Prioritet: NIZAK

- [ ] Email notifikacije (Supabase Edge Functions)
- [ ] Upload slika na Supabase Storage (trenutno base64)
- [ ] Recenzije i ocene
- [ ] Search sa autocomplete
- [ ] Mapa integracija
- [ ] PWA podrška
- [ ] Analytics

---

## Struktura Foldera

```
booking-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx      ✅
│   │   │   ├── register/page.tsx   ✅
│   │   │   └── layout.tsx          ✅
│   │   ├── (client)/
│   │   │   ├── salons/
│   │   │   │   ├── page.tsx        ✅
│   │   │   │   └── [id]/page.tsx   ✅
│   │   │   ├── my-bookings/page.tsx ✅
│   │   │   └── layout.tsx          ✅
│   │   ├── (provider)/
│   │   │   ├── dashboard/page.tsx  ✅
│   │   │   ├── my-salon/page.tsx   ✅
│   │   │   ├── salon-setup/page.tsx ✅
│   │   │   ├── services/page.tsx   ✅
│   │   │   ├── bookings/page.tsx   ✅
│   │   │   ├── working-hours/page.tsx ✅
│   │   │   └── layout.tsx          ✅
│   │   ├── globals.css             ✅
│   │   ├── layout.tsx              ✅
│   │   └── page.tsx                ✅
│   ├── components/
│   │   ├── ui/                     ✅ (shadcn)
│   │   └── shared/
│   │       ├── Header.tsx          ✅
│   │       ├── Footer.tsx          ✅
│   │       ├── ThemeProvider.tsx   ✅
│   │       └── ThemeToggle.tsx     ✅
│   ├── contexts/
│   │   └── AuthContext.tsx         ✅
│   ├── hooks/
│   │   └── useAuth.ts              ✅
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           ✅
│   │   │   ├── server.ts           ✅
│   │   │   └── middleware.ts       ✅
│   │   ├── utils.ts                ✅
│   │   └── validations.ts          ✅
│   ├── types/
│   │   ├── user.ts                 ✅
│   │   ├── salon.ts                ✅
│   │   ├── service.ts              ✅
│   │   ├── booking.ts              ✅
│   │   ├── working-hours.ts        ✅
│   │   └── index.ts                ✅
│   └── config/
│       └── site.ts                 ✅
├── .env.local                      ✅
├── package.json                    ✅
└── PROJECT_STATUS.md               ✅ (ovaj fajl)
```

---

## Supabase Tabele

| Tabela | Status | RLS |
|--------|--------|-----|
| profiles | ✅ | ✅ |
| salons | ✅ | ✅ |
| services | ✅ | ✅ |
| working_hours | ✅ | ✅ |
| bookings | ✅ | ✅ |

---

## Kako Pokrenuti

```bash
cd booking-app
npm run dev
```

Aplikacija će biti dostupna na `http://localhost:3000`

---

## Flow Aplikacije

### Klijent:
1. Registracija/Prijava kao klijent
2. Pretraga salona (`/salons`)
3. Pregled detalja salona (`/salons/[id]`)
4. Rezervacija termina (izbor usluge → datum → vreme)
5. Pregled svojih rezervacija (`/my-bookings`)
6. Otkazivanje rezervacije

### Provider:
1. Registracija/Prijava kao vlasnik salona
2. Kreiranje salona (`/salon-setup`)
3. Dodavanje usluga (`/services`)
4. Podešavanje radnog vremena (`/working-hours`)
5. Upravljanje rezervacijama (`/bookings`)
   - Potvrda / Odbijanje novih rezervacija
   - Označavanje kao završeno
   - Otkazivanje

---

## Poznati Problemi

1. ~~Tamna tema ne radi na svim stranicama~~ - **REŠENO**
2. ~~Mock data umesto prave baze~~ - **REŠENO** (sve koristi Supabase)
3. Nema route protection - Potrebno implementirati middleware
4. Nema email verifikacije - Supabase podržava, treba omogućiti
5. Slike se čuvaju kao base64 - Treba prebaciti na Supabase Storage

---

*Poslednje ažuriranje: Januar 2026*
