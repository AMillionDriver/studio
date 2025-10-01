
import { ReactNode } from "react";
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { cookies } from "next/headers";
import { getAdminApp } from "@/lib/firebase/admin-sdk";
import { getAuth } from "firebase-admin/auth";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ADMIN_UID = "Lz56srOfOWPJpiNMbPJJznPPik23";

/**
 * Verifies the user's session cookie and checks if their UID matches the admin UID.
 * This function runs on the server for every request to the admin panel.
 * @returns A promise that resolves to true if the user is the admin, false otherwise.
 */
async function checkIsAdmin(): Promise<boolean> {
  try {
    const sessionCookie = cookies().get("__session")?.value;
    if (!sessionCookie) {
      // No cookie, definitely not an admin.
      return false;
    }

    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Explicitly check if the UID from the token matches the hardcoded admin UID.
    const isAuthorized = decodedClaims.uid === ADMIN_UID;
    
    return isAuthorized;
  } catch (error) {
    // Any error during verification means the user is not authenticated or authorized.
    // This catches invalid cookies, expired cookies, etc.
    console.error("Admin Check: Error verifying session cookie.", error);
    return false;
  }
}

function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
            <Card className="max-w-md text-center bg-destructive/10 border-destructive">
                <CardHeader>
                    <div className="mx-auto bg-destructive/20 rounded-full p-3 w-fit mb-4">
                         <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl text-destructive-foreground">Akses Ditolak</CardTitle>
                    <CardDescription className="text-destructive-foreground/80">
                        Anda tidak memiliki izin untuk mengakses halaman ini. Hanya super admin yang dapat mengakses halaman ini.
                    </CardDescription>
                    <div className="pt-4">
                        <Button asChild>
                            <Link href="/">Kembali ke Beranda</Link>
                        </Button>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}


export default async function AdminPanelLayout({
    children,
}: {
    children: ReactNode;
}) {
    const isAdmin = await checkIsAdmin();

    if (!isAdmin) {
        return <AccessDenied />;
    }

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
