import { useState, useCallback, useMemo } from 'react';
import { Movie } from '@/components/MovieCard.d';

export type SortOption = 'rating' | 'hipster' | 'title' | 'releaseYear';

interface UseMoviesOptions {
  initialSort?: SortOption;
  initialMovies?: Movie[];
}

interface UseMoviesReturn {
  movies: Movie[];
  sortedMovies: Movie[];
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  setMovies: (movies: Movie[]) => void;
  addMovies: (newMovies: Movie[]) => void;
  clearMovies: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const sortMovies = (movies: Movie[], sortOption: SortOption): Movie[] => {
  const sorted = [...movies];
  
  switch (sortOption) {
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'hipster':
      return sorted.sort((a, b) => (b.letterboxdRating || 0) - (a.letterboxdRating || 0));
    case 'title':
      return sorted.sort((a, b) => {
        const titleA = (a.tmdbTitle || a.title).toLowerCase();
        const titleB = (b.tmdbTitle || b.title).toLowerCase();
        return titleA.localeCompare(titleB);
      });
    case 'releaseYear':
      return sorted.sort((a, b) => {
        const yearA = parseInt(a.releaseYear) || 0;
        const yearB = parseInt(b.releaseYear) || 0;
        return yearB - yearA;
      });
    default:
      return sorted;
  }
};

export const useMovies = ({ 
  initialSort = 'rating', 
  initialMovies = [] 
}: UseMoviesOptions = {}): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [sortOption, setSortOption] = useState<SortOption>(initialSort);
  const [isLoading, setIsLoading] = useState(false);

  const sortedMovies = useMemo(() => 
    sortMovies(movies, sortOption), 
    [movies, sortOption]
  );

  const addMovies = useCallback((newMovies: Movie[]) => {
    setMovies(prev => {
      const existingIds = new Set(prev.map(m => String(m.id)));
      const uniqueNewMovies = newMovies.filter(m => !existingIds.has(String(m.id)));
      return [...prev, ...uniqueNewMovies];
    });
  }, []);

  const clearMovies = useCallback(() => {
    setMovies([]);
  }, []);

  return {
    movies,
    sortedMovies,
    sortOption,
    setSortOption,
    setMovies,
    addMovies,
    clearMovies,
    isLoading,
    setIsLoading,
  };
}; 