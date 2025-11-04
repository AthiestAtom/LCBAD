
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { User, Mail, Linkedin, MessageSquare, GraduationCap, BookOpen, Atom } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 matrix-bg">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <section className="py-12 text-center slide-in-up">
            <div className="flex justify-center mb-6 floating">
              <User className="h-16 w-16 text-cyan-400 neon-glow" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 cyberpunk-text">
              About the Author
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto typing-effect">
              Meet Jashan Bansal, the visionary behind Life Could Be A Dream
            </p>
          </section>

          {/* Author Bio */}
          <section className="glass-card rounded-xl p-8 mb-8 card-hover slide-in-left">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mr-6 pulse-intense">
                <span className="text-3xl font-bold text-white">JB</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white cyberpunk-text">Jashan Bansal</h2>
                <div className="flex items-center mt-2 text-cyan-400">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  <span className="text-lg">BTech AI&DS • CGC Landran, Punjab</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center text-cyan-400 mb-3">
                  <BookOpen className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-semibold">Passionate Storyteller</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Passionate about sci-fi story writing and scientific theories, I craft narratives that blend cutting-edge technology with human emotion and moral complexity.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-purple-400 mb-3">
                  <Atom className="h-6 w-6 mr-3" />
                  <h3 className="text-xl font-semibold">Scientific Explorer</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  I unfold the mysteries of blurred parts of life, weaving scientific theories into compelling stories that challenge conventional thinking and explore the boundaries of possibility.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-800/30 to-cyan-800/30 rounded-lg border border-cyan-500/30">
              <p className="text-gray-300 leading-relaxed text-center italic">
                "Through my stories, I use morals as the foundation to explore complex themes of manipulation, expertise, and the various forms of power that shape our world."
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section className="glass-card rounded-xl p-8 slide-in-right">
            <h2 className="text-4xl font-bold mb-8 text-center cyberpunk-text">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/jashan-bansal-02309b317?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BibA3z7p7SXSHMiLSicKQ5A%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-futuristic flex flex-col items-center p-6 rounded-xl group fade-in-stagger"
              >
                <Linkedin className="h-12 w-12 text-cyan-400 mb-4 group-hover:scale-125 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2 text-white">LinkedIn</h3>
                <p className="text-gray-300 text-center text-sm">
                  Connect professionally
                </p>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me/+918283035000"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-futuristic flex flex-col items-center p-6 rounded-xl group fade-in-stagger"
              >
                <MessageSquare className="h-12 w-12 text-green-400 mb-4 group-hover:scale-125 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2 text-white">WhatsApp</h3>
                <p className="text-gray-300 text-center text-sm">
                  Chat directly
                </p>
              </a>

              {/* Email */}
              <a 
                href="mailto:cec235008.aids.cec@cgc.edu.in"
                className="btn-futuristic flex flex-col items-center p-6 rounded-xl group fade-in-stagger"
              >
                <Mail className="h-12 w-12 text-pink-400 mb-4 group-hover:scale-125 transition-transform duration-300" />
                <h3 className="text-xl font-semibold mb-2 text-white">Email</h3>
                <p className="text-gray-300 text-center text-sm">
                  Direct contact
                </p>
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
