'use client';

import Link from 'next/link';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VerifiedPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Rezervisi
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-background to-fuchsia-50 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="pt-10 pb-8 px-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-3">
              Email je verifikovan!
            </h1>

            {/* Description */}
            <p className="text-muted-foreground mb-8">
              Hvala vam! Vaš nalog je uspešno aktiviran. Sada možete da se prijavite i počnete sa korišćenjem platforme.
            </p>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl h-12"
            >
              <Link href="/login">
                Prijavite se
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Secondary Link */}
            <p className="mt-6 text-sm text-muted-foreground">
              Ili se vratite na{' '}
              <Link href="/" className="text-violet-600 hover:underline font-medium">
                početnu stranicu
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
