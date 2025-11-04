
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { stories } from "@/data/stories";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Book, Plus, Minus, Type, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StoryReader = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const story = stories.find(s => s.id === storyId);
  const [fontSize, setFontSize] = useState(18); // Default font size in px
  const [storiesReadCount, setStoriesReadCount] = useState(0);
  const [canReadStory, setCanReadStory] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getStoriesReadCount, markStoryAsRead } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkReadingLimit = async () => {
      if (!storyId) return;
      
      setLoading(true);
      const count = await getStoriesReadCount();
      setStoriesReadCount(count);
      
      // Allow reading if under limit (5 stories)
      if (count < 5) {
        setCanReadStory(true);
        // Mark this story as read
        const { error } = await markStoryAsRead(storyId);
        if (error && !error.message.includes('duplicate')) {
          // Only show error if it's not a duplicate entry
          console.error('Error marking story as read:', error);
        }
      } else {
        setCanReadStory(false);
      }
      
      setLoading(false);
    };
    
    checkReadingLimit();
  }, [storyId, getStoriesReadCount, markStoryAsRead]);

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-white mb-4">
              Story Not Found
            </h2>
            <p className="text-gray-300 mb-8">
              The story you're looking for doesn't exist or has been moved.
            </p>
            <Link 
              to="/stories" 
              className="btn-futuristic flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Stories
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Checking reading permissions...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!canReadStory) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="max-w-md glass-card border-purple-500/30">
            <CardHeader className="text-center">
              <Lock className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
              <CardTitle className="text-2xl text-white">Reading Limit Reached</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-300">
                You've reached your limit of 5 stories. You've read {storiesReadCount} stories so far.
              </p>
              <p className="text-gray-400 text-sm">
                To continue reading, please create a new account or contact support for more access.
              </p>
              <Link 
                to="/stories" 
                className="btn-futuristic flex items-center justify-center w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stories
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Reading Progress Indicator */}
          <div className="glass-card rounded-lg p-4 mb-6">
            <p className="text-center text-gray-300">
              Stories read: <span className="text-cyan-400 font-bold">{storiesReadCount}</span> / 5
            </p>
          </div>

          {/* Back Button */}
          <Link 
            to="/stories" 
            className="inline-flex items-center text-cyan-400 hover:text-purple-400 transition-colors font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stories
          </Link>

          {/* Story Header with Font Controls */}
          <div className="glass-card rounded-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Book className="h-8 w-8 text-cyan-400 mr-3" />
                <h1 className="text-4xl font-bold text-white cyberpunk-text">
                  {story.title}
                </h1>
              </div>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <Type className="h-4 w-4 text-gray-300" />
                <button
                  onClick={decreaseFontSize}
                  className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                  disabled={fontSize <= 12}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-sm font-medium px-2 text-white">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-1 hover:bg-white/20 rounded transition-colors text-white"
                  disabled={fontSize >= 24}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">
              By {story.author} • Published {story.published}
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2 text-white">Summary</h2>
              <p className="text-gray-300 leading-relaxed">
                {story.summary}
              </p>
            </div>
          </div>

          {/* Story Content */}
          <div className="glass-card rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-white cyberpunk-text">Full Story</h2>
            <div className="prose prose-lg max-w-none">
              {story.content.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index} 
                  className="mb-6 text-gray-300 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryReader;
