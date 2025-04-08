
import { useState } from "react";
import { Map, Ticket, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ShowtimeFilter from "@/components/ShowtimeFilter";
import { CinemaOption } from "@/services/showtimeService";

interface Showtime {
  id: number;
  cinemaId: string;
  cinemaName: string;
  date: string;
  time: string;
  movieFormat: string;
  ticketType: string;
  link: string;
  unixTime: number;
}

interface MovieShowtimesProps {
  showtimes: Showtime[];
  availableDates: Date[];
  cinemas: CinemaOption[];
  onDateChange: (date: Date | undefined) => void;
  onCinemaChange: (cinemaId: string | undefined) => void;
}

const MovieShowtimes = ({ 
  showtimes, 
  availableDates, 
  cinemas,
  onDateChange,
  onCinemaChange
}: MovieShowtimesProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    availableDates.length > 0 ? availableDates[0] : undefined
  );
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | undefined>(undefined);
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    onDateChange(date);
  };
  
  const handleCinemaChange = (cinemaId: string | undefined) => {
    // If the value is "all", set it to undefined to show all cinemas
    const newCinemaId = cinemaId === "all" ? undefined : cinemaId;
    setSelectedCinemaId(newCinemaId);
    onCinemaChange(newCinemaId);
  };
  
  const clearFilters = () => {
    setSelectedDate(availableDates.length > 0 ? availableDates[0] : undefined);
    setSelectedCinemaId(undefined);
    onDateChange(availableDates.length > 0 ? availableDates[0] : undefined);
    onCinemaChange(undefined);
  };
  
  const showtimesByCinema = showtimes.reduce((acc, showtime) => {
    if (!acc[showtime.cinemaName]) {
      acc[showtime.cinemaName] = [];
    }
    acc[showtime.cinemaName].push(showtime);
    return acc;
  }, {} as Record<string, Showtime[]>);
  
  const hasActiveFilters = selectedCinemaId !== undefined;
  
  return (
    <div className="mt-12 mb-16 animate-slide-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Ticket className="w-6 h-6 mr-2 text-cinema-gold" />
        Showtimes
      </h2>
      
      <div className="mb-6">
        <ShowtimeFilter 
          availableDates={availableDates}
          cinemas={cinemas}
          selectedDate={selectedDate}
          selectedCinemaId={selectedCinemaId}
          onDateChange={handleDateChange}
          onCinemaChange={handleCinemaChange}
        />
        
        {hasActiveFilters && (
          <div className="flex items-center mt-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
              className="text-cinema-gold hover:text-cinema-gold/80 hover:bg-cinema-dark-gray/30"
            >
              <X className="h-4 w-4 mr-1" /> Clear filters
            </Button>
          </div>
        )}
      </div>
      
      {Object.keys(showtimesByCinema).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(showtimesByCinema).map(([cinemaName, cinemaTimes]) => (
            <div key={cinemaName} className="bg-cinema-dark-gray/30 rounded-lg p-5">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Map className="w-5 h-5 mr-2 text-cinema-gold" />
                {cinemaName}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cinemaTimes.map((showtime) => {
                  const date = new Date(showtime.unixTime * 1000);
                  
                  return (
                    <a 
                      key={showtime.id} 
                      href={showtime.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-cinema-dark-gray/50 rounded p-3 hover:bg-cinema-dark-gray transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-cinema-gold font-medium">
                          {format(date, 'h:mm a')}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {format(date, 'EEE, MMM d')}
                        </span>
                        {showtime.movieFormat && (
                          <Badge className="mt-2 w-fit bg-cinema-dark-blue/70 text-white">
                            {showtime.movieFormat}
                          </Badge>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-cinema-dark-gray/30 rounded-lg p-5 text-center">
          <p className="text-white">No showtimes found for the selected filters.</p>
          <Button 
            variant="outline" 
            className="mt-3 border-cinema-gold text-cinema-gold hover:bg-cinema-gold/10"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default MovieShowtimes;
