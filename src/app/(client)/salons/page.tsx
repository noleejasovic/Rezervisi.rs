'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SalonTypeLabels, SalonType, Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Star,
  MapPin,
  Sparkles,
  X,
  Loader2,
  Grid3X3,
  List,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Category icons mapping
const CATEGORY_DATA: Record<string, { icon: string; gradient: string }> = {
  hair_salon: { icon: '💇', gradient: 'from-pink-500 to-rose-500' },
  beauty_salon: { icon: '💄', gradient: 'from-purple-500 to-violet-500' },
  nail_studio: { icon: '💅', gradient: 'from-red-500 to-pink-500' },
  barbershop: { icon: '💈', gradient: 'from-blue-500 to-indigo-500' },
  spa: { icon: '🧖', gradient: 'from-teal-500 to-emerald-500' },
  tattoo_studio: { icon: '🎨', gradient: 'from-slate-600 to-slate-800' },
  massage: { icon: '💆', gradient: 'from-green-500 to-teal-500' },
  other: { icon: '✨', gradient: 'from-violet-500 to-purple-500' },
};

export default function SalonsPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load salons from Supabase
  useEffect(() => {
    const loadSalons = async () => {
      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        console.error('Error loading salons:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSalons();
  }, []);

  // Update type from URL params
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      setSelectedType(typeParam);
    }
  }, [searchParams]);

  // Get unique cities from loaded salons
  const cities = [...new Set(salons.map(s => s.city))].sort();

  // Filter salons
  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (salon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = selectedType === 'all' || salon.type === selectedType;
    const matchesCity = selectedCity === 'all' || salon.city === selectedCity;
    return matchesSearch && matchesType && matchesCity;
  });

  const hasFilters = searchQuery || selectedType !== 'all' || selectedCity !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCity('all');
  };

  // Get category counts
  const categoryCounts = salons.reduce((acc, salon) => {
    acc[salon.type] = (acc[salon.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-background dark:from-violet-950/20 dark:to-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Pronađite savršen salon
            </h1>
            <p className="text-violet-100 text-lg mb-8">
              Pretražite {salons.length}+ salona i rezervišite termin u nekoliko klikova
            </p>

            {/* Search Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Pretraži po imenu salona..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-0 bg-transparent focus-visible:ring-0 text-foreground"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full md:w-[160px] h-12 border-0 bg-muted/50">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Grad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Svi gradovi</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="lg"
                    className="h-12 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    <Search className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">Pretraži</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedType('all')}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                selectedType === 'all'
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                  : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-violet-50 dark:hover:bg-slate-700 border"
              )}
            >
              Sve kategorije
            </button>
            {Object.entries(SalonTypeLabels).map(([value, label]) => {
              const categoryInfo = CATEGORY_DATA[value] || CATEGORY_DATA.other;
              const count = categoryCounts[value] || 0;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                    selectedType === value
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-violet-50 dark:hover:bg-slate-700 border"
                  )}
                >
                  <span>{categoryInfo.icon}</span>
                  <span>{label}</span>
                  {count > 0 && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      selectedType === value
                        ? "bg-white/20"
                        : "bg-muted"
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-muted-foreground">
              {isLoading ? (
                'Učitavanje...'
              ) : (
                <>
                  Pronađeno <span className="font-semibold text-foreground">{filteredSalons.length}</span> salona
                  {selectedType !== 'all' && (
                    <span> u kategoriji <span className="font-semibold text-foreground">{SalonTypeLabels[selectedType as SalonType]}</span></span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Obriši filtere
              </Button>
            )}
            <div className="flex items-center border rounded-lg p-1 bg-muted/30">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'grid' ? "bg-white dark:bg-slate-800 shadow-sm" : "hover:bg-white/50"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'list' ? "bg-white dark:bg-slate-800 shadow-sm" : "hover:bg-white/50"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
              </div>
              <p className="text-muted-foreground">Učitavanje salona...</p>
            </div>
          </div>
        ) : filteredSalons.length > 0 ? (
          /* Salon Grid/List */
          <div className={cn(
            viewMode === 'grid'
              ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}>
            {filteredSalons.map((salon) => {
              const categoryInfo = CATEGORY_DATA[salon.type] || CATEGORY_DATA.other;

              if (viewMode === 'list') {
                return (
                  <Link key={salon.id} href={`/salons/${salon.id}`}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg transition-all p-4 flex gap-4 group">
                      {/* Image */}
                      <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50">
                        {salon.image_url ? (
                          <img
                            src={salon.image_url}
                            alt={salon.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-4xl">{categoryInfo.icon}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg group-hover:text-violet-600 transition-colors truncate">
                              {salon.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {salon.address}, {salon.city}
                            </p>
                          </div>
                          {salon.rating && salon.rating > 0 && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {salon.rating}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {salon.description || 'Profesionalne usluge za vas'}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">
                            {categoryInfo.icon} {SalonTypeLabels[salon.type as SalonType]}
                          </Badge>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                );
              }

              return (
                <Link key={salon.id} href={`/salons/${salon.id}`}>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl border hover:border-violet-300 dark:hover:border-violet-700 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 h-full">
                    {/* Image */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50">
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
                            categoryInfo.gradient
                          )}>
                            <span className="text-4xl">{categoryInfo.icon}</span>
                          </div>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {salon.rating && salon.rating > 0 && (
                        <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-sm font-semibold">{salon.rating}</span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge className={cn(
                          "bg-gradient-to-r text-white border-0 shadow-lg",
                          categoryInfo.gradient
                        )}>
                          {categoryInfo.icon} {SalonTypeLabels[salon.type as SalonType]}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-violet-600 transition-colors line-clamp-1">
                        {salon.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{salon.city}</span>
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {salon.description || 'Profesionalne usluge za vas'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-10 w-10 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nema rezultata</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {salons.length === 0
                ? 'Trenutno nema registrovanih salona. Budite prvi koji će registrovati svoj salon!'
                : 'Nismo pronašli salone koji odgovaraju vašoj pretrazi. Pokušajte sa drugim filterima.'}
            </p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="rounded-full">
                <X className="h-4 w-4 mr-2" />
                Obriši filtere
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
