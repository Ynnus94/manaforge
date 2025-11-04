#!/usr/bin/env node

/**
 * Generate TypeScript types from Supabase schema
 * Uses the Management API directly without CLI
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_REF = 'cffcezpyxxpcvgvfmmdu';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZmNlenB5eHhwY3ZndmZtbWR1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjIwODQ3OSwiZXhwIjoyMDc3Nzg0NDc5fQ.fJ-E7pZ2SVDaghV13lPcEeLypzlFd_x0P6_zFmv1zWo';

console.log('⚙️  Generating TypeScript types...\n');

// Use Supabase Management API to get schema
const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/types/typescript`, {
  headers: {
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  }
});

if (!response.ok) {
  console.error('❌ Failed to fetch types from Supabase API');
  console.error('Status:', response.status);
  console.error('Response:', await response.text());
  
  console.log('\n📋 Manual method:');
  console.log('Run in your terminal (you\'ll need to login in browser once):');
  console.log('  npx supabase login');
  console.log('  npx supabase link --project-ref cffcezpyxxpcvgvfmmdu');
  console.log('  npx supabase gen types typescript --linked > src/lib/supabase/types.ts\n');
  
  process.exit(1);
}

const types = await response.text();

// Write to file
const outputPath = join(__dirname, '../src/lib/supabase/types.ts');
writeFileSync(outputPath, types, 'utf8');

console.log('✅ Types generated successfully!');
console.log('📄 File:', outputPath);
console.log('📊 Size:', Math.round(types.length / 1024), 'KB\n');

