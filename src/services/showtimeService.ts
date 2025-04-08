import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fetchTmdbDataByIds, fetchTmdbTitlesByIds, getTmdbPosterUrl } from "./tmdbService";
import { dateToStartOfDayUnix, dateToEndOfDayUnix, getUniqueDatesFromUnixTimestamps, formatUnixTime } from "@/utils/dateUtils";
import { CinemaShowtime, Showtime, CinemaOption } from "./types";

/**
 * Fetch showtimes for a specific cinema
 */
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
      const startUnix = dateToStartOfDayUnix(date);
      const endUnix = dateToEndOfDayUnix(date);
      
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
    
    // Prepare a map to store tmdb titles
    let tmdbTitles: Record<string, string> = {};
    
    if (movieIds.length > 0) {
      // Get the tmdbIds for the movies
      const { data: movieData, error: movieError } = await supabase
        .from('Movie')
        .select('id, tmdbId')
        .in('id', movieIds);
      
      if (!movieError && movieData) {
        const tmdbIds = movieData
          .filter(m => m.tmdbId)
          .map(m => m.tmdbId as number);
        
        if (tmdbIds.length > 0) {
          // Fetch tmdb titles
          const tmdbTitleMap = await fetchTmdbTitlesByIds(tmdbIds);
          
          // Map movie ids to tmdb titles
          movieData.forEach(movie => {
            if (movie.tmdbId && tmdbTitleMap.has(movie.tmdbId)) {
              tmdbTitles[movie.id] = tmdbTitleMap.get(movie.tmdbId) || '';
            }
          });
        }
      }
    }
    
    // Get all tmdbIds from the movies
    const tmdbIds = data
      .map(item => {
        const movie = item.Movie;
        if (!movie) return null;
        return movie.tmdbId;
      })
      .filter(Boolean) as number[];
    
    // Fetch TMDB data for poster paths
    const tmdbLookup = await fetchTmdbDataByIds(tmdbIds);
    
    // Transform the data to match our interface
    return data.map((item) => {
      const showtime = new Date(item.unixTime);
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
        posterPath: getTmdbPosterUrl(image?.poster_path),
        date: format(showtime, 'yyyy-MM-dd'),
        time: item.unixTime.toString(),
        formattedTime: formatUnixTime(item.unixTime),
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

/**
 * Fetch available dates for a cinema
 */
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
    
    return getUniqueDatesFromUnixTimestamps(data.map(item => item.unixTime));
  } catch (error) {
    console.error('Error in fetchAvailableDatesForCinema:', error);
    return [];
  }
}

/**
 * Fetch showtimes for a specific movie
 */
export async function fetchShowtimesForMovie(
  movieId: string, 
  selectedDate?: Date,
  selectedCinemaId?: string
): Promise<Showtime[]> {
  try {
    // Start with base query for this movie
    let query = supabase
      .from('Showtime')
      .select('*, Cinema(name)')
      .eq('filmId', movieId)
      .order('unixTime', { ascending: true });
    
    // Apply date filter if provided
    if (selectedDate) {
      const startUnix = dateToStartOfDayUnix(selectedDate);
      const endUnix = dateToEndOfDayUnix(selectedDate);
      
      query = query
        .gte('unixTime', startUnix)
        .lte('unixTime', endUnix);
    }
    
    // Apply cinema filter if provided
    if (selectedCinemaId) {
      query = query.eq('cinemaId', selectedCinemaId);
    }
    
    const { data: showtimes, error } = await query;
    
    if (error) {
      console.error('Error fetching showtimes:', error);
      return [];
    }
    
    if (!showtimes || showtimes.length === 0) {
      return [];
    }
    
    // Transform the data to match our interface
    return showtimes.map((showtime) => {
      return {
        id: showtime.id,
        cinemaId: showtime.cinemaId,
        cinemaName: showtime.Cinema?.name || 'Unknown Cinema',
        date: format(new Date(showtime.unixTime), 'yyyy-MM-dd'),
        time: showtime.unixTime.toString(),
        movieFormat: showtime.movieFormat,
        ticketType: showtime.ticketType,
        link: showtime.link,
        unixTime: showtime.unixTime,
      };
    });
  } catch (error) {
    console.error('Error in fetchShowtimesForMovie:', error);
    return [];
  }
}

/**
 * Fetch cinemas with showtimes for a movie
 */
export async function fetchCinemasWithShowtimesForMovie(movieId: string): Promise<CinemaOption[]> {
  try {
    const { data, error } = await supabase
      .from('Showtime')
      .select('cinemaId, Cinema(id, name)')
      .eq('filmId', movieId)
      .order('cinemaId');
    
    if (error) {
      console.error('Error fetching cinemas with showtimes:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Create a unique list of cinemas
    const uniqueCinemas = new Map<string, CinemaOption>();
    
    data.forEach(item => {
      if (item.Cinema && !uniqueCinemas.has(item.cinemaId)) {
        uniqueCinemas.set(item.cinemaId, {
          id: item.cinemaId,
          name: item.Cinema.name || 'Unknown Cinema'
        });
      }
    });
    
    return Array.from(uniqueCinemas.values());
  } catch (error) {
    console.error('Error in fetchCinemasWithShowtimesForMovie:', error);
    return [];
  }
}

/**
 * Fetch available dates for a movie
 */
export async function fetchAvailableDatesForMovie(movieId: string): Promise<Date[]> {
  try {
    const { data, error } = await supabase
      .from('Showtime')
      .select('unixTime')
      .eq('filmId', movieId)
      .order('unixTime');
    
    if (error) {
      console.error('Error fetching available dates:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return getUniqueDatesFromUnixTimestamps(data.map(item => item.unixTime));
  } catch (error) {
    console.error('Error in fetchAvailableDatesForMovie:', error);
    return [];
  }
}

/**
 * Fetch all showtimes
 */
export async function fetchAllShowtimes(limit = 100): Promise<Showtime[]> {
  try {
    const { data: showtimes, error } = await supabase
      .from('Showtime')
      .select('*, Cinema(name)')
      .order('unixTime', { ascending: true })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching all showtimes:', error);
      return [];
    }
    
    if (!showtimes || showtimes.length === 0) {
      return [];
    }
    
    // Transform the data to match our interface
    return showtimes.map((showtime) => {
      return {
        id: showtime.id,
        cinemaId: showtime.cinemaId,
        cinemaName: showtime.Cinema?.name || 'Unknown Cinema',
        date: format(new Date(showtime.unixTime), 'yyyy-MM-dd'),
        time: showtime.unixTime.toString(),
        movieFormat: showtime.movieFormat,
        ticketType: showtime.ticketType,
        link: showtime.link,
        unixTime: showtime.unixTime,
      };
    });
  } catch (error) {
    console.error('Error in fetchAllShowtimes:', error);
    return [];
  }
}
