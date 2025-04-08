
import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieGenresProps {
  genres?: string[];
}

const MovieGenres = ({ genres }: MovieGenresProps) => {
  if (!genres || genres.length === 0) return null;
  
  return (
    <div className="mb-6 animate-slide-up">
      <h3 className="text-white font-semibold mb-2 flex items-center">
        <Tag className="w-4 h-4 mr-2 text-cinema-gold" />
        Genres
      </h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre: string) => (
          <Badge key={genre} variant="outline" className="bg-cinema-dark-gray/50 text-white">
            {genre}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default MovieGenres;
