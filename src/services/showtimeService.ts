
import { supabase } from "@/integrations/supabase/client";
import { format, startOfDay, endOfDay } from "date-fns";

export interface Showtime {
  id: number;
  cinemaId: string;
  cinemaName: string;
  date: string;
  time: string;
  movieFormat: string;
  ticketType: string;
  link: string;
}

export interface CinemaOption {
  id: string;
  name: string;
}

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
      const startUnix = Math.floor(startOfDay(selectedDate).getTime() / 1000);
      const endUnix = Math.floor(endOfDay(selectedDate).getTime() / 1000);
      
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
      console.info(`No showtimes found for movie with ID: ${movieId} with the applied filters`);
      return [];
    }
    
    // Transform the data to match our interface
    return showtimes.map((showtime) => {
      return {
        id: showtime.id,
        cinemaId: showtime.cinemaId,
        cinemaName: showtime.Cinema?.name || 'Unknown Cinema',
        date: format(new Date(showtime.unixTime * 1000), 'yyyy-MM-dd'),
        time: showtime.unixTime.toString(),
        movieFormat: showtime.movieFormat,
        ticketType: showtime.ticketType,
        link: showtime.link,
      };
    });
  } catch (error) {
    console.error('Error in fetchShowtimesForMovie:', error);
    return [];
  }
}

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
    console.error('Error in fetchAvailableDatesForMovie:', error);
    return [];
  }
}

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
        date: new Date(showtime.unixTime * 1000).toISOString().split('T')[0],
        time: showtime.unixTime.toString(),
        movieFormat: showtime.movieFormat,
        ticketType: showtime.ticketType,
        link: showtime.link,
      };
    });
  } catch (error) {
    console.error('Error in fetchAllShowtimes:', error);
    return [];
  }
}
