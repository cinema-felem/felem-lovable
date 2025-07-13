import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MovieCardData {
  id: string;
  title: string;
  tmdbTitle?: string;
  posterPath: string;
  rating: number;
  releaseYear: string;
}

interface MovieCardProps {
  movie: MovieCardData;
  className?: string;
  onClick?: (movie: MovieCardData) => void;
  showRating?: boolean;
  showYear?: boolean;
}

const MovieCard = ({ 
  movie, 
  className,
  onClick,
  showRating = true,
  showYear = true 
}: MovieCardProps) => {
  const displayTitle = movie.tmdbTitle || movie.title;
  
  const handleClick = () => {
    onClick?.(movie);
  };
  
  return (
    <Link 
      to={`/movie/${movie.id}`} 
      className={cn(
        "group block relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 poster-shadow h-full",
        className
      )}
      onClick={handleClick}
      aria-label={`View details for ${displayTitle}`}
    >
      <img
        src={movie.posterPath}
        alt={`${displayTitle} poster`}
        className="w-full h-full object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 cinema-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
          {showRating && (
            <div className="flex items-center mb-1">
              <Star className="w-4 h-4 text-cinema-gold fill-cinema-gold mr-1" />
              <span className="text-white text-sm">{movie.rating.toFixed(1)}</span>
            </div>
          )}
          <h3 className="text-white font-semibold line-clamp-1">{displayTitle}</h3>
          {showYear && (
            <p className="text-gray-300 text-sm">{movie.releaseYear}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 