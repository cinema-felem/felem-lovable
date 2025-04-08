
import { Star, Clock, Calendar, Tag, Globe, Award, Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  );
};

export default MovieInfo;
