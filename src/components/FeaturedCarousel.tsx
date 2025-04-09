
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedMovie {
  id: number;
  title: string;
  backdrop: string;
  description: string;
}

interface FeaturedCarouselProps {
  movies: FeaturedMovie[];
  autoSlideInterval?: number;
}

const FeaturedCarousel = ({ movies, autoSlideInterval = 5000 }: FeaturedCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  };

  useEffect(() => {
    if (movies.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [autoSlideInterval, movies.length]);

  if (movies.length === 0) return null;

  return (
    <div className="relative overflow-hidden h-96 md:h-[600px]">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(6, 13, 23, 0.8)), url(${movie.backdrop})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16">
            <div className="max-w-3xl animate-fade-in">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              <p className="text-gray-200 text-lg mb-6 line-clamp-3">{movie.description}</p>
              <Link to={`/movie/${movie.id}`}>
                <Button variant="default" className="bg-cinema-gold hover:bg-cinema-gold/90 text-black">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {movies.length > 1 && (
        <>
          <Button 
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {movies.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-white w-4" : "bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedCarousel;
