import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">{siteConfig.name}</span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Pronađite i rezervišite termine kod najboljih frizera, kozmetičara i beauty profesionalaca u Srbiji.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-violet-600 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6">Brzi linkovi</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/salons" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Pronađi salon
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Registruj svoj salon
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Moje rezervacije
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-violet-400 transition-colors">
                  O nama
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-6">Kategorije</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/salons?type=hair_salon" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Frizerski saloni
                </Link>
              </li>
              <li>
                <Link href="/salons?type=beauty_salon" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Kozmetički saloni
                </Link>
              </li>
              <li>
                <Link href="/salons?type=nail_studio" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Nail studiji
                </Link>
              </li>
              <li>
                <Link href="/salons?type=spa" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Spa centri
                </Link>
              </li>
              <li>
                <Link href="/salons?type=barbershop" className="text-slate-400 hover:text-violet-400 transition-colors">
                  Barber shopovi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-6">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-violet-400" />
                </div>
                <a href="mailto:info@rezervisi.rs" className="text-slate-400 hover:text-violet-400 transition-colors">
                  info@rezervisi.rs
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-violet-400" />
                </div>
                <a href="tel:+381111234567" className="text-slate-400 hover:text-violet-400 transition-colors">
                  +381 11 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-violet-400" />
                </div>
                <span className="text-slate-400">Beograd, Srbija</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} {siteConfig.name}. Sva prava zadržana.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-violet-400 transition-colors">
                Politika privatnosti
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-violet-400 transition-colors">
                Uslovi korišćenja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
