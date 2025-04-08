
import { Star, Clock, Calendar, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MovieGenres from "./MovieGenres";
import MovieRatings from "./MovieRatings";
import MovieCast from "./MovieCast";

interface RatingSource {
  source: string;
  rating: number;
  votes?: number;
}

interface MovieInfoProps {
  movie: {
    originalTitle?: string;
    title: string;
    releaseYear?: string;
    originalLanguage?: string;
    parental?: string;
    rating?: number;
    runtime?: string;
    genres?: string[];
    overview?: string;
    allRatings?: RatingSource[];
    cast?: string[];
    director?: string;
  };
}

const MovieInfo = ({ movie }: MovieInfoProps) => {
  const displayTitle = movie.title;
  
  return (
    <div className="flex-grow">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-shadow animate-slide-up">
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
        {movie.rating && movie.rating > 0 && (
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
      
      <MovieGenres genres={movie.genres} />
      
      {movie.overview && (
        <div className="mb-6 animate-slide-up">
          <h3 className="text-white font-semibold mb-2">Overview</h3>
          <p className="text-gray-300">{movie.overview}</p>
        </div>
      )}
      
      <MovieRatings allRatings={movie.allRatings} />
      
      <MovieCast cast={movie.cast} director={movie.director} />
    </div>
  );
};

export default MovieInfo;
