
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
            <p className="text-muted-foreground">
                Configure platform-wide settings and preferences.
            </p>
        </div>

         <Card>
            <CardHeader>
                <CardTitle>Feature Under Construction</CardTitle>
                <CardDescription>
                    This settings page is not yet implemented. In the future, you will be able to manage site configurations, API keys, and other administrative options here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button disabled>Save Changes</Button>
            </CardContent>
         </Card>
    </div>
  );
}
