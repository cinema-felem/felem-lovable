
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import MovieGrid from "@/components/MovieGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
import { fetchPopularMovies } from "@/services/supabaseMovieService";

const Movies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [sortOption, setSortOption] = useState<string>("rating");
  const { toast } = useToast();

  const loadMovies = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }
      
      const { movies: newMovies, hasMore: moreAvailable } = await fetchPopularMovies(
        reset ? 0 : page, 
        12, 
        sortOption
      );
      
      setMovies(prev => reset ? newMovies : [...prev, ...newMovies]);
      setHasMore(moreAvailable);
      setPage(prev => reset ? 1 : prev + 1);
    } catch (error) {
      console.error("Error loading movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, sortOption, toast]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    loadMovies(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMovies();
    }
  };

  useEffect(() => {
    loadMovies(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Movie Library</h1>
          
          {loading && movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white text-xl">Loading movies...</p>
            </div>
          ) : (
            <MovieGrid 
              title="All Movies" 
              movies={movies}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
              sortOption={sortOption}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
