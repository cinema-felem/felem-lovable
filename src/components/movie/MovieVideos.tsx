
import { Film, Video } from "lucide-react";

interface VideoItem {
  type: string;
  key: string;
  site: string;
  name: string;
}

interface MovieVideosProps {
  videos?: VideoItem[];
}

const MovieVideos = ({ videos }: MovieVideosProps) => {
  if (!videos || videos.length === 0) {
    return null;
  }

  // Find official trailers first (prefer YouTube videos)
  const officialTrailers = videos.filter(
    video => 
      video.site?.toLowerCase() === "youtube" && 
      video.type?.toLowerCase() === "trailer"
  );

  // If no official trailers, try to get any YouTube video
  const youtubeVideos = videos.filter(
    video => video.site?.toLowerCase() === "youtube"
  );

  // Use trailers if available, otherwise use any YouTube video
  const displayVideos = officialTrailers.length > 0 
    ? officialTrailers 
    : youtubeVideos;

  // Only display up to 3 videos
  const limitedVideos = displayVideos.slice(0, 3);

  if (limitedVideos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 animate-slide-up">
      <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
        <Film className="mr-2" /> Videos & Trailers
      </h3>
      
      <div className="space-y-4">
        {limitedVideos.map((video, index) => (
          <div key={index} className="aspect-video rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.key}`}
              title={video.name || "Movie Trailer"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieVideos;
