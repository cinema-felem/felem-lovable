
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard.d";
import { transformTmdbToMovies, TmdbMovie } from "./utils";

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

  return transformTmdbToMovies(data as TmdbMovie[] || []);
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .order('ratings->tmdb', { ascending: false });

  if (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }

  return transformTmdbToMovies(data as TmdbMovie[] || []);
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres');

  if (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }

  return transformTmdbToMovies(data as TmdbMovie[] || []);
}
