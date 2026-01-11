'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { Salon, SalonType, SalonTypeLabels } from '@/types';
import {
  Search,
  Calendar,
  CheckCircle,
  Star,
  MapPin,
  ArrowRight,
  Users,
  Shield,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  Play,
  TrendingUp,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Category data with emojis and gradients
const CATEGORIES = [
  { type: 'hair_salon', label: 'Frizerski saloni', icon: '💇', gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
  { type: 'beauty_salon', label: 'Kozmetički saloni', icon: '💄', gradient: 'from-purple-500 to-violet-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  { type: 'nail_studio', label: 'Nail studiji', icon: '💅', gradient: 'from-red-500 to-pink-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  { type: 'barbershop', label: 'Barber shopovi', icon: '💈', gradient: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { type: 'spa', label: 'Spa & Wellness', icon: '🧖', gradient: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50 dark:bg-teal-950/30' },
  { type: 'massage', label: 'Masaža', icon: '💆', gradient: 'from-green-500 to-teal-500', bg: 'bg-green-50 dark:bg-green-950/30' },
];

// Cities
const CITIES = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo'];

// Testimonials
const TESTIMONIALS = [
  {
    text: 'Rezerviši mi je promenio život! Više ne moram da zovem i čekam da se jave. Jednostavno izaberem termin i to je to.',
    author: 'Marija Stojanović',
    role: 'Redovan korisnik',
    avatar: 'MS',
    rating: 5
  },
  {
    text: 'Kao vlasnica salona, ova platforma mi je uštedela sate svaki dan. Klijenti sami biraju termine, a ja se fokusiram na posao.',
    author: 'Jelena Petrović',
    role: 'Vlasnica Beauty Studio',
    avatar: 'JP',
    rating: 5
  },
  {
    text: 'Konačno mogu da vidim sve salone na jednom mestu i uporedim cene. Preporučujem svima!',
    author: 'Petar Marković',
    role: 'Korisnik',
    avatar: 'PM',
    rating: 5
  }
];

// Stats
const STATS = [
  { value: '500+', label: 'Salona', icon: Sparkles },
  { value: '10,000+', label: 'Rezervacija', icon: Calendar },
  { value: '4.9', label: 'Prosečna ocena', icon: Star },
  { value: '50+', label: 'Gradova', icon: MapPin },
];

// Business features
const BUSINESS_FEATURES = [
  { icon: Calendar, title: 'Online rezervacije 24/7', desc: 'Klijenti rezervišu kada god im odgovara' },
  { icon: Users, title: 'Upravljanje klijentima', desc: 'Pratite istoriju i preferencije' },
  { icon: TrendingUp, title: 'Analitika i izveštaji', desc: 'Uvid u poslovanje u realnom vremenu' },
  { icon: Zap, title: 'Brz i lak setup', desc: 'Krenite za manje od 5 minuta' },
];

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [featuredSalons, setFeaturedSalons] = useState<Salon[]>([]);
  const [newSalons, setNewSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalons = async () => {
      try {
        // Load featured (highest rated)
        const { data: featured } = await supabase
          .from('salons')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(8);

        // Load newest
        const { data: newest } = await supabase
          .from('salons')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4);

        setFeaturedSalons(featured || []);
        setNewSalons(newest || []);
      } catch (error) {
        console.error('Error loading salons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalons();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);
    router.push(`/salons?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Liquid Aurora Gradient */}
        <section className="relative overflow-hidden">
          {/* Animated aurora background */}
          <div className="absolute inset-0 aurora-bg" />

          {/* Mesh gradient overlay for depth */}
          <div className="absolute inset-0 mesh-gradient opacity-60" />

          {/* Animated floating blobs */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Purple blob */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl aurora-blob" />
            {/* Pink blob */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-500/40 rounded-full blur-3xl aurora-blob-delay-1" />
            {/* Blue blob */}
            <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-500/40 rounded-full blur-3xl aurora-blob-delay-2" />
            {/* Orange blob */}
            <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-orange-500/30 rounded-full blur-3xl aurora-blob-delay-3" />
            {/* Cyan blob */}
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl aurora-blob" />
            {/* Green blob */}
            <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl aurora-blob-delay-2" />
          </div>

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative container mx-auto px-4 py-20 md:py-28 lg:py-36">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-8">
                <Sparkles className="h-4 w-4" />
                <span>#1 platforma za rezervacije u Srbiji</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                Pronađite i rezervišite
                <span className="block mt-2">savršen salon</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Hiljade salona na jednom mestu. Rezervišite termin kod najboljh frizera,
                kozmetičara i beauty profesionalaca u vašem gradu.
              </p>

              {/* Search Box */}
              <div className="max-w-3xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-2xl shadow-black/20">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Šta tražite? (npr. šišanje, manikir...)"
                        className="pl-12 h-14 text-base border-0 bg-muted/30 focus-visible:ring-0 rounded-xl"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="w-full md:w-[180px] h-14 border-0 bg-muted/30 rounded-xl">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Izaberite grad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Svi gradovi</SelectItem>
                          {CITIES.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="lg"
                        className="h-14 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl shadow-lg"
                        onClick={handleSearch}
                      >
                        <Search className="h-5 w-5 md:mr-2" />
                        <span className="hidden md:inline">Pretraži</span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  <span className="text-white/60 text-sm">Popularno:</span>
                  {['Šišanje', 'Manikir', 'Masaža', 'Farbanje'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch();
                      }}
                      className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Stats Bar */}
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Istražite kategorije</h2>
              <p className="text-muted-foreground text-lg">Pronađite uslugu koja vam je potrebna</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat) => (
                <Link key={cat.type} href={`/salons?type=${cat.type}`}>
                  <div className={cn(
                    "group p-6 rounded-2xl text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border",
                    cat.bg
                  )}>
                    <div className={cn(
                      "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      cat.gradient
                    )}>
                      <span className="text-3xl">{cat.icon}</span>
                    </div>
                    <h3 className="font-semibold text-sm group-hover:text-violet-600 transition-colors">
                      {cat.label}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Salons */}
        {featuredSalons.length > 0 && (
          <section className="py-16 md:py-20 bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background">
            <div className="container mx-auto px-4">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <Badge className="mb-3 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Najbolje ocenjeni
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold">Preporučeni saloni</h2>
                </div>
                <Button variant="outline" asChild className="hidden md:flex rounded-full">
                  <Link href="/salons">
                    Vidi sve
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredSalons.slice(0, 4).map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>

              <div className="mt-8 text-center md:hidden">
                <Button variant="outline" asChild className="rounded-full">
                  <Link href="/salons">
                    Vidi sve salone
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* How it Works */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0">
                Kako funkcioniše
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Rezervišite termin u 3 koraka
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Jednostavan proces koji štedi vaše vreme
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', icon: Search, title: 'Pronađite salon', desc: 'Pretražite salone po lokaciji, tipu usluge ili oceni. Uporedite cene i pročitajte recenzije.' },
                { step: '02', icon: Calendar, title: 'Izaberite termin', desc: 'Odaberite uslugu i vreme koje vam odgovara. Vidite dostupnost u realnom vremenu.' },
                { step: '03', icon: CheckCircle, title: 'Potvrdite rezervaciju', desc: 'Primite potvrdu putem emaila i SMS-a. Dođite na vreme i uživajte!' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-violet-200 dark:border-violet-800" />
                  )}
                  <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border text-center hover:shadow-xl transition-shadow">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                      {item.step}
                    </div>
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-slate-900 dark:bg-slate-950 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-white/10 text-white border-0">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Utisci korisnika
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Šta kažu naši korisnici
              </h2>
              <div className="flex items-center justify-center gap-2 text-violet-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2">4.9/5 na osnovu 1000+ recenzija</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Business */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0">
                  Za vlasnike salona
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Digitalizujte vaš salon
                  <span className="text-violet-600"> besplatno</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Pridružite se stotinama salona koji su već unapredili svoje poslovanje.
                  Smanjite propuštene termine, povećajte produktivnost i zadovoljstvo klijenata.
                </p>

                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  {BUSINESS_FEATURES.map((feature, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-full shadow-lg" asChild>
                    <Link href="/register">
                      Registrujte vaš salon
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full" asChild>
                    <Link href="/about">
                      Saznajte više
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative lg:pl-8">
                <div className="relative">
                  {/* Main card */}
                  <div className="bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-3xl p-8">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Vaš Salon</h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs text-muted-foreground">4.9 (256 recenzija)</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-0">Aktivan</Badge>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-violet-600">24</div>
                          <div className="text-xs text-muted-foreground">Danas</div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-violet-600">156</div>
                          <div className="text-xs text-muted-foreground">Ove nedelje</div>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-violet-600">98%</div>
                          <div className="text-xs text-muted-foreground">Popunjenost</div>
                        </div>
                      </div>

                      {/* Upcoming */}
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-muted-foreground">Sledeće rezervacije</div>
                        {[
                          { time: '10:00', name: 'Marija S.', service: 'Šišanje + Feniranje' },
                          { time: '11:30', name: 'Ana P.', service: 'Farbanje' },
                        ].map((booking, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                            <div className="text-sm font-semibold text-violet-600 w-12">{booking.time}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{booking.name}</div>
                              <div className="text-xs text-muted-foreground">{booking.service}</div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Floating notification */}
                  <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 hidden lg:block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Nova rezervacija!</p>
                        <p className="text-xs text-muted-foreground">Pre 2 minuta</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Animated aurora background */}
          <div className="absolute inset-0 aurora-bg" />

          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 mesh-gradient opacity-50" />

          {/* Animated floating blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-pink-500/40 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl aurora-blob-delay-1" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/40 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl aurora-blob" />
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-yellow-500/30 rounded-full blur-3xl aurora-blob-delay-2" />
          </div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="container mx-auto px-4 text-center relative">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Spremni da započnete?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Pridružite se hiljadama zadovoljnih korisnika. Pronađite savršen salon ili registrujte svoj već danas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 rounded-full shadow-lg h-14 px-8 text-lg" asChild>
                <Link href="/register">
                  Registrujte salon
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Salon Card Component
function SalonCard({ salon }: { salon: Salon }) {
  const categoryGradients: Record<string, string> = {
    hair_salon: 'from-pink-500 to-rose-500',
    beauty_salon: 'from-purple-500 to-violet-500',
    nail_studio: 'from-red-500 to-pink-500',
    barbershop: 'from-blue-500 to-indigo-500',
    spa: 'from-teal-500 to-emerald-500',
    massage: 'from-green-500 to-teal-500',
    tattoo_studio: 'from-slate-600 to-slate-800',
    other: 'from-violet-500 to-purple-500',
  };

  const categoryIcons: Record<string, string> = {
    hair_salon: '💇',
    beauty_salon: '💄',
    nail_studio: '💅',
    barbershop: '💈',
    spa: '🧖',
    massage: '💆',
    tattoo_studio: '🎨',
    other: '✨',
  };

  const gradient = categoryGradients[salon.type] || categoryGradients.other;
  const icon = categoryIcons[salon.type] || categoryIcons.other;

  return (
    <Link href={`/salons/${salon.id}`}>
      <Card className="group cursor-pointer border hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 overflow-hidden">
          {salon.image_url ? (
            <img
              src={salon.image_url}
              alt={salon.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                gradient
              )}>
                <span className="text-4xl">{icon}</span>
              </div>
            </div>
          )}

          {/* Rating badge */}
          {salon.rating && salon.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-lg">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{salon.rating}</span>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className={cn(
              "bg-gradient-to-r text-white border-0 shadow-lg",
              gradient
            )}>
              {icon} {SalonTypeLabels[salon.type as SalonType]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-violet-600 transition-colors line-clamp-1">
            {salon.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{salon.city}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {salon.description || 'Profesionalne usluge za vas'}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
