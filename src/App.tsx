
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import SentryErrorBoundary from "./components/SentryErrorBoundary";
import { Sentry } from "./integrations/sentry/config";
import Index from "./pages/Index";
import MovieDetails from "./pages/MovieDetails";
import Cinemas from "./pages/Cinemas";
import CinemaDetails from "./pages/CinemaDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { logPageView } from "./utils/analytics";
import Attribution from "./pages/Attribution";

const queryClient = new QueryClient();

// Analytics tracker component that will log every route change
const RouteTracker = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Don't track initial page load (this will be handled by the browser)
    if (navigationType !== 'POP') {
      // Get the page title from the document or use a fallback
      const title = document.title || 'Felem - Movie Curation Website';
      logPageView(location.pathname, title);
      
      // Also send to Sentry for monitoring
      Sentry.captureMessage(`Page viewed: ${location.pathname}`, {
        level: 'info',
        tags: { route: location.pathname }
      });
    }
  }, [location, navigationType]);

  return null;
};

const App = () => (
  <SentryErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <RouteTracker />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/cinemas" element={<Cinemas />} />
                <Route path="/cinemas/:id" element={<CinemaDetails />} />
                <Route path="/attribution" element={<Attribution />} />
                
                {/* Admin routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </SentryErrorBoundary>
);

export default App;
