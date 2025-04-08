import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard.d";
import { Database } from "@/integrations/supabase/types";
import { calculateMedianRating } from "@/utils/ratingUtils";

type TmdbRow = Database['public']['Tables']['tmdb']['Row'];
type Json = Database['public']['Tables']['tmdb']['Row']['image'];

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
  const from = page * limit;
  const to = from + limit - 1;
  
  let movieData;
  let movieError;
  
  if (sortBy === 'recent') {
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
  } else if (sortBy === 'hipster') {
    const { data, error } = await supabase
      .from('tmdb')
      .select('id, title, image, release_date, ratings, genres')
      .contains('ratings', [{"source": "letterboxd"}])
      .range(from, to + 1);
    
    movieData = data?.map(item => ({
      id: item.id.toString(),
      title: item.title,
      tmdbId: item.id
    }));
    movieError = error;
  } else {
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

  const hasMore = movieData && movieData.length > limit;
  const paginatedData = hasMore ? movieData.slice(0, limit) : movieData;
  
  const tmdbIds = paginatedData
    .filter(movie => movie.tmdbId !== null)
    .map(movie => movie.tmdbId as number);
  
  if (tmdbIds.length === 0) {
    return { 
      movies: paginatedData.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0,
        genres: [],
      })),
      hasMore 
    };
  }
  
  let tmdbQuery = supabase
    .from('tmdb')
    .select('id, title, image, release_date, ratings, genres')
    .in('id', tmdbIds);
  
  const { data: tmdbData, error: tmdbError } = await tmdbQuery;
  
  if (tmdbError) {
    console.error('Error fetching tmdb metadata:', tmdbError);
    return { 
      movies: paginatedData.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0,
        genres: [],
      })),
      hasMore 
    };
  }
  
  const tmdbMap = new Map();
  tmdbData?.forEach(tmdb => {
    tmdbMap.set(tmdb.id, tmdb);
  });
  
  let movies = paginatedData.map(movie => {
    const tmdb = movie.tmdbId ? tmdbMap.get(movie.tmdbId) : null;
    
    if (!tmdb) {
      return {
        id: movie.id,
        title: movie.title,
        posterPath: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        releaseYear: "",
        rating: 5.0,
        genres: [],
      };
    }
    
    const image = tmdb.image as ImageJson | null;
    const ratings = tmdb.ratings as RatingsJson[] | null;
    const genres = tmdb.genres as GenreJson[] | null;
    
    const allRatingValues = ratings ? ratings.map(r => r.rating || 0).filter(r => r > 0) : [];
    const medianRating = calculateMedianRating(allRatingValues);
    
    const letterboxdRating = ratings ? 
      ratings.find(r => r.source === 'letterboxd')?.rating : 
      undefined;
    
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
      allRatings: ratings ? ratings.map(r => ({
        source: r.source || 'Unknown',
        rating: r.rating || 0,
        votes: r.votes
      })) : [],
      letterboxdRating: letterboxdRating,
    };
  });
  
  if (sortBy === 'hipster') {
    movies = movies.filter(movie => 
      movie.allRatings && movie.allRatings.some(r => r.source === 'letterboxd')
    );
    
    movies.sort((a, b) => {
      const aRating = a.allRatings?.find(r => r.source === 'letterboxd')?.rating || 0;
      const bRating = b.allRatings?.find(r => r.source === 'letterboxd')?.rating || 0;
      return bRating - aRating;
    });
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
  
  const { data: tmdbData, error: tmdbError } = await supabase
    .from('tmdb')
    .select('*, external_ids, streaming, videos')
    .eq('id', movieData.tmdbId)
    .single();
  
  if (tmdbError || !tmdbData) {
    console.error('Error fetching tmdb data:', tmdbError);
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
  const videos = tmdbData.videos as any[] | null;
  const externalIds = tmdbData.external_ids as any | null;

  if (
    movieData.title === 'M' || 
    movieData.title === 'Blue Velvet' || 
    movieData.title === 'Dazed and Confused'
  ) {
    console.log(`Streaming data for ${movieData.title}:`, streaming);
  }

  const allRatings = ratings ? ratings.map(rating => ({
    source: rating.source || 'Unknown',
    rating: rating.rating || 0,
    votes: rating.votes
  })).filter(rating => rating.rating > 0) : [];

  const allRatingValues = allRatings.map(r => r.rating);
  const medianRating = calculateMedianRating(allRatingValues);

  let streamingProviders: string[] = [];
  if (streaming && typeof streaming === 'object') {
    if (Array.isArray(streaming.providers)) {
      streamingProviders = streaming.providers;
    } 
    else if (streaming.providers && typeof streaming.providers === 'object') {
      const providerCountries = Object.values(streaming.providers);
      const allPlatforms = new Set<string>();
      providerCountries.forEach((country: any) => {
        if (country && Array.isArray(country)) {
          country.forEach((platform: string) => {
            allPlatforms.add(platform);
          });
        } else if (country && typeof country === 'object') {
          Object.values(country).forEach((platforms: any) => {
            if (Array.isArray(platforms)) {
              platforms.forEach((platform: string) => {
                allPlatforms.add(platform);
              });
            }
          });
        }
      });
      streamingProviders = Array.from(allPlatforms);
    }
  }

  const movieVideos = videos || [];

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
    videos: movieVideos,
    externalIds: externalIds,
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

function transformTmdbToMovies(tmdbMovies: any[]): Movie[] {
  return tmdbMovies.map(movie => {
    const image = movie.image as ImageJson | null;
    const ratings = movie.ratings as RatingsJson[] | null; 
    const genres = movie.genres as GenreJson[] | null;
    
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
