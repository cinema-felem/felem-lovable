
import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard.d";
import { Database } from "@/integrations/supabase/types";
import { calculateMedianRating } from "@/utils/ratingUtils";

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
  source?: string;
  rating?: number;
  votes?: number;
}

interface GenreJson {
  id?: number;
  name?: string;
}

interface StreamingJson {
  providers?: string[];
}

export async function fetchPopularMovies(page = 0, limit = 10, sortBy = 'rating'): Promise<{movies: Movie[], hasMore: boolean}> {
  // First get movie IDs from the Movie table
  const from = page * limit;
  const to = from + limit - 1;
  
  // Fetch movies from either the Movie table or the tmdb table depending on the sort criteria
  let movieData;
  let movieError;
  
  if (sortBy === 'recent') {
    // For 'recent', use release_date from tmdb table
    const { data, error } = await supabase
      .from('tmdb')
      .select('id, title, image, release_date, ratings, genres')
      .order('release_date', { ascending: false })
      .range(from, to + 1);
    
    movieData = data?.map(item => ({
      id: item.id.toString(),
      title: item.title,
      tmdbId: item.id
    }));
    movieError = error;
  } else {
    // For 'rating' or any other sort, get IDs from the Movie table
    const { data, error } = await supabase
      .from('Movie')
      .select('id, title, tmdbId')
      .range(from, to + 1);
    
    movieData = data;
    movieError = error;
  }

  if (movieError || !movieData || movieData.length === 0) {
    console.error('Error fetching movies:', movieError);
    return { movies: [], hasMore: false };
  }

  // Check if we got an extra item (indicating there are more)
  const hasMore = movieData && movieData.length > limit;
  // Remove the extra item if it exists
  const paginatedData = hasMore ? movieData.slice(0, limit) : movieData;
  
  // Extract tmdbIds for fetching additional metadata
  const tmdbIds = paginatedData
    .filter(movie => movie.tmdbId !== null)
    .map(movie => movie.tmdbId as number);
  
  if (tmdbIds.length === 0) {
    // Return basic movie data if no tmdbIds are available
    return { 
      movies: paginatedData.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0, // Default rating
        genres: [],
      })),
      hasMore 
    };
  }
  
  // Fetch metadata from tmdb table
  let tmdbQuery = supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .in('id', tmdbIds);
  
  // Apply additional sorting if needed
  if (sortBy === 'rating') {
    // This will be post-processed after we fetch the data since we need to calculate median ratings
    tmdbQuery = tmdbQuery.order('ratings->tmdb', { ascending: false });
  }
  
  const { data: tmdbData, error: tmdbError } = await tmdbQuery;
  
  if (tmdbError) {
    console.error('Error fetching tmdb metadata:', tmdbError);
    // Return basic movie data if tmdb fetch fails
    return { 
      movies: paginatedData.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0, // Default rating
        genres: [],
      })),
      hasMore 
    };
  }
  
  // Create a mapping of tmdbId to tmdb metadata
  const tmdbMap = new Map();
  tmdbData?.forEach(tmdb => {
    tmdbMap.set(tmdb.id, tmdb);
  });
  
  // Combine Movie and tmdb data
  let movies = paginatedData.map(movie => {
    const tmdb = movie.tmdbId ? tmdbMap.get(movie.tmdbId) : null;
    
    if (!tmdb) {
      return {
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0, // Default rating
        genres: [],
      };
    }
    
    const image = tmdb.image as ImageJson | null;
    const ratings = tmdb.ratings as RatingsJson[] | null;
    const genres = tmdb.genres as GenreJson[] | null;
    
    // Extract all available ratings and calculate median
    const allRatingValues = ratings ? ratings.map(r => r.rating || 0).filter(r => r > 0) : [];
    const medianRating = calculateMedianRating(allRatingValues);
    
    return {
      id: movie.id,
      title: movie.title,
      tmdbTitle: tmdb.title,
      posterPath: image?.poster_path 
        ? `https://image.tmdb.org/t/p/w500${image.poster_path}` 
        : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
      releaseYear: tmdb.release_date ? new Date(tmdb.release_date).getFullYear().toString() : "",
      rating: medianRating,
      genres: genres ? genres.map((genre) => genre.name || '') : [],
    };
  });
  
  // Additional client-side sorting if needed (for median ratings or complex sorts)
  if (sortBy === 'rating') {
    movies = movies.sort((a, b) => b.rating - a.rating);
  }
  
  return { movies, hasMore };
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

  return transformTmdbToMovies(data || []);
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres');

  if (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }

  return transformTmdbToMovies(data || []);
}

export async function fetchMovieById(id: string) {
  // Fetch the movie from the Movie table
  const { data: movieData, error: movieError } = await supabase
    .from('Movie')
    .select('*, tmdbId')
    .eq('id', id)
    .single();

  if (movieError) {
    console.error('Error fetching movie by ID:', movieError);
    return null;
  }

  if (!movieData) return null;
  
  // If there's no tmdbId, return basic movie info
  if (!movieData.tmdbId) {
    return {
      id: movieData.id,
      title: movieData.title,
      posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
      releaseYear: "",
      rating: 5.0,
      genres: [],
      overview: "No overview available",
      backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    };
  }
  
  // Fetch additional metadata from tmdb table
  const { data: tmdbData, error: tmdbError } = await supabase
    .from('tmdb')
    .select('*, external_ids, streaming')
    .eq('id', movieData.tmdbId)
    .single();
  
  if (tmdbError || !tmdbData) {
    console.error('Error fetching tmdb data:', tmdbError);
    // Return basic movie info if tmdb fetch fails
    return {
      id: movieData.id,
      title: movieData.title,
      posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
      releaseYear: "",
      rating: 5.0,
      genres: [],
      overview: "No overview available",
      backdrop: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    };
  }

  const image = tmdbData.image as ImageJson | null;
  const ratings = tmdbData.ratings as RatingsJson[] | null;
  const genres = tmdbData.genres as GenreJson[] | null;
  const streaming = tmdbData.streaming as StreamingJson | null;

  // Extract all available ratings
  const allRatings = ratings ? ratings.map(rating => ({
    source: rating.source || 'Unknown',
    rating: rating.rating || 0,
    votes: rating.votes
  })).filter(rating => rating.rating > 0) : [];

  // Calculate median rating from all ratings
  const allRatingValues = allRatings.map(r => r.rating);
  const medianRating = calculateMedianRating(allRatingValues);

  // Extract streaming providers if available
  const streamingProviders = streaming?.providers || [];

  return {
    id: movieData.id,
    tmdbId: tmdbData.id,
    title: movieData.title,
    tmdbTitle: tmdbData.title,
    originalTitle: tmdbData.original_title,
    originalLanguage: tmdbData.original_language,
    posterPath: image?.poster_path ? `https://image.tmdb.org/t/p/w500${image.poster_path}` : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
    releaseYear: tmdbData.release_date ? new Date(tmdbData.release_date).getFullYear().toString() : "",
    releaseDate: tmdbData.release_date,
    rating: medianRating,
    allRatings: allRatings,
    genres: genres ? genres.map((genre) => genre.name || '') : [],
    director: "Director information not available",
    cast: ["Cast information not available"],
    runtime: tmdbData.runtime ? `${tmdbData.runtime} min` : "Unknown",
    overview: tmdbData.overview || "No overview available",
    backdrop: image?.backdrop_path ? `https://image.tmdb.org/t/p/original${image.backdrop_path}` : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    parental: tmdbData.parental,
    streamingProviders: streamingProviders,
    originCountry: tmdbData.origin_country,
    language: movieData.language,
    format: movieData.format,
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
    const ratings = movie.ratings as RatingsJson[] | null; 
    const genres = movie.genres as GenreJson[] | null;
    
    // Extract all available ratings and calculate median
    const allRatingValues = ratings ? ratings.map(r => r.rating || 0).filter(r => r > 0) : [];
    const medianRating = calculateMedianRating(allRatingValues);
    
    return {
      id: movie.id,
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
    tmdbTitle: data.title,
    backdrop: image?.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${image.backdrop_path}` 
      : "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    description: data.overview || "No description available"
  };
}
