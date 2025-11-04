-- Telegram-like Anonymous Chat Implementation
-- This migration adds real-time messaging features similar to Telegram
-- NOTE: If Realtime is not available in your plan, the ALTER PUBLICATION commands at the end can be safely ignored

-- Create messages table (Telegram-like cloud storage)
CREATE TABLE IF NOT EXISTS public.anonymous_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_public_key TEXT NOT NULL,
  receiver_public_key TEXT NOT NULL,
  content TEXT NOT NULL,
  encrypted_content TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  ipfs_hash TEXT,
  sequence_number BIGSERIAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_ephemeral BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_burned BOOLEAN NOT NULL DEFAULT false,
  burned_at TIMESTAMP WITH TIME ZONE,
  is_delivered BOOLEAN NOT NULL DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to_message_id UUID REFERENCES public.anonymous_messages(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_conversation 
ON public.anonymous_messages (sender_public_key, receiver_public_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_receiver 
ON public.anonymous_messages (receiver_public_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_sequence 
ON public.anonymous_messages (sender_public_key, receiver_public_key, sequence_number);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_expires 
ON public.anonymous_messages (expires_at) WHERE expires_at IS NOT NULL AND is_burned = false;

-- Create typing indicators table
CREATE TABLE IF NOT EXISTS public.anonymous_typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_public_key TEXT NOT NULL,
  receiver_public_key TEXT NOT NULL,
  is_typing BOOLEAN NOT NULL DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '5 seconds'),
  UNIQUE(sender_public_key, receiver_public_key)
);

CREATE INDEX IF NOT EXISTS idx_typing_indicators_receiver 
ON public.anonymous_typing_indicators (receiver_public_key, expires_at);

-- Update anonymous_online_users table (add unique constraint if needed)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'anonymous_online_users_public_key_unique'
  ) THEN
    CREATE UNIQUE INDEX IF NOT EXISTS anonymous_online_users_public_key_unique 
    ON public.anonymous_online_users (public_key);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.anonymous_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anonymous_typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for anonymous_messages
CREATE POLICY "Anonymous users can read their messages"
ON public.anonymous_messages FOR SELECT USING (true);

CREATE POLICY "Anonymous users can send messages"
ON public.anonymous_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Anonymous users can update their own messages"
ON public.anonymous_messages FOR UPDATE USING (true);

-- RLS Policies for anonymous_typing_indicators
CREATE POLICY "Anonymous users can read typing indicators"
ON public.anonymous_typing_indicators FOR SELECT USING (true);

CREATE POLICY "Anonymous users can manage typing indicators"
ON public.anonymous_typing_indicators FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for anonymous_online_users
CREATE POLICY "Anonymous users can view online users"
ON public.anonymous_online_users FOR SELECT USING (true);

CREATE POLICY "Anonymous users can update their presence"
ON public.anonymous_online_users FOR ALL USING (true) WITH CHECK (true);

-- Function to auto-cleanup expired typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.anonymous_typing_indicators WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to auto-cleanup expired ephemeral messages
CREATE OR REPLACE FUNCTION public.cleanup_expired_messages()
RETURNS void AS $$
BEGIN
  UPDATE public.anonymous_messages
  SET is_burned = true, burned_at = now()
  WHERE is_ephemeral = true 
    AND expires_at < now()
    AND is_burned = false;
END;
$$ LANGUAGE plpgsql;

-- Enable Realtime for tables (only if Realtime/Replication is available)
-- These commands may fail if Realtime is not enabled in your plan - that's okay!
DO $$ 
BEGIN
  -- Try to add tables to realtime publication (suppress errors if not available)
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_messages;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Realtime not available for anonymous_messages - this is okay if Realtime is not enabled in your plan';
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_typing_indicators;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Realtime not available for anonymous_typing_indicators - this is okay if Realtime is not enabled in your plan';
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_online_users;
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Realtime not available for anonymous_online_users - this is okay if Realtime is not enabled in your plan';
  END;
END $$;

-- Create function to get unread message count
CREATE OR REPLACE FUNCTION public.get_unread_count(receiver_key TEXT)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.anonymous_messages
    WHERE receiver_public_key = receiver_key
      AND is_read = false
      AND is_burned = false
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(
  receiver_key TEXT,
  sender_key TEXT,
  read_before TIMESTAMP WITH TIME ZONE DEFAULT now()
)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.anonymous_messages
  SET is_read = true, read_at = now()
  WHERE receiver_public_key = receiver_key
    AND sender_public_key = sender_key
    AND is_read = false
    AND is_burned = false
    AND created_at <= read_before;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
