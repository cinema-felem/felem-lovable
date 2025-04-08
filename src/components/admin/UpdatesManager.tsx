
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Plus } from "lucide-react";

interface Update {
  id: number;
  modelName: string;
  operation: string;
  sourceField: string;
  sourceText: string;
  destinationField: string | null;
  destinationText: string | null;
  createdAt: string;
  updatedAt: string;
}

export function UpdatesManager() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUpdate, setNewUpdate] = useState<Partial<Update>>({
    modelName: "",
    operation: "",
    sourceField: "",
    sourceText: "",
    destinationField: "",
    destinationText: ""
  });
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  
  useEffect(() => {
    fetchUpdates();
  }, []);

  async function fetchUpdates() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("Updates")
        .select("*")
        .order("createdAt", { ascending: false });
      
      if (error) throw error;
      setUpdates(data || []);
    } catch (error: any) {
      toast.error("Error fetching updates", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  async function createUpdate() {
    if (!newUpdate.modelName || !newUpdate.operation || !newUpdate.sourceField || !newUpdate.sourceText) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const now = new Date().toISOString();
      
      // Fix: Create a complete record with all required fields
      const recordToInsert = {
        modelName: newUpdate.modelName,
        operation: newUpdate.operation,
        sourceField: newUpdate.sourceField,
        sourceText: newUpdate.sourceText,
        destinationField: newUpdate.destinationField || null,
        destinationText: newUpdate.destinationText || null,
        createdAt: now,
        updatedAt: now
      };
      
      const { error } = await supabase
        .from("Updates")
        .insert(recordToInsert);
      
      if (error) throw error;
      toast.success("Update created successfully");
      setNewUpdate({
        modelName: "",
        operation: "",
        sourceField: "",
        sourceText: "",
        destinationField: "",
        destinationText: ""
      });
      fetchUpdates();
    } catch (error: any) {
      toast.error("Error creating update", {
        description: error.message,
      });
    }
  }

  async function updateRecord() {
    if (!editingUpdate || !editingUpdate.modelName || !editingUpdate.operation || !editingUpdate.sourceField || !editingUpdate.sourceText) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("Updates")
        .update({ 
          ...editingUpdate,
          updatedAt: new Date().toISOString()
        })
        .eq("id", editingUpdate.id);
      
      if (error) throw error;
      toast.success("Update record updated successfully");
      setEditingUpdate(null);
      fetchUpdates();
    } catch (error: any) {
      toast.error("Error updating record", {
        description: error.message,
      });
    }
  }

  async function deleteUpdate(id: number) {
    try {
      const { error } = await supabase
        .from("Updates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      toast.success("Update deleted successfully");
      fetchUpdates();
    } catch (error: any) {
      toast.error("Error deleting update", {
        description: error.message,
      });
    }
  }

  const operationOptions = ["CREATE", "UPDATE", "DELETE", "TRANSFORM"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Updates Manager</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Add New Update Record</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model Name</label>
                  <Input
                    placeholder="Model Name"
                    value={newUpdate.modelName}
                    onChange={(e) => setNewUpdate({...newUpdate, modelName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Operation</label>
                  <Select 
                    value={newUpdate.operation} 
                    onValueChange={(value) => setNewUpdate({...newUpdate, operation: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      {operationOptions.map(op => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Field</label>
                <Input
                  placeholder="Source Field"
                  value={newUpdate.sourceField}
                  onChange={(e) => setNewUpdate({...newUpdate, sourceField: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Text</label>
                <Textarea
                  placeholder="Source Text"
                  value={newUpdate.sourceText}
                  onChange={(e) => setNewUpdate({...newUpdate, sourceText: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Field (Optional)</label>
                <Input
                  placeholder="Destination Field"
                  value={newUpdate.destinationField || ""}
                  onChange={(e) => setNewUpdate({...newUpdate, destinationField: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Text (Optional)</label>
                <Textarea
                  placeholder="Destination Text"
                  value={newUpdate.destinationText || ""}
                  onChange={(e) => setNewUpdate({...newUpdate, destinationText: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={createUpdate}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : updates.length === 0 ? (
        <p>No updates found. Create a new one to get started.</p>
      ) : (
        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{update.modelName}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {update.operation}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Source Field: {update.sourceField}</p>
                        <p className="text-sm mt-1 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                          {update.sourceText}
                        </p>
                      </div>
                      {update.destinationField && (
                        <div>
                          <p className="text-xs text-muted-foreground">Destination Field: {update.destinationField}</p>
                          <p className="text-sm mt-1 bg-gray-50 p-2 rounded max-h-20 overflow-y-auto">
                            {update.destinationText}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(update.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setEditingUpdate(update)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Edit Update Record</DialogTitle>
                        </DialogHeader>
                        {editingUpdate && (
                          <div className="py-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Model Name</label>
                                <Input
                                  placeholder="Model Name"
                                  value={editingUpdate.modelName}
                                  onChange={(e) => setEditingUpdate({...editingUpdate, modelName: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Operation</label>
                                <Select 
                                  value={editingUpdate.operation} 
                                  onValueChange={(value) => setEditingUpdate({...editingUpdate, operation: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select operation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {operationOptions.map(op => (
                                      <SelectItem key={op} value={op}>{op}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Source Field</label>
                              <Input
                                placeholder="Source Field"
                                value={editingUpdate.sourceField}
                                onChange={(e) => setEditingUpdate({...editingUpdate, sourceField: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Source Text</label>
                              <Textarea
                                placeholder="Source Text"
                                value={editingUpdate.sourceText}
                                onChange={(e) => setEditingUpdate({...editingUpdate, sourceText: e.target.value})}
                                rows={3}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Destination Field (Optional)</label>
                              <Input
                                placeholder="Destination Field"
                                value={editingUpdate.destinationField || ""}
                                onChange={(e) => setEditingUpdate({...editingUpdate, destinationField: e.target.value})}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Destination Text (Optional)</label>
                              <Textarea
                                placeholder="Destination Text"
                                value={editingUpdate.destinationText || ""}
                                onChange={(e) => setEditingUpdate({...editingUpdate, destinationText: e.target.value})}
                                rows={3}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={updateRecord}>Save</Button>
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
                        <p>Are you sure you want to delete this update? This action cannot be undone.</p>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button 
                            variant="destructive" 
                            onClick={() => deleteUpdate(update.id)}
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
