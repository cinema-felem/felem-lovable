
import StreamingProviders from "./StreamingProviders";
import ExternalLinks from "./ExternalLinks";

interface MovieSidebarProps {
  movie: {
    title: string;
    tmdbTitle?: string;
    posterPath: string;
    streamingProviders?: string[];
    externalIds?: {
      imdb_id?: string;
      facebook_id?: string;
      instagram_id?: string;
      twitter_id?: string;
      letterboxd_id?: string;
    };
  };
}

const MovieSidebar = ({ movie }: MovieSidebarProps) => {
  // Prioritize tmdbTitle if available, otherwise use title
  const displayTitle = movie.tmdbTitle || movie.title;
  
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
      <img 
        src={movie.posterPath} 
        alt={`${displayTitle} poster`}
        className="w-full h-auto rounded-lg poster-shadow animate-fade-in"
      />
      
      <div className="mt-6 space-y-4">
        <StreamingProviders providers={movie.streamingProviders} />
        
        {/* Add External Links */}
        <ExternalLinks externalIds={movie.externalIds} title={displayTitle} />
      </div>
    </div>
  );
};

export default MovieSidebar;
