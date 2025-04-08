
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithMagicLink, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signInWithMagicLink(email);
      if (error) throw error;
      
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // No need to navigate, OAuth redirect will handle this
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cinema-dark-blue">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin portal
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleMagicLinkSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Sign in with Magic Link"}
              <Mail className="ml-2 h-4 w-4" />
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/30" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              Sign in with Google
              <LogIn className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
