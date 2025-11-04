
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-comic-purple mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-comic-purple hover:bg-comic-darkPurple text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg flex items-center justify-center"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="bg-transparent border-2 border-comic-purple text-comic-purple hover:bg-comic-purple hover:text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
