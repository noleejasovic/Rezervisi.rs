'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { SalonType, SalonTypeLabels } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Store,
  MapPin,
  ImagePlus,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Building2,
  FileText,
  Upload,
  X,
  Scissors,
  Sparkles,
  Palette,
  Heart,
  Gem,
  Waves,
} from 'lucide-react';
import { toast } from 'sonner';

// Ikone za tipove salona
const salonTypeIcons: Record<SalonType, React.ElementType> = {
  [SalonType.HAIR_SALON]: Scissors,
  [SalonType.NAIL_SALON]: Sparkles,
  [SalonType.TATTOO_STUDIO]: Palette,
  [SalonType.BARBERSHOP]: Scissors,
  [SalonType.BEAUTY_SALON]: Heart,
  [SalonType.SPA]: Waves,
};

// Koraci
const steps = [
  { id: 1, title: 'Osnovne informacije', icon: Store, description: 'Naziv i tip salona' },
  { id: 2, title: 'Kontakt', icon: MapPin, description: 'Adresa i kontakt podaci' },
  { id: 3, title: 'Slika', icon: ImagePlus, description: 'Fotografija salona' },
  { id: 4, title: 'Potvrda', icon: CheckCircle, description: 'Pregled i završetak' },
];

// Gradovi u Srbiji
const cities = [
  'Beograd',
  'Novi Sad',
  'Niš',
  'Kragujevac',
  'Subotica',
  'Zrenjanin',
  'Pančevo',
  'Čačak',
  'Novi Pazar',
  'Kraljevo',
  'Smederevo',
  'Leskovac',
  'Užice',
  'Vranje',
  'Valjevo',
  'Šabac',
  'Sombor',
  'Požarevac',
  'Pirot',
  'Zaječar',
];

interface SalonFormData {
  name: string;
  type: SalonType | '';
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  image_url: string;
}

export default function SalonSetupPage() {
  const router = useRouter();
  const { user, supabaseUser } = useAuth();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [existingSalon, setExistingSalon] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<SalonFormData>({
    name: '',
    type: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: user?.email || '',
    image_url: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SalonFormData, string>>>({});

  // Učitaj postojeći salon ako postoji
  useEffect(() => {
    const loadExistingSalon = async () => {
      if (!supabaseUser) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('salons')
          .select('*')
          .eq('provider_id', supabaseUser.id)
          .single();

        if (data && !error) {
          setExistingSalon(data);
          setFormData({
            name: data.name || '',
            type: data.type || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            phone: data.phone || '',
            email: data.email || '',
            image_url: data.image_url || '',
          });
          if (data.image_url) {
            setImagePreview(data.image_url);
          }
        }
      } catch (err) {
        console.error('Error loading salon:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingSalon();
  }, [supabaseUser]);

  const updateFormData = (field: keyof SalonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof SalonFormData, string>> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Naziv salona je obavezan';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Naziv mora imati najmanje 3 karaktera';
      }
      if (!formData.type) {
        newErrors.type = 'Izaberite tip salona';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Opis salona je obavezan';
      } else if (formData.description.length < 20) {
        newErrors.description = 'Opis mora imati najmanje 20 karaktera';
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Adresa je obavezna';
      }
      if (!formData.city) {
        newErrors.city = 'Izaberite grad';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Broj telefona je obavezan';
      } else if (!/^[\d\s+()-]{9,}$/.test(formData.phone)) {
        newErrors.phone = 'Unesite validan broj telefona';
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Unesite validnu email adresu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Molimo izaberite sliku');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Slika mora biti manja od 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // For now, we'll store the preview URL
        // Later this will be replaced with Supabase Storage upload
        updateFormData('image_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    updateFormData('image_url', '');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    if (!supabaseUser) {
      toast.error('Morate biti prijavljeni');
      return;
    }

    setIsSubmitting(true);

    try {
      const salonData = {
        provider_id: supabaseUser.id,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email || null,
        image_url: formData.image_url || null,
        is_active: true,
      };

      if (existingSalon) {
        // Ažuriraj postojeći salon
        const { error } = await supabase
          .from('salons')
          .update(salonData)
          .eq('id', existingSalon.id);

        if (error) throw error;
        toast.success('Salon je uspešno ažuriran!');
      } else {
        // Kreiraj novi salon
        const { error } = await supabase
          .from('salons')
          .insert([salonData]);

        if (error) throw error;
        toast.success('Salon je uspešno kreiran!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error saving salon:', error);
      toast.error(error.message || 'Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / 4) * 100;

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {existingSalon ? 'Uredite svoj salon' : 'Kreirajte svoj salon'}
        </h1>
        <p className="text-muted-foreground">
          {existingSalon
            ? 'Ažurirajte informacije o vašem salonu'
            : 'Popunite informacije o vašem salonu i počnite da primate rezervacije'}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                step.id === currentStep
                  ? 'text-primary'
                  : step.id < currentStep
                  ? 'text-primary/60'
                  : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id < currentStep
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <StepIcon className="h-5 w-5 text-primary" />
                </div>
              );
            })()}
            <div>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Naziv salona *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="npr. Beauty Studio Ana"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Tip salona *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(SalonTypeLabels).map(([value, label]) => {
                    const Icon = salonTypeIcons[value as SalonType];
                    const isSelected = formData.type === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateFormData('type', value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <Icon
                          className={`h-6 w-6 mb-2 ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                          {label}
                        </p>
                      </button>
                    );
                  })}
                </div>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Opis salona *</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="description"
                    placeholder="Opišite vaš salon, usluge koje nudite, iskustvo..."
                    className="pl-10 min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.description.length}/500 karaktera (minimum 20)
                </p>
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Adresa *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="npr. Knez Mihailova 15"
                    className="pl-10"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Grad *</Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => updateFormData('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite grad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-sm text-destructive">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Broj telefona *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+381 11 123 4567"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email adresa (opciono)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="salon@email.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Image Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Fotografija salona</Label>
                <p className="text-sm text-muted-foreground">
                  Dodajte fotografiju vašeg salona. Preporučena veličina je 1200x800 piksela.
                </p>
              </div>

              {!imagePreview ? (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Kliknite za upload</span> ili prevucite sliku
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG ili WEBP (max. 5MB)
                    </p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                * Slika nije obavezna, možete je dodati kasnije
              </p>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  Osnovne informacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Naziv:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tip:</span>
                    <Badge variant="secondary">
                      {formData.type && SalonTypeLabels[formData.type as SalonType]}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Opis:</span>
                    <p className="mt-1 text-sm">{formData.description}</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Kontakt informacije
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adresa:</span>
                    <span className="font-medium">{formData.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grad:</span>
                    <span className="font-medium">{formData.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefon:</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                  {formData.email && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {imagePreview && (
                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <ImagePlus className="h-5 w-5 text-primary" />
                    Fotografija
                  </h3>
                  <img
                    src={imagePreview}
                    alt="Salon preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Sve je spremno!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Proverite informacije i kliknite "Kreiraj salon" da završite.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <Separator className="my-6" />
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Nazad
            </Button>

            {currentStep < 4 ? (
              <Button onClick={nextStep} className="gap-2">
                Dalje
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {existingSalon ? 'Ažuriranje...' : 'Kreiranje...'}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    {existingSalon ? 'Sačuvaj izmene' : 'Kreiraj salon'}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
