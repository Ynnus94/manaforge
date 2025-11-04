import { createBrowserClient as createClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Creates a Supabase client for use in Client Components
 * 
 * Use this in components marked with 'use client'
 * Perfect for real-time subscriptions and client-side mutations
 * 
 * @example
 * ```tsx
 * 'use client';
 * 
 * import { createBrowserClient } from '@/lib/supabase/client';
 * 
 * export function DeckList() {
 *   const supabase = createBrowserClient();
 *   // Use for real-time subscriptions, client-side queries
 * }
 * ```
 */
export function createBrowserClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

