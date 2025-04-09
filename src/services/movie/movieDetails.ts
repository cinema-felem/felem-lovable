
import { supabase } from "@/integrations/supabase/client";
import { calculateMedianRating } from "@/utils/ratingUtils";
import { ImageJson, RatingsJson, GenreJson, StreamingJson, MovieWithDetails } from "./types";

export async function fetchMovieById(id: string): Promise<MovieWithDetails | null> {
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
