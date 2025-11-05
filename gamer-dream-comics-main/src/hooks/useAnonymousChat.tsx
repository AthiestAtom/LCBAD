import { useState, useEffect, useCallback, useRef } from 'react';
import { anonymousChatClient, AnonymousIdentity } from '@/integrations/web3/client';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { getMTProtoClient, MTProtoClient } from '@/integrations/web3/mtproto-client';

export interface AnonymousUser {
  address: string;
  pseudonym: string;
  reputation: number;
  isOnline: boolean;
  lastSeen: Date;
  unreadCount?: number;
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
  sequenceNumber?: number;
  isDelivered?: boolean;
  isRead?: boolean;
  readAt?: Date;
  editedAt?: Date;
  replyToMessageId?: string;
}

const ONLINE_PRESENCE_INTERVAL = 30000; // 30 seconds (Telegram-like)
const ONLINE_TIMEOUT = 60000; // 1 minute
const TYPING_INDICATOR_TIMEOUT = 5000; // 5 seconds
const MESSAGE_BATCH_SIZE = 50; // Telegram-like pagination

export const useAnonymousChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [anonymousIdentity, setAnonymousIdentity] = useState<AnonymousIdentity | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<AnonymousUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  
  const cleanupRef = useRef<NodeJS.Timeout | null>(null);
  const presenceRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const channelsRef = useRef<Map<string, RealtimeChannel>>(new Map());
  const messagesChannelRef = useRef<RealtimeChannel | null>(null);
  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const onlineUsersChannelRef = useRef<RealtimeChannel | null>(null);
  const mtProtoClientRef = useRef<MTProtoClient | null>(null);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Announce presence to Supabase (Telegram-like)
  const announcePresence = useCallback(async (identity: AnonymousIdentity) => {
    const { error } = await supabase.from('anonymous_online_users').upsert({
      public_key: identity.publicKey,
      pseudonym: identity.pseudonym,
      last_seen: new Date().toISOString(),
      is_online: true,
    }, { 
      onConflict: 'public_key',
      ignoreDuplicates: false 
    });
    
    if (error) {
      console.error('Error announcing presence:', error);
    }
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
    if (!anonymousIdentity) return; // Don't fetch if not initialized
    
    const since = new Date(Date.now() - ONLINE_TIMEOUT).toISOString();
    const { data, error } = await supabase
      .from('anonymous_online_users')
      .select('public_key, pseudonym, last_seen, is_online')
      .eq('is_online', true)
      .gte('last_seen', since)
      .order('last_seen', { ascending: false });
    
    if (error) {
      console.error('Error fetching online users:', error);
      return;
    }

    if (!data || data.length === 0) {
      setOnlineUsers([]);
      return;
    }

    // Get unread counts for each user (messages FROM that user TO current user)
    const usersWithUnread = await Promise.all(
              data.map(async (u) => {
          try {
            // Query directly to get count for messages from this specific user
            const { count } = await supabase
            .from('anonymous_messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_public_key', u.public_key)
            .eq('receiver_public_key', anonymousIdentity.publicKey)
            .eq('is_read', false)
            .eq('is_burned', false)
            .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
          
          return {
            address: u.public_key,
            pseudonym: u.pseudonym,
            reputation: Math.floor(Math.random() * 100), // Placeholder
            isOnline: u.is_online,
            lastSeen: new Date(u.last_seen),
            unreadCount: count || 0,
          };
        } catch (err) {
          console.error('Error getting unread count for user:', u.public_key, err);
          return {
            address: u.public_key,
            pseudonym: u.pseudonym,
            reputation: Math.floor(Math.random() * 100),
            isOnline: u.is_online,
            lastSeen: new Date(u.last_seen),
            unreadCount: 0,
          };
        }
      })
    );

    // Filter out the current user and any nulls, then set online users
    const otherUsers = usersWithUnread
      .filter(u => u !== null && u.address !== anonymousIdentity.publicKey) as AnonymousUser[];
    
    setOnlineUsers(otherUsers);
  }, [anonymousIdentity]);

  // Load message history (Telegram-like pagination)
  const loadMessageHistory = useCallback(async (otherUserKey: string, before?: Date) => {
    if (!anonymousIdentity) return [];

    const query = supabase
      .from('anonymous_messages')
      .select('*')
      .or(`and(sender_public_key.eq.${anonymousIdentity.publicKey},receiver_public_key.eq.${otherUserKey}),and(sender_public_key.eq.${otherUserKey},receiver_public_key.eq.${anonymousIdentity.publicKey})`)
      .eq('is_burned', false)
      .order('created_at', { ascending: false })
      .limit(MESSAGE_BATCH_SIZE);

    if (before) {
      query.lt('created_at', before.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error loading messages:', error);
      return [];
    }

    return (data || []).map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender_public_key,
      receiver: msg.receiver_public_key,
      timestamp: new Date(msg.created_at),
      isEphemeral: msg.is_ephemeral,
      isBurned: msg.is_burned,
      expiresAt: msg.expires_at ? new Date(msg.expires_at) : undefined,
      sequenceNumber: msg.sequence_number,
      isDelivered: msg.is_delivered,
      isRead: msg.is_read,
      readAt: msg.read_at ? new Date(msg.read_at) : undefined,
      editedAt: msg.edited_at ? new Date(msg.edited_at) : undefined,
      replyToMessageId: msg.reply_to_message_id,
    })).reverse(); // Reverse to show oldest first
  }, [anonymousIdentity]);

  // Mark message as delivered (Telegram-like) - defined before use
  const markAsDelivered = useCallback(async (messageId: string) => {
    await supabase
      .from('anonymous_messages')
      .update({ is_delivered: true, delivered_at: new Date().toISOString() })
      .eq('id', messageId);
  }, []);

  // Setup real-time subscriptions (Telegram-like)
  const setupRealtimeSubscriptions = useCallback((identity: AnonymousIdentity) => {
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel(`messages:${identity.publicKey}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'anonymous_messages',
          filter: `receiver_public_key=eq.${identity.publicKey}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, {
              id: newMessage.id,
              content: newMessage.content,
              sender: newMessage.sender_public_key,
              receiver: newMessage.receiver_public_key,
              timestamp: new Date(newMessage.created_at),
              isEphemeral: newMessage.is_ephemeral,
              isBurned: newMessage.is_burned,
              expiresAt: newMessage.expires_at ? new Date(newMessage.expires_at) : undefined,
              sequenceNumber: newMessage.sequence_number,
              isDelivered: newMessage.is_delivered,
              isRead: newMessage.is_read,
              readAt: newMessage.read_at ? new Date(newMessage.read_at) : undefined,
              editedAt: newMessage.edited_at ? new Date(newMessage.edited_at) : undefined,
              replyToMessageId: newMessage.reply_to_message_id,
            }];
          });
          // Mark as delivered
          markAsDelivered(newMessage.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'anonymous_messages',
          filter: `receiver_public_key=eq.${identity.publicKey}`,
        },
        (payload) => {
          const updatedMessage = payload.new as any;
          setMessages(prev => prev.map(msg =>
            msg.id === updatedMessage.id
              ? {
                  ...msg,
                  isRead: updatedMessage.is_read,
                  readAt: updatedMessage.read_at ? new Date(updatedMessage.read_at) : undefined,
                  isBurned: updatedMessage.is_burned,
                  content: updatedMessage.content,
                  editedAt: updatedMessage.edited_at ? new Date(updatedMessage.edited_at) : undefined,
                }
              : msg
          ));
        }
      )
      .subscribe();

    messagesChannelRef.current = messagesChannel;

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`typing:${identity.publicKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'anonymous_typing_indicators',
          filter: `receiver_public_key=eq.${identity.publicKey}`,
        },
        (payload) => {
          const indicator = payload.new as any;
          if (indicator && indicator.is_typing && new Date(indicator.expires_at) > new Date()) {
            setTypingUsers(prev => new Set(prev).add(indicator.sender_public_key));
            // Auto-remove after timeout
            if (typingTimeoutRef.current.has(indicator.sender_public_key)) {
              clearTimeout(typingTimeoutRef.current.get(indicator.sender_public_key)!);
            }
            const timeout = setTimeout(() => {
              setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(indicator.sender_public_key);
                return next;
              });
            }, TYPING_INDICATOR_TIMEOUT);
            typingTimeoutRef.current.set(indicator.sender_public_key, timeout);
          } else {
            setTypingUsers(prev => {
              const next = new Set(prev);
              next.delete((indicator as any)?.sender_public_key);
              return next;
            });
          }
        }
      )
      .subscribe();

    typingChannelRef.current = typingChannel;

    // Subscribe to online users changes
    const onlineUsersChannel = supabase
      .channel(`online_users`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'anonymous_online_users',
        },
        () => {
          fetchOnlineUsers();
        }
      )
      .subscribe();

    onlineUsersChannelRef.current = onlineUsersChannel;
  }, [fetchOnlineUsers, markAsDelivered]);

  // Mark messages as read (Telegram-like read receipts)
  const markAsRead = useCallback(async (senderKey: string) => {
    if (!anonymousIdentity) return;
    
    await supabase.rpc('mark_messages_as_read', {
      receiver_key: anonymousIdentity.publicKey,
      sender_key: senderKey,
    });
    
    // Update local state
    setMessages(prev => prev.map(msg =>
      msg.sender === senderKey && !msg.isRead
        ? { ...msg, isRead: true, readAt: new Date() }
        : msg
    ));
  }, [anonymousIdentity]);

  // Send typing indicator (Telegram-like)
  const sendTypingIndicator = useCallback(async (receiverKey: string, isTyping: boolean) => {
    if (!anonymousIdentity) return;

    if (isTyping) {
      await supabase.from('anonymous_typing_indicators').upsert({
        sender_public_key: anonymousIdentity.publicKey,
        receiver_public_key: receiverKey,
        is_typing: true,
        expires_at: new Date(Date.now() + TYPING_INDICATOR_TIMEOUT).toISOString(),
      }, { onConflict: 'sender_public_key,receiver_public_key' });
    } else {
      await supabase
        .from('anonymous_typing_indicators')
        .delete()
        .eq('sender_public_key', anonymousIdentity.publicKey)
        .eq('receiver_public_key', receiverKey);
    }
  }, [anonymousIdentity]);

  // Process MTProto batches (send accumulated messages)
  const processMTProtoBatches = useCallback(async () => {
    if (!mtProtoClientRef.current || !anonymousIdentity) return;

    const batch = mtProtoClientRef.current.getPendingBatches();
    if (!batch || batch.messages.length === 0) return;

    // Send batch to Supabase
    try {
      const messages = batch.messages.map(msg => msg.body);
      const { data, error } = await supabase
        .from('anonymous_messages')
        .insert(messages)
        .select();

      if (error) throw error;

      // Acknowledge all messages in batch
      const msgIds = batch.messages.map(msg => msg.msgId);
      mtProtoClientRef.current.acknowledge(msgIds);
      
      // Update message IDs in local state (replace optimistic IDs with real ones)
      if (data && Array.isArray(data)) {
        setMessages(prev => {
          return prev.map(msg => {
            const batchMsg = batch.messages.find(bm => bm.msgId.toString() === msg.id);
            if (batchMsg) {
              const dbMsg = data.find((d: any) => 
                d.sender_public_key === msg.sender && 
                d.receiver_public_key === msg.receiver &&
                d.content === msg.content
              );
              if (dbMsg) {
                return {
                  ...msg,
                  id: dbMsg.id,
                  timestamp: new Date(dbMsg.created_at),
                  sequenceNumber: dbMsg.sequence_number,
                };
              }
            }
            return msg;
          });
        });
      }
    } catch (err) {
      console.error('Error sending batch:', err);
      // Retry unacknowledged messages
      const unacknowledged = mtProtoClientRef.current.retryUnacknowledged();
      console.log('Retrying unacknowledged messages:', unacknowledged.length);
    }
  }, [anonymousIdentity]);

  // Start presence interval
  const startPresenceInterval = useCallback((identity: AnonymousIdentity) => {
    if (presenceRef.current) clearInterval(presenceRef.current);
    presenceRef.current = setInterval(async () => {
      await announcePresence(identity);
      fetchOnlineUsers();
    }, ONLINE_PRESENCE_INTERVAL);
  }, [announcePresence, fetchOnlineUsers]);

  // Initialize anonymous chat
  const initializeAnonymousChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const identity = await anonymousChatClient.generateAnonymousIdentity();
      setAnonymousIdentity(identity);
      setIsConnected(true);
      
      // Initialize MTProto client for low-latency messaging
      mtProtoClientRef.current = getMTProtoClient(identity.publicKey);
      mtProtoClientRef.current.connect();
      
      // Start batch processing timer
      batchTimerRef.current = setInterval(() => {
        processMTProtoBatches();
      }, 100); // Check every 100ms for pending batches
      
      await announcePresence(identity);
      setupRealtimeSubscriptions(identity);
      startPresenceInterval(identity);
      fetchOnlineUsers();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize anonymous chat');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [announcePresence, fetchOnlineUsers, setupRealtimeSubscriptions, processMTProtoBatches, startPresenceInterval]);

  // Send anonymous message (MTProto-optimized with batching)
  const sendMessage = useCallback(async (
    receiverAddress: string,
    content: string,
    options: {
      ephemeral?: boolean;
      burnAfterRead?: boolean;
      expiresIn?: number;
      replyToMessageId?: string;
    } = {}
  ) => {
    if (!isConnected || !anonymousIdentity || !mtProtoClientRef.current) {
      throw new Error('Anonymous chat not initialized');
    }
    try {
      // Prepare message payload
      const messagePayload = {
        sender_public_key: anonymousIdentity.publicKey,
        receiver_public_key: receiverAddress,
        content: content,
        is_ephemeral: options.ephemeral || false,
        expires_at: options.expiresIn ? new Date(Date.now() + options.expiresIn * 1000).toISOString() : null,
        reply_to_message_id: options.replyToMessageId || null,
      };

      // Optionally encrypt and store on IPFS (async, non-blocking)
      anonymousChatClient.sendAnonymousMessage(receiverAddress, content, options)
        .then(ipfsMessage => {
          // Update message with IPFS hash asynchronously
          supabase
            .from('anonymous_messages')
            .update({
              encrypted_content: ipfsMessage.encryptedContent,
              ipfs_hash: ipfsMessage.ipfsHash,
            })
            .eq('sender_public_key', anonymousIdentity.publicKey)
            .eq('receiver_public_key', receiverAddress)
            .eq('content', content)
            .order('created_at', { ascending: false })
            .limit(1);
        })
        .catch(err => console.error('IPFS storage error:', err));

      // Send via MTProto (optimistic, batched)
      const mtProtoMsg = await mtProtoClientRef.current.send(messagePayload, false);
      
      // Optimistic UI update (show message immediately)
      const optimisticMessage: ChatMessage = {
        id: mtProtoMsg.msgId.toString(), // Temporary ID
        content: content,
        sender: anonymousIdentity.publicKey,
        receiver: receiverAddress,
        timestamp: new Date(mtProtoMsg.timestamp),
        isEphemeral: options.ephemeral || false,
        isBurned: false,
        expiresAt: options.expiresIn ? new Date(Date.now() + options.expiresIn * 1000) : undefined,
        sequenceNumber: mtProtoMsg.seqNo,
        isDelivered: false,
        isRead: false,
        replyToMessageId: options.replyToMessageId,
      };

      setMessages(prev => [...prev, optimisticMessage]);

      // Batch will be processed automatically by processMTProtoBatches
      // Message will be updated with real ID when batch is sent
      
      return optimisticMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    }
  }, [isConnected, anonymousIdentity]);

  // Burn a message
  const burnMessage = useCallback(async (messageId: string) => {
    await supabase
      .from('anonymous_messages')
      .update({ is_burned: true, burned_at: new Date().toISOString() })
      .eq('id', messageId);

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

  // Discover online users
  const discoverOnlineUsers = useCallback(async () => {
    fetchOnlineUsers();
  }, [fetchOnlineUsers]);

  // Disconnect from anonymous chat
  const disconnect = useCallback(async () => {
    // Flush any pending MTProto batches before disconnecting
    if (mtProtoClientRef.current) {
      processMTProtoBatches();
      mtProtoClientRef.current.disconnect();
      mtProtoClientRef.current = null;
    }
    
    if (batchTimerRef.current) {
      clearInterval(batchTimerRef.current);
      batchTimerRef.current = null;
    }
    
    if (anonymousIdentity) {
      await removePresence(anonymousIdentity);
    }
    
    // Unsubscribe from all channels
    messagesChannelRef.current?.unsubscribe();
    typingChannelRef.current?.unsubscribe();
    onlineUsersChannelRef.current?.unsubscribe();
    
    // Clear all typing timeouts
    typingTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
    typingTimeoutRef.current.clear();
    
    setIsConnected(false);
    setAnonymousIdentity(null);
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers(new Set());
    setError(null);
    
    if (cleanupRef.current) {
      clearInterval(cleanupRef.current);
      cleanupRef.current = null;
    }
    if (presenceRef.current) {
      clearInterval(presenceRef.current);
      presenceRef.current = null;
    }
  }, [anonymousIdentity, removePresence, processMTProtoBatches]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    getUserReputation,
    discoverOnlineUsers,
    disconnect,
    markAsRead,
    sendTypingIndicator,
    loadMessageHistory,
    getCurrentIdentity: () => anonymousChatClient.getCurrentIdentity()
  };
};
