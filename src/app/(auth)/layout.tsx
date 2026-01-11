import Link from 'next/link';
import { Scissors } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Scissors className="h-6 w-6 text-primary" />
            <span>Rezerviši</span>
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-background to-fuchsia-50 dark:from-violet-950/20 dark:via-background dark:to-fuchsia-950/20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
