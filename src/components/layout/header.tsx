import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Clapperboard } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Logo } from './logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Logo />
              <div className="flex flex-col space-y-2 mt-4">
                {/* Mobile Nav Links Here */}
              </div>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
             <Logo />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:space-x-4">
          {/* Desktop Nav Links Here */}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
