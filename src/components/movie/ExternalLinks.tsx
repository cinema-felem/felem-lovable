
import { ExternalLink } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExternalLinksProps {
  externalIds?: {
    imdb_id?: string;
    facebook_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    letterboxd_id?: string;
  };
  title: string;
}

const ExternalLinks = ({ externalIds, title }: ExternalLinksProps) => {
  if (!externalIds) return null;
  
  const hasAnyLink = 
    externalIds.imdb_id || 
    externalIds.facebook_id || 
    externalIds.instagram_id || 
    externalIds.twitter_id ||
    externalIds.letterboxd_id;
  
  if (!hasAnyLink) return null;
  
  return (
    <div className="mt-6 animate-slide-up">
      <h3 className="text-xl text-white font-semibold mb-4 flex items-center">
        <ExternalLink className="mr-2" /> External Links
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {externalIds.imdb_id && (
          <ExternalLinkButton 
            url={`https://www.imdb.com/title/${externalIds.imdb_id}`}
            label="IMDb"
            title={title}
          />
        )}
        
        {externalIds.letterboxd_id && (
          <ExternalLinkButton 
            url={`https://letterboxd.com/film/${externalIds.letterboxd_id}`}
            label="Letterboxd"
            title={title}
          />
        )}
        
        {externalIds.facebook_id && (
          <ExternalLinkButton 
            url={`https://www.facebook.com/${externalIds.facebook_id}`}
            label="Facebook"
            title={title}
          />
        )}
        
        {externalIds.instagram_id && (
          <ExternalLinkButton 
            url={`https://www.instagram.com/${externalIds.instagram_id}`}
            label="Instagram"
            title={title}
          />
        )}
        
        {externalIds.twitter_id && (
          <ExternalLinkButton 
            url={`https://twitter.com/${externalIds.twitter_id}`}
            label="Twitter"
            title={title}
          />
        )}
      </div>
    </div>
  );
};

interface ExternalLinkButtonProps {
  url: string;
  label: string;
  title: string;
}

const ExternalLinkButton = ({ url, label, title }: ExternalLinkButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-cinema-dark-gray/50 hover:bg-cinema-dark-gray/70 transition-colors px-4 py-2 rounded-full text-white flex items-center gap-2"
          >
            {label}
            <ExternalLink className="w-4 h-4" />
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>View {title} on {label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ExternalLinks;
