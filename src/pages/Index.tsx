import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Movie } from "@/components/MovieCard.d";
import { fetchFeaturedMovie, fetchPopularMovies } from "@/services/movie";
import { useToast } from "@/hooks/use-toast";
import FeaturedCarousel from "@/components/FeaturedCarousel";

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>("rating");
  const { toast } = useToast();

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
    
    if (value === 'rating' && movies.length > 0) {
      const sortedMovies = [...movies].sort((a, b) => b.rating - a.rating);
      setMovies(sortedMovies);
    } else if (value === 'hipster' && movies.length > 0) {
      const filteredMovies = [...movies].filter(movie => {
        if (movie.allRatings) {
          return movie.allRatings.some(rating => rating.source === 'letterboxd');
        }
        return false;
      });
      
      if (filteredMovies.length > 0) {
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
    } else if (value === 'title' && movies.length > 0) {
      const sortedMovies = [...movies].sort((a, b) => 
        a.title.localeCompare(b.title)
      );
      setMovies(sortedMovies);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        const featuredMoviesData = [];
        for (let i = 0; i < 5; i++) {
          const featured = await fetchFeaturedMovie();
          if (featured) featuredMoviesData.push(featured);
        }
        
        setFeaturedMovies(featuredMoviesData);
        
        const { movies: allMovies } = await fetchPopularMovies(0, 100, sortOption);
        
        if (sortOption === 'rating') {
          setMovies(allMovies.sort((a, b) => b.rating - a.rating));
        } else if (sortOption === 'hipster') {
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

  useEffect(() => {
    if (featuredMovies.length > 1) {
      const nextIndex = (currentFeaturedIndex + 1) % featuredMovies.length;
      setCurrentFeaturedIndex(nextIndex);
    }
  }, []);

  const moviesStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": movies.slice(0, 10).map((movie, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Movie",
        "name": movie.title,
        "image": movie.posterPath,
        "url": `https://felem.puayhiang.com/movie/${movie.id}`
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Helmet>
        <title>Felem - Discover and Curate the Best Movies</title>
        <meta name="description" content="Discover the best movies from around the world, find showtimes, read reviews, and explore carefully curated film collections." />
        <link rel="canonical" href="https://felem.puayhiang.com/" />
        <meta property="og:title" content="Felem - Discover and Curate the Best Movies" />
        <meta property="og:description" content="Discover the best movies from around the world, find showtimes, read reviews, and explore carefully curated film collections." />
        <meta property="og:url" content="https://felem.puayhiang.com/" />
        <meta property="og:type" content="website" />
        {featuredMovies[currentFeaturedIndex] && <meta property="og:image" content={featuredMovies[currentFeaturedIndex].backdrop} />}
        <script type="application/ld+json">
          {JSON.stringify(moviesStructuredData)}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {featuredMovies.length > 0 && (
          <HeroSection 
            featuredMovie={featuredMovies[currentFeaturedIndex]}
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
