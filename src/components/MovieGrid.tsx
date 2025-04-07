
import { useEffect, useState, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";
import { Movie } from "./MovieCard.d";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  sortOption?: string;
  onSortChange?: (value: string) => void;
}

const MovieGrid = ({ 
  title, 
  movies, 
  onLoadMore, 
  hasMore = false, 
  isLoading = false,
  sortOption = "rating",
  onSortChange
}: MovieGridProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  
  // Reference for the last movie element for infinite scroll
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

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
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie, index) => {
            if (movies.length === index + 1) {
              return (
                <div ref={lastMovieElementRef} key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              );
            } else {
              return <MovieCard key={movie.id} movie={movie} />;
            }
          })}
        </div>
        
        {isLoading && (
          <div className="w-full text-center py-4">
            <p className="text-white">Loading more movies...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
