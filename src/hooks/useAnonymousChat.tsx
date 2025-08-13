import { useState, useEffect, useCallback, useRef } from 'react';
import { anonymousChatClient, AnonymousIdentity, AnonymousMessage } from '@/integrations/web3/client';
import { useAuth } from './useAuth';

export interface AnonymousUser {
  address: string;
  pseudonym: string;
  reputation: number;
  isOnline: boolean;
  lastSeen: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  timestamp: Date;
  isEphemeral: boolean;
  isBurned: boolean;
  expiresAt?: Date;
}

export const useAnonymousChat = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [anonymousIdentity, setAnonymousIdentity] = useState<AnonymousIdentity | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<AnonymousUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for cleanup
  const cleanupRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize anonymous chat
  const initializeAnonymousChat = useCallback(async () => {
    if (!user) {
      setError('User must be authenticated to use anonymous chat');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Connect wallet
      const walletConnected = await anonymousChatClient.connectWallet();
      if (!walletConnected) {
        throw new Error('Failed to connect wallet');
      }

      // Generate or retrieve anonymous identity
      const identity = await anonymousChatClient.generateAnonymousIdentity();
      setAnonymousIdentity(identity);
      setIsConnected(true);

      // Start cleanup timer for expired messages
      startCleanupTimer();

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize anonymous chat');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Send anonymous message
  const sendMessage = useCallback(async (
    receiverAddress: string,
    content: string,
    options: {
      ephemeral?: boolean;
      burnAfterRead?: boolean;
      expiresIn?: number;
    } = {}
  ) => {
    if (!isConnected || !anonymousIdentity) {
      throw new Error('Anonymous chat not initialized');
    }

    try {
      const message = await anonymousChatClient.sendAnonymousMessage(
        receiverAddress,
        content,
        options
      );

      // Add message to local state
      const chatMessage: ChatMessage = {
        id: message.id,
        content: message.content,
        sender: message.senderAddress,
        receiver: message.receiverAddress,
        timestamp: new Date(message.timestamp),
        isEphemeral: message.ephemeral,
        isBurned: false,
        expiresAt: message.expiresAt ? new Date(message.expiresAt) : undefined
      };

      setMessages(prev => [...prev, chatMessage]);

      return message;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [isConnected, anonymousIdentity]);

  // Start cleanup timer for expired messages
  const startCleanupTimer = useCallback(() => {
    cleanupRef.current = setInterval(() => {
      cleanupExpiredMessages();
    }, 60000); // Check every minute
  }, []);

  // Clean up expired messages
  const cleanupExpiredMessages = useCallback(() => {
    setMessages(prev => {
      const now = new Date();
      return prev.filter(msg => {
        // Remove expired ephemeral messages
        if (msg.isEphemeral && msg.expiresAt && msg.expiresAt < now) {
          return false;
        }
        // Remove burned messages
        if (msg.isBurned) {
          return false;
        }
        return true;
      });
    });
  }, []);

  // Burn a message (delete it permanently)
  const burnMessage = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isBurned: true } : msg
      )
    );
  }, []);

  // Update pseudonym
  const updatePseudonym = useCallback(async (newPseudonym: string) => {
    if (!isConnected || !anonymousIdentity) {
      throw new Error('Anonymous chat not initialized');
    }

    try {
      await anonymousChatClient.updatePseudonym(newPseudonym);
      setAnonymousIdentity(prev => prev ? { ...prev, pseudonym: newPseudonym } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pseudonym');
      throw err;
    }
  }, [isConnected, anonymousIdentity]);

  // Get user reputation
  const getUserReputation = useCallback(async (address: string) => {
    try {
      return await anonymousChatClient.getReputation(address);
    } catch (err) {
      console.error('Failed to get reputation:', err);
      return 0;
    }
  }, []);

  // Discover online users (placeholder)
  const discoverOnlineUsers = useCallback(async () => {
    // In a real implementation, this would query the blockchain for active users
    // For now, return mock data
    const mockUsers: AnonymousUser[] = [
      {
        address: '0x1234567890abcdef',
        pseudonym: 'ShadowTraveler#1234',
        reputation: 85,
        isOnline: true,
        lastSeen: new Date()
      },
      {
        address: '0xabcdef1234567890',
        pseudonym: 'PhantomObserver#5678',
        reputation: 92,
        isOnline: true,
        lastSeen: new Date()
      }
    ];

    setOnlineUsers(mockUsers);
  }, []);

  // Disconnect from anonymous chat
  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAnonymousIdentity(null);
    setMessages([]);
    setOnlineUsers([]);
    setError(null);

    // Clear intervals
    if (cleanupRef.current) {
      clearInterval(cleanupRef.current);
      cleanupRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        clearInterval(cleanupRef.current);
      }
    };
  }, []);

  // Auto-initialize when user is authenticated
  useEffect(() => {
    if (user && !isConnected) {
      initializeAnonymousChat();
    }
  }, [user, isConnected, initializeAnonymousChat]);

  return {
    // State
    isConnected,
    anonymousIdentity,
    messages,
    onlineUsers,
    isLoading,
    error,

    // Actions
    initializeAnonymousChat,
    sendMessage,
    burnMessage,
    updatePseudonym,
    getUserReputation,
    discoverOnlineUsers,
    disconnect,

    // Utilities
    getCurrentIdentity: () => anonymousChatClient.getCurrentIdentity()
  };
};