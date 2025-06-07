import { supabase } from "@/integrations/supabase/client";
import { calculateMedianRating } from "@/utils/ratingUtils";
import { fetchTmdbDataByIds } from "./tmdbService";

interface MovieStats {
  id: string;
  title: string;
  rating: number;
  ratingNumbers: number[];
  showtimeCount: number;
}

export async function fetchMovieStats(): Promise<MovieStats[]> {
  try {
    const { data: movies, error } = await supabase
      .from('Movie')
      .select('id, title, tmdbId')
      .order('title');

    if (error) {
      console.error('Error fetching movies:', error);
      return [];
    }

    const tmdbIds = movies
      ?.filter(movie => movie.tmdbId)
      .map(movie => movie.tmdbId) as number[];

    if (!tmdbIds || tmdbIds.length === 0) {
      return movies?.map(movie => ({
        id: movie.id,
        title: movie.title,
        rating: 0,
        ratingNumbers: [],
        showtimeCount: 0
      })) || [];
    }

    const tmdbData = await fetchTmdbDataByIds(tmdbIds);

    const { data: showtimeCounts, error: showtimeError } = await supabase
      .from('Showtime')
      .select('filmId')
      .order('filmId');

    if (showtimeError) {
      console.error('Error fetching showtime counts:', showtimeError);
    }

    const showtimeCountMap = new Map<string, number>();
    showtimeCounts?.forEach(showtime => {
      const count = showtimeCountMap.get(showtime.filmId) || 0;
      showtimeCountMap.set(showtime.filmId, count + 1);
    });

    return movies?.map(movie => {
      const tmdbInfo = movie.tmdbId ? tmdbData.get(movie.tmdbId) : null;
      const ratings = tmdbInfo?.ratings as any[] | null;
      
      // Filter and extract valid rating numbers
      const validRatings = ratings
        ?.filter(rating => 
          rating && 
          typeof rating === 'object' && 
          'rating' in rating && 
          typeof rating.rating === 'number' &&
          rating.rating > 0
        )
        .map(rating => rating.rating) || [];

      const medianRating = validRatings.length > 0 ? calculateMedianRating(validRatings) : 0;

      return {
        id: movie.id,
        title: movie.title,
        rating: medianRating,
        ratingNumbers: validRatings,
        showtimeCount: showtimeCountMap.get(movie.id) || 0
      };
    }) || [];
  } catch (error) {
    console.error('Error in fetchMovieStats:', error);
    return [];
  }
}
