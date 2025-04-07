
import { useEffect, useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Movie } from "@/components/MovieCard.d";
import { 
  fetchFeaturedMovie, 
  fetchPopularMovies
} from "@/services/supabaseMovieService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
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
        10, 
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
    // Reset and reload with new sort
    loadMovies(true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadMovies();
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        const [featured, { movies: popularMovies, hasMore: moreAvailable }] = await Promise.all([
          fetchFeaturedMovie(),
          fetchPopularMovies(0, 10, sortOption)
        ]);
        
        setFeaturedMovie(featured);
        setMovies(popularMovies);
        setHasMore(moreAvailable);
        setPage(1);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [toast, sortOption]);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        {featuredMovie && <HeroSection featuredMovie={featuredMovie} />}
        
        <div className="py-8">
          {loading && movies.length === 0 ? (
            <div className="container mx-auto px-4 text-center py-12">
              <p className="text-white text-xl">Loading movies...</p>
            </div>
          ) : (
            <MovieGrid 
              title="Movies" 
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

export default Index;
