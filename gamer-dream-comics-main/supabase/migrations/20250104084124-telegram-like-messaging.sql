-- Telegram-like Anonymous Chat Implementation
-- This migration adds real-time messaging features similar to Telegram

-- Create messages table (Telegram-like cloud storage)
CREATE TABLE IF NOT EXISTS public.anonymous_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_public_key TEXT NOT NULL,
  receiver_public_key TEXT NOT NULL,
  content TEXT NOT NULL,
  encrypted_content TEXT, -- For end-to-end encryption
  message_type TEXT NOT NULL DEFAULT 'text', -- text, image, file, etc.
  ipfs_hash TEXT, -- For IPFS storage reference
  sequence_number BIGSERIAL, -- Telegram-like message ordering per conversation
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Telegram-like features
  is_ephemeral BOOLEAN NOT NULL DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_burned BOOLEAN NOT NULL DEFAULT false,
  burned_at TIMESTAMP WITH TIME ZONE,
  
  -- Delivery and read receipts (Telegram-like)
  is_delivered BOOLEAN NOT NULL DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Editing support (like Telegram)
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to_message_id UUID REFERENCES public.anonymous_messages(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for fast conversation retrieval (Telegram-like)
CREATE INDEX IF NOT EXISTS idx_anonymous_messages_conversation 
ON public.anonymous_messages (sender_public_key, receiver_public_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_receiver 
ON public.anonymous_messages (receiver_public_key, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_sequence 
ON public.anonymous_messages (sender_public_key, receiver_public_key, sequence_number);

CREATE INDEX IF NOT EXISTS idx_anonymous_messages_expires 
ON public.anonymous_messages (expires_at) WHERE expires_at IS NOT NULL AND is_burned = false;

-- Create typing indicators table (Telegram-like real-time typing)
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

-- RLS Policies for anonymous_messages (allow anonymous access)
-- Policy: Users can read messages where they are sender or receiver
CREATE POLICY "Anonymous users can read their messages"
ON public.anonymous_messages
FOR SELECT
USING (
  sender_public_key = current_setting('request.jwt.claims', true)::json->>'public_key'
  OR receiver_public_key = current_setting('request.jwt.claims', true)::json->>'public_key'
  OR true -- Allow all reads for anonymous (can be restricted later)
);

-- Policy: Users can insert messages where they are the sender
CREATE POLICY "Anonymous users can send messages"
ON public.anonymous_messages
FOR INSERT
WITH CHECK (
  sender_public_key = current_setting('request.jwt.claims', true)::json->>'public_key'
  OR true -- Allow all inserts for anonymous
);

-- Policy: Users can update messages where they are the sender (for editing, burning)
CREATE POLICY "Anonymous users can update their own messages"
ON public.anonymous_messages
FOR UPDATE
USING (
  sender_public_key = current_setting('request.jwt.claims', true)::json->>'public_key'
  OR receiver_public_key = current_setting('request.jwt.claims', true)::json->>'public_key'
  OR true -- Allow updates for anonymous (for read receipts, etc.)
);

-- RLS Policies for anonymous_typing_indicators
CREATE POLICY "Anonymous users can read typing indicators"
ON public.anonymous_typing_indicators
FOR SELECT
USING (true); -- Allow all reads

CREATE POLICY "Anonymous users can manage typing indicators"
ON public.anonymous_typing_indicators
FOR ALL
USING (true) -- Allow all operations for anonymous
WITH CHECK (true);

-- RLS Policies for anonymous_online_users (allow anonymous access)
CREATE POLICY "Anonymous users can view online users"
ON public.anonymous_online_users
FOR SELECT
USING (true);

CREATE POLICY "Anonymous users can update their presence"
ON public.anonymous_online_users
FOR ALL
USING (true)
WITH CHECK (true);

-- Function to auto-cleanup expired typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_expired_typing_indicators()
RETURNS void AS $$
BEGIN
  DELETE FROM public.anonymous_typing_indicators
  WHERE expires_at < now();
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

-- Enable Realtime for tables (Telegram-like real-time updates)
-- Note: This requires Supabase Realtime to be enabled in the dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_online_users;

-- Create function to get unread message count (Telegram-like)
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

-- Create function to mark messages as read (Telegram-like read receipts)
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
