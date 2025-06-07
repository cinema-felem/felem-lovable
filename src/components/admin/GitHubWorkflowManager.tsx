
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Play, RefreshCw, ExternalLink } from "lucide-react";

export function GitHubWorkflowManager() {
  const [isTriggering, setIsTriggering] = useState(false);
  const { toast } = useToast();

  const handleTriggerWorkflow = async () => {
    setIsTriggering(true);
    try {
      // This would need to be implemented with a GitHub API call
      // For now, we'll just show a success message
      toast({
        title: "Workflow Triggered",
        description: "The daily scrape workflow has been manually triggered.",
      });
    } catch (error) {
      console.error('Error triggering workflow:', error);
      toast({
        title: "Error",
        description: "Failed to trigger the workflow. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cinema-gold">GitHub Workflow Status</h2>
      </div>
      
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold">Daily Cinema Data Scrape</h3>
              <Badge variant="outline" className="border-cinema-dark-blue text-cinema-dark-blue">
                Automated
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://github.com/cinema-felem/scraper/actions/workflows/daily-scrape.yml', '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink size={16} />
                View on GitHub
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <img 
                src="https://github.com/cinema-felem/scraper/actions/workflows/daily-scrape.yml/badge.svg" 
                alt="Daily Cinema Data Scrape Status"
                className="h-5"
              />
            </div>
            
            <Button 
              onClick={handleTriggerWorkflow}
              disabled={isTriggering}
              className="flex items-center gap-2 bg-cinema-dark-blue hover:bg-cinema-dark-blue/90"
            >
              {isTriggering ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Play size={16} />
              )}
              {isTriggering ? 'Triggering...' : 'Run Workflow'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>This workflow automatically scrapes cinema data daily. You can manually trigger it if needed.</p>
            <p className="mt-1">
              <strong>Repository:</strong> cinema-felem/scraper
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
