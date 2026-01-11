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
  Scissors,
  Sparkles,
  Palette,
  Heart,
  Search,
  Calendar,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  ArrowRight,
  Users,
  Play,
  Smartphone,
  Shield,
  Zap,
  Quote
} from 'lucide-react';

// Kategorije
const categories = [
  { type: 'hair_salon', label: 'Frizerski saloni', icon: Scissors, color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
  { type: 'nail_salon', label: 'Nail saloni', icon: Sparkles, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' },
  { type: 'beauty_salon', label: 'Beauty saloni', icon: Heart, color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
  { type: 'tattoo_studio', label: 'Tattoo studiji', icon: Palette, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  { type: 'spa_center', label: 'Spa centri', icon: Sparkles, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' },
];

// Gradovi
const cities = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica'];

// Reviews
const reviews = [
  {
    text: 'Najbolji sistem za rezervacije! Lako pronađem salon i zakažem termin za par sekundi.',
    author: 'Marija S.',
    location: 'Beograd',
    rating: 5
  },
  {
    text: 'Konačno mogu da vidim sve salone na jednom mestu. Preporučujem svima!',
    author: 'Petar M.',
    location: 'Novi Sad',
    rating: 5
  },
  {
    text: 'Super aplikacija! Moj frizer sad ima online rezervacije i sve je mnogo lakše.',
    author: 'Ana K.',
    location: 'Niš',
    rating: 5
  }
];

// Features za biznis
const businessFeatures = [
  { icon: Calendar, title: 'Online rezervacije', desc: 'Primajte rezervacije 24/7' },
  { icon: Users, title: 'Upravljanje klijentima', desc: 'Pratite istoriju poseta' },
  { icon: Zap, title: 'Brz setup', desc: 'Počnite za 5 minuta' },
  { icon: Shield, title: 'Besplatno', desc: 'Bez skrivenih troškova' },
];

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [recommendedSalons, setRecommendedSalons] = useState<Salon[]>([]);
  const [newSalons, setNewSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalons = async () => {
      try {
        // Učitaj preporučene (sa najboljom ocenom)
        const { data: recommended } = await supabase
          .from('salons')
          .select('*')
          .eq('is_active', true)
          .order('rating', { ascending: false })
          .limit(4);

        // Učitaj nove salone
        const { data: newest } = await supabase
          .from('salons')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4);

        setRecommendedSalons(recommended || []);
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
    if (selectedCity) params.set('city', selectedCity);
    router.push(`/salons?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Clean & Simple */}
        <section className="relative pt-8 pb-16 md:pt-16 md:pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Rezervišite lokalne{' '}
                <span className="text-violet-600 dark:text-violet-400">
                  beauty usluge
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Pronađite top-ocenjene salone, brijačnice, spa centre i beauty studije.
                Pouzdani od strane hiljada korisnika.
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-xl border-0 bg-background">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Pretraži tretmane ili salone..."
                        className="pl-10 h-12 text-base"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="h-12 flex-1">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Izaberite grad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Svi gradovi</SelectItem>
                          {cities.map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="lg"
                        className="h-12 px-8 bg-violet-600 hover:bg-violet-700"
                        onClick={handleSearch}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        Pretraži
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats below search */}
              <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <strong className="text-foreground">10,000+</strong> rezervacija
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <strong className="text-foreground">4.8</strong> prosečna ocena
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Categories - Horizontal Scroll */}
        <section className="py-8 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <Link key={cat.type} href={`/salons?type=${cat.type}`}>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 whitespace-nowrap h-11 px-5 rounded-full hover:border-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                  >
                    <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center`}>
                      <cat.icon className="h-4 w-4" />
                    </div>
                    {cat.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended Salons */}
        {recommendedSalons.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Preporučeno</h2>
                  <p className="text-muted-foreground">Najbolje ocenjeni saloni</p>
                </div>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/salons">
                    Vidi sve
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New to Platform */}
        {newSalons.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">Novi na Rezerviši</h2>
                  <p className="text-muted-foreground">Nedavno pridruženi saloni</p>
                </div>
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/salons">
                    Vidi sve
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} badge="Novo" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How it Works - Simple */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Kako funkcioniše</h2>
              <p className="text-muted-foreground">Tri jednostavna koraka do vašeg termina</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Search className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Pronađite</h3>
                <p className="text-muted-foreground text-sm">
                  Pretražite salone po lokaciji, usluzi ili oceni
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Calendar className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Rezervišite</h3>
                <p className="text-muted-foreground text-sm">
                  Izaberite uslugu, datum i vreme koje vam odgovara
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Uživajte</h3>
                <p className="text-muted-foreground text-sm">
                  Dođite na termin i prepustite se profesionalcima
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Šta kažu korisnici</h2>
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2">4.9 prosečna ocena</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {reviews.map((review, i) => (
                <Card key={i} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{review.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                        <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                          {review.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For Business */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <Badge className="mb-4 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0">
                  Za biznis
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Unapredite vaš salon sa Rezerviši
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Pridružite se stotinama salona koji koriste našu platformu za upravljanje
                  rezervacijama. Besplatno, jednostavno i efikasno.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {businessFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button size="lg" className="bg-violet-600 hover:bg-violet-700" asChild>
                  <Link href="/register">
                    Registrujte vaš salon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Illustration/Preview */}
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 rounded-3xl p-8 flex items-center justify-center">
                  <Card className="w-full max-w-xs shadow-2xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center">
                          <Scissors className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Studio Lepote</h4>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-muted-foreground">4.9 (120)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm py-2 border-b">
                          <span>Žensko šišanje</span>
                          <span className="font-medium">1.500 RSD</span>
                        </div>
                        <div className="flex justify-between text-sm py-2 border-b">
                          <span>Farbanje</span>
                          <span className="font-medium">3.000 RSD</span>
                        </div>
                        <div className="flex justify-between text-sm py-2">
                          <span>Feniranje</span>
                          <span className="font-medium">800 RSD</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-violet-600">
                        Rezerviši
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-background shadow-lg rounded-xl p-3 hidden lg:block">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Nova rezervacija</p>
                      <p className="text-xs text-muted-foreground">upravo sada</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 bg-violet-600 dark:bg-violet-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Spremni da rezervišete?
            </h2>
            <p className="text-lg text-violet-100 mb-8 max-w-xl mx-auto">
              Pronađite savršen salon i zakažite termin u par klikova.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-violet-700 hover:bg-violet-50" asChild>
                <Link href="/salons">
                  <Search className="mr-2 h-4 w-4" />
                  Pronađi salon
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link href="/register">
                  Registruj se
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
function SalonCard({ salon, badge }: { salon: Salon; badge?: string }) {
  return (
    <Link href={`/salons/${salon.id}`}>
      <Card className="group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
        {/* Image */}
        <div className="aspect-[4/3] relative bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30">
          {salon.image_url ? (
            <img
              src={salon.image_url}
              alt={salon.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Scissors className="h-12 w-12 text-violet-300 dark:text-violet-600" />
            </div>
          )}

          {/* Rating badge */}
          {salon.rating && salon.rating > 0 && (
            <div className="absolute top-3 left-3 bg-white dark:bg-gray-900 rounded-full px-2 py-1 flex items-center gap-1 shadow">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{salon.rating}</span>
            </div>
          )}

          {/* New badge */}
          {badge && (
            <Badge className="absolute top-3 right-3 bg-violet-600 border-0">
              {badge}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 group-hover:text-violet-600 transition-colors line-clamp-1">
            {salon.name}
          </h3>
          <p className="text-sm text-violet-600 dark:text-violet-400 mb-2">
            {SalonTypeLabels[salon.type as SalonType]}
          </p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{salon.city}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
