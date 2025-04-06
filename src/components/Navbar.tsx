
import { Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-cinema-dark-blue/95 backdrop-blur-sm border-b border-cinema-dark-gray">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-cinema-gold font-bold text-2xl">CineGems</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-cinema-gold transition">Home</Link>
          <Link to="/collections" className="text-white hover:text-cinema-gold transition">Collections</Link>
          <Link to="/genres" className="text-white hover:text-cinema-gold transition">Genres</Link>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full max-w-xs">
          <Input
            type="search"
            placeholder="Search movies..."
            className="bg-cinema-dark-gray/50 border-cinema-dark-gray text-white placeholder:text-gray-400 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cinema-gold"
          >
            <Search size={18} />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
