
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define the type for an Update record
export interface Update {
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
export const updateFormSchema = z.object({
  modelName: z.string().min(1, "Model name is required"),
  operation: z.string().min(1, "Operation is required"),
  sourceField: z.string().min(1, "Source field is required"),
  sourceText: z.string().min(1, "Source text is required"),
  destinationField: z.string().nullable(),
  destinationText: z.string().nullable(),
});

export type UpdateFormValues = z.infer<typeof updateFormSchema>;

// Dropdown options
export const MODULE_OPTIONS = ["movie"];
export const OPERATION_OPTIONS = ["update"];
export const SOURCE_FIELD_OPTIONS = ["id"];

interface UpdateFormProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  currentUpdate: Update | null;
  onSuccess: () => void;
}

export function UpdateForm({ isSheetOpen, setIsSheetOpen, currentUpdate, onSuccess }: UpdateFormProps) {
  const { toast } = useToast();
  
  // Initialize the form with react-hook-form
  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      modelName: MODULE_OPTIONS[0],
      operation: OPERATION_OPTIONS[0],
      sourceField: SOURCE_FIELD_OPTIONS[0],
      sourceText: "",
      destinationField: "",
      destinationText: "",
    },
  });

  // Update form values when currentUpdate changes
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
        modelName: MODULE_OPTIONS[0],
        operation: OPERATION_OPTIONS[0],
        sourceField: SOURCE_FIELD_OPTIONS[0],
        sourceText: "",
        destinationField: "",
        destinationText: "",
      });
    }
  }, [currentUpdate, form]);

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
      onSuccess();
    } catch (error) {
      console.error("Error saving update:", error);
      toast({
        title: "Error",
        description: "Failed to save update",
        variant: "destructive",
      });
    }
  };

  return (
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model name" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODULE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATION_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source field" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOURCE_FIELD_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
  );
}
