
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

const Attribution = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cinema-dark-blue">
      <Helmet>
        <title>TMDB Attribution - Felem</title>
        <meta name="description" content="Attribution information for The Movie Database (TMDB) used on Felem." />
        <link rel="canonical" href="https://felem.puayhiang.com/attribution" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-cinema-dark-gray/30 p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-white mb-6">TMDB Attribution</h1>
          
          <div className="flex justify-center mb-8">
            <img 
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" 
              alt="TMDB Logo" 
              className="h-24"
            />
          </div>
          
          <div className="space-y-6 text-gray-200">
            <p>
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            
            <h2 className="text-xl font-semibold text-cinema-gold mt-6">About TMDB</h2>
            <p>
              The Movie Database (TMDB) is a community built movie and TV database. 
              Every piece of data has been added by their amazing community dating back to 2008. 
              TMDB's international focus and breadth of data is largely unmatched.
            </p>
            
            <h2 className="text-xl font-semibold text-cinema-gold mt-6">API Usage</h2>
            <p>
              Felem uses TMDB's API to provide movie information, images, ratings, and other metadata. 
              All movie-related data displayed on this website, including posters, backdrops, titles, 
              descriptions, and release dates, is sourced from TMDB's vast database.
            </p>
            
            <h2 className="text-xl font-semibold text-cinema-gold mt-6">TMDB Terms of Use</h2>
            <p>
              Our use of TMDB's API is governed by their terms of use. For more information about TMDB's 
              terms of use and API guidelines, please visit their website.
            </p>
            
            <div className="pt-4">
              <a 
                href="https://www.themoviedb.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-cinema-gold hover:underline"
              >
                Visit TMDB <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="pt-2">
              <a 
                href="https://developers.themoviedb.org/3/getting-started/introduction" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-cinema-gold hover:underline"
              >
                TMDB API Documentation <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
            
            <div className="pt-2">
              <a 
                href="https://www.themoviedb.org/documentation/api/terms-of-use" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-cinema-gold hover:underline"
              >
                TMDB API Terms of Use <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Attribution;
