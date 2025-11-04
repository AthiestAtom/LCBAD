
import { useState } from "react";
import { Link } from "react-router-dom";
import { characters } from "../data/characters";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Zap, Sparkles, ExternalLink } from "lucide-react";

const Characters = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Protagonist":
        return "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white";
      case "Antagonist":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "Supporting Character":
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white";
      case "Mysterious Entity":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
      case "Gifted Individual":
        return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
      default:
        return "bg-gradient-to-r from-cyan-500 to-purple-500 text-white";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Page Header */}
        <section className="py-16 text-center slide-in-up">
          <div className="flex justify-center mb-8 floating">
            <Users className="h-16 w-16 text-cyan-400 neon-glow" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 cyberpunk-text">
            Characters
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto typing-effect">
            Meet the extraordinary individuals from our stories
          </p>
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Character Selection with Fixed Height and Scroll */}
          <div className="col-span-1 glass-card rounded-xl p-6 card-hover slide-in-left h-[500px] flex flex-col">
            <h2 className="text-2xl font-bold mb-6 cyberpunk-text flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-cyan-400" />
              Select a Character
            </h2>
            <ScrollArea className="flex-1">
              <div className="space-y-3 pr-4">
                {characters.map((character, index) => (
                  <button
                    key={character.id}
                    onClick={() => setSelectedCharacter(character)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      selectedCharacter.id === character.id 
                        ? 'bg-gradient-to-r from-cyan-500/80 to-purple-500/80 text-white border border-cyan-400/50 neon-glow' 
                        : 'glass-card hover:border-purple-500/50 text-gray-200 border border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                      <span className="font-semibold">{character.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Character Details - Fixed Height with Internal Scroll */}
          <div className="col-span-1 lg:col-span-2 glass-card rounded-xl card-hover slide-in-right h-[500px] flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-8">
                <div className="mb-6">
                  <Badge 
                    className={`mb-4 px-4 py-2 text-sm font-bold ${getRoleBadgeVariant(selectedCharacter.role)} border-0`}
                  >
                    {selectedCharacter.role}
                  </Badge>
                  <h3 className="text-4xl font-bold cyberpunk-text mb-2">{selectedCharacter.name}</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg border border-cyan-500/30">
                    <p className="text-gray-300 leading-relaxed text-lg">{selectedCharacter.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-2xl font-bold mb-4 cyberpunk-text flex items-center">
                      <Zap className="w-6 h-6 mr-3 text-purple-400" />
                      Abilities
                    </h4>
                    <div className="grid gap-3">
                      {selectedCharacter.abilities.map((ability, index) => (
                        <div key={index} className="flex items-center p-3 glass-card rounded-lg">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 pulse-intense"></span>
                          <span className="text-gray-300">{ability}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-cyan-500/30">
                    <Link 
                      to={`/read/${selectedCharacter.relatedStory}`} 
                      className="btn-futuristic flex items-center group"
                    >
                      <Sparkles className="w-5 h-5 mr-2 group-hover:text-yellow-400 transition-colors" />
                      Read story featuring {selectedCharacter.name}
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Characters;
