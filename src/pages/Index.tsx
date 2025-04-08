
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
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("rating");
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<Set<number | string>>(new Set());

  // Load all movies at once
  const loadAllMovies = useCallback(async () => {
    try {
      setLoading(true);
      
      const { movies: allMovies } = await fetchPopularMovies(
        0, 
        100, // Fetch a large batch of movies at once
        sortOption
      );
      
      setMovies(allMovies);
    } catch (error) {
      console.error("Error loading movies:", error);
      toast({
        title: "Error",
        description: "Failed to load movies. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [sortOption, toast]);

  const handleSortChange = (value: string) => {
    setSortOption(value);
    
    // For client-side sorting if value is 'rating'
    if (value === 'rating' && movies.length > 0) {
      // Sort movies by rating (highest first)
      const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);
      setMovies(sortedMovies);
    }
  };

  const toggleWatchlist = (movieId: number | string) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(movieId)) {
        newWatchlist.delete(movieId);
        toast({
          title: "Removed from Watchlist",
          description: "Movie has been removed from your watchlist",
        });
      } else {
        newWatchlist.add(movieId);
        toast({
          title: "Added to Watchlist",
          description: "Movie has been added to your watchlist",
        });
      }
      return newWatchlist;
    });
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load multiple featured movies for carousel
        const featuredMoviesData = [];
        for (let i = 0; i < 5; i++) {
          const featured = await fetchFeaturedMovie();
          if (featured) featuredMoviesData.push(featured);
        }
        
        setFeaturedMovies(featuredMoviesData);
        
        // Set initial featured movie
        if (featuredMoviesData.length > 0) {
          setFeaturedMovie(featuredMoviesData[0]);
        }
        
        const { movies: allMovies } = await fetchPopularMovies(0, 100, sortOption);
        
        // Client-side sort if needed
        if (sortOption === 'rating') {
          setMovies(allMovies.sort((a, b) => b.rating - a.rating));
        } else {
          setMovies(allMovies);
        }
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
  }, [toast]);

  // Update featured movie on page navigation
  useEffect(() => {
    // Only run if we have more than one featured movie
    if (featuredMovies.length > 1) {
      const nextIndex = (currentFeaturedIndex + 1) % featuredMovies.length;
      setCurrentFeaturedIndex(nextIndex);
      setFeaturedMovie(featuredMovies[nextIndex]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        {featuredMovie && (
          <HeroSection 
            featuredMovie={featuredMovie} 
            onAddToWatchlist={() => toggleWatchlist(featuredMovie.id)} 
            isInWatchlist={watchlist.has(featuredMovie.id)}
          />
        )}
        
        <div className="py-8">
          {loading ? (
            <div className="container mx-auto px-4 text-center py-12">
              <p className="text-white text-xl">Loading movies...</p>
            </div>
          ) : (
            <MovieGrid 
              title="Movies" 
              movies={movies}
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
