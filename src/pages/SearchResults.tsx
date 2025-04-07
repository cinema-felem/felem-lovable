
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieCard, { Movie } from "@/components/MovieCard";
import { searchMovies } from "@/services/supabaseMovieService";
import { useToast } from "@/hooks/use-toast";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState<Movie[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("query") || "";
    setQuery(searchQuery);
    
    const performSearch = async () => {
      if (searchQuery) {
        try {
          setLoading(true);
          const movieResults = await searchMovies(searchQuery);
          setResults(movieResults);
        } catch (error) {
          console.error("Error searching movies:", error);
          toast({
            title: "Error",
            description: "Failed to search movies. Please try again later.",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    performSearch();
  }, [location.search, toast]);
  
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            Search Results for "{query}"
          </h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-white">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl text-white mb-4">No movies found</h2>
              <p className="text-gray-400">
                Try adjusting your search or check the spelling.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchResults;
