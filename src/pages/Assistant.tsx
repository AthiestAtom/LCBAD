import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Bot, MessageCircle, BookOpen, Users, Zap } from "lucide-react";

const Assistant = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Assistant Mr. Effort</h1>
            <p className="text-xl text-gray-300">
              Your AI guide to the Life Could Be A Dream universe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-sm border-purple-500 border-2 shadow-lg shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Bot className="h-5 w-5" />
                  Widget Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Assistant Mr. Effort is now available as a <strong className="text-purple-300">floating widget</strong> in the bottom-right corner of every page. 
                  Click the chat icon to open the assistant and start your conversation!
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-300">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Always accessible from any page</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Instant responses with context memory</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Zap className="h-5 w-5" />
                  What I Can Do
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-300" />
                    <span>Story summaries and content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-300" />
                    <span>Character profiles and relationships</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Inline clock icon to avoid runtime issues */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-purple-300"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Timeline and universe lore</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/10 backdrop-blur-sm border-purple-500">
            <CardHeader>
              <CardTitle className="text-purple-300">Example Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">About Stories</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">"Tell me about the Videogamer stories"</Badge>
                    <Badge variant="secondary" className="text-xs">"What happens in atom-1?"</Badge>
                    <Badge variant="secondary" className="text-xs">"Summarize the Dictator arc"</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">About Characters</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">"Who is The Kid?"</Badge>
                    <Badge variant="secondary" className="text-xs">"Tell me about Atom's powers"</Badge>
                    <Badge variant="secondary" className="text-xs">"What is Mr. Effort's role?"</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">About the Universe</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">"Explain the power system"</Badge>
                    <Badge variant="secondary" className="text-xs">"What are the core themes?"</Badge>
                    <Badge variant="secondary" className="text-xs">"Tell me about the timeline"</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-300">About the Author</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">"Who is Jashan Bansal?"</Badge>
                    <Badge variant="secondary" className="text-xs">"What's his writing style?"</Badge>
                    <Badge variant="secondary" className="text-xs">"How can I contact him?"</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border-purple-400 border-2">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Start?</h3>
                <p className="text-gray-300 mb-6">
                  The Assistant Mr. Effort is powered by advanced AI and has deep knowledge of the entire Life Could Be A Dream universe. 
                  Look for the floating chat widget in the bottom-right corner and start your conversation now!
                </p>
                <div className="flex items-center justify-center gap-2 text-purple-300">
                  <MessageCircle className="h-5 w-5 animate-pulse" />
                  <span className="text-lg font-semibold">Click the widget to begin! →</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Assistant;


