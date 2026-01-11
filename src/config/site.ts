export const siteConfig = {
  name: 'Rezerviši',
  description: 'Rezervišite termin u najomiljenijim salonima',
  locale: 'sr-RS',
  currency: 'RSD',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Navigacija
  nav: {
    main: [
      { name: 'Početna', href: '/' },
      { name: 'Saloni', href: '/salons' },
      { name: 'O nama', href: '/about' },
      { name: 'Kontakt', href: '/contact' }
    ],
    client: [
      { name: 'Saloni', href: '/salons' },
      { name: 'Moje rezervacije', href: '/my-bookings' }
    ],
    provider: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Salon', href: '/salon-setup' },
      { name: 'Usluge', href: '/services' },
      { name: 'Rezervacije', href: '/bookings' },
      { name: 'Radno vreme', href: '/working-hours' }
    ]
  },

  // Tekstovi
  translations: {
    auth: {
      login: 'Prijava',
      register: 'Registracija',
      logout: 'Odjava',
      email: 'Email adresa',
      password: 'Lozinka',
      fullName: 'Ime i prezime',
      phone: 'Broj telefona',
      forgotPassword: 'Zaboravili ste lozinku?',
      noAccount: 'Nemate nalog?',
      hasAccount: 'Već imate nalog?',
      signUp: 'Registrujte se',
      signIn: 'Prijavite se'
    },
    userTypes: {
      client: 'Klijent',
      provider: 'Pružalac usluga',
      selectType: 'Izaberite tip korisnika'
    },
    salon: {
      search: 'Pretražite salone',
      filters: 'Filteri',
      book: 'Rezervišite',
      bookNow: 'Rezerviši termin',
      services: 'Usluge',
      workingHours: 'Radno vreme',
      about: 'O salonu',
      reviews: 'Recenzije',
      noResults: 'Nema rezultata',
      viewDetails: 'Pogledaj detalje'
    },
    booking: {
      myBookings: 'Moje rezervacije',
      newBooking: 'Nova rezervacija',
      selectService: 'Izaberite uslugu',
      selectDate: 'Izaberite datum',
      selectTime: 'Izaberite vreme',
      notes: 'Napomena (opciono)',
      confirm: 'Potvrdi rezervaciju',
      cancel: 'Otkaži',
      status: 'Status',
      date: 'Datum',
      time: 'Vreme',
      service: 'Usluga',
      price: 'Cena'
    },
    provider: {
      dashboard: 'Kontrolna tabla',
      setupSalon: 'Podesi salon',
      manageServices: 'Upravljaj uslugama',
      manageBookings: 'Upravljaj rezervacijama',
      workingHours: 'Radno vreme',
      stats: {
        totalBookings: 'Ukupne rezervacije',
        pendingBookings: 'Na čekanju',
        revenue: 'Prihod',
        rating: 'Ocena'
      },
      actions: {
        accept: 'Prihvati',
        reject: 'Odbij',
        complete: 'Završi',
        add: 'Dodaj',
        edit: 'Izmeni',
        delete: 'Obriši',
        save: 'Sačuvaj'
      }
    },
    common: {
      loading: 'Učitavanje...',
      error: 'Greška',
      success: 'Uspešno',
      cancel: 'Otkaži',
      save: 'Sačuvaj',
      delete: 'Obriši',
      edit: 'Izmeni',
      add: 'Dodaj',
      search: 'Pretraži',
      filter: 'Filtriraj',
      clear: 'Obriši',
      back: 'Nazad',
      next: 'Sledeće',
      previous: 'Prethodno',
      submit: 'Pošalji',
      close: 'Zatvori'
    }
  }
};

export type SiteConfig = typeof siteConfig;
