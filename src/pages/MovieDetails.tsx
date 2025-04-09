
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchMovieById } from "@/services/movie";
import { 
  fetchShowtimesForMovie, 
  fetchCinemasWithShowtimesForMovie, 
  fetchAvailableDatesForMovie 
} from "@/services/showtimeService";
import { CinemaOption } from "@/services/types";
import MovieSidebar from "@/components/movie/MovieSidebar";
import MovieInfo from "@/components/movie/MovieInfo";
import MovieShowtimes from "@/components/movie/MovieShowtimes";
import MovieVideos from "@/components/movie/MovieVideos";
import { logMovieView, logShowtimeInteraction } from "@/utils/analytics";
import { Helmet } from "react-helmet-async";

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
          // Set page title based on movie title
          document.title = `${movieData.title} (${movieData.releaseYear || ''}) - Felem Movies`;
          
          // Log movie view once data is loaded
          logMovieView(movieId, movieData.title);
          
          // Fetch available dates for the movie
          const datesData = await fetchAvailableDatesForMovie(movieId);
          setAvailableDates(datesData);
          
          // Fetch cinemas showing this movie
          const cinemasData = await fetchCinemasWithShowtimesForMovie(movieId);
          setCinemas(cinemasData);
          
          // Get today's date to use as default if available
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Find today's date in the available dates, or the closest future date
          let defaultDate = datesData.find(date => 
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
          );
          
          // If today is not available, use the first available date
          if (!defaultDate && datesData.length > 0) {
            defaultDate = datesData[0];
          }
          
          // Pass the movie UUID to fetch showtimes with the selected filters
          const showtimesData = await fetchShowtimesForMovie(
            movieId, 
            defaultDate,
            undefined
          );
          
          // The unixTime is already in the right format now
          setShowtimes(showtimesData);
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
      setShowtimes(showtimesData);
    } catch (error) {
      console.error("Error updating showtimes:", error);
    }
  };
  
  const handleCinemaChange = async (cinemaId: string | undefined) => {
    try {
      // Get today's date to use as default if available
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find today's date in the available dates, or the closest future date
      let defaultDate = availableDates.find(date => 
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
      
      // If today is not available, use the first available date
      if (!defaultDate && availableDates.length > 0) {
        defaultDate = availableDates[0];
      }
      
      const showtimesData = await fetchShowtimesForMovie(
        movieId,
        defaultDate,
        cinemaId
      );
      
      setShowtimes(showtimesData);
      
      // Log cinema selection for this movie
      if (cinemaId && movie) {
        const cinema = cinemas.find(c => c.id === cinemaId);
        if (cinema) {
          logShowtimeInteraction(movieId, movie.title, cinemaId, cinema.name);
        }
      }
    } catch (error) {
      console.error("Error updating showtimes:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
        <Helmet>
          <title>Loading Movie - Felem Movies</title>
          <meta name="description" content="Loading movie details..." />
        </Helmet>
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
        <Helmet>
          <title>Movie Not Found - Felem Movies</title>
          <meta name="description" content="Movie not found" />
        </Helmet>
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <h1 className="text-2xl text-white">Movie not found</h1>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Generate a clean description from the movie overview
  const metaDescription = movie.overview 
    ? `${movie.title} (${movie.releaseYear || ''}) - ${movie.overview.slice(0, 155)}...` 
    : `View showtimes, ratings, and details for ${movie.title} (${movie.releaseYear || ''}).`;
  
  // Create structured data for the movie
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.overview,
    "image": movie.posterPath,
    "datePublished": movie.releaseDate,
    "director": movie.director ? {
      "@type": "Person",
      "name": movie.director
    } : undefined,
    "actor": movie.cast?.map((actor: string) => ({
      "@type": "Person",
      "name": actor
    })),
    "aggregateRating": movie.rating ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "bestRating": "10",
      "worstRating": "1"
    } : undefined,
    "genre": movie.genres
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Helmet>
        <title>{`${movie.title} (${movie.releaseYear || ''}) - Felem Movies`}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${movie.title} (${movie.releaseYear || ''}) - Felem Movies`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={movie.posterPath} />
        <meta property="og:type" content="video.movie" />
        <link rel="canonical" href={`https://felem.puayhiang.com/movie/${movieId}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
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
          
          {/* Add the MovieVideos component */}
          <MovieVideos videos={movie.videos} />
          
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
