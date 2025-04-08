
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { logEvent } from "@/utils/analytics";

interface HeroSectionProps {
  featuredMovie: {
    id: number;
    title: string;
    backdrop: string;
    description: string;
  };
}

const HeroSection = ({ featuredMovie }: HeroSectionProps) => {
  const handleFeaturedClick = () => {
    // Track when users click on the featured movie
    logEvent('click_featured_movie', {
      movie_id: featuredMovie.id,
      movie_title: featuredMovie.title
    });
  };

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
              <Link 
                to={`/movie/${featuredMovie.id}`}
                onClick={handleFeaturedClick}
              >
                View Showtimes
              </Link>
            </Button>
            <Button asChild variant="outline" className="text-white border-white/20 hover:bg-white/10">
              <Link to="/cinemas">
                Find Cinemas
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
