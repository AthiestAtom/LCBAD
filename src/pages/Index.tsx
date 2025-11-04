import { stories } from "../data/stories";
import StoryCard from "../components/StoryCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LiveClock from "../components/LiveClock";
import { Link } from "react-router-dom";
import { Sparkles, Zap, Book } from "lucide-react";

const Index = () => {
  console.log("Index component rendering");
  console.log("Stories loaded:", stories);    
  
  // Get the featured story
  const featuredStory = stories.find(story => story.featured);
  console.log("Featured story:", featuredStory);
  
  // Get other stories
  const otherStories = stories.filter(story => !story.featured);
  console.log("Other stories count:", otherStories.length);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="py-16 text-center slide-in-up">
          <div className="flex justify-center mb-8 floating">
            <Sparkles className="h-20 w-20 text-cyan-400 neon-glow" />
          </div>
          
          {/* Live Clock Display */}
          <div className="flex justify-center mb-6">
            <LiveClock showSeconds={true} showDate={true} variant="detailed" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 cyberpunk-text">
            Welcome to Life Could Be A Dream
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12" style={{
            overflow: 'visible',
            whiteSpace: 'normal',
            animation: 'typing 4s steps(120, end), blink-caret 0.75s step-end infinite'
          }}>
            Explore the complex dynamics of power, expertise, and manipulation in worlds where warriors challenge traditional structures through specialized knowledge and unique abilities.
          </p>
          <div className="flex justify-center space-x-6 fade-in-stagger">
            <Link 
              to="/stories" 
              className="btn-futuristic flex items-center group"
            >
              <Book className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Browse Stories
              <Zap className="w-4 h-4 ml-2 group-hover:text-yellow-400 transition-colors" />
            </Link>
            <Link 
              to="/characters" 
              className="relative px-8 py-4 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 text-white font-bold rounded-lg border border-purple-500/50 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 flex items-center group backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:text-yellow-400 transition-colors" />
              Meet Characters
            </Link>
          </div>
        </section>
        
        {/* Featured Story Section */}
        {featuredStory && (
          <section className="py-16 slide-in-left">
            <h2 className="text-4xl font-bold mb-12 text-center cyberpunk-text flex items-center justify-center">
              <Zap className="w-8 h-8 mr-3 text-cyan-400" />
              Featured Story
            </h2>
            <StoryCard story={featuredStory} featured={true} />
          </section>
        )}
        
        {/* Latest Stories Section */}
        {otherStories.length > 0 && (
          <section className="py-16 slide-in-right">
            <h2 className="text-4xl font-bold mb-12 text-center cyberpunk-text flex items-center justify-center">
              <Book className="w-8 h-8 mr-3 text-purple-400" />
              Latest Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherStories.map((story, index) => (
                <div key={story.id} className="fade-in-stagger" style={{animationDelay: `${index * 0.1}s`}}>
                  <StoryCard story={story} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* About Section */}
        <section className="glass-card rounded-xl p-12 my-16 card-hover slide-in-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-6 cyberpunk-text flex items-center justify-center">
              <Sparkles className="w-8 h-8 mr-3 text-cyan-400" />
              About Life Could Be A Dream
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                Life Could Be A Dream is a collection of original stories that explore the complex dynamics of power, expertise, and social change. Written by Jashan Bansal, these stories feature warriors and specialists with different forms of manipulation abilities.
              </p>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                Each story examines how specialized knowledge and skills can challenge traditional power structures through themes of decentralization and individual empowerment using various approaches to creating meaningful change.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
