
import { useState } from "react";
import MovieCard, { Movie } from "./MovieCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { cn } from "@/lib/utils";

interface MovieGridProps {
  title: string;
  movies: Movie[];
  itemsPerPage?: number;
}

const MovieGrid = ({ title, movies, itemsPerPage = 10 }: MovieGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(movies.length / itemsPerPage);
  
  // Calculate the current page's movies
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  // Handle previous page click
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(current => current - 1);
    }
  };

  // Handle next page click
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(current => current + 1);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <span className="text-sm text-gray-400">Showing {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, movies.length)} of {movies.length}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {currentMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={handlePreviousPage}
                  className={cn(
                    currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  )}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={handleNextPage}
                  className={cn(
                    currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default MovieGrid;
