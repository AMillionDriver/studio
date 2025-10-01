
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ReactNode } from "react";

export default async function AdminPanelLayout({
    children,
}: {
    children: ReactNode;
}) {
    // Keamanan telah dihapus untuk sementara waktu.
    // Siapa pun sekarang dapat mengakses panel admin.
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
