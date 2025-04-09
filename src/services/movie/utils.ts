
import { Movie } from "@/components/MovieCard.d";
import { calculateMedianRating } from "@/utils/ratingUtils";

// Generic Json type to match what Supabase returns
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface TmdbMovie {
  id: number;
  title: string;
  image?: Json | null;
  release_date?: string;
  ratings?: Json | null;
  genres?: Json | null;
}

export function transformTmdbToMovies(tmdbMovies: TmdbMovie[]): Movie[] {
  return tmdbMovies.map(movie => {
    // Safely cast the JSON fields to their expected types
    const image = movie.image as {poster_path?: string} | null;
    const ratings = movie.ratings as {source?: string, rating?: number, votes?: number}[] | null; 
    const genres = movie.genres as {id?: number, name?: string}[] | null;
    
    const allRatingValues = ratings ? ratings.map(r => r.rating || 0).filter(r => r > 0) : [];
    const medianRating = calculateMedianRating(allRatingValues);
    
    return {
      id: movie.id.toString(),
      title: movie.title,
      tmdbTitle: movie.title,
      posterPath: image?.poster_path 
        ? `https://image.tmdb.org/t/p/w500${image.poster_path}` 
        : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : "",
      rating: medianRating,
      genres: genres ? genres.map((genre) => genre.name || '') : [],
    };
  });
}
