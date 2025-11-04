
import { Link, useLocation } from "react-router-dom";
import { Book, Users, User, LogOut, Bot, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LiveClock from "./LiveClock";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-comic-purple" : "hover:text-comic-purple transition-colors";
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out.",
      });
    }
  };
  
  return (
    <nav className="bg-comic-darkBg text-white py-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Link to="/" className="text-2xl font-bold font-title flex items-center">
            <span className="text-comic-purple mr-1">L</span>ife
            <span className="text-comic-softOrange mx-1">C</span>ould
            <span className="text-comic-softBlue mx-1">B</span>e
            <span className="text-comic-purple ml-1">A</span> 
            <span className="text-comic-softBlue ml-1">D</span>ream
          </Link>
        </div>
        
        <div className="flex items-center space-x-6">
        {/* Live Clock Display */}
        <LiveClock showSeconds={true} variant="default" />
        
          <div className="flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/stories" 
              className={`flex items-center ${isActive('/stories')}`}
            >
              <Book className="mr-1 h-4 w-4" />
              Stories
            </Link>
            <Link 
              to="/characters" 
              className={`flex items-center ${isActive('/characters')}`}
            >
              <Users className="mr-1 h-4 w-4" />
              Characters
            </Link>
            <Link 
              to="/about" 
              className={`flex items-center ${isActive('/about')}`}
            >
              <User className="mr-1 h-4 w-4" />
              About
            </Link>
            <Link 
              to="/assistant" 
              className={`flex items-center ${isActive('/assistant')}`}
            >
              <Bot className="mr-1 h-4 w-4" />
              Assistant
            </Link>
            <Link 
              to="/anonymous-chat" 
              className={`flex items-center ${isActive('/anonymous-chat')}`}
            >
              <Shield className="mr-1 h-4 w-4" />
              Anonymous Chat
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-purple-500/30">
              <span className="text-sm text-gray-300">
                Welcome, {user.email?.split('@')[0]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-300 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
