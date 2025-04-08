
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchMovieById } from "@/services/supabaseMovieService";
import { 
  fetchShowtimesForMovie, 
  fetchCinemasWithShowtimesForMovie, 
  fetchAvailableDatesForMovie, 
  CinemaOption 
} from "@/services/showtimeService";
import MovieSidebar from "@/components/movie/MovieSidebar";
import MovieInfo from "@/components/movie/MovieInfo";
import MovieShowtimes from "@/components/movie/MovieShowtimes";

interface Showtime {
  id: number;
  cinemaId: string;
  cinemaName: string;
  date: string;
  time: string;
  movieFormat: string;
  ticketType: string;
  link: string;
  unixTime: number;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id || ""; // Use UUID format ID from Movie table
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [cinemas, setCinemas] = useState<CinemaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      try {
        setLoading(true);
        // Use the UUID string directly without parsing
        const movieData = await fetchMovieById(movieId);
        setMovie(movieData);
        
        if (movieData) {
          // Fetch available dates for the movie
          const datesData = await fetchAvailableDatesForMovie(movieId);
          setAvailableDates(datesData);
          
          // Fetch cinemas showing this movie
          const cinemasData = await fetchCinemasWithShowtimesForMovie(movieId);
          setCinemas(cinemasData);
          
          // Pass the movie UUID to fetch showtimes with the selected filters
          const showtimesData = await fetchShowtimesForMovie(
            movieId, 
            datesData.length > 0 ? datesData[0] : undefined,
            undefined
          );
          
          // Add unixTime to each showtime for convenience
          const formattedShowtimes = showtimesData.map(showtime => ({
            ...showtime,
            unixTime: parseInt(showtime.time)
          }));
          
          setShowtimes(formattedShowtimes);
        }
      } catch (error) {
        console.error("Error loading movie details:", error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [movieId, toast]);
  
  const handleDateChange = async (date: Date | undefined) => {
    try {
      const showtimesData = await fetchShowtimesForMovie(movieId, date, undefined);
      
      // Add unixTime to each showtime for convenience
      const formattedShowtimes = showtimesData.map(showtime => ({
        ...showtime,
        unixTime: parseInt(showtime.time)
      }));
      
      setShowtimes(formattedShowtimes);
    } catch (error) {
      console.error("Error updating showtimes:", error);
    }
  };
  
  const handleCinemaChange = async (cinemaId: string | undefined) => {
    try {
      const showtimesData = await fetchShowtimesForMovie(
        movieId,
        availableDates.length > 0 ? availableDates[0] : undefined,
        cinemaId
      );
      
      // Add unixTime to each showtime for convenience
      const formattedShowtimes = showtimesData.map(showtime => ({
        ...showtime,
        unixTime: parseInt(showtime.time)
      }));
      
      setShowtimes(formattedShowtimes);
    } catch (error) {
      console.error("Error updating showtimes:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <h1 className="text-2xl text-white">Loading movie details...</h1>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <h1 className="text-2xl text-white">Movie not found</h1>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark-blue via-cinema-dark-blue/80 to-transparent" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 -mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <MovieSidebar movie={movie} />
            <MovieInfo movie={movie} />
          </div>
          
          {showtimes.length > 0 && (
            <MovieShowtimes 
              showtimes={showtimes}
              availableDates={availableDates}
              cinemas={cinemas}
              onDateChange={handleDateChange}
              onCinemaChange={handleCinemaChange}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
