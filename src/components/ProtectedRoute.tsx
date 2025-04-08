
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin';
};

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [checkingRole, setCheckingRole] = useState(!!requiredRole);
  const { toast } = useToast();

  useEffect(() => {
    if (requiredRole && user) {
      const checkRole = async () => {
        try {
          // Use our has_role function directly
          const { data, error } = await supabase.rpc('has_role', { 
            required_role: requiredRole 
          });
          
          if (error) throw error;
          setHasRequiredRole(data);
        } catch (error) {
          console.error("Error checking role:", error);
          toast({
            title: "Permission Error",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          setHasRequiredRole(false);
        } finally {
          setCheckingRole(false);
        }
      };

      checkRole();
    } else if (!requiredRole) {
      setCheckingRole(false);
      setHasRequiredRole(true);
    }
  }, [user, requiredRole, toast]);

  // Show loading
  if (loading || checkingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if doesn't have required role
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
}
