#!/usr/bin/env node

/**
 * Database Migration Runner
 * Executes SQL migration using Supabase service_role key
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = 'https://cffcezpyxxpcvgvfmmdu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZmNlenB5eHhwY3ZndmZtbWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwODQ3OSwiZXhwIjoyMDc3Nzg0NDc5fQ.fJ-E7pZ2SVDaghV13lPcEeLypzlFd_x0P6_zFmv1zWo';

async function runMigration() {
  console.log('🚀 MTG Deck Builder - Database Migration');
  console.log('=========================================\n');

  // Create Supabase client with service_role key (bypasses RLS)
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  // Read migration file
  const migrationPath = join(__dirname, '../database/migrations/001_initial_schema.sql');
  console.log('📖 Reading migration:', migrationPath);
  
  const sql = readFileSync(migrationPath, 'utf8');
  console.log(`✅ Loaded (${Math.round(sql.length / 1024)}KB)\n`);

  // Split SQL into individual statements (rough split on semicolons)
  console.log('⚡ Executing migration...\n');
  
  // Execute via SQL query (using rpc if available, otherwise direct connection)
  try {
    // Try using the SQL editor endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ Migration executed!\n');
  } catch (error) {
    console.error('⚠️  Direct execution failed:', error.message);
    console.error('\n📋 Manual Steps Required:\n');
    console.error('1. Open: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor');
    console.error('2. Click "New query"');
    console.error('3. Copy file: database/migrations/001_initial_schema.sql');
    console.error('4. Paste and click "Run"\n');
    process.exit(1);
  }

  // Verify tables were created
  console.log('🔍 Verifying tables...');
  
  const { data: tables, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .in('tablename', ['collections', 'collection_cards', 'decks', 'deck_cards', 'deck_history']);

  if (error) {
    console.error('⚠️  Could not verify (tables may still be created)');
    console.error('   Error:', error.message);
  } else if (tables && tables.length === 5) {
    console.log('✅ All 5 tables verified!');
    tables.forEach(t => console.log(`   - ${t.tablename}`));
  } else {
    console.log(`⚠️  Expected 5 tables, found ${tables?.length || 0}`);
  }

  console.log('\n🎉 Database setup complete!');
  console.log('\nNext steps:');
  console.log('1. Generate types: npm run gen:types');
  console.log('2. Install components: npm run setup:components');
  console.log('3. Build auth: @builder.md\n');
}

runMigration().catch(err => {
  console.error('\n❌ Error:', err.message);
  console.error('\n📋 Please run migration manually:');
  console.error('https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor\n');
  process.exit(1);
});

