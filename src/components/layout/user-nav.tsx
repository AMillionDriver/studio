
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, User as UserIcon, Settings, Shield, FileText, Lock, Info, Gavel } from "lucide-react";
import Link from "next/link";
import { AdminBadge } from "./admin-badge";
import { Separator } from "../ui/separator";

export function UserNav() {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (name: string | null | undefined) => {
    if (user?.isAnonymous) return "G";
    if (!name) return "U";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  }

  const generalLinks = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/dmca", label: "DMCA", icon: Gavel },
    { href: "/eula", label: "EULA", icon: FileText },
    { href: "/policy", label: "Privacy Policy", icon: Shield },
    { href: "/security", label: "Security", icon: Lock },
    { href: "/about", label: "About Us", icon: Info },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] flex flex-col p-0">
        <SheetHeader className="p-6 pb-4">
            <SheetTitle className="font-normal text-left">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold leading-none">{user.isAnonymous ? "Guest User" : user.displayName || "User"}</p>
                    {user.isAdmin && <AdminBadge />}
                </div>
                <p className="text-sm leading-none text-muted-foreground">
                  {user.isAnonymous ? "You are browsing anonymously" : user.email}
                </p>
              </div>
            </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
            <nav className="flex flex-col gap-2">
                <SheetClose asChild>
                    <Link href="/profile" className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium hover:bg-accent">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <span>Profile</span>
                    </Link>
                </SheetClose>

                <Separator className="my-2" />
                
                {generalLinks.map(link => (
                    <SheetClose asChild key={link.href}>
                         <Link href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                            <link.icon className="h-5 w-5" />
                            <span>{link.label}</span>
                        </Link>
                    </SheetClose>
                ))}
            </nav>
        </div>

        <SheetFooter className="p-6 pt-4 mt-auto border-t">
          <Button onClick={signOut} variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    