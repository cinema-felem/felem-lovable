import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { ScrollArea } from "./scroll-area";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";
import MovieCard, { MovieCardData } from "./movie-card";

export interface SortOption {
  value: string;
  label: string;
}

interface MovieGridProps {
  title: string;
  movies: MovieCardData[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  sortOption?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: SortOption[];
  className?: string;
  gridCols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  onMovieClick?: (movie: MovieCardData) => void;
}

const defaultSortOptions: SortOption[] = [
  { value: "rating", label: "Highest Rating" },
  { value: "hipster", label: "Hipster Rating" },
  { value: "title", label: "Title A-Z" },
];

const MovieGrid = ({ 
  title, 
  movies, 
  sortOption = "rating",
  onSortChange,
  sortOptions = defaultSortOptions,
  className,
  gridCols = { sm: 2, md: 3, lg: 4, xl: 5 },
  onMovieClick,
  isLoading = false,
  hasMore = false,
  onLoadMore
}: MovieGridProps) => {
  const gridColsClass = cn(
    "grid gap-6",
    `grid-cols-${gridCols.sm || 2}`,
    `sm:grid-cols-${gridCols.sm || 2}`,
    `md:grid-cols-${gridCols.md || 3}`,
    `lg:grid-cols-${gridCols.lg || 4}`,
    `xl:grid-cols-${gridCols.xl || 5}`
  );

  const renderMovieSkeleton = () => (
    <div className="aspect-[2/3]">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
  );

  return (
    <section className={cn("py-8", className)}>
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
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className={gridColsClass}>
          {isLoading ? (
            // Show skeletons while loading
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index}>{renderMovieSkeleton()}</div>
            ))
          ) : (
            // Show actual movies
            movies.map((movie) => (
              <div key={movie.id} className="aspect-[2/3]">
                <MovieCard 
                  movie={movie} 
                  onClick={onMovieClick}
                />
              </div>
            ))
          )}
        </div>

        {hasMore && onLoadMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-cinema-gold text-black font-semibold rounded-lg hover:bg-cinema-gold/90 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid; 