
import { Movie } from "./MovieCard.d";
import MovieGridUI from "./ui/movie-grid";
import { MovieCardData } from "./ui/movie-card";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
  sortOption?: string;
  onSortChange?: (value: string) => void;
  onMovieClick?: (movie: Movie) => void;
}

const MovieGrid = ({ 
  title, 
  movies, 
  sortOption = "rating",
  onSortChange,
  onMovieClick,
  ...props
}: MovieGridProps) => {
  // Convert Movie[] to MovieCardData[]
  const movieCardData: MovieCardData[] = movies.map(movie => ({
    id: String(movie.id),
    title: movie.title,
    tmdbTitle: movie.tmdbTitle,
    posterPath: movie.posterPath,
    rating: movie.rating,
    releaseYear: movie.releaseYear
  }));

  const handleMovieClick = (movieData: MovieCardData) => {
    // Find the original movie object
    const originalMovie = movies.find(m => String(m.id) === movieData.id);
    if (originalMovie && onMovieClick) {
      onMovieClick(originalMovie);
    }
  };

  return (
    <MovieGridUI 
      title={title}
      movies={movieCardData}
      sortOption={sortOption}
      onSortChange={onSortChange}
      onMovieClick={handleMovieClick}
      {...props}
    />
  );
};

export default MovieGrid;
