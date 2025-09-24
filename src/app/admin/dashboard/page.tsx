import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="container py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline mb-8">
        Admin Dashboard
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your admin control panel. From here, you will be able to manage anime content, users, and site settings.
          </p>
          <p className="mt-4">
            More features coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
