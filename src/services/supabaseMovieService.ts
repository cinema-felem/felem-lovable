
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard";
import { Database } from "@/integrations/supabase/types";

// Define TypeScript types for our database tables
type TmdbRow = Database['public']['Tables']['tmdb']['Row'];
type Json = Database['public']['Tables']['tmdb']['Row']['image'];

// Define more specific types for our JSON objects
interface ImageJson {
  poster_path?: string;
  backdrop_path?: string;
}

interface RatingsJson {
  tmdb?: number;
}

interface GenreJson {
  id?: number;
  name?: string;
}

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

  const image = data.image as ImageJson | null;
  const ratings = data.ratings as RatingsJson | null;
  const genres = data.genres as GenreJson[] | null;

  return {
    id: data.id,
    title: data.title,
    posterPath: image?.poster_path ? `https://image.tmdb.org/t/p/w500${image.poster_path}` : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: data.release_date ? new Date(data.release_date).getFullYear().toString() : "",
    rating: ratings?.tmdb || 0,
    genres: genres ? genres.map((genre) => genre.name || '') : [],
    director: "Director information not available",
    cast: ["Cast information not available"],
    runtime: data.runtime ? `${data.runtime} min` : "Unknown",
    overview: data.overview || "No overview available",
    backdrop: image?.backdrop_path ? `https://image.tmdb.org/t/p/original${image.backdrop_path}` : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
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
function transformTmdbToMovies(tmdbMovies: any[]): Movie[] {
  return tmdbMovies.map(movie => {
    const image = movie.image as ImageJson | null;
    const ratings = movie.ratings as RatingsJson | null; 
    const genres = movie.genres as GenreJson[] | null;
    
    return {
      id: movie.id,
      title: movie.title,
      posterPath: image?.poster_path 
        ? `https://image.tmdb.org/t/p/w500${image.poster_path}` 
        : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : "",
      rating: ratings?.tmdb || 0,
      genres: genres ? genres.map((genre) => genre.name || '') : [],
    };
  });
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

  const image = data.image as ImageJson | null;

  return {
    id: data.id,
    title: data.title,
    backdrop: image?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${image.backdrop_path}` 
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    description: data.overview || "No description available"
  };
}
