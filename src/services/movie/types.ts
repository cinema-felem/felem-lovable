
import { Movie } from "@/components/MovieCard.d";
import { Json } from "./utils";

export interface ImageJson {
  poster_path?: string;
  backdrop_path?: string;
}

export interface RatingsJson {
  tmdb?: number;
  source?: string;
  rating?: number;
  votes?: number;
}

export interface GenreJson {
  id?: number;
  name?: string;
}

export interface StreamingJson {
  providers?: string[] | {[key: string]: any};
}

export interface MovieWithDetails extends Movie {
  tmdbId?: number;
  originalTitle?: string;
  originalLanguage?: string;
  releaseDate?: string;
  allRatings?: {
    source: string;
    rating: number;
    votes?: number;
  }[];
  director?: string;
  cast?: string[];
  runtime?: string;
  overview?: string;
  backdrop?: string;
  parental?: string;
  streamingProviders?: string[];
  originCountry?: string[];
  language?: string;
  format?: string;
  videos?: any[];
  externalIds?: any;
}
