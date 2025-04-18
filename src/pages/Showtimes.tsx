
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Film, MapPin, Clock, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Showtime {
  id: number;
  unixTime: number;
  link: string;
  ticketType: string;
  movieFormat: string;
  theatreFilmId: string;
  filmId: string;
  cinemaId: string;
  film: {
    title: string;
    tmdbTitle?: string;
  };
  cinema: {
    name: string;
    address: string | null;
  };
}

const Showtimes = () => {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        
        // First, fetch basic showtime data
        const { data: showtimeData, error: showtimeError } = await supabase
          .from('Showtime')
          .select(`
            id, 
            unixTime, 
            link, 
            ticketType, 
            movieFormat,
            theatreFilmId,
            filmId,
            cinemaId,
            cinema:Cinema(name, address)
          `)
          .order('unixTime', { ascending: true })
          .limit(20);
        
        if (showtimeError) {
          throw showtimeError;
        }
        
        if (!showtimeData || showtimeData.length === 0) {
          setShowtimes([]);
          setLoading(false);
          return;
        }
        
        // Extract all filmIds to fetch movie titles
        const filmIds = showtimeData.map(showtime => showtime.filmId);
        
        // Fetch movies data
        const { data: moviesData, error: moviesError } = await supabase
          .from('Movie')
          .select('id, title, tmdbId')
          .in('id', filmIds);
        
        if (moviesError) {
          throw moviesError;
        }
        
        // Create a map of movie data by id
        const movieMap = new Map();
        moviesData?.forEach(movie => {
          movieMap.set(movie.id, { 
            title: movie.title,
            tmdbId: movie.tmdbId
          });
        });
        
        // Fetch TMDB titles for movies with tmdbId
        const tmdbIds = moviesData
          ?.filter(movie => movie.tmdbId)
          .map(movie => movie.tmdbId) as number[];
        
        let tmdbTitleMap = new Map();
        
        if (tmdbIds && tmdbIds.length > 0) {
          const { data: tmdbData, error: tmdbError } = await supabase
            .from('tmdb')
            .select('id, title')
            .in('id', tmdbIds);
          
          if (!tmdbError && tmdbData) {
            tmdbData.forEach(item => {
              tmdbTitleMap.set(item.id, item.title);
            });
          }
        }
        
        // Combine the data
        const processedShowtimes = showtimeData.map(showtime => {
          const movieInfo = movieMap.get(showtime.filmId);
          const tmdbTitle = movieInfo?.tmdbId ? tmdbTitleMap.get(movieInfo.tmdbId) : undefined;
          
          return {
            ...showtime,
            film: {
              title: movieInfo?.title || 'Unknown Movie',
              tmdbTitle: tmdbTitle
            }
          };
        });
        
        setShowtimes(processedShowtimes);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        toast({
          title: "Error",
          description: "Failed to load showtimes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [toast]);

  const formatShowtimeDate = (unixTime: number) => {
    const date = new Date(unixTime * 1000); // Convert to milliseconds
    return format(date, "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Upcoming Showtimes</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-xl">Loading showtimes...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {showtimes.map((showtime) => {
                // Prioritize TMDB title if available
                const displayTitle = showtime.film?.tmdbTitle || showtime.film?.title || "Unknown Movie";
                
                return (
                  <Card key={showtime.id} className="bg-cinema-dark-gray/50 border-cinema-dark-gray hover:bg-cinema-dark-gray/70 transition duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                          <CardTitle className="text-white">{displayTitle}</CardTitle>
                          <div className="flex items-center gap-2 mt-1 text-gray-300">
                            <Clock size={16} className="text-cinema-gold" />
                            <span>{formatShowtimeDate(showtime.unixTime)}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-cinema-gold text-cinema-gold">
                            {showtime.movieFormat}
                          </Badge>
                          <Badge variant="outline">
                            {showtime.ticketType}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-gray-300">
                          <MapPin size={16} className="mt-1 flex-shrink-0 text-cinema-gold" />
                          <div>
                            <p className="font-medium">{showtime.cinema?.name || "Unknown Cinema"}</p>
                            <p className="text-sm">{showtime.cinema?.address || ""}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            asChild 
                            className="bg-cinema-gold hover:bg-cinema-gold/90 text-black font-medium"
                          >
                            <a href={showtime.link} target="_blank" rel="noopener noreferrer">
                              <Ticket size={16} className="mr-2" />
                              Get Tickets
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {showtimes.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-white text-xl">No upcoming showtimes found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Showtimes;
