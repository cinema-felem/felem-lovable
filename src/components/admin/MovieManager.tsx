import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Movie } from "@/components/MovieCard.d";
import { Search, Filter, Plus, Edit, Save, X, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ExtendedMovie extends Movie {
  language?: string;
  format?: string;
  tmdbId?: number | null;
  isEditing?: boolean;
}

export function MovieManager() {
  const [movies, setMovies] = useState<ExtendedMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [tempMovies, setTempMovies] = useState<ExtendedMovie[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filterNullTmdbId, setFilterNullTmdbId] = useState(false);
  const { toast } = useToast();
  const pageSize = 10;

  useEffect(() => {
    fetchMovies();
  }, [currentPage, searchQuery, filterNullTmdbId]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('Movie')
        .select('*', { count: 'exact' });
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      if (filterNullTmdbId) {
        query = query.or('tmdbId.is.null,tmdbId.eq.0');
      }
      
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .range(from, to)
        .order('title', { ascending: true });
        
      if (error) throw error;
      
      const formattedMovies = data.map(movie => ({
        id: movie.id,
        title: movie.title,
        posterPath: "",
        releaseYear: "",
        rating: 0,
        language: movie.language,
        format: movie.format,
        tmdbId: movie.tmdbId,
        isEditing: false
      }));
      
      setMovies(formattedMovies);
      setTempMovies(JSON.parse(JSON.stringify(formattedMovies)));
      
      if (count) {
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        title: "Error",
        description: "Failed to load movies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFilterNullTmdbId = () => {
    setFilterNullTmdbId(!filterNullTmdbId);
    setCurrentPage(0);
  };

  const handleEditMovie = (index: number) => {
    const updatedMovies = [...movies];
    updatedMovies[index] = {
      ...updatedMovies[index],
      isEditing: true
    };
    setMovies(updatedMovies);
    setTempMovies([...updatedMovies]);
  };

  const handleSaveMovie = async (index: number) => {
    try {
      const movieToUpdate = tempMovies[index];
      const { id, title, language, format, tmdbId } = movieToUpdate;
      
      const { error } = await supabase
        .from('Movie')
        .update({
          title,
          language,
          format,
          tmdbId,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id.toString());
        
      if (error) throw error;
      
      const updatedMovies = [...movies];
      updatedMovies[index] = {
        ...movieToUpdate,
        isEditing: false
      };
      setMovies(updatedMovies);
      
      toast({
        title: "Success",
        description: "Movie updated successfully",
      });
    } catch (error) {
      console.error('Error updating movie:', error);
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = (index: number) => {
    const updatedMovies = [...movies];
    updatedMovies[index] = {
      ...updatedMovies[index],
      isEditing: false
    };
    setMovies(updatedMovies);
    setTempMovies(JSON.parse(JSON.stringify(updatedMovies)));
  };

  const handleDeleteMovie = async (index: number) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    
    try {
      const movieId = movies[index].id;
      
      const { error } = await supabase
        .from('Movie')
        .delete()
        .eq('id', movieId.toString());
        
      if (error) throw error;
      
      const updatedMovies = [...movies];
      updatedMovies.splice(index, 1);
      setMovies(updatedMovies);
      
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      });
      
      if (updatedMovies.length === 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchMovies();
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (index: number, field: keyof ExtendedMovie, value: any) => {
    const updatedTempMovies = [...tempMovies];
    updatedTempMovies[index] = {
      ...updatedTempMovies[index],
      [field]: value
    };
    setTempMovies(updatedTempMovies);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cinema-gold">Movie Management</h2>
        <Button variant="default" size="sm" className="flex items-center gap-2 bg-cinema-dark-blue">
          <Plus size={16} /> Add Movie
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-cinema-dark-blue/10 border-cinema-dark-blue"
          />
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className={`border-cinema-dark-blue ${filterNullTmdbId ? 'bg-cinema-gold text-cinema-dark-blue' : 'text-cinema-gold'}`}
          onClick={toggleFilterNullTmdbId}
          title="Filter movies without TMDB ID"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border border-border overflow-hidden bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Title</TableHead>
              <TableHead className="font-semibold">TMDB ID</TableHead>
              <TableHead className="font-semibold">Format</TableHead>
              <TableHead className="font-semibold">Language</TableHead>
              <TableHead className="w-[100px] text-center font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cinema-gold"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : movies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No movies found
                </TableCell>
              </TableRow>
            ) : (
              movies.map((movie, index) => (
                <TableRow key={movie.id.toString()} className="border-b border-border">
                  <TableCell>
                    {movie.isEditing ? (
                      <Input
                        value={tempMovies[index].title}
                        onChange={(e) => handleInputChange(index, 'title', e.target.value)}
                        className="min-w-[200px] bg-cinema-dark-blue/10 border-cinema-dark-blue"
                      />
                    ) : (
                      movie.title
                    )}
                  </TableCell>
                  <TableCell>
                    {movie.isEditing ? (
                      <Input
                        value={tempMovies[index].tmdbId || ''}
                        onChange={(e) => handleInputChange(index, 'tmdbId', e.target.value !== '' ? parseInt(e.target.value) : null)}
                        type="number"
                        className="bg-cinema-dark-blue/10 border-cinema-dark-blue"
                      />
                    ) : (
                      movie.tmdbId || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {movie.isEditing ? (
                      <Input
                        value={tempMovies[index].format || ''}
                        onChange={(e) => handleInputChange(index, 'format', e.target.value)}
                        className="bg-cinema-dark-blue/10 border-cinema-dark-blue"
                      />
                    ) : (
                      movie.format || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {movie.isEditing ? (
                      <Input
                        value={tempMovies[index].language || ''}
                        onChange={(e) => handleInputChange(index, 'language', e.target.value)}
                        className="bg-cinema-dark-blue/10 border-cinema-dark-blue"
                      />
                    ) : (
                      movie.language || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {movie.isEditing ? (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSaveMovie(index)}
                            className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-cinema-dark-blue/20"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCancelEdit(index)}
                            className="h-8 w-8 text-gray-400 hover:text-gray-300 hover:bg-cinema-dark-blue/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMovie(index)}
                            className="h-8 w-8 text-cinema-light-blue hover:text-cinema-light-blue/80 hover:bg-cinema-dark-blue/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMovie(index)}
                            className="h-8 w-8 text-cinema-red hover:text-cinema-red/80 hover:bg-cinema-dark-blue/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-cinema-dark-blue/20"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i}
                  onClick={() => setCurrentPage(i)}
                  className={`cursor-pointer ${currentPage === i ? "bg-cinema-dark-blue text-white" : "hover:bg-cinema-dark-blue/20"}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
                className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-cinema-dark-blue/20"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
