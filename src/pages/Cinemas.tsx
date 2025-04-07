
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Cinema {
  id: string;
  name: string;
  address?: string | null;
  fullAddress?: string | null;
}

const Cinemas = () => {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        
        // Fetch cinemas from the database
        const { data, error } = await supabase
          .from('Cinema')
          .select('id, name, address, fullAddress')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setCinemas(data || []);
      } catch (error) {
        console.error("Error fetching cinemas:", error);
        toast({
          title: "Error",
          description: "Failed to load cinemas. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Cinemas</h1>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-xl">Loading cinemas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cinemas.map((cinema) => (
                <Link to={`/cinemas/${cinema.id}`} key={cinema.id}>
                  <Card className="bg-cinema-dark-gray/50 border-cinema-dark-gray hover:border-cinema-gold transition duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white">{cinema.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cinema.address && (
                        <div className="flex items-start gap-2 text-gray-300">
                          <MapPin size={16} className="mt-1 flex-shrink-0 text-cinema-gold" />
                          <p>{cinema.fullAddress || cinema.address}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {cinemas.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <p className="text-white text-xl">No cinemas found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cinemas;
