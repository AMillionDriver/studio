
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAnimes } from "@/lib/data";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin-sdk";
import { Users, Clapperboard, Eye, BarChart } from "lucide-react";

async function getAnalyticsData() {
    try {
        const animes = await getAnimes();
        const animeCount = animes.length;
        
        const adminApp = getAdminApp();
        const auth = getAuth(adminApp);
        const userRecords = await auth.listUsers();
        const userCount = userRecords.users.length;

        // Placeholder data for metrics not yet implemented
        const totalViews = 0;
        const activeNow = 0;

        return { animeCount, userCount, totalViews, activeNow, error: null };
    } catch (error: any) {
        console.error("Failed to fetch analytics data:", error);
        return { 
            animeCount: 0, 
            userCount: 0, 
            totalViews: 0,
            activeNow: 0,
            error: "Failed to load analytics data. Please check server logs." 
        };
    }
}


export default async function AnalyticsPage() {
    const { animeCount, userCount, totalViews, activeNow, error } = await getAnalyticsData();

    return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
                An overview of your platform's performance and user engagement.
            </p>
        </div>

        {error && (
             <Card className="bg-destructive/10 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Error Loading Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive-foreground">{error}</p>
                </CardContent>
            </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalViews}</div>
                    <p className="text-xs text-muted-foreground">View tracking not yet implemented.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userCount}</div>
                     <p className="text-xs text-muted-foreground">Total registered users.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Anime</CardTitle>
                    <Clapperboard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{animeCount}</div>
                     <p className="text-xs text-muted-foreground">Total anime series in the database.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeNow}</div>
                     <p className="text-xs text-muted-foreground">Real-time tracking not yet implemented.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
