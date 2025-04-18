
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
  videos?: {
    type: string;
    key: string;
    site: string;
    name: string;
  }[];
  externalIds?: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    letterboxd_id?: string;
  };
}
