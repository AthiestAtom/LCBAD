import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import AssistantWidget from "./components/AssistantWidget";
import Assistant from "./pages/Assistant";
import AnonymousChat from "./pages/AnonymousChat";
import Index from "./pages/Index";
import Characters from "./pages/Characters";
import NotFound from "./pages/NotFound";
import Stories from "./pages/Stories";
import StoryReader from "./pages/StoryReader";
import About from "./pages/About";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/characters" 
              element={
                <ProtectedRoute>
                  <Characters />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/stories" 
              element={
                <ProtectedRoute>
                  <Stories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/read/:storyId" 
              element={
                <ProtectedRoute>
                  <StoryReader />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assistant" 
              element={
                <ProtectedRoute>
                  <Assistant />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/anonymous-chat" 
              element={
                <ProtectedRoute>
                  <AnonymousChat />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AssistantWidget />
        </HashRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
