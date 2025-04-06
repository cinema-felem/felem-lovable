
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { popularMovies, topRatedMovies, trendingMovies } from "@/services/movieData";
import { Link } from "react-router-dom";

const collections = [
  {
    id: 1,
    title: "Award Winners",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=300&q=80",
    count: popularMovies.length,
  },
  {
    id: 2,
    title: "Must-See Classics",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=300&q=80",
    count: topRatedMovies.length,
  },
  {
    id: 3,
    title: "New Releases",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=500&h=300&q=80",
    count: trendingMovies.length,
  },
  {
    id: 4,
    title: "Indie Darlings",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=500&h=300&q=80",
    count: 8,
  },
  {
    id: 5,
    title: "Film Festival Favorites",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=500&h=300&q=80",
    count: 12,
  },
  {
    id: 6,
    title: "Hidden Gems",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=500&h=300&q=80",
    count: 7,
  }
];

const Collections = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            Movie Collections
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <Link 
                key={collection.id} 
                to={`/collection/${collection.id}`}
                className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 poster-shadow"
              >
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-cinema-gold transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-gray-300 text-sm">{collection.count} movies</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;
