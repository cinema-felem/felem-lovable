
export interface Movie {
  id: string | number;
  title: string;
  tmdbTitle?: string;
  posterPath: string;
  releaseYear: string;
  rating: number;
  genres?: string[];
  allRatings?: {
    source: string;
    rating: number;
    votes?: number;
  }[];
  letterboxdRating?: number;
}
