
import { Film } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieCastProps {
  cast?: string[];
  director?: string;
}

const MovieCast = ({ cast, director }: MovieCastProps) => {
  const hasCast = cast && cast.length > 0 && cast[0] !== "Cast information not available";
  const hasDirector = director && director !== "Director information not available";
  
  if (!hasCast && !hasDirector) return null;
  
  return (
    <div className="space-y-6 animate-slide-up">
      {hasCast && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2 flex items-center">
            <Film className="w-4 h-4 mr-2 text-cinema-gold" />
            Cast
          </h3>
          <div className="flex flex-wrap gap-2">
            {cast?.map((actor: string) => (
              <Badge key={actor} variant="outline" className="bg-cinema-dark-gray/50 text-white">
                {actor}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {hasDirector && (
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">Director</h3>
          <p className="text-gray-300">{director}</p>
        </div>
      )}
    </div>
  );
};

export default MovieCast;
