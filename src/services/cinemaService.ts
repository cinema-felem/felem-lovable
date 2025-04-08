
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Movie } from "@/components/MovieCard.d";

export interface Cinema {
  id: string;
  name: string;
  address?: string | null;
  fullAddress?: string | null;
}

export interface CinemaShowtime {
  id: number;
  movieId: string;
  movieTitle: string;
  tmdbTitle?: string;
  posterPath: string;
  date: string;
  time: string;
  formattedTime: string;
  movieFormat: string;
  ticketType: string;
  link: string;
}

export async function fetchCinemaById(id: string): Promise<Cinema | null> {
  try {
    const { data, error } = await supabase
      .from('Cinema')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching cinema by ID:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchCinemaById:', error);
    return null;
  }
}

export async function fetchShowtimesForCinema(
  cinemaId: string,
  date?: Date
): Promise<CinemaShowtime[]> {
  try {
    // Start with base query for this cinema
    let query = supabase
      .from('Showtime')
      .select(`
        id, 
        movieFormat, 
        ticketType, 
        unixTime, 
        link,
        filmId,
        Movie(id, title, tmdbId)
      `)
      .eq('cinemaId', cinemaId)
      .order('unixTime', { ascending: true });
    
    // Apply date filter if provided
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const startUnix = Math.floor(startOfDay.getTime() / 1000);
      const endUnix = Math.floor(endOfDay.getTime() / 1000);
      
      query = query
        .gte('unixTime', startUnix)
        .lte('unixTime', endUnix);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching showtimes for cinema:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Fetch tmdb info for movies with tmdbId
    const movieIds = data
      .map(item => item.Movie?.id)
      .filter(Boolean) as string[];
    
    let tmdbTitles: Record<string, string> = {};
    if (movieIds.length > 0) {
      const { data: movieData, error: movieError } = await supabase
        .from('Movie')
        .select('id, tmdbId')
        .in('id', movieIds);
      
      if (!movieError && movieData) {
        // Get tmdbIds to fetch TMDB titles
        const tmdbIds = movieData
          .filter(m => m.tmdbId)
          .map(m => m.tmdbId as number);
        
        if (tmdbIds.length > 0) {
          const { data: tmdbResults, error: tmdbError } = await supabase
            .from('tmdb')
            .select('id, title')
            .in('id', tmdbIds);
          
          if (!tmdbError && tmdbResults) {
            // Create a mapping of tmdbId to title
            const tmdbTitleMap = new Map();
            tmdbResults.forEach(item => {
              tmdbTitleMap.set(item.id, item.title);
            });
            
            // Map movie ids to tmdb titles
            movieData.forEach(movie => {
              if (movie.tmdbId && tmdbTitleMap.has(movie.tmdbId)) {
                tmdbTitles[movie.id] = tmdbTitleMap.get(movie.tmdbId);
              }
            });
          }
        }
      }
    }
    
    // Fetch tmdb data for poster paths
    const tmdbIds = data
      .map(item => {
        const movie = item.Movie;
        if (!movie) return null;
        return movie.tmdbId;
      })
      .filter(Boolean) as number[];
    
    let tmdbData: any[] = [];
    if (tmdbIds.length > 0) {
      const { data: tmdbResults, error: tmdbError } = await supabase
        .from('tmdb')
        .select('id, image')
        .in('id', tmdbIds);
      
      if (!tmdbError && tmdbResults) {
        tmdbData = tmdbResults;
      }
    }
    
    // Map tmdb data to a lookup object
    const tmdbLookup = new Map();
    tmdbData.forEach(item => {
      tmdbLookup.set(item.id, item);
    });
    
    // Transform the data to match our interface
    return data.map((item) => {
      const showtime = new Date(item.unixTime * 1000);
      const movie = item.Movie;
      const tmdbId = movie?.tmdbId;
      const tmdbInfo = tmdbId ? tmdbLookup.get(tmdbId) : null;
      const image = tmdbInfo?.image as { poster_path?: string } | null;
      const movieId = movie?.id || '';
      
      return {
        id: item.id,
        movieId: movieId,
        movieTitle: movie?.title || 'Unknown Movie',
        tmdbTitle: tmdbTitles[movieId] || undefined,
        posterPath: image?.poster_path 
          ? `https://image.tmdb.org/t/p/w500${image.poster_path}` 
          : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=750&q=80",
        date: format(showtime, 'yyyy-MM-dd'),
        time: item.unixTime.toString(),
        formattedTime: format(showtime, 'h:mm a'),
        movieFormat: item.movieFormat,
        ticketType: item.ticketType,
        link: item.link,
      };
    });
  } catch (error) {
    console.error('Error in fetchShowtimesForCinema:', error);
    return [];
  }
}

export async function fetchAvailableDatesForCinema(cinemaId: string): Promise<Date[]> {
  try {
    const { data, error } = await supabase
      .from('Showtime')
      .select('unixTime')
      .eq('cinemaId', cinemaId)
      .order('unixTime');
    
    if (error) {
      console.error('Error fetching available dates:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Convert unix timestamps to Date objects
    const dates = data.map(item => {
      const date = new Date(item.unixTime * 1000);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    });
    
    // Use a Set to get unique dates (by their time)
    const uniqueDatesSet = new Set(dates.map(date => date.getTime()));
    
    // Convert back to Date objects
    return Array.from(uniqueDatesSet).map(time => new Date(time)).sort((a, b) => a.getTime() - b.getTime());
  } catch (error) {
    console.error('Error in fetchAvailableDatesForCinema:', error);
    return [];
  }
}
