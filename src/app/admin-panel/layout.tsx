
'use client';

import { Clapperboard, Home, Users, BarChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { href: '/admin-panel', label: 'Anime', icon: Clapperboard },
    { href: '/admin-panel/users', label: 'Users', icon: Users },
    { href: '/admin-panel/analytics', label: 'Analytics', icon: BarChart },
    { href: '/admin-panel/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 lg:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Home className="h-6 w-6" />
                            <span>Back to Site</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            {navItems.map(({ href, label, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                                        (pathname === href || (href !== '/admin-panel' && pathname.startsWith(href))) && "bg-muted text-primary"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 lg:h-[60px]">
                   {/* Mobile Nav Trigger could go here */}
                   <div className="flex-1">
                     <h1 className="font-semibold text-lg">Admin Panel</h1>
                   </div>
                </header>
                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Create placeholder pages for new routes
export function AnalyticsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">This page is under construction.</p>
        </div>
    );
}

export function SettingsPage() {
    return (
         <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">This page is under construction.</p>
        </div>
    );
}
