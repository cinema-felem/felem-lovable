
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Movie } from "@/components/MovieCard";
import { 
  fetchFeaturedMovie, 
  fetchPopularMovies, 
  fetchTopRatedMovies, 
  fetchTrendingMovies 
} from "@/services/supabaseMovieService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        
        const [featured, popular, topRated, trending] = await Promise.all([
          fetchFeaturedMovie(),
          fetchPopularMovies(),
          fetchTopRatedMovies(),
          fetchTrendingMovies()
        ]);
        
        setFeaturedMovie(featured);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setTrendingMovies(trending);
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
    };

    loadMovies();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        {featuredMovie && <HeroSection featuredMovie={featuredMovie} />}
        
        <div className="py-8 space-y-12">
          {loading ? (
            <div className="container mx-auto px-4 text-center py-12">
              <p className="text-white text-xl">Loading movies...</p>
            </div>
          ) : (
            <>
              <MovieGrid 
                title="Popular Movies" 
                movies={popularMovies} 
                itemsPerPage={10} 
              />
              <MovieGrid 
                title="Top Rated" 
                movies={topRatedMovies} 
                itemsPerPage={10} 
              />
              <MovieGrid 
                title="Trending Now" 
                movies={trendingMovies} 
                itemsPerPage={10} 
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
