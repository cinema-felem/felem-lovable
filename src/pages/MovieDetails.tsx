
import { useParams } from "react-router-dom";
import { Star, Clock, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMovieDetails } from "@/services/movieData";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "0");
  const movie = getMovieDetails(movieId);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
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
            </div>
            
            {/* Details */}
            <div className="flex-grow">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-shadow animate-slide-up">
                {movie.title}
              </h1>
              
              <p className="text-lg text-cinema-gold mb-6 animate-slide-up">{movie.releaseYear}</p>
              
              <div className="flex flex-wrap gap-4 mb-6 animate-slide-up">
                <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                  <Star className="w-5 h-5 text-cinema-gold fill-cinema-gold" />
                  <span className="text-white">{movie.rating.toFixed(1)}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                  <Clock className="w-5 h-5 text-white" />
                  <span className="text-white">{movie.runtime}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white">{movie.releaseYear}</span>
                </div>
              </div>
              
              <div className="mb-6 animate-slide-up">
                <h3 className="text-white font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map(genre => (
                    <span key={genre} className="bg-cinema-dark-gray/50 px-3 py-1 rounded-full text-white text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6 animate-slide-up">
                <h3 className="text-white font-semibold mb-2">Overview</h3>
                <p className="text-gray-300">{movie.overview}</p>
              </div>
              
              <div className="mb-6 animate-slide-up">
                <h3 className="text-white font-semibold mb-2">Director</h3>
                <p className="text-gray-300">{movie.director}</p>
              </div>
              
              <div className="mb-8 animate-slide-up">
                <h3 className="text-white font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map(actor => (
                    <span key={actor} className="bg-cinema-dark-gray/50 px-3 py-1 rounded-full text-white text-sm">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 animate-slide-up">
                <Button className="bg-cinema-gold hover:bg-cinema-gold/90 text-black">
                  Add to Favorites
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
