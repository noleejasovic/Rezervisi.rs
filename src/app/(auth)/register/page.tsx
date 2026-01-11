'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Mail, Lock, User, Phone, AlertCircle, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const registerSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
  full_name: z.string().min(2, 'Unesite ime i prezime'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Izaberite tip korisnika' }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: UserRole.CLIENT,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data);
      toast.success('Uspešno ste se registrovali!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Došlo je do greške';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Kreirajte nalog</CardTitle>
        <CardDescription>
          Registrujte se i počnite da rezervišete termine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Tip korisnika</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setValue('role', value as UserRole)}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value={UserRole.CLIENT}
                  id="client"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="client"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <Users className="mb-2 h-6 w-6 text-violet-600 dark:text-violet-400" />
                  <span className="font-medium">Klijent</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Rezervišite termine
                  </span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value={UserRole.PROVIDER}
                  id="provider"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="provider"
                  className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <Building2 className="mb-2 h-6 w-6 text-violet-600 dark:text-violet-400" />
                  <span className="font-medium">Vlasnik salona</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    Registrujte salon
                  </span>
                </Label>
              </div>
            </RadioGroup>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Ime i prezime</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="full_name"
                type="text"
                placeholder="Marko Marković"
                className="pl-10"
                {...register('full_name')}
              />
            </div>
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email adresa</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="vas@email.com"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Broj telefona (opciono)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+381 6X XXX XXXX"
                className="pl-10"
                {...register('phone')}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registracija...
              </>
            ) : (
              'Registruj se'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-center text-sm text-muted-foreground">
          Već imate nalog?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Prijavite se
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
