
import { useParams } from "react-router-dom";
import { Star, StarHalf, Clock, Calendar, Tag, Globe, Award, Film, Video, Bookmark, Heart, Map, Ticket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchMovieById } from "@/services/supabaseMovieService";
import { fetchShowtimesForMovie } from "@/services/showtimeService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  const movieId = parseInt(id || "0");
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      try {
        setLoading(true);
        const movieData = await fetchMovieById(movieId);
        setMovie(movieData);
        
        if (movieData) {
          const showtimesData = await fetchShowtimesForMovie(movieId.toString());
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
  
  // Group showtimes by cinema
  const showtimesByCinema = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.cinemaName]) {
      acc[showtime.cinemaName] = [];
    }
    acc[showtime.cinemaName].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);
  
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        {/* Backdrop with gradient overlay */}
        <div className="relative h-[70vh] min-h-[500px] w-full">
          <div 
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${movie.backdrop})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark-blue via-cinema-dark-blue/80 to-transparent" />
          </div>
        </div>
        
        {/* Movie details section */}
        <div className="container mx-auto px-4 -mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
              <img 
                src={movie.posterPath} 
                alt={`${movie.title} poster`}
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
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-cinema-gold hover:bg-cinema-gold/90 text-black">
                    <Heart className="w-4 h-4 mr-2" /> Favorite
                  </Button>
                  <Button variant="outline" className="flex-1 text-white border-white hover:bg-white/10">
                    <Bookmark className="w-4 h-4 mr-2" /> Watchlist
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-shadow animate-slide-up">
                {movie.title}
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <span className="block text-lg text-gray-400 mt-1">{movie.originalTitle}</span>
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
          
          {/* Showtimes Section */}
          {Object.keys(showtimesByCinema).length > 0 && (
            <div className="mt-12 mb-16 animate-slide-up">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Ticket className="w-6 h-6 mr-2 text-cinema-gold" />
                Showtimes
              </h2>
              
              <div className="space-y-8">
                {Object.entries(showtimesByCinema).map(([cinemaName, cinemaTimes]) => (
                  <div key={cinemaName} className="bg-cinema-dark-gray/30 rounded-lg p-5">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <Map className="w-5 h-5 mr-2 text-cinema-gold" />
                      {cinemaName}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {cinemaTimes.map((showtime) => {
                        const unixTime = parseInt(showtime.time);
                        const date = new Date(unixTime * 1000);
                        
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
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
