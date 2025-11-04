-- Update Script for Realtime Handling
-- Run this AFTER the main migration if you already ran the first version
-- This will safely add Realtime support if available, or skip if not

DO $$ 
BEGIN
  -- Try to add tables to realtime publication (suppress errors if not available)
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_messages;
    RAISE NOTICE 'Realtime enabled for anonymous_messages';
  EXCEPTION 
    WHEN duplicate_object THEN
      RAISE NOTICE 'anonymous_messages already in realtime publication';
    WHEN OTHERS THEN
      RAISE NOTICE 'Realtime not available for anonymous_messages - this is okay if Realtime is not enabled in your plan';
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_typing_indicators;
    RAISE NOTICE 'Realtime enabled for anonymous_typing_indicators';
  EXCEPTION 
    WHEN duplicate_object THEN
      RAISE NOTICE 'anonymous_typing_indicators already in realtime publication';
    WHEN OTHERS THEN
      RAISE NOTICE 'Realtime not available for anonymous_typing_indicators - this is okay if Realtime is not enabled in your plan';
  END;
  
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.anonymous_online_users;
    RAISE NOTICE 'Realtime enabled for anonymous_online_users';
  EXCEPTION 
    WHEN duplicate_object THEN
      RAISE NOTICE 'anonymous_online_users already in realtime publication';
    WHEN OTHERS THEN
      RAISE NOTICE 'Realtime not available for anonymous_online_users - this is okay if Realtime is not enabled in your plan';
  END;
END $$;
