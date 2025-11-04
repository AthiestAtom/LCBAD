# Telegram-like Anonymous Chat Setup Guide

## Migration Application

Since Supabase migrations on hosted instances require dashboard access, please follow these steps:

### Step 1: Apply the Migration

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Click **New Query**
5. Copy the contents of: `supabase/migrations/20251104084124-telegram-like-messaging.sql`
6. Paste and click **Run**

The migration will run successfully even if Realtime is not available - it will skip those steps gracefully.

### Step 2: Enable Realtime (If Available)

**Note:** If "Replication" shows "Coming Soon" in your dashboard, Realtime may not be available in your current plan. The chat will still work but will use polling instead of real-time updates.

If Realtime IS available in your plan:

1. In Supabase Dashboard, go to **Database** â†’ **Publications** (or **Replication** if available)
2. Find the `supabase_realtime` publication
3. Ensure these tables are included:
   - `anonymous_messages`
   - `anonymous_typing_indicators`
   - `anonymous_online_users`

**Alternative:** Some Supabase plans have Realtime enabled by default. You can verify this by checking if the tables appear in the publication after running the migration.

### Step 3: Fallback to Polling (If Realtime Not Available)

If Realtime is not available, the chat will automatically fall back to polling for updates. The experience will still work, just with slightly higher latency (messages will refresh every few seconds instead of instantly).

### Step 4: Verify Environment Variables

Ensure your `.env` file contains:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## What's Been Implemented

âœ… MTProto-inspired low-latency messaging protocol
âœ… Real-time messaging with Supabase Realtime (with polling fallback)
âœ… Typing indicators (with polling fallback if Realtime unavailable)
âœ… Read receipts (single check = delivered, double check = read)
âœ… Message delivery status
âœ… Message history with pagination
âœ… Online presence tracking
âœ… Message batching for performance
âœ… Optimistic UI updates

## Testing

Once the migration is applied:
1. Start your dev server: `npm run dev`
2. Navigate to the Anonymous Chat page
3. Click "Start Chatting" to generate an identity
4. You should see other online users (if any)
5. Select a user and start chatting!

## Troubleshooting

- **No messages appearing?** 
  - Check browser console for errors
  - Verify RLS policies are correct
  - If Realtime is not available, messages will update via polling (refresh every few seconds)

- **Typing indicators not working?** 
  - Verify the `anonymous_typing_indicators` table exists
  - If Realtime is unavailable, typing indicators will update less frequently via polling

- **Read receipts not updating?** 
  - Check browser console for errors
  - Verify RLS policies are correct
  - This feature works without Realtime as it uses direct database queries
