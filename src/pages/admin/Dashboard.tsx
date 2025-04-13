
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { GarbageTitleManager } from "@/components/admin/GarbageTitleManager";
import { MovieManager } from "@/components/admin/MovieManager";
import { UpdatesManager } from "@/components/admin/UpdatesManager";

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("garbage-titles");

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cinema-dark-blue">
      <div className="bg-sidebar text-white p-4 border-b border-sidebar-border">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-primary">Felem Admin Portal</h1>
            <p className="text-sm text-slate-300">
              Logged in as: {user?.email}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-sidebar-border hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger 
              value="garbage-titles" 
              className="data-[state=active]:bg-primary data-[state=active]:text-cinema-dark-blue"
            >
              Garbage Titles
            </TabsTrigger>
            <TabsTrigger 
              value="movies"
              className="data-[state=active]:bg-primary data-[state=active]:text-cinema-dark-blue"
            >
              Movies
            </TabsTrigger>
            <TabsTrigger 
              value="updates"
              className="data-[state=active]:bg-primary data-[state=active]:text-cinema-dark-blue"
            >
              Updates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="garbage-titles" className="p-4 bg-card rounded-md shadow">
            <GarbageTitleManager />
          </TabsContent>
          
          <TabsContent value="movies" className="p-4 bg-card rounded-md shadow">
            <MovieManager />
          </TabsContent>
          
          <TabsContent value="updates" className="p-4 bg-card rounded-md shadow">
            <UpdatesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
