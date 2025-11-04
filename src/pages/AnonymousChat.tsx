import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Shield, 
  Flame,
  Eye,
  RefreshCw,
  UserPlus,
  Settings,
  Sparkles,
  Search,`r`n  Check,`r`n  CheckCheck
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';`r`nimport { useAnonymousChat, ChatMessage, AnonymousUser } from '@/hooks/useAnonymousChat';

const AnonymousChat = () => {
  const {
    isConnected,
    anonymousIdentity,
    messages,
    onlineUsers,
    typingUsers,
    isLoading,
    error,
    initializeAnonymousChat,
    sendMessage,
    burnMessage,
    updatePseudonym,
    discoverOnlineUsers,
    disconnect,
    markAsRead,
    sendTypingIndicator,
    loadMessageHistory
  } = useAnonymousChat();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [newPseudonym, setNewPseudonym] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Load message history when user is selected
  useEffect(() => {
    if (selectedUser && anonymousIdentity) {
      loadMessageHistory(selectedUser).then(() => {
        // Messages will be added via real-time subscriptions
      });
      // Mark messages as read when opening conversation
      markAsRead(selectedUser);
    }
  }, [selectedUser, anonymousIdentity, loadMessageHistory, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: ''smooth'' });
  }, [messages]);

  // Handle typing indicators
  const handleInputChange = (value: string) => {
    setMessageInput(value);
    if (selectedUser) {
      if (value.trim().length > 0) {
        sendTypingIndicator(selectedUser, true);
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        // Set timeout to stop typing indicator
        typingTimeoutRef.current = setTimeout(() => {
          sendTypingIndicator(selectedUser, false);
        }, 2000);
      } else {
        sendTypingIndicator(selectedUser, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
      }
    }
  };













  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedUser) return;

    try {
      await sendMessage(selectedUser, messageInput.trim());
      setMessageInput('');
      // Stop typing indicator
      if (selectedUser) {
        sendTypingIndicator(selectedUser, false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return onlineUsers;
    return onlineUsers.filter(u =>
      u.pseudonym.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
    );
  }, [onlineUsers, userSearch]);

  const currentThread = useMemo(() => {
    if (!selectedUser || !anonymousIdentity) return [] as ChatMessage[];
    return messages.filter(msg =>
      (msg.sender === selectedUser && msg.receiver === anonymousIdentity.publicKey) ||
      (msg.sender === anonymousIdentity.publicKey && msg.receiver === selectedUser)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages, selectedUser, anonymousIdentity]);

  const handleUpdatePseudonym = async () => {
    if (!newPseudonym.trim()) return;

    try {
      await updatePseudonym(newPseudonym.trim());
      setNewPseudonym('');
      setShowSettings(false);
    } catch (err) {
      console.error('Failed to update pseudonym:', err);
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(timestamp);
  };

  const getMessageStatusIcon = (message: ChatMessage) => {
    if (message.isBurned) return <Flame className="h-3 w-3 text-red-500" />;
    if (message.isEphemeral) return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 text-yellow-500"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
    // Show read receipts (Telegram-like)
    if (message.isRead) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    }
    if (message.isDelivered) {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
    return <Eye className="h-3 w-3 text-gray-500" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden text-center mb-8 rounded-2xl p-8 bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-indigo-600/20 border border-purple-500/30">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-pink-500/20 blur-3xl" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 flex items-center justify-center gap-3">
              <Shield className="h-10 w-10 text-purple-300 drop-shadow" />
              Anonymous Chat
              <Sparkles className="h-6 w-6 text-pink-300" />
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              Secure, private conversations â€” ephemeral by choice, memorable by design.
            </p>
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <Card className="bg-white/10 backdrop-blur-sm border-purple-500/40 mb-6 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Shield className="h-12 w-12 text-purple-300" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Start Anonymous Chat
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Generate a secure anonymous identity to start chatting privately
                    </p>
                    <Button
                      onClick={initializeAnonymousChat}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating Identity...
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Start Chatting
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-300">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Main Chat Interface */}
          {isConnected && anonymousIdentity && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Online Users Sidebar */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/40">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-purple-200">
                        <Users className="h-5 w-5" />
                        Online Users ({onlineUsers.length})
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={discoverOnlineUsers}
                        className="text-purple-200 hover:bg-purple-500/20"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <div className="relative">
                        <Input
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search users or addresses..."
                          className="pl-9 bg-white/5 border-purple-400/40 text-white placeholder:text-gray-400"
                        />
                        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.address}
                            className={`p-3 rounded-xl cursor-pointer transition-all border ${
                              selectedUser === user.address
                                ? 'bg-purple-500/20 border-purple-400 shadow-md'
                                : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                            onClick={() => setSelectedUser(user.address)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">
                                  {user.pseudonym}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Reputation: {user.reputation}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-xs text-gray-400">Online</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredUsers.length === 0 && (
                          <p className="text-gray-400 text-center py-4">
                            No other users online
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Current Identity */}
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/40 mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-200">
                      <Shield className="h-5 w-5" />
                      Your Identity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-white font-medium">
                          {anonymousIdentity.pseudonym}
                        </p>
                        <p className="text-xs text-gray-400">
                          Reputation: {anonymousIdentity.reputation}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSettings(!showSettings)}
                        className="w-full border-purple-400/60 text-purple-200 hover:bg-purple-500/20"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-sm border-purple-500/40 h-[640px] flex flex-col shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-purple-200">
                        {selectedUser ? (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-white">Chat with</span>
                            <span className="text-purple-300 font-semibold">{onlineUsers.find(u => u.address === selectedUser)?.pseudonym}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5" />
                            <span>Select a user to start chatting</span>
                          </div>
                        )}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={disconnect}
                        className="text-red-300 hover:bg-red-500/20"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow flex flex-col p-0">
                    {/* Messages */}
                    <ScrollArea className="flex-grow p-4">
                      <div className="space-y-3">
                        {currentThread.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === anonymousIdentity.publicKey ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-3 rounded-2xl shadow-sm border ${
                                message.sender === anonymousIdentity.publicKey
                                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white border-purple-400/40'
                                  : 'bg-white text-gray-800 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {getMessageStatusIcon(message)}
                                <span className={`text-xs ${message.sender === anonymousIdentity.publicKey ? 'opacity-80' : 'text-gray-500'}`}>
                                  {message.sender === anonymousIdentity.publicKey
                                    ? anonymousIdentity.pseudonym
                                    : onlineUsers.find(u => u.address === message.sender)?.pseudonym || 'Unknown'}
                                </span>
                                <Badge variant="secondary" className="text-[10px] opacity-80">
                                  {formatTimestamp(message.timestamp)}
                                </Badge>
                              </div>
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {message.content}
                              </div>
                              {message.isEphemeral && message.expiresAt && (
                                <div className="text-xs opacity-70 mt-1">
                                  Expires: {formatTimestamp(message.expiresAt)}
                                </div>
                              )}
                              {!message.isBurned && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => burnMessage(message.id)}
                                  className={`text-xs p-1 h-auto mt-1 ${message.sender === anonymousIdentity.publicKey ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                                >
                                  <Flame className="h-3 w-3 mr-1" />
                                  Burn
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                        {selectedUser && currentThread.length === 0 && (
                          <div className="text-center text-gray-400 py-10">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-sm">No messages yet. Say hello and start the conversation!</p>
                          </div>
                        )}
                        {selectedUser && typingUsers.has(selectedUser) && (
                          <div className="flex justify-start">
                            <div className="max-w-[60%] p-3 rounded-2xl bg-white text-gray-800 border border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Typing</span>
                                <span className="inline-flex gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    
                    {/* Message Input */}
                    {selectedUser && (
                      <div className="p-4 border-t border-purple-500/30 bg-gradient-to-b from-transparent to-black/10 rounded-b-2xl">
                        <div className="flex gap-2 items-end">
                          <Input
                            value={messageInput}
                            onChange={(e) => handleInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/10 border-purple-400/60 text-white placeholder:text-gray-400 rounded-xl"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 pl-1">Press Enter to send</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <Card className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="bg-white/10 backdrop-blur-sm border-purple-500/40 w-96 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-purple-200">Update Pseudonym</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm mb-2 block">
                        New Pseudonym
                      </label>
                      <Input
                        value={newPseudonym}
                        onChange={(e) => setNewPseudonym(e.target.value)}
                        placeholder="Enter new pseudonym..."
                        className="bg-white/10 border-purple-400/60 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleUpdatePseudonym}
                        disabled={!newPseudonym.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                        className="border-purple-400/60 text-purple-200 hover:bg-purple-500/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnonymousChat;





