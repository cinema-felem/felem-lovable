
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash, Plus } from "lucide-react";

interface GarbageTitle {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function GarbageTitleManager() {
  const [titles, setTitles] = useState<GarbageTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState<GarbageTitle | null>(null);
  
  useEffect(() => {
    fetchTitles();
  }, []);

  async function fetchTitles() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("GarbageTitle")
        .select("*")
        .order("createdAt", { ascending: false });
      
      if (error) throw error;
      setTitles(data || []);
    } catch (error: any) {
      toast.error("Error fetching titles", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function createTitle() {
    if (!newTitle.trim()) return;
    
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("GarbageTitle")
        .insert([{ 
          title: newTitle,
          createdAt: now,
          updatedAt: now
        }]);
      
      if (error) throw error;
      toast.success("Title created successfully");
      setNewTitle("");
      fetchTitles();
    } catch (error: any) {
      toast.error("Error creating title", {
        description: error.message,
      });
    }
  }

  async function updateTitle() {
    if (!editingTitle || !editingTitle.title.trim()) return;
    
    try {
      const { error } = await supabase
        .from("GarbageTitle")
        .update({ 
          title: editingTitle.title,
          updatedAt: new Date().toISOString()
        })
        .eq("id", editingTitle.id);
      
      if (error) throw error;
      toast.success("Title updated successfully");
      setEditingTitle(null);
      fetchTitles();
    } catch (error: any) {
      toast.error("Error updating title", {
        description: error.message,
      });
    }
  }

  async function deleteTitle(id: number) {
    try {
      const { error } = await supabase
        .from("GarbageTitle")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Title deleted successfully");
      fetchTitles();
    } catch (error: any) {
      toast.error("Error deleting title", {
        description: error.message,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Garbage Titles Manager</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Title
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Garbage Title</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={createTitle}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : titles.length === 0 ? (
        <p>No titles found. Create a new one to get started.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {titles.map((title) => (
            <Card key={title.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium break-words">{title.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(title.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingTitle(title)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Garbage Title</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            placeholder="Enter title"
                            value={editingTitle?.title || ""}
                            onChange={(e) => setEditingTitle(prev => 
                              prev ? { ...prev, title: e.target.value } : null
                            )}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={updateTitle}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this title? This action cannot be undone.</p>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button 
                            variant="destructive" 
                            onClick={() => deleteTitle(title.id)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
