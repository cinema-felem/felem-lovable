import { supabase } from "@/integrations/supabase/client";
import { Movie } from "@/components/MovieCard.d";
import { calculateMedianRating } from "@/utils/ratingUtils";
import { transformTmdbToMovies } from "./utils";
import { ImageJson, RatingsJson, GenreJson } from "./types";

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
  } else if (sortBy === 'title') {
    const { data, error } = await supabase
      .from('tmdb')
      .select('id, title, image, release_date, ratings, genres')
      .order('title', { ascending: true })
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
    console.log('Filtering for Hipster Rating', {
      totalMovies: movies.length,
      moviesWithLetterboxdRatings: movies.filter(movie => 
        movie.allRatings && movie.allRatings.some(r => r.source === 'Letterboxd')
      ).length
    });

    movies = movies.filter(movie => 
      movie.allRatings && movie.allRatings.some(r => r.source === 'Letterboxd')
    );
    
    movies.sort((a, b) => {
      const aRating = a.allRatings?.find(r => r.source === 'Letterboxd')?.rating || 0;
      const bRating = b.allRatings?.find(r => r.source === 'Letterboxd')?.rating || 0;
      
      console.log('Hipster Rating Sort', {
        movieA: { title: a.title, letterboxdRating: aRating },
        movieB: { title: b.title, letterboxdRating: bRating }
      });
      
      return bRating - aRating;
    });
  }
  
  return { movies, hasMore };
}
