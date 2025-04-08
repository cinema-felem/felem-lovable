
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { GarbageTitleManager } from "@/components/admin/GarbageTitleManager";

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-cinema-dark-blue text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Felem Admin Portal</h1>
            <p className="text-sm text-slate-300">
              Logged in as: {user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="p-4 bg-white rounded-md shadow">
          <GarbageTitleManager />
        </div>
      </div>
    </div>
  );
}
