
import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StreamingProvidersProps {
  providers?: string[] | null;
}

const StreamingProviders = ({ providers }: StreamingProvidersProps) => {
  // Return null if providers is null, undefined, or an empty array
  if (!providers || providers.length === 0) return null;
  
  return (
    <div className="bg-cinema-dark-gray/30 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Video className="w-5 h-5 mr-2 text-cinema-gold" />
        Available on
      </h3>
      <div className="flex flex-wrap gap-2">
        {providers.map((provider: string, index: number) => (
          <Badge key={index} variant="outline" className="bg-cinema-dark-gray/50 text-white">
            {provider}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default StreamingProviders;
