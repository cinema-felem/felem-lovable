
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { Update } from "./UpdateForm";

interface UpdatesTableProps {
  updates: Update[];
  loading: boolean;
  onEditClick: (update: Update) => void;
  onUpdatesChange: () => void;
}

export function UpdatesTable({ updates, loading, onEditClick, onUpdatesChange }: UpdatesTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    
    try {
      const { error } = await supabase
        .from("Updates")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Update deleted successfully",
      });
      
      // Refresh data after deletion
      onUpdatesChange();
    } catch (error) {
      console.error("Error deleting update:", error);
      toast({
        title: "Error",
        description: "Failed to delete update",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="rounded-md border border-border overflow-hidden bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Model</TableHead>
            <TableHead className="font-semibold">Operation</TableHead>
            <TableHead className="font-semibold">Source Field</TableHead>
            <TableHead className="font-semibold">Source Text</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-[100px] text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cinema-gold"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : updates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No updates found
              </TableCell>
            </TableRow>
          ) : (
            updates.map((update) => (
              <TableRow key={update.id} className="border-b border-border">
                <TableCell>{update.modelName}</TableCell>
                <TableCell>{update.operation}</TableCell>
                <TableCell>{update.sourceField}</TableCell>
                <TableCell className="max-w-[200px] truncate">{update.sourceText}</TableCell>
                <TableCell>{formatDate(update.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditClick(update)}
                      className="h-8 w-8 text-cinema-light-blue hover:text-cinema-light-blue/80 hover:bg-cinema-dark-blue/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(update.id)}
                      className="h-8 w-8 text-cinema-red hover:text-cinema-red/80 hover:bg-cinema-dark-blue/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
