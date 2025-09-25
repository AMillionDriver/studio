
import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ReactNode } from "react";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin-sdk";
import { cookies } from "next/headers";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function checkAdminStatus(): Promise<boolean> {
    try {
        const sessionCookie = cookies().get("__session")?.value;

        // 1. If there's no cookie, the user is definitely not an admin.
        if (!sessionCookie) {
            console.log("Admin check: No session cookie found.");
            return false;
        }

        const adminApp = getAdminApp();
        
        // 2. Verify the session cookie. The second parameter (true) checks if the session has been revoked.
        const decodedClaims = await getAuth(adminApp).verifySessionCookie(
            sessionCookie, 
            true
        );
        
        // 3. (CRITICAL STEP) Explicitly check if the 'admin' claim is true.
        // This is the main fix.
        const isAdmin = decodedClaims.admin === true;

        if (!isAdmin) {
            console.log("Admin check: Cookie is valid, but 'admin' claim is not true.", decodedClaims);
        }

        return isAdmin;

    } catch (error: any) {
        // 4. Safely catch all possible errors (invalid cookie, expired, etc.)
        // and return false.
        console.error("Admin status check failed with error:", error.code);
        return false;
    }
}


export default async function AdminPanelLayout({
    children,
}: {
    children: ReactNode;
}) {

    const isAdmin = await checkAdminStatus();

    if (!isAdmin) {
        return (
            <div className="container mx-auto py-20 px-4 md:px-6 flex items-center justify-center">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
                            <ShieldAlert className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="mt-4 text-2xl">Access Denied</CardTitle>
                        <CardDescription>
                            You do not have the necessary permissions to view this page. Please contact an administrator if you believe this is an error.
                        </CardDescription>
                    </CardHeader>
                    <div className="p-6 pt-0">
                         <Button asChild>
                            <Link href="/">Return to Homepage</Link>
                         </Button>
                    </div>
                </Card>
            </div>
        )
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
