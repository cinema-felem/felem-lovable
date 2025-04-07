
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard";
import { Database } from "@/integrations/supabase/types";

// Define TypeScript types for our database tables
type TmdbRow = Database['public']['Tables']['tmdb']['Row'];

export async function fetchPopularMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .order('ratings->tmdb', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }

  return transformTmdbToMovies(data || []);
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .order('ratings->tmdb', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }

  return transformTmdbToMovies(data || []);
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .limit(10);

  if (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }

  return transformTmdbToMovies(data || []);
}

export async function fetchMovieById(id: number) {
  const { data, error } = await supabase
    .from('tmdb')
    .select('*, external_ids, streaming')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching movie by ID:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    posterPath: data.image?.poster_path ? `https://image.tmdb.org/t/p/w500${data.image.poster_path}` : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: data.release_date ? new Date(data.release_date).getFullYear().toString() : "",
    rating: data.ratings?.tmdb || 0,
    genres: data.genres ? data.genres.map((genre: any) => genre.name) : [],
    director: "Director information not available",
    cast: ["Cast information not available"],
    runtime: data.runtime ? `${data.runtime} min` : "Unknown",
    overview: data.overview || "No overview available",
    backdrop: data.image?.backdrop_path ? `https://image.tmdb.org/t/p/original${data.image.backdrop_path}` : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
  };
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .ilike('title', `%${query}%`)
    .limit(20);

  if (error) {
    console.error('Error searching movies:', error);
    return [];
  }

  return transformTmdbToMovies(data || []);
}

// Helper function to transform tmdb data to Movie format
function transformTmdbToMovies(tmdbMovies: TmdbRow[]): Movie[] {
  return tmdbMovies.map(movie => ({
    id: movie.id,
    title: movie.title,
    posterPath: movie.image?.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.image.poster_path}` 
      : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : "",
    rating: movie.ratings?.tmdb || 0,
    genres: movie.genres ? movie.genres.map((genre: any) => genre.name) : [],
  }));
}

// Featured movie for hero section
export async function fetchFeaturedMovie() {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, overview')
    .order('ratings->tmdb', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching featured movie:', error);
    return {
      id: 1,
      title: "The Godfather",
      backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
    };
  }

  return {
    id: data.id,
    title: data.title,
    backdrop: data.image?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${data.image.backdrop_path}` 
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    description: data.overview || "No description available"
  };
}
