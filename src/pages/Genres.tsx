
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const genres = [
  { id: 1, name: "Action", count: 42, color: "#EF4444" },
  { id: 2, name: "Adventure", count: 38, color: "#F59E0B" },
  { id: 3, name: "Animation", count: 24, color: "#10B981" },
  { id: 4, name: "Comedy", count: 65, color: "#3B82F6" },
  { id: 5, name: "Crime", count: 28, color: "#8B5CF6" },
  { id: 6, name: "Documentary", count: 19, color: "#EC4899" },
  { id: 7, name: "Drama", count: 78, color: "#6366F1" },
  { id: 8, name: "Family", count: 22, color: "#14B8A6" },
  { id: 9, name: "Fantasy", count: 18, color: "#F97316" },
  { id: 10, name: "History", count: 12, color: "#8B5CF6" },
  { id: 11, name: "Horror", count: 35, color: "#6B7280" },
  { id: 12, name: "Music", count: 15, color: "#EC4899" },
  { id: 13, name: "Mystery", count: 26, color: "#8B5CF6" },
  { id: 14, name: "Romance", count: 33, color: "#EC4899" },
  { id: 15, name: "Science Fiction", count: 23, color: "#3B82F6" },
  { id: 16, name: "Thriller", count: 45, color: "#6366F1" },
  { id: 17, name: "War", count: 14, color: "#6B7280" },
  { id: 18, name: "Western", count: 9, color: "#F59E0B" }
];

const Genres = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8">
            Browse by Genre
          </h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {genres.map((genre) => (
              <Link 
                key={genre.id} 
                to={`/genre/${genre.id}`}
                className="block p-4 rounded-lg transition-transform hover:scale-105"
                style={{ backgroundColor: `${genre.color}20` }}
              >
                <h3 
                  className="text-lg font-medium mb-1 transition-colors"
                  style={{ color: genre.color }}
                >
                  {genre.name}
                </h3>
                <p className="text-gray-400 text-sm">{genre.count} movies</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Genres;
