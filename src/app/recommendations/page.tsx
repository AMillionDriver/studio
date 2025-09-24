import { RecommendationForm } from '@/components/recommendations/recommendation-form';
import { getInitialRecommendationState } from '@/lib/actions';

export default async function RecommendationsPage() {
  const initialState = await getInitialRecommendationState();

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter font-headline">
          AI-Powered Recommendations
        </h1>
        <p className="max-w-xl mt-4 text-muted-foreground">
          Discover new anime tailored just for you. Based on your viewing history and favorite genres, our AI will curate a list of shows you're bound to love.
        </p>
      </div>
      <div className="mt-8 flex justify-center">
        <RecommendationForm initialState={initialState} />
      </div>
    </div>
  );
}
