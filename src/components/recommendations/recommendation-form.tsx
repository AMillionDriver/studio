'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { WandSparkles, Loader, ServerCrash, Star } from 'lucide-react';
import { getRecommendations, type RecommendationState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90">
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <WandSparkles className="mr-2 h-4 w-4" />
          Get Recommendations
        </>
      )}
    </Button>
  );
}

type RecommendationFormProps = {
  initialState: RecommendationState;
}

export function RecommendationForm({ initialState }: RecommendationFormProps) {
  const [state, formAction] = useActionState(getRecommendations, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error' && state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Find Your Next Favorite Anime</CardTitle>
            <CardDescription>Tell us what you like, and our AI will suggest something new for you to watch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="viewingHistory" className="text-sm font-medium">What have you watched?</label>
              <Textarea
                id="viewingHistory"
                name="viewingHistory"
                placeholder="e.g., Death Note, Steins;Gate, Jujutsu Kaisen"
                defaultValue={initialState.form.viewingHistory}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="preferredGenres" className="text-sm font-medium">What are your favorite genres?</label>
              <Textarea
                id="preferredGenres"
                name="preferredGenres"
                placeholder="e.g., Fantasy, Mystery, Slice of Life"
                defaultValue={initialState.form.preferredGenres}
                 rows={2}
              />
               <p className="text-xs text-muted-foreground">
                Available genres: {initialState.genres?.join(', ')}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      
      {state.status === 'success' && state.recommendations && (
        <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-center font-headline">Your AI Recommendations</h3>
             <Card>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {state.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-4 p-4 rounded-md bg-card-foreground/5">
                            <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                            <span className="text-lg font-medium text-foreground">{rec}</span>
                        </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      )}

      {state.status === 'error' && !state.recommendations && (
        <Alert variant="destructive" className="mt-8">
            <ServerCrash className="h-4 w-4" />
            <AlertTitle>Something went wrong!</AlertTitle>
            <AlertDescription>
                We couldn't generate recommendations at this time. Please try again.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
