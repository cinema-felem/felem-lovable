
import { Award, Star } from "lucide-react";
import { calculateMedianRating } from "@/utils/ratingUtils";

interface RatingSource {
  source: string;
  rating: number;
  votes?: number;
}

interface MovieRatingsProps {
  allRatings?: RatingSource[];
}

const MovieRatings = ({ allRatings }: MovieRatingsProps) => {
  if (!allRatings || allRatings.length === 0) return null;
  
  // Calculate median for the display title
  const ratingValues = allRatings.map(rating => rating.rating);
  const medianRating = calculateMedianRating(ratingValues);
  
  return (
    <div className="mb-6 animate-slide-up">
      <h3 className="text-white font-semibold mb-2 flex items-center">
        <Award className="w-4 h-4 mr-2 text-cinema-gold" />
        Ratings (Combined: {medianRating.toFixed(1)})
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {allRatings.map((ratingItem: RatingSource, index: number) => (
          <div key={index} className="bg-cinema-dark-gray/30 p-3 rounded flex items-center justify-between">
            <span className="text-gray-300">{ratingItem.source}</span>
            <div className="flex items-center">
              <span className="text-white font-medium mr-1">
                {ratingItem.rating.toFixed(1)}
              </span>
              <Star className="w-4 h-4 text-cinema-gold fill-cinema-gold" />
              {ratingItem.votes && (
                <span className="ml-1 text-xs text-gray-400">({ratingItem.votes})</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieRatings;
