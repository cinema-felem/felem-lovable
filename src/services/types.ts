
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
