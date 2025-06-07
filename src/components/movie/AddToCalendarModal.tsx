
import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  showtime: {
    time: string;
    movieFormat: string;
    unixTime: number;
    link: string;
  };
  movieTitle: string;
  cinemaName: string;
}

const AddToCalendarModal = ({ 
  isOpen, 
  onClose, 
  showtime, 
  movieTitle, 
  cinemaName 
}: AddToCalendarModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDateForCalendar = (unixTime: number) => {
    const date = new Date(unixTime);
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const generateGoogleCalendarUrl = () => {
    const startDate = formatDateForCalendar(showtime.unixTime);
    // Assume 2 hour duration for the movie
    const endDate = formatDateForCalendar(showtime.unixTime + (2 * 60 * 60 * 1000));
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `${movieTitle} - ${showtime.movieFormat}`,
      dates: `${startDate}/${endDate}`,
      details: `Movie: ${movieTitle}\nFormat: ${showtime.movieFormat}\nCinema: ${cinemaName}\nBook tickets: ${showtime.link}`,
      location: cinemaName,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const generateICSFile = () => {
    setIsGenerating(true);
    
    const startDate = formatDateForCalendar(showtime.unixTime);
    const endDate = formatDateForCalendar(showtime.unixTime + (2 * 60 * 60 * 1000));
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Felem Movies//Movie Calendar//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${movieTitle} - ${showtime.movieFormat}`,
      `DESCRIPTION:Movie: ${movieTitle}\\nFormat: ${showtime.movieFormat}\\nCinema: ${cinemaName}\\nBook tickets: ${showtime.link}`,
      `LOCATION:${cinemaName}`,
      `UID:${Date.now()}@felem.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${movieTitle.replace(/[^a-zA-Z0-9]/g, '_')}_showtime.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setIsGenerating(false), 1000);
  };

  const showtimeDate = new Date(showtime.unixTime);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-cinema-dark-gray border-cinema-dark-gray">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-cinema-gold" />
            Add to Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-cinema-dark-blue/30 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">{movieTitle}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Cinema:</strong> {cinemaName}</p>
              <p><strong>Date & Time:</strong> {format(showtimeDate, 'EEEE, MMMM do, yyyy \'at\' h:mm a')}</p>
              <div className="flex items-center gap-2">
                <strong>Format:</strong>
                <Badge className="bg-cinema-gold/20 text-cinema-gold border-cinema-gold">
                  {showtime.movieFormat}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => window.open(generateGoogleCalendarUrl(), '_blank')}
              className="w-full bg-cinema-gold hover:bg-cinema-gold/90 text-black font-medium"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Google Calendar
            </Button>
            
            <Button
              onClick={generateICSFile}
              disabled={isGenerating}
              variant="outline"
              className="w-full border-cinema-gold text-cinema-gold hover:bg-cinema-gold/10"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Calendar File (.ics)'}
            </Button>
          </div>

          <div className="text-xs text-gray-400 text-center">
            The .ics file works with Apple Calendar, Outlook, and other calendar applications
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCalendarModal;
