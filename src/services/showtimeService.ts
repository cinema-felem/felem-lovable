
import { supabase } from "@/integrations/supabase/client";

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

export async function fetchShowtimesForMovie(movieId: string): Promise<Showtime[]> {
  try {
    // First, get all showtimes for this movie
    const { data: showtimes, error } = await supabase
      .from('Showtime')
      .select('*, Cinema(name)')
      .eq('filmId', movieId)
      .order('unixTime', { ascending: true });
    
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
        date: new Date(showtime.unixTime * 1000).toISOString().split('T')[0],
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
