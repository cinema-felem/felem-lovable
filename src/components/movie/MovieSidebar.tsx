
import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MovieSidebarProps {
  movie: {
    title: string;
    posterPath: string;
    streamingProviders?: string[];
  };
}

const MovieSidebar = ({ movie }: MovieSidebarProps) => {
  const hasStreamingProviders = movie.streamingProviders && movie.streamingProviders.length > 0;
  
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
      <img 
        src={movie.posterPath} 
        alt={`${movie.title} poster`}
        className="w-full h-auto rounded-lg poster-shadow animate-fade-in"
      />
      
      <div className="mt-6 space-y-4">
        {hasStreamingProviders && (
          <div className="bg-cinema-dark-gray/30 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Video className="w-5 h-5 mr-2 text-cinema-gold" />
              Available on
            </h3>
            <div className="flex flex-wrap gap-2">
              {movie.streamingProviders?.map((provider: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-cinema-dark-gray/50 text-white">
                  {provider}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieSidebar;
