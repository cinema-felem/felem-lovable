
import { Film, Play } from "lucide-react";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogTrigger 
} from "@/components/ui/dialog";

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {limitedVideos.map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
      </div>
    </div>
  );
};

interface VideoCardProps {
  video: VideoItem;
}

const VideoCard = ({ video }: VideoCardProps) => {
  // Get thumbnail from YouTube
  const thumbnailUrl = `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`;
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer group">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt={video.name || "Movie Trailer"} 
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/40 rounded-full p-3 group-hover:bg-primary/80 transition-colors">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-white line-clamp-1">{video.name}</p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-none w-[90vw] md:w-[75vw] lg:w-[50vw] max-h-[90vh] p-0">
        <div className="w-full h-full aspect-video">
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
      </DialogContent>
    </Dialog>
  );
};

export default MovieVideos;
