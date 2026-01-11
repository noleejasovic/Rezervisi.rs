'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Service, Salon } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Clock, Store, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface ServiceFormData {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
}

const initialFormData: ServiceFormData = {
  name: '',
  description: '',
  duration_minutes: 30,
  price: 0,
};

export default function ServicesPage() {
  const { supabaseUser, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [salon, setSalon] = useState<Salon | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ServiceFormData>>({});

  // Ucitaj salon i usluge
  useEffect(() => {
    const loadData = async () => {
      if (!supabaseUser) {
        setIsLoading(false);
        return;
      }

      try {
        // Prvo ucitaj salon
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('*')
          .eq('provider_id', supabaseUser.id)
          .single();

        if (salonError || !salonData) {
          setSalon(null);
          setIsLoading(false);
          return;
        }

        setSalon(salonData);

        // Zatim ucitaj usluge za taj salon
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('salon_id', salonData.id)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices(servicesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Greška pri učitavanju podataka');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabaseUser]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ServiceFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naziv usluge je obavezan' as any;
    }
    if (formData.duration_minutes < 5) {
      newErrors.duration_minutes = 'Minimalno trajanje je 5 minuta' as any;
    }
    if (formData.price < 0) {
      newErrors.price = 'Cena ne može biti negativna' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        duration_minutes: service.duration_minutes,
        price: service.price,
      });
    } else {
      setEditingService(null);
      setFormData(initialFormData);
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingService(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validateForm() || !salon) return;

    setIsSaving(true);

    try {
      if (editingService) {
        // Azuriraj postojecu uslugu
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description || null,
            duration_minutes: formData.duration_minutes,
            price: formData.price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingService.id);

        if (error) throw error;

        setServices(services.map(s =>
          s.id === editingService.id
            ? { ...s, ...formData, updated_at: new Date().toISOString() }
            : s
        ));
        toast.success('Usluga je uspešno ažurirana');
      } else {
        // Kreiraj novu uslugu
        const { data, error } = await supabase
          .from('services')
          .insert([{
            salon_id: salon.id,
            name: formData.name,
            description: formData.description || null,
            duration_minutes: formData.duration_minutes,
            price: formData.price,
            currency: 'RSD',
            is_active: true,
          }])
          .select()
          .single();

        if (error) throw error;

        setServices([data, ...services]);
        toast.success('Usluga je uspešno kreirana');
      }

      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error.message || 'Greška pri čuvanju usluge');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          is_active: !service.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', service.id);

      if (error) throw error;

      setServices(services.map(s =>
        s.id === service.id
          ? { ...s, is_active: !s.is_active }
          : s
      ));

      toast.success(service.is_active ? 'Usluga je deaktivirana' : 'Usluga je aktivirana');
    } catch (error: any) {
      console.error('Error toggling service:', error);
      toast.error('Greška pri promeni statusa');
    }
  };

  const handleDeleteClick = (service: Service) => {
    setDeletingService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingService) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', deletingService.id);

      if (error) throw error;

      setServices(services.filter(s => s.id !== deletingService.id));
      toast.success('Usluga je uspešno obrisana');
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error(error.message || 'Greška pri brisanju usluge');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingService(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // Ako nema salona, prikazi poruku
  if (!salon) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Usluge</h1>
          <p className="text-muted-foreground">
            Upravljajte uslugama vašeg salona
          </p>
        </div>

        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold">Najpre podesite salon</h3>
              <p className="text-sm text-muted-foreground">
                Pre dodavanja usluga, morate kreirati profil vašeg salona
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
              <Link href="/salon-setup">
                <Store className="mr-2 h-4 w-4" />
                Podesi salon
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Usluge</h1>
          <p className="text-muted-foreground">
            Upravljajte uslugama salona "{salon.name}"
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-violet-600 to-purple-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Dodaj uslugu
        </Button>
      </div>

      {/* Services Table/List */}
      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nema usluga</h3>
            <p className="text-muted-foreground text-center mb-4">
              Dodajte prvu uslugu da biste omogućili klijentima da rezervišu termine
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Dodaj prvu uslugu
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista usluga</CardTitle>
            <CardDescription>
              Ukupno {services.length} {services.length === 1 ? 'usluga' : 'usluga'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naziv</TableHead>
                    <TableHead>Trajanje</TableHead>
                    <TableHead>Cena</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Akcije</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          {service.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {service.duration_minutes} min
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(service.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={service.is_active}
                            onCheckedChange={() => handleToggleActive(service)}
                          />
                          <Badge variant={service.is_active ? 'default' : 'secondary'}>
                            {service.is_active ? 'Aktivna' : 'Neaktivna'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(service)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(service)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {services.map((service) => (
                <Card key={service.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        {service.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'Aktivna' : 'Neaktivna'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {service.duration_minutes} min
                      </span>
                      <span className="font-semibold">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={() => handleToggleActive(service)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {service.is_active ? 'Aktivna' : 'Neaktivna'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(service)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Izmeni uslugu' : 'Nova usluga'}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Izmenite detalje usluge'
                : 'Popunite informacije o novoj usluzi'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naziv usluge *</Label>
              <Input
                id="name"
                placeholder="npr. Žensko šišanje"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Opis (opciono)</Label>
              <Textarea
                id="description"
                placeholder="Opišite uslugu..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Trajanje (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  step="5"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value) || 0
                  })}
                />
                {errors.duration_minutes && (
                  <p className="text-sm text-destructive">{errors.duration_minutes}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Cena (RSD) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="100"
                  value={formData.price}
                  onChange={(e) => setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Otkaži
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-violet-600 to-purple-600"
            >
              {isSaving ? 'Čuvanje...' : (editingService ? 'Sačuvaj izmene' : 'Dodaj uslugu')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Da li ste sigurni?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija će trajno obrisati uslugu "{deletingService?.name}".
              Ovu akciju nije moguće poništiti.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
