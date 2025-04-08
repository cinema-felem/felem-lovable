
import { useParams } from "react-router-dom";
import { Star, Clock, Calendar, Tag, Globe, Award, Film, Video, Map, Ticket, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchMovieById } from "@/services/supabaseMovieService";
import { fetchShowtimesForMovie, fetchCinemasWithShowtimesForMovie, fetchAvailableDatesForMovie, CinemaOption } from "@/services/showtimeService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ShowtimeFilter from "@/components/ShowtimeFilter";

interface RatingSource {
  source: string;
  rating: number;
  votes?: number;
}

interface Showtime {
  id: number;
  cinemaId: string;
  cinemaName: string;
  date: string;
  time: string;
  movieFormat: string;
  ticketType: string;
  link: string;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id || ""; // Use UUID format ID from Movie table
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [cinemas, setCinemas] = useState<CinemaOption[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | undefined>(undefined);
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
          
          // Set default selected date to the first available date
          if (datesData.length > 0) {
            setSelectedDate(datesData[0]);
          }
          
          // Fetch cinemas showing this movie
          const cinemasData = await fetchCinemasWithShowtimesForMovie(movieId);
          setCinemas(cinemasData);
          
          // Pass the movie UUID to fetch showtimes with the selected filters
          const showtimesData = await fetchShowtimesForMovie(
            movieId, 
            datesData.length > 0 ? datesData[0] : undefined,
            undefined
          );
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
  
  // Effect to update showtimes when filters change
  useEffect(() => {
    const updateShowtimes = async () => {
      if (!movieId) return;
      
      try {
        const showtimesData = await fetchShowtimesForMovie(
          movieId,
          selectedDate,
          selectedCinemaId
        );
        setShowtimes(showtimesData);
      } catch (error) {
        console.error("Error updating showtimes:", error);
      }
    };
    
    // Only run if the movie has been loaded
    if (movie) {
      updateShowtimes();
    }
  }, [movieId, selectedDate, selectedCinemaId, movie]);
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const handleCinemaChange = (cinemaId: string | undefined) => {
    // If the value is "all", set it to undefined to show all cinemas
    setSelectedCinemaId(cinemaId === "all" ? undefined : cinemaId);
  };
  
  const clearFilters = () => {
    setSelectedDate(availableDates.length > 0 ? availableDates[0] : undefined);
    setSelectedCinemaId(undefined);
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
  
  // Use TMDB title as the primary title with movie's title as fallback
  const displayTitle = movie.title;
  
  const showtimesByCinema = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.cinemaName]) {
      acc[showtime.cinemaName] = [];
    }
    acc[showtime.cinemaName].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);
  
  const hasActiveFilters = selectedCinemaId !== undefined;
  
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
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img 
                src={movie.posterPath} 
                alt={`${displayTitle} poster`}
                className="w-full h-auto rounded-lg poster-shadow animate-fade-in"
              />
              
              <div className="mt-6 space-y-4">
                {movie.streamingProviders && movie.streamingProviders.length > 0 && (
                  <div className="bg-cinema-dark-gray/30 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <Video className="w-5 h-5 mr-2 text-cinema-gold" />
                      Available on
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.streamingProviders.map((provider: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-cinema-dark-gray/50 text-white">
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Removed Favorite and Watchlist buttons */}
              </div>
            </div>
            
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-shadow animate-slide-up">
                {/* Use TMDB title with movie title as fallback */}
                {movie.originalTitle || displayTitle}
                {movie.originalTitle && movie.originalTitle !== displayTitle && (
                  <span className="block text-lg text-gray-400 mt-1">{displayTitle}</span>
                )}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-6 animate-slide-up">
                <span className="text-lg text-cinema-gold">{movie.releaseYear}</span>
                {movie.originalLanguage && (
                  <Badge variant="outline" className="bg-cinema-dark-gray/50 text-white">
                    <Globe className="w-3 h-3 mr-1" /> {movie.originalLanguage.toUpperCase()}
                  </Badge>
                )}
                {movie.parental && (
                  <Badge className="bg-cinema-dark-gray/70 text-white border border-white/20">
                    {movie.parental}
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6 animate-slide-up">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                    <Star className="w-5 h-5 text-cinema-gold fill-cinema-gold" />
                    <span className="text-white">{movie.rating.toFixed(1)}</span>
                  </div>
                )}
                
                {movie.runtime && (
                  <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white">{movie.runtime}</span>
                  </div>
                )}
                
                {movie.releaseYear && (
                  <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                    <span className="text-white">{movie.releaseYear}</span>
                  </div>
                )}
              </div>
              
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6 animate-slide-up">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-cinema-gold" />
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre: string) => (
                      <Badge key={genre} variant="outline" className="bg-cinema-dark-gray/50 text-white">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.overview && (
                <div className="mb-6 animate-slide-up">
                  <h3 className="text-white font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300">{movie.overview}</p>
                </div>
              )}
              
              {movie.allRatings && movie.allRatings.length > 0 && (
                <div className="mb-6 animate-slide-up">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-cinema-gold" />
                    Ratings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {movie.allRatings.map((ratingItem: RatingSource, index: number) => (
                      <div key={index} className="bg-cinema-dark-gray/30 p-3 rounded flex items-center justify-between">
                        <span className="text-gray-300">{ratingItem.source}</span>
                        <div className="flex items-center">
                          <span className="text-white font-medium mr-1">
                            {ratingItem.rating.toFixed(1)}
                          </span>
                          <Star className="w-4 h-4 text-cinema-gold fill-cinema-gold" />
                          {ratingItem.votes && (
                            <span className="ml-1 text-xs text-gray-400">({ratingItem.votes})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.cast && movie.cast.length > 0 && movie.cast[0] !== "Cast information not available" && (
                <div className="mb-6 animate-slide-up">
                  <h3 className="text-white font-semibold mb-2 flex items-center">
                    <Film className="w-4 h-4 mr-2 text-cinema-gold" />
                    Cast
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor: string) => (
                      <Badge key={actor} variant="outline" className="bg-cinema-dark-gray/50 text-white">
                        {actor}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.director && movie.director !== "Director information not available" && (
                <div className="mb-6 animate-slide-up">
                  <h3 className="text-white font-semibold mb-2">Director</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
              )}
            </div>
          </div>
          
          {showtimes.length > 0 && (
            <div className="mt-12 mb-16 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Ticket className="w-6 h-6 mr-2 text-cinema-gold" />
                Showtimes
              </h2>
              
              <div className="mb-6">
                <ShowtimeFilter 
                  availableDates={availableDates}
                  cinemas={cinemas}
                  selectedDate={selectedDate}
                  selectedCinemaId={selectedCinemaId}
                  onDateChange={handleDateChange}
                  onCinemaChange={handleCinemaChange}
                />
                
                {hasActiveFilters && (
                  <div className="flex items-center mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-cinema-gold hover:text-cinema-gold/80 hover:bg-cinema-dark-gray/30"
                    >
                      <X className="h-4 w-4 mr-1" /> Clear filters
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                {Object.entries(showtimesByCinema).map(([cinemaName, cinemaTimes]) => (
                  <div key={cinemaName} className="bg-cinema-dark-gray/30 rounded-lg p-5">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Map className="w-5 h-5 mr-2 text-cinema-gold" />
                      {cinemaName}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {cinemaTimes.map((showtime) => {
                        // Use unixTime directly as it's already in Unix timestamp format
                        const date = new Date(showtime.unixTime * 1000);
                        
                        return (
                          <a 
                            key={showtime.id} 
                            href={showtime.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-cinema-dark-gray/50 rounded p-3 hover:bg-cinema-dark-gray transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-cinema-gold font-medium">
                                {format(date, 'h:mm a')}
                              </span>
                              <span className="text-gray-400 text-sm">
                                {format(date, 'EEE, MMM d')}
                              </span>
                              {showtime.movieFormat && (
                                <Badge className="mt-2 w-fit bg-cinema-dark-blue/70 text-white">
                                  {showtime.movieFormat}
                                </Badge>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {showtimes.length === 0 && (
                <div className="bg-cinema-dark-gray/30 rounded-lg p-5 text-center">
                  <p className="text-white">No showtimes found for the selected filters.</p>
                  <Button 
                    variant="outline" 
                    className="mt-3 border-cinema-gold text-cinema-gold hover:bg-cinema-gold/10"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
