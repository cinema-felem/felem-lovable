
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-cinema-dark-blue/95 backdrop-blur-sm border-b border-cinema-dark-gray">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-cinema-gold font-bold text-2xl">Felem</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-cinema-gold transition">Home</Link>
          <Link to="/cinemas" className="text-white hover:text-cinema-gold transition">Cinemas</Link>
          <Link to="/" className="text-white hover:text-cinema-gold transition">Showtimes</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
