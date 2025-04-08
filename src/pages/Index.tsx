
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
    // For client-side sorting and filtering if value is 'hipster'
    else if (value === 'hipster' && movies.length > 0) {
      // Filter movies that have a letterboxd rating and sort by it
      const filteredMovies = [...movies].filter(movie => {
        if (movie.allRatings) {
          return movie.allRatings.some(rating => rating.source === 'letterboxd');
        }
        return false;
      });
      
      if (filteredMovies.length > 0) {
        // Sort by letterboxd rating (highest first)
        const sortedMovies = filteredMovies.sort((a, b) => {
          const aRating = a.allRatings?.find(rating => rating.source === 'letterboxd')?.rating || 0;
          const bRating = b.allRatings?.find(rating => rating.source === 'letterboxd')?.rating || 0;
          return bRating - aRating;
        });
        setMovies(sortedMovies);
      } else {
        toast({
          title: "No Movies Found",
          description: "No movies with Letterboxd ratings were found.",
          variant: "default"
        });
      }
    }
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
        } else if (sortOption === 'hipster') {
          // Filter and sort by letterboxd rating
          const filteredMovies = allMovies.filter(movie => {
            if (movie.allRatings) {
              return movie.allRatings.some(rating => rating.source === 'letterboxd');
            }
            return false;
          });
          
          if (filteredMovies.length > 0) {
            setMovies(filteredMovies.sort((a, b) => {
              const aRating = a.allRatings?.find(rating => rating.source === 'letterboxd')?.rating || 0;
              const bRating = b.allRatings?.find(rating => rating.source === 'letterboxd')?.rating || 0;
              return bRating - aRating;
            }));
          } else {
            setMovies(allMovies.sort((a, b) => b.rating - a.rating));
          }
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
  }, [sortOption, toast]);

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
