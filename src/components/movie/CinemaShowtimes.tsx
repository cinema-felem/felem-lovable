
import { useState } from "react";
import { Map } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import AddToCalendarModal from "./AddToCalendarModal";

interface Showtime {
  id: number;
  time: string;
  movieFormat: string;
  unixTime: number;
  link: string;
}

interface CinemaShowtimesProps {
  cinemaName: string;
  showtimes: Showtime[];
  movieTitle?: string;
}

const CinemaShowtimes = ({ cinemaName, showtimes, movieTitle = "Movie" }: CinemaShowtimesProps) => {
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowtimeClick = (e: React.MouseEvent, showtime: Showtime) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedShowtime(showtime);
    setIsModalOpen(true);
  };

  const handleTicketLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="bg-cinema-dark-gray/30 rounded-lg p-5">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Map className="w-5 h-5 mr-2 text-cinema-gold" />
          {cinemaName}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {showtimes.map((showtime) => {
            const date = new Date(showtime.unixTime);
            
            return (
              <div 
                key={showtime.id} 
                onClick={(e) => handleShowtimeClick(e, showtime)}
                className="bg-cinema-dark-gray/50 rounded p-3 hover:bg-cinema-dark-gray transition-colors cursor-pointer relative group"
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
                
                {/* Tickets button that appears on hover */}
                <button
                  onClick={(e) => handleTicketLinkClick(e, showtime.link)}
                  className="absolute inset-0 bg-cinema-gold/90 text-black font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-sm"
                >
                  Get Tickets
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {selectedShowtime && (
        <AddToCalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showtime={selectedShowtime}
          movieTitle={movieTitle}
          cinemaName={cinemaName}
        />
      )}
    </>
  );
};

export default CinemaShowtimes;
