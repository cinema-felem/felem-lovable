
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="text-center px-4 max-w-lg">
          <h1 className="text-6xl font-bold text-cinema-gold mb-4">404</h1>
          <p className="text-2xl text-white mb-6">
            Oops! This scene hasn't been filmed yet.
          </p>
          <p className="text-gray-400 mb-8">
            The movie page you're looking for doesn't exist or has been moved to a different location.
          </p>
          <Button asChild className="bg-cinema-gold hover:bg-cinema-gold/90 text-black">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
