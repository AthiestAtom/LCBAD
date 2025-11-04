
import { useState } from "react";
import { stories } from "@/data/stories";
import StoryCard from "@/components/StoryCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, ChevronDown, ChevronUp, Zap, Sparkles } from "lucide-react";

// Helper function to group stories by series
const getSeriesFromStoryId = (id: string) => {
  if (id.startsWith("videogamer")) {
    return "Videogamer";
  } else if (id.startsWith("atom")) {
    return "Atom";
  } else if (id.startsWith("dictator")) {
    return "Dictator";
  } else if (id.startsWith("mreffort")) {
    return "Mr. Effort";
  } else if (id.startsWith("scientist")) {
    return "Scientist";
  } else if (id.startsWith("collab")) {
    return "Collab";
  }
  return "Other";
};

const Stories = () => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    Videogamer: false,
    Atom: true,
    Dictator: true,
    "Mr. Effort": true,
    Scientist: true,
    Collab: true
  });

  // Group stories by series
  const storiesByCategory = stories.reduce((acc, story) => {
    const series = getSeriesFromStoryId(story.id);
    if (!acc[series]) {
      acc[series] = [];
    }
    acc[series].push(story);
    return acc;
  }, {} as Record<string, typeof stories>);
  
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="py-16 text-center slide-in-up">
          <div className="flex justify-center mb-8 floating">
            <Book className="h-16 w-16 text-cyan-400 neon-glow" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 cyberpunk-text">
            Stories
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8" style={{
            overflow: 'visible',
            whiteSpace: 'normal',
            animation: 'typing 4s steps(120, end), blink-caret 0.75s step-end infinite'
          }}>
            Explore stories of warriors and experts who use different forms of manipulation and specialized knowledge to challenge power structures and work toward decentralization in their respective worlds.
          </p>
        </section>
        
        {/* Stories List */}
        <section className="py-8">
          {Object.entries(storiesByCategory).map(([category, categoryStories], index) => (
            <div key={category} className="mb-12 fade-in-stagger" style={{animationDelay: `${index * 0.1}s`}}>
              <div 
                className="glass-card cursor-pointer rounded-xl p-6 mb-8 card-hover flex items-center justify-between group"
                onClick={() => toggleSection(category)}
              >
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-cyan-400 mr-4 group-hover:text-yellow-400 transition-colors" />
                  <h2 className="text-3xl font-bold cyberpunk-text">
                    {category} Series
                  </h2>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">{categoryStories.length} stories</span>
                  {collapsedSections[category] ? 
                    <ChevronDown className="h-8 w-8 text-purple-400 group-hover:text-cyan-400 transition-colors" /> : 
                    <ChevronUp className="h-8 w-8 text-purple-400 group-hover:text-cyan-400 transition-colors" />
                  }
                </div>
              </div>
              
              {!collapsedSections[category] && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 slide-in-up">
                  {categoryStories.map((story, storyIndex) => (
                    <div key={story.id} className="fade-in-stagger" style={{animationDelay: `${storyIndex * 0.1}s`}}>
                      <StoryCard story={story} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Stories;
