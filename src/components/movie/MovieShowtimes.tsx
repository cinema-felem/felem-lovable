
import { useState } from "react";
import { Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShowtimeFilter from "@/components/ShowtimeFilter";
import { CinemaOption } from "@/services/types";
import CinemaShowtimes from "./CinemaShowtimes";

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
            <CinemaShowtimes 
              key={cinemaName}
              cinemaName={cinemaName}
              showtimes={cinemaTimes}
            />
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
