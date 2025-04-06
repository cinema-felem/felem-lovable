
import MovieCard, { Movie } from "./MovieCard";

interface MovieGridProps {
  title: string;
  movies: Movie[];
}

const MovieGrid = ({ title, movies }: MovieGridProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-white">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;
