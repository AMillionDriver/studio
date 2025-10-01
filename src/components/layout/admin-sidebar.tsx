
'use client';

import { 
    SidebarHeader, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ListVideo, LineChart, Users, Settings } from "lucide-react";
import { UserNav } from "./user-nav";
import { useAuth } from "@/hooks/use-auth";

const links = [
    { href: "/admin-panel", label: "Anime Management", icon: ListVideo },
    { href: "/admin-panel/analytics", label: "Analytics", icon: LineChart },
    { href: "/admin-panel/users", label: "User Management", icon: Users },
    { href: "/admin-panel/settings", label: "Platform Settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { user } = useAuth(); // Assuming useAuth provides user info

    return (
        <>
            <SidebarHeader>
                <div className="flex items-center justify-between">
                    <Logo />
                    <SidebarTrigger />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {links.map((link) => (
                        <SidebarMenuItem key={link.href}>
                             <Link href={link.href}>
                                <SidebarMenuButton
                                    isActive={pathname === link.href}
                                    icon={<link.icon />}
                                    tooltip={link.label}
                                >
                                    {link.label}
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                 <Separator className="my-2" />
                 {user && <UserNav />}
            </SidebarFooter>
        </>
    );
}
