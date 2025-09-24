import { SeedButton } from '@/components/admin/seed-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline mb-8">
        Admin Dashboard
      </h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This is your admin control panel. From here, you will be able to manage anime content, users, and site settings.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Database Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If this is a new setup, click the button below to populate the Firestore database with initial sample data. This only needs to be done once.
            </p>
            <SeedButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
