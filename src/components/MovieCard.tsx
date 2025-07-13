
import { Movie } from "./MovieCard.d";
import { logEvent } from "@/utils/analytics";
import MovieCardUI from "./ui/movie-card";
import { MovieCardData } from "./ui/movie-card";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const displayTitle = movie.tmdbTitle || movie.title;
  
  const handleMovieClick = (movieData: MovieCardData) => {
    // Track when users click on a movie card
    logEvent('click_movie_card', {
      movie_id: movieData.id,
      movie_title: displayTitle,
      release_year: movieData.releaseYear
    });
  };
  
  // Convert Movie type to MovieCardData
  const movieCardData: MovieCardData = {
    id: String(movie.id),
    title: movie.title,
    tmdbTitle: movie.tmdbTitle,
    posterPath: movie.posterPath,
    rating: movie.rating,
    releaseYear: movie.releaseYear
  };
  
  return (
    <MovieCardUI 
      movie={movieCardData}
      onClick={handleMovieClick}
    />
  );
};

export default MovieCard;
