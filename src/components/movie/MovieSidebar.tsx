
import StreamingProviders from "./StreamingProviders";

interface MovieSidebarProps {
  movie: {
    title: string;
    posterPath: string;
    streamingProviders?: string[];
  };
}

const MovieSidebar = ({ movie }: MovieSidebarProps) => {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
      <img 
        src={movie.posterPath} 
        alt={`${movie.title} poster`}
        className="w-full h-auto rounded-lg poster-shadow animate-fade-in"
      />
      
      <div className="mt-6 space-y-4">
        <StreamingProviders providers={movie.streamingProviders} />
      </div>
    </div>
  );
};

export default MovieSidebar;
