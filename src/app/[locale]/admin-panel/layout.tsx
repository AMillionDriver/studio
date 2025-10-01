
import { ReactNode } from "react";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminPanelLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <SidebarProvider>
            <Sidebar>
                <AdminSidebar />
            </Sidebar>
            <SidebarInset>
                <div className="p-4 md:p-6 lg:p-8">
                  {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
