
import { useEffect, useState } from "react";
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
  sortOption = "rating",
  onSortChange
}: MovieGridProps) => {
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="aspect-[2/3]">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
