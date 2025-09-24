import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Logo } from './logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/use-auth';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/genre', label: 'Genre' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/riwayat', label: 'Riwayat' },
  { href: '/bookmark', label: 'Bookmark' },
];

export default function Header() {
  const { user, loading } = useAuth();

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
              <div className="p-4">
                <Logo />
              </div>
              <nav className="flex flex-col space-y-2 p-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="md:hidden">
             <Logo />
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-2 md:flex">
           {navLinks.map((link) => (
            <Button key={link.href} asChild variant="link" className="text-muted-foreground hover:text-foreground">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
           <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <Input placeholder="Search for anime..." />
                <Button type="submit">Search</Button>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
          {loading ? null : user ? (
            <UserNav />
          ) : (
            <>
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
