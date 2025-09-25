
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Security() {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is a placeholder for your Security page.</p>
          <p>
            You should replace this content with details about your security
            measures.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Go back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

    