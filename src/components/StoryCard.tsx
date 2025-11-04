
import { Link } from "react-router-dom";
import { Story } from "../data/stories";
import { Book, ExternalLink, Sparkles, Zap, Atom } from "lucide-react";

interface StoryCardProps {
  story: Story;
  featured?: boolean;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, featured = false }) => {
  return (
    <div className={`glass-card card-hover relative overflow-hidden ${featured ? 'md:flex col-span-full' : ''} rounded-xl shadow-2xl fade-in-stagger`}>
      {/* Animated Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/20 to-pink-600/20 opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
      
      <div className={`relative z-10 p-8 ${featured ? 'md:w-full' : ''}`}>
        {featured && (
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 text-sm font-bold rounded-full mb-6 neon-glow transform hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 mr-2 animate-spin" />
            Featured Story
            <Zap className="w-4 h-4 ml-2" />
          </div>
        )}
        
        <h3 className={`${featured ? 'text-4xl' : 'text-2xl'} font-bold mb-4 cyberpunk-text flex items-center`}>
          <Atom className="w-6 h-6 mr-3 text-cyan-400" />
          {story.title}
        </h3>
        
        <p className="text-cyan-300 mb-6 text-sm flex items-center">
          <span className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mr-3 pulse-intense"></span>
          By {story.author} • Published {story.published}
        </p>
        
        <div className="p-4 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-cyan-500/30 mb-8">
          <p className={`text-gray-300 leading-relaxed ${featured ? 'text-lg' : ''}`}>
            {story.summary}
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link
            to={`/read/${story.id}`}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center"
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 3s ease infinite',
              width: '280px',
              height: '40px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <Book className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform relative z-10" />
            <span className="relative z-10 font-extrabold">READ FULL STORY</span>
            <ExternalLink className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
