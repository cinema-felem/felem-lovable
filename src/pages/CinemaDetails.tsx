
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShowtimeFilter from "@/components/ShowtimeFilter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Calendar, Film, Ticket, ExternalLink } from "lucide-react";
import { fetchCinemaById, fetchShowtimesForCinema, fetchAvailableDatesForCinema } from "@/services/cinemaService";
import { CinemaShowtime } from "@/services/types";

interface MovieShowtimeGroup {
  movieId: string;
  title: string;
  tmdbTitle?: string;
  posterPath: string;
  showtimes: CinemaShowtime[];
}

const CinemaDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const { data: cinema, isLoading: isLoadingCinema } = useQuery({
    queryKey: ['cinema', id],
    queryFn: () => fetchCinemaById(id || ''),
    enabled: !!id,
  });

  const { data: availableDates = [], isLoading: isLoadingDates } = useQuery({
    queryKey: ['cinema-dates', id],
    queryFn: () => fetchAvailableDatesForCinema(id || ''),
    enabled: !!id,
  });

  const { data: showtimes = [], isLoading: isLoadingShowtimes } = useQuery({
    queryKey: ['cinema-showtimes', id, selectedDate],
    queryFn: () => fetchShowtimesForCinema(id || '', selectedDate),
    enabled: !!id,
  });

  // Group showtimes by movie
  const showtimesByMovie = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.movieId]) {
      acc[showtime.movieId] = {
        movieId: showtime.movieId,
        title: showtime.movieTitle,
        tmdbTitle: showtime.tmdbTitle,
        posterPath: showtime.posterPath,
        showtimes: []
      };
    }
    acc[showtime.movieId].showtimes.push(showtime);
    return acc;
  }, {} as Record<string, MovieShowtimeGroup>);

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  // Set default date when dates are loaded
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find today's date in the available dates, or the closest future date
      let defaultDate = availableDates.find(date => 
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
      
      // If today is not available, use the first available date
      if (!defaultDate) {
        defaultDate = availableDates[0];
      }
      
      setSelectedDate(defaultDate);
    }
  }, [availableDates, selectedDate]);

  if (isLoadingCinema) {
    return (
      <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-white text-xl">Loading cinema details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-white text-xl">Cinema not found</p>
            <Button asChild className="mt-6 bg-cinema-gold text-black hover:bg-cinema-gold/90">
              <Link to="/cinemas">Back to Cinemas</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="outline" className="bg-cinema-dark-gray/50 border-cinema-dark-gray/70 text-white hover:bg-cinema-dark-gray/70 mb-4">
            <Link to="/cinemas">
              <span>Back to All Cinemas</span>
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold text-white">{cinema?.name}</h1>
          
          {cinema?.fullAddress && (
            <div className="flex items-start gap-2 mt-2 text-gray-300">
              <MapPin size={16} className="mt-1 flex-shrink-0 text-cinema-gold" />
              <p>{cinema.fullAddress}</p>
            </div>
          )}
        </div>
        
        <div className="bg-cinema-dark-gray/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-cinema-gold" />
            Movie Showtimes
          </h2>
          
          <ShowtimeFilter
            availableDates={availableDates}
            cinemas={[]}
            selectedDate={selectedDate}
            selectedCinemaId={undefined}
            onDateChange={handleDateChange}
            onCinemaChange={() => {}}
          />

          {isLoadingShowtimes || isLoadingDates ? (
            <div className="text-center py-8">
              <p className="text-white">Loading showtimes...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(showtimesByMovie).length > 0 ? (
                Object.values(showtimesByMovie).map(movie => (
                  <Card key={movie.movieId} className="bg-cinema-dark-gray/50 border-cinema-dark-gray overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <Link to={`/movie/${movie.movieId}`} className="md:w-1/4 lg:w-1/6">
                        <img 
                          src={movie.posterPath} 
                          alt={movie.tmdbTitle || movie.title}
                          className="w-full h-auto object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-white">
                            <Link to={`/movie/${movie.movieId}`} className="hover:text-cinema-gold transition-colors">
                              {movie.tmdbTitle || movie.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {movie.showtimes.map(showtime => (
                              <a 
                                key={showtime.id}
                                href={showtime.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-cinema-dark-blue/70 rounded-md px-3 py-2 text-center hover:bg-cinema-dark-blue transition-colors flex flex-col items-center"
                              >
                                <span className="text-white font-medium">{showtime.formattedTime}</span>
                                <span className="text-xs text-gray-400 mt-1">{showtime.movieFormat}</span>
                                <div className="flex items-center mt-2 text-cinema-gold">
                                  <Ticket className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Book</span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </div>
                              </a>
                            ))}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-white">
                  <p>No showtimes available for selected date.</p>
                  {availableDates.length > 0 && (
                    <p className="mt-2">Please select a different date.</p>
                  )}
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

export default CinemaDetails;
