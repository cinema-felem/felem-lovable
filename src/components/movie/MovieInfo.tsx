
import { Star, Clock, Calendar, Globe } from "lucide-react";
import { InfoBadge, RatingDisplay } from "@/components/ui";
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
    tmdbTitle?: string;
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
  // Prioritize TMDB title, fall back to movie title
  const displayTitle = movie.tmdbTitle || movie.title;
  
  return (
    <div className="flex-grow">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 text-shadow animate-slide-up">
        {displayTitle}
        {movie.originalTitle && movie.originalTitle !== displayTitle && (
          <span className="block text-lg text-gray-400 mt-1">{movie.originalTitle}</span>
        )}
      </h1>
      
      <div className="flex flex-wrap items-center gap-2 mb-6 animate-slide-up">
        <span className="text-lg text-cinema-gold">{movie.releaseYear}</span>
        {movie.originalLanguage && (
          <InfoBadge 
            icon={Globe} 
            label={movie.originalLanguage.toUpperCase()}
            variant="outline"
          />
        )}
        {movie.parental && (
          <InfoBadge 
            label={movie.parental}
            className="bg-cinema-dark-gray/70 border-white/20"
          />
        )}
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6 animate-slide-up">
        {movie.rating && movie.rating > 0 && (
          <div className="bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
            <RatingDisplay rating={movie.rating} size="lg" />
          </div>
        )}
        
        {movie.runtime && (
          <div className="bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
            <InfoBadge 
              icon={Clock} 
              label={movie.runtime}
              className="bg-transparent border-none p-0"
            />
          </div>
        )}
        
        {movie.releaseYear && (
          <div className="bg-cinema-dark-gray/50 px-3 py-2 rounded-full">
            <InfoBadge 
              icon={Calendar} 
              label={movie.releaseYear}
              className="bg-transparent border-none p-0"
            />
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
