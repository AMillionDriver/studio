
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is a placeholder for your About Us page.</p>
          <p>You should replace this content with information about your company or project.</p>
          <Link href="/" className="text-primary hover:underline">
            Go back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

    