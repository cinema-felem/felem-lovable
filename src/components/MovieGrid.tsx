import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "./MovieCard.d";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { fetchShowtimesForMovie } from "@/services/showtimeService";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  sortOption?: string;
  onSortChange?: (value: string) => void;
  showOnlyWithShowtimes?: boolean;
}

const MovieGrid = ({ 
  title, 
  movies, 
  sortOption = "rating",
  onSortChange,
  showOnlyWithShowtimes = false
}: MovieGridProps) => {
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(movies);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    if (!showOnlyWithShowtimes) {
      setFilteredMovies(movies);
      return;
    }

    const filterMoviesWithShowtimes = async () => {
      setIsFiltering(true);
      
      const moviesWithShowtimes: Movie[] = [];
      
      for (const movie of movies) {
        try {
          const showtimes = await fetchShowtimesForMovie(movie.id);
          if (showtimes.length > 0) {
            moviesWithShowtimes.push(movie);
          }
        } catch (error) {
          console.error(`Error checking showtimes for movie ${movie.id}:`, error);
        }
      }
      
      setFilteredMovies(moviesWithShowtimes);
      setIsFiltering(false);
    };
    
    filterMoviesWithShowtimes();
  }, [movies, showOnlyWithShowtimes]);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          
          {onSortChange && (
            <div className="w-40">
              <Select 
                value={sortOption} 
                onValueChange={onSortChange}
              >
                <SelectTrigger className="bg-cinema-dark-gray/50 border-cinema-dark-gray text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="hipster">Hipster Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {isFiltering ? (
          <div className="text-center py-8">
            <p className="text-white">Filtering movies with showtimes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="aspect-[2/3]">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
