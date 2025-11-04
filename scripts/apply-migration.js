// Migration Helper Script
// This script can be used to apply the migration to Supabase
// Run with: node scripts/apply-migration.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251104084124-telegram-like-messaging.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Applying migration...');
    console.log('Note: This requires Supabase Admin API or manual application via dashboard.');
    console.log('\nMigration SQL:');
    console.log('================');
    console.log(migrationSQL.substring(0, 500) + '...\n');
    console.log('================\n');
    console.log('To apply this migration:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL from: supabase/migrations/20251104084124-telegram-like-messaging.sql');
    console.log('4. Run the SQL');
    console.log('5. Enable Realtime in Database â†’ Replication for: anonymous_messages, anonymous_typing_indicators, anonymous_online_users');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

applyMigration();
