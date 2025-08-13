import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  MessageCircle,
  Send,
  X,
  User,
  Shield,
  Eye,
  EyeOff,
  Clock,
  Flame,
  Users,
  Search,
  Settings,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { useAnonymousChat, AnonymousUser, ChatMessage } from '@/hooks/useAnonymousChat';
import { useAuth } from '@/hooks/useAuth';

interface AnonymousChatProps {
  className?: string;
}

// Updated extended interfaces to match the original types
interface ExtendedChatMessage extends Omit<ChatMessage, 'timestamp'> {
  isOwn?: boolean;
  isBurning?: boolean;
  timestamp: number;
  pseudonym?: string;
}

interface ExtendedAnonymousUser extends AnonymousUser {
  identity: string; // Alias for address
  isOnline: boolean;
}

const AnonymousChat: React.FC<AnonymousChatProps> = ({ className }) => {
  const { user } = useAuth();
  const {
    isConnected,
    anonymousIdentity,
    messages,
    onlineUsers,
    isLoading,
    error,
    initializeAnonymousChat,
    sendMessage,
    burnMessage,
    updatePseudonym,
    discoverOnlineUsers,
    disconnect
  } = useAnonymousChat();

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [pseudonym, setPseudonym] = useState('');
  const [displayPseudonym, setDisplayPseudonym] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [autoBurnMessages, setAutoBurnMessages] = useState(true);
  const [burnDelay, setBurnDelay] = useState(30);
  const [showDiscover, setShowDiscover] = useState(false);
  const [scrollAreaRef, setScrollAreaRef] = useState<HTMLDivElement | null>(null);

  // Convert messages to ExtendedChatMessage format
  const extendedMessages: ExtendedChatMessage[] = messages.map(msg => ({
    ...msg,
    timestamp: msg.timestamp.getTime(), // Convert Date to number
    isOwn: msg.sender === anonymousIdentity?.address,
    isBurning: msg.isEphemeral
  }));

  // Convert onlineUsers to ExtendedAnonymousUser format
  const extendedOnlineUsers: ExtendedAnonymousUser[] = onlineUsers.map(user => ({
    ...user,
    identity: user.address,
    isOnline: user.isOnline
  }));

  useEffect(() => {
    if (isOpen && !isConnected) {
      initializeAnonymousChat();
    }
    if (!isOpen && isConnected) {
      disconnect();
    }
  }, [isOpen, isConnected, initializeAnonymousChat, disconnect]);

  useEffect(() => {
    if (scrollAreaRef) {
      const timeoutId = setTimeout(() => {
        scrollAreaRef.scrollTop = scrollAreaRef.scrollHeight;
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, scrollAreaRef]);

  useEffect(() => {
    if (isConnected && autoBurnMessages) {
      const interval = setInterval(() => {
        extendedMessages.forEach(message => {
          if (message.timestamp && (Date.now() - message.timestamp) > burnDelay * 1000) {
            burnMessage(message.id);
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [messages, autoBurnMessages, burnDelay, burnMessage, isConnected]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isConnected) return;

    // Create a temporary message object for optimistic UI update
    const tempMessage: ExtendedChatMessage = {
      id: `temp-${Date.now()}`,
      content: inputValue.trim(),
      sender: anonymousIdentity?.address || '',
      receiver: '', // Will be set by the hook
      timestamp: Date.now(),
      isEphemeral: autoBurnMessages,
      isBurned: false,
      isOwn: true,
      isBurning: autoBurnMessages,
    };

    try {
      await sendMessage(
        '', // receiverAddress - needs to be provided in real implementation
        inputValue.trim(),
        {
          ephemeral: autoBurnMessages,
          expiresIn: burnDelay,
          // Remove pseudonym property since it's not part of the expected type
          // Remove duplicate expiresIn property since it was already specified above
        }
      );
      setInputValue('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleUpdatePseudonym = () => {
    if (isConnected && pseudonym.trim()) {
      updatePseudonym(pseudonym.trim());
      setDisplayPseudonym(pseudonym.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Anonymous Chat
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-[400px] h-[600px] max-h-[80vh] shadow-2xl flex flex-col bg-background">
      <CardHeader className="flex-shrink-0 p-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
            <span>Anonymous Chat</span>
            {isConnected && (
              <Badge variant="outline" className="ml-2 py-0 px-2">
                <div className={`h-2 w-2 rounded-full mr-1 ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                  }`} />
                {error ? 'Error' : 'Online'}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {showSettings && (
        <Card className="absolute inset-x-4 top-16 z-10 bg-background border">
          <CardHeader className="p-3">
            <CardTitle className="text-sm flex items-center justify-between">
              Settings
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Chat Settings</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={autoBurnMessages}
                  onCheckedChange={setAutoBurnMessages}
                />
                <Label className="text-xs">Auto-burn messages</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Burn delay (seconds)</Label>
              <Input
                type="number"
                min="10"
                max="300"
                value={burnDelay}
                onChange={(e) => setBurnDelay(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Pseudonym</Label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Chat as..."
                  value={pseudonym}
                  onChange={(e) => setPseudonym(e.target.value)}
                  className="h-8 flex-grow text-sm"
                  maxLength={20}
                />
                <Button
                  size="sm"
                  onClick={handleUpdatePseudonym}
                  className="h-8 px-2 text-xs"
                >
                  Set
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                Identity: {anonymousIdentity?.address.slice(0, 8)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={discoverOnlineUsers}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 h-10 px-4">
          <TabsTrigger value="chat" className="text-sm">Chat</TabsTrigger>
          <TabsTrigger value="people" className="text-sm flex items-center">
            <Users className="h-3 w-3 mr-1" />
            People ({extendedOnlineUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 p-0">
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-4" ref={setScrollAreaRef}>
              {extendedMessages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {isLoading ? "Connecting to X019..." : (error || "No messages yet.")}
                  </p>
                </div>
              )}

              {extendedMessages.map((message, index) => (
                <div key={`${message.id}-${index}`} className="mb-4 last:mb-0">
                  <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 ${message.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                      }`}>
                      <div className="flex items-center justify-between text-xs opacity-75 mb-1">
                        <span>{message.sender.slice(0, 8)}...</span> {/* Show sender address */}
                        <span className="ml-2 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.isBurning && (
                        <Badge variant="outline" className="text-xs mt-1">
                          <Flame className="h-2 w-2 mr-1" />
                          Self-destruct
                        </Badge>
                      )}
                      {message.isOwn && message.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => burnMessage(message.id)}
                          className="h-auto p-0 ml-2 text-xs hover:bg-transparent"
                          title="Burn this message"
                        >
                          <Flame className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={!isConnected || isLoading}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || !isConnected || isLoading}
                  size="icon"
                  className="h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="people" className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {extendedOnlineUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    {isLoading ? "Discovering users..." : "No users online"}
                  </p>
                </div>
              )}

              {extendedOnlineUsers.map((user, index) => (
                <div
                  key={`${user.address}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">
                        {user.pseudonym || 'Anonymous'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.address.slice(0, 8)}...{user.address.slice(-4)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={user.isOnline ? "default" : "outline"}
                    className={`text-xs ${user.isOnline
                        ? 'bg-green-500 hover:bg-green-600'
                        : ''
                      }`}
                  >
                    {user.isOnline ? 'Active' : 'Away'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AnonymousChat;