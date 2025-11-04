#!/usr/bin/env node

/**
 * Database Setup Script
 * Runs the initial schema migration using Supabase Management API
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cffcezpyxxpcvgvfmmdu.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZmNlenB5eHhwY3ZndmZtbWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwODQ3OSwiZXhwIjoyMDc3Nzg0NDc5fQ.fJ-E7pZ2SVDaghV13lPcEeLypzlFd_x0P6_zFmv1zWo';

async function executeSql(sql) {
  // Use Supabase's SQL execution endpoint (part of PostgREST)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql })
  });

  return response;
}

async function runMigration() {
  console.log('🚀 Starting database setup...\n');

  // Read the SQL migration file
  const migrationPath = path.join(__dirname, '../database/migrations/001_initial_schema.sql');
  console.log('📖 Reading migration file:', migrationPath);
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  console.log(`✅ Loaded SQL file (${sql.length} characters)\n`);

  console.log('⚡ Executing SQL migration via Supabase...');
  console.log('');
  console.log('⚠️  NOTE: The Supabase REST API doesn\'t support direct SQL execution.');
  console.log('Please run the migration manually:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor');
  console.log('2. Click "New query"');
  console.log('3. Copy contents of: database/migrations/001_initial_schema.sql');
  console.log('4. Paste and click "Run"\n');
  console.log('OR use the Supabase CLI:\n');
  console.log('  supabase db push\n');
  
  console.log('Once complete, run: npm run setup:types\n');
}

runMigration().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

