import { useState, useEffect, useCallback, useRef } from 'react';
import { anonymousChatClient, AnonymousIdentity, AnonymousMessage } from '@/integrations/web3/client';
import { supabase } from '@/integrations/supabase/client';

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

const ONLINE_PRESENCE_INTERVAL = 10000; // 10 seconds
const ONLINE_TIMEOUT = 60000; // 1 minute

export const useAnonymousChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [anonymousIdentity, setAnonymousIdentity] = useState<AnonymousIdentity | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<AnonymousUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cleanupRef = useRef<NodeJS.Timeout | null>(null);
  const presenceRef = useRef<NodeJS.Timeout | null>(null);

  // Announce presence to Supabase
  const announcePresence = useCallback(async (identity: AnonymousIdentity) => {
    await supabase.from('anonymous_online_users').upsert({
      public_key: identity.publicKey,
      pseudonym: identity.pseudonym,
      last_seen: new Date().toISOString(),
      is_online: true,
    }, { onConflict: 'public_key' });
  }, []);

  // Remove presence from Supabase
  const removePresence = useCallback(async (identity: AnonymousIdentity) => {
    await supabase.from('anonymous_online_users').update({
      is_online: false,
      last_seen: new Date().toISOString(),
    }).eq('public_key', identity.publicKey);
  }, []);

  // Fetch online users from Supabase
  const fetchOnlineUsers = useCallback(async () => {
    const since = new Date(Date.now() - ONLINE_TIMEOUT).toISOString();
    const { data, error } = await supabase
      .from('anonymous_online_users')
      .select('public_key, pseudonym, last_seen, is_online')
      .eq('is_online', true)
      .gte('last_seen', since);
    if (error) return;
    setOnlineUsers(
      (data || []).map(u => ({
        address: u.public_key,
        pseudonym: u.pseudonym,
        reputation: Math.floor(Math.random() * 100), // Placeholder
        isOnline: u.is_online,
        lastSeen: new Date(u.last_seen),
      }))
    );
  }, []);

  // Initialize anonymous chat (no wallet, no auth)
  const initializeAnonymousChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const identity = await anonymousChatClient.generateAnonymousIdentity();
      setAnonymousIdentity(identity);
      setIsConnected(true);
      await announcePresence(identity);
      startCleanupTimer();
      startPresenceInterval(identity);
      fetchOnlineUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize anonymous chat');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [announcePresence, fetchOnlineUsers]);

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
    }, 60000);
  }, []);

  // Start presence interval for online status
  const startPresenceInterval = useCallback((identity: AnonymousIdentity) => {
    if (presenceRef.current) clearInterval(presenceRef.current);
    presenceRef.current = setInterval(async () => {
      await announcePresence(identity);
      fetchOnlineUsers();
    }, ONLINE_PRESENCE_INTERVAL);
  }, [announcePresence, fetchOnlineUsers]);

  // Clean up expired messages
  const cleanupExpiredMessages = useCallback(() => {
    setMessages(prev => {
      const now = new Date();
      return prev.filter(msg => {
        if (msg.isEphemeral && msg.expiresAt && msg.expiresAt < now) {
          return false;
        }
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
      await supabase.from('anonymous_online_users').update({ pseudonym: newPseudonym }).eq('public_key', anonymousIdentity.publicKey);
      fetchOnlineUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update pseudonym');
      throw err;
    }
  }, [isConnected, anonymousIdentity, fetchOnlineUsers]);

  // Get user reputation
  const getUserReputation = useCallback(async (address: string) => {
    try {
      return await anonymousChatClient.getReputation(address);
    } catch (err) {
      console.error('Failed to get reputation:', err);
      return 0;
    }
  }, []);

  // Discover online users (manual refresh)
  const discoverOnlineUsers = useCallback(async () => {
    fetchOnlineUsers();
  }, [fetchOnlineUsers]);

  // Disconnect from anonymous chat
  const disconnect = useCallback(() => {
    setIsConnected(false);
    if (anonymousIdentity) removePresence(anonymousIdentity);
    setAnonymousIdentity(null);
    setMessages([]);
    setOnlineUsers([]);
    setError(null);
    if (cleanupRef.current) {
      clearInterval(cleanupRef.current);
      cleanupRef.current = null;
    }
    if (presenceRef.current) {
      clearInterval(presenceRef.current);
      presenceRef.current = null;
    }
  }, [anonymousIdentity, removePresence]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        clearInterval(cleanupRef.current);
      }
      if (presenceRef.current) {
        clearInterval(presenceRef.current);
      }
      if (anonymousIdentity) removePresence(anonymousIdentity);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    getUserReputation,
    discoverOnlineUsers,
    disconnect,
    getCurrentIdentity: () => anonymousChatClient.getCurrentIdentity()
  };
}; 