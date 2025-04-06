
import HeroSection from "@/components/HeroSection";
import MovieGrid from "@/components/MovieGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredMovie, popularMovies, topRatedMovies, trendingMovies } from "@/services/movieData";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection featuredMovie={featuredMovie} />
        
        <div className="py-8 space-y-12">
          <MovieGrid title="Popular Movies" movies={popularMovies} />
          <MovieGrid title="Top Rated" movies={topRatedMovies} />
          <MovieGrid title="Trending Now" movies={trendingMovies} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
