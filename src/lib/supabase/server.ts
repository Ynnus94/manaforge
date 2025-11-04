import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

/**
 * Creates a Supabase client for use in Server Components and API Routes
 * 
 * Use this in:
 * - Server Components (default in Next.js 14)
 * - API Routes
 * - Server Actions
 * 
 * Automatically handles cookie-based authentication
 * 
 * @example
 * ```tsx
 * // Server Component
 * import { createServerClient } from '@/lib/supabase/server';
 * 
 * export default async function DecksPage() {
 *   const supabase = createServerClient();
 *   const { data: decks } = await supabase.from('decks').select('*');
 *   return <DeckList decks={decks} />;
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Server Action
 * 'use server';
 * 
 * import { createServerClient } from '@/lib/supabase/server';
 * 
 * export async function createDeck(name: string) {
 *   const supabase = createServerClient();
 *   const { data, error } = await supabase
 *     .from('decks')
 *     .insert({ name });
 *   return { data, error };
 * }
 * ```
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

