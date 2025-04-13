
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UpdateForm, Update } from "./updates/UpdateForm";
import { UpdatesTable } from "./updates/UpdatesTable";

export function UpdatesManager() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState<Update | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Updates")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      
      setUpdates(data || []);
    } catch (error) {
      console.error("Error fetching updates:", error);
      toast({
        title: "Error",
        description: "Failed to load updates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCreateSheet = () => {
    setCurrentUpdate(null);
    setIsSheetOpen(true);
  };

  const openEditSheet = (update: Update) => {
    setCurrentUpdate(update);
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cinema-gold">Updates Management</h2>
        <Button 
          variant="default" 
          size="sm" 
          className="flex items-center gap-2 bg-cinema-dark-blue"
          onClick={openCreateSheet}
        >
          <Plus size={16} /> Add Update
        </Button>
      </div>

      <UpdatesTable 
        updates={updates} 
        loading={loading} 
        onEditClick={openEditSheet} 
        onUpdatesChange={fetchUpdates} 
      />

      <UpdateForm 
        isSheetOpen={isSheetOpen} 
        setIsSheetOpen={setIsSheetOpen} 
        currentUpdate={currentUpdate} 
        onSuccess={fetchUpdates} 
      />
    </div>
  );
}
