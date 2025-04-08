
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-cinema-dark-blue border-t border-cinema-dark-gray py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-cinema-gold font-bold text-xl mb-4">Felem</h3>
            <p className="text-gray-400">Discover and curate the best movies from around the world.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Browse</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-cinema-gold transition">Home</Link></li>
              <li><Link to="/cinemas" className="text-gray-400 hover:text-cinema-gold transition">Cinemas</Link></li>
              <li><Link to="/attribution" className="text-gray-400 hover:text-cinema-gold transition">Attribution</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-cinema-gold transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-cinema-gold transition">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-cinema-gold transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-cinema-gold transition">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <p className="text-gray-400 mb-4">Stay updated with the latest movie news and additions.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cinema-gold transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-cinema-gold transition">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-cinema-gold transition">Facebook</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-cinema-dark-gray mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Felem. All rights reserved.</p>
          <p className="mt-2">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
            <Link to="/attribution" className="ml-2 text-cinema-gold hover:underline">Learn more</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
