
import { Map } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
}

const CinemaShowtimes = ({ cinemaName, showtimes }: CinemaShowtimesProps) => {
  return (
    <div className="bg-cinema-dark-gray/30 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Map className="w-5 h-5 mr-2 text-cinema-gold" />
        {cinemaName}
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {showtimes.map((showtime) => {
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
  );
};

export default CinemaShowtimes;
