
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CinemaOption } from "@/services/showtimeService";
import { cn } from "@/lib/utils";

interface ShowtimeFilterProps {
  availableDates: Date[];
  cinemas: CinemaOption[];
  selectedDate: Date | undefined;
  selectedCinemaId: string | undefined;
  onDateChange: (date: Date | undefined) => void;
  onCinemaChange: (cinemaId: string | undefined) => void;
}

const ShowtimeFilter: React.FC<ShowtimeFilterProps> = ({
  availableDates,
  cinemas,
  selectedDate,
  selectedCinemaId,
  onDateChange,
  onCinemaChange,
}) => {
  const hasAvailableDates = availableDates.length > 0;
  const hasCinemas = cinemas.length > 0;

  // This function disables dates in the calendar that don't have showtimes
  const isDateAvailable = (date: Date) => {
    if (!hasAvailableDates) return false;
    
    return !availableDates.some(
      availableDate => 
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() && 
        availableDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-cinema-dark-gray/50 border-cinema-dark-gray/70 hover:bg-cinema-dark-gray/70 text-white justify-start text-left w-full sm:w-[240px]",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={!hasAvailableDates}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-cinema-gold" />
            {selectedDate ? (
              format(selectedDate, "MMMM d, yyyy")
            ) : (
              <span>Select date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-cinema-dark-gray border-cinema-dark-gray/70" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            disabled={isDateAvailable}
            initialFocus
            className="p-3 pointer-events-auto text-white"
            classNames={{
              day_selected: "bg-cinema-gold text-black hover:bg-cinema-gold/90 hover:text-black",
              day_today: "bg-cinema-dark-blue text-white",
              day: "text-white hover:bg-cinema-dark-blue/70",
              head_cell: "text-cinema-gold"
            }}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={selectedCinemaId}
        onValueChange={(value) => onCinemaChange(value || undefined)}
        disabled={!hasCinemas}
      >
        <SelectTrigger 
          className="bg-cinema-dark-gray/50 border-cinema-dark-gray/70 text-white w-full sm:w-[240px]"
        >
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-cinema-gold" />
            <SelectValue placeholder="All cinemas" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-cinema-dark-gray border-cinema-dark-gray/70">
          <SelectItem value="all" className="text-white hover:bg-cinema-dark-blue/70">
            All cinemas
          </SelectItem>
          {cinemas.map((cinema) => (
            <SelectItem 
              key={cinema.id} 
              value={cinema.id}
              className="text-white hover:bg-cinema-dark-blue/70"
            >
              {cinema.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShowtimeFilter;
