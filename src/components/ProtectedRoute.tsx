import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'admin';
};

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [checkingRole, setCheckingRole] = useState(!!requiredRole);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (requiredRole && user) {
      const checkRole = async () => {
        try {
          console.log("Checking role for user:", user.id);
          
          // Check if user_roles entry exists for this user
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', user.id);
            
          if (rolesError) {
            throw new Error(`Error fetching user roles: ${rolesError.message}`);
          }
          
          console.log("User roles:", userRoles);
          
          if (!userRoles || userRoles.length === 0) {
            // No roles found, create admin role for this user
            console.log("No roles found, creating admin role");
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert([{ user_id: user.id, role: requiredRole }]);
              
            if (insertError) {
              throw new Error(`Error assigning admin role: ${insertError.message}`);
            }
            
            setHasRequiredRole(true);
            setErrorMessage(null);
          } else {
            // Otherwise check with RPC function
            console.log("Checking role with RPC function");
            const { data, error } = await supabase.rpc('has_role', { 
              required_role: requiredRole 
            });
            
            if (error) throw new Error(`Role check failed: ${error.message}`);
            
            console.log("Role check result:", data);
            setHasRequiredRole(data);
            setErrorMessage(data ? null : `You don't have the required ${requiredRole} role`);
          }
        } catch (error: any) {
          console.error("Error checking role:", error);
          setErrorMessage(error.message);
          toast({
            title: "Permission Error",
            description: error.message || "You don't have permission to access this page.",
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
      setErrorMessage(null);
    }
  }, [user, requiredRole, toast]);

  // Show loading
  if (authLoading || checkingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
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

  // Show error message if role check failed but user is authenticated
  if (errorMessage && requiredRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-700 mb-4">{errorMessage}</p>
          <p className="text-sm text-muted-foreground">
            You're logged in as {user.email}, but you need {requiredRole} permissions to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Redirect if doesn't have required role
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and has required role
  return <>{children}</>;
}
