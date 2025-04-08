
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkPlus, BookmarkX } from "lucide-react";

interface HeroSectionProps {
  featuredMovie: {
    id: number;
    title: string;
    backdrop: string;
    description: string;
  };
  onAddToWatchlist: () => void;
  isInWatchlist: boolean;
}

const HeroSection = ({ featuredMovie, onAddToWatchlist, isInWatchlist }: HeroSectionProps) => {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full">
      <div 
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${featuredMovie.backdrop})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark-blue via-cinema-dark-blue/80 to-transparent" />
      </div>
      
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-shadow">
            {featuredMovie.title}
          </h1>
          <p className="text-lg text-gray-200 mb-6 line-clamp-3 md:line-clamp-none">
            {featuredMovie.description}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-cinema-gold hover:bg-cinema-gold/90 text-black">
              <Link to={`/movie/${featuredMovie.id}`}>
                View Details
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10"
              onClick={onAddToWatchlist}
            >
              {isInWatchlist ? (
                <>
                  <BookmarkX className="mr-2 h-4 w-4" />
                  Remove from Watchlist
                </>
              ) : (
                <>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Add to Watchlist
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
