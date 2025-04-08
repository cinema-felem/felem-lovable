
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Loader2, Pencil, Trash, Plus, Filter, ArrowUpDown } from "lucide-react";

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
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterModel, setFilterModel] = useState<string>("");
  const [filterOperation, setFilterOperation] = useState<string>("");
  
  const [newUpdate, setNewUpdate] = useState<Partial<Update>>({
    modelName: "",
    operation: "",
    sourceField: "",
    sourceText: "",
    destinationField: "",
    destinationText: ""
  });
  
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define available operations - now limited to MERGE and DELETE for updates
  const availableOperations = ["MERGE", "DELETE"];
  // Full operations list for filtering
  const allOperations = ["MERGE", "DELETE", "CREATE", "TRANSFORM", "UPDATE"];
  
  useEffect(() => {
    fetchUpdates();
  }, [currentPage, itemsPerPage, sortField, sortDirection, filterModel, filterOperation]);

  async function fetchUpdates() {
    setLoading(true);
    try {
      let query = supabase
        .from("Updates")
        .select("*", { count: "exact" });
      
      if (filterModel) {
        query = query.ilike("modelName", `%${filterModel}%`);
      }
      
      if (filterOperation && filterOperation !== "all-operations") {
        query = query.eq("operation", filterOperation);
      }
      
      query = query.order(sortField, { ascending: sortDirection === "asc" });
      
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      setUpdates(data || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error("Error fetching updates", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setNewUpdate({
      modelName: "",
      operation: "",
      sourceField: "",
      sourceText: "",
      destinationField: "",
      destinationText: ""
    });
    setEditingUpdate(null);
    setIsSubmitting(false);
  }

  function validateForm(update: Partial<Update>): boolean {
    if (!update.modelName || !update.operation || !update.sourceField || !update.sourceText) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }

  async function createUpdate() {
    if (!validateForm(newUpdate)) return;
    
    setIsSubmitting(true);
    try {
      const now = new Date().toISOString();
      
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
      resetForm();
      fetchUpdates();
    } catch (error: any) {
      toast.error("Error creating update", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateRecord() {
    if (!editingUpdate || !validateForm(editingUpdate)) return;
    
    setIsSubmitting(true);
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
      resetForm();
      fetchUpdates();
    } catch (error: any) {
      toast.error("Error updating record", {
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
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

  function handleSort(field: string) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  }

  function handleFilterChange() {
    setCurrentPage(1);
  }

  function clearFilters() {
    setFilterModel("");
    setFilterOperation("");
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
                  <label className="text-sm font-medium">Model Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Model Name"
                    value={newUpdate.modelName}
                    onChange={(e) => setNewUpdate({...newUpdate, modelName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Operation <span className="text-red-500">*</span></label>
                  <Select 
                    value={newUpdate.operation} 
                    onValueChange={(value) => setNewUpdate({...newUpdate, operation: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      {allOperations.map(op => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Field <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Source Field"
                  value={newUpdate.sourceField}
                  onChange={(e) => setNewUpdate({...newUpdate, sourceField: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Text <span className="text-red-500">*</span></label>
                <Textarea
                  placeholder="Source Text"
                  value={newUpdate.sourceText}
                  onChange={(e) => setNewUpdate({...newUpdate, sourceText: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Field</label>
                <Input
                  placeholder="Destination Field"
                  value={newUpdate.destinationField || ""}
                  onChange={(e) => setNewUpdate({...newUpdate, destinationField: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Destination Text</label>
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
              <Button 
                onClick={createUpdate} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model Name</label>
              <Input
                placeholder="Filter by model"
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                onBlur={handleFilterChange}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Operation</label>
              <Select 
                value={filterOperation} 
                onValueChange={(value) => {
                  setFilterOperation(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All operations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-operations">All operations</SelectItem>
                  {allOperations.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <div className="ml-auto">
              <Select 
                value={String(itemsPerPage)} 
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading updates...</span>
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-white rounded-md shadow p-8 text-center">
          <p className="text-lg text-muted-foreground mb-4">No updates found matching your criteria.</p>
          <p className="text-sm text-muted-foreground">Try clearing filters or create a new update to get started.</p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("modelName")}
                >
                  <div className="flex items-center">
                    Model Name
                    {sortField === "modelName" && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("operation")}
                >
                  <div className="flex items-center">
                    Operation
                    {sortField === "operation" && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead>Source Field</TableHead>
                <TableHead>Source Text</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead 
                  className="cursor-pointer" 
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Created
                    {sortField === "createdAt" && (
                      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell className="font-medium">{update.modelName}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      update.operation === 'MERGE' ? 'bg-blue-100 text-blue-800' : 
                      update.operation === 'DELETE' ? 'bg-red-100 text-red-800' :
                      update.operation === 'CREATE' ? 'bg-green-100 text-green-800' :
                      update.operation === 'TRANSFORM' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {update.operation}
                    </span>
                  </TableCell>
                  <TableCell>{update.sourceField}</TableCell>
                  <TableCell className="max-w-xs truncate" title={update.sourceText}>
                    {update.sourceText.length > 50 ? `${update.sourceText.substring(0, 50)}...` : update.sourceText}
                  </TableCell>
                  <TableCell>
                    {update.destinationField && (
                      <span className="text-xs font-medium text-gray-700">
                        {update.destinationField}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(update.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
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
                                  <label className="text-sm font-medium">Model Name <span className="text-red-500">*</span></label>
                                  <Input
                                    placeholder="Model Name"
                                    value={editingUpdate.modelName}
                                    onChange={(e) => setEditingUpdate({...editingUpdate, modelName: e.target.value})}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Operation <span className="text-red-500">*</span></label>
                                  <Select 
                                    value={editingUpdate.operation} 
                                    onValueChange={(value) => setEditingUpdate({...editingUpdate, operation: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select operation" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableOperations.map(op => (
                                        <SelectItem key={op} value={op}>{op}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Source Field <span className="text-red-500">*</span></label>
                                <Input
                                  placeholder="Source Field"
                                  value={editingUpdate.sourceField}
                                  onChange={(e) => setEditingUpdate({...editingUpdate, sourceField: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Source Text <span className="text-red-500">*</span></label>
                                <Textarea
                                  placeholder="Source Text"
                                  value={editingUpdate.sourceText}
                                  onChange={(e) => setEditingUpdate({...editingUpdate, sourceText: e.target.value})}
                                  rows={3}
                                  className="text-gray-900"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Destination Field</label>
                                <Input
                                  placeholder="Destination Field"
                                  value={editingUpdate.destinationField || ""}
                                  onChange={(e) => setEditingUpdate({...editingUpdate, destinationField: e.target.value})}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Destination Text</label>
                                <Textarea
                                  placeholder="Destination Text"
                                  value={editingUpdate.destinationText || ""}
                                  onChange={(e) => setEditingUpdate({...editingUpdate, destinationText: e.target.value})}
                                  rows={3}
                                  className="text-gray-900"
                                />
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                              onClick={updateRecord}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : "Save"}
                            </Button>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        href="#" 
                        isActive={pageNum === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalCount)} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} updates
          </div>
        </>
      )}
    </div>
  );
}
