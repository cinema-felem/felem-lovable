
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Plus, 
  Edit, 
  Trash2
} from "lucide-react";

// Define the type for an Update record
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

// Define the validation schema for the form
const updateFormSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  operation: z.string().min(1, "Operation is required"),
  sourceField: z.string().min(1, "Source field is required"),
  sourceText: z.string().min(1, "Source text is required"),
  destinationField: z.string().nullable(),
  destinationText: z.string().nullable(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

export function UpdatesManager() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState<Update | null>(null);
  const { toast } = useToast();

  // Initialize the form with react-hook-form
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      modelName: "",
      operation: "",
      sourceField: "",
      sourceText: "",
      destinationField: "",
      destinationText: "",
    },
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  useEffect(() => {
    if (currentUpdate) {
      form.reset({
        modelName: currentUpdate.modelName,
        operation: currentUpdate.operation,
        sourceField: currentUpdate.sourceField,
        sourceText: currentUpdate.sourceText,
        destinationField: currentUpdate.destinationField || "",
        destinationText: currentUpdate.destinationText || "",
      });
    } else {
      form.reset({
        modelName: "",
        operation: "",
        sourceField: "",
        sourceText: "",
        destinationField: "",
        destinationText: "",
      });
    }
  }, [currentUpdate, form]);

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    
    try {
      const { error } = await supabase
        .from("Updates")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setUpdates(updates.filter(update => update.id !== id));
      
      toast({
        title: "Success",
        description: "Update deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting update:", error);
      toast({
        title: "Error",
        description: "Failed to delete update",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: UpdateFormValues) => {
    try {
      const timestamp = new Date().toISOString();
      
      if (currentUpdate) {
        // Update existing record
        const { error } = await supabase
          .from("Updates")
          .update({
            modelName: values.modelName,
            operation: values.operation,
            sourceField: values.sourceField,
            sourceText: values.sourceText,
            destinationField: values.destinationField,
            destinationText: values.destinationText,
            updatedAt: timestamp,
          })
          .eq("id", currentUpdate.id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Update modified successfully",
        });
      } else {
        // Create new record - ensure all required fields are present
        const { error } = await supabase
          .from("Updates")
          .insert({
            modelName: values.modelName,
            operation: values.operation,
            sourceField: values.sourceField,
            sourceText: values.sourceText,
            destinationField: values.destinationField,
            destinationText: values.destinationText,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "New update created successfully",
        });
      }
      
      // Close the sheet and refresh the data
      setIsSheetOpen(false);
      fetchUpdates();
    } catch (error) {
      console.error("Error saving update:", error);
      toast({
        title: "Error",
        description: "Failed to save update",
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
                        onClick={() => openEditSheet(update)}
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

      {/* Form Sheet for creating/editing updates */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{currentUpdate ? "Edit Update" : "Create New Update"}</SheetTitle>
            <SheetDescription>
              {currentUpdate 
                ? "Make changes to the existing update record." 
                : "Add a new update record to the database."}
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="modelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Movie, Cinema" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. update, create" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Field</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. title, name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sourceText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Text</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Original value" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Field (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. title, name" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Text (optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="New value" 
                          className="min-h-[80px]"
                          {...field}
                          value={field.value || ""} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {currentUpdate ? "Save Changes" : "Create Update"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
