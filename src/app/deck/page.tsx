/**
 * Deck List Page
 * 
 * Shows all user's decks with:
 * - Responsive grid (desktop: 3-4 cols, mobile: 1-2 cols)
 * - Create new deck button
 * - Filter by format
 * - Sort options
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { DeckListHeader } from '@/components/deck/DeckListHeader';
import { DeckCardGrid } from '@/components/deck/DeckCardGrid';
import { DeckEmptyState } from '@/components/deck/DeckEmptyState';

export default async function DeckListPage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch user's decks
  const { data: decks, error } = await supabase
    .from('decks')
    .select('*')
    .order('updated_at', { ascending: false });

  const hasDecks = (decks?.length || 0) > 0;

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <DeckListHeader deckCount={decks?.length || 0} />

        <div className="container mx-auto px-4 py-6">
          {hasDecks ? (
            <DeckCardGrid decks={decks || []} />
          ) : (
            <DeckEmptyState />
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}

