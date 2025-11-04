/**
 * Collection Page
 * 
 * User's card collection with:
 * - Responsive grid (desktop: 4-6 cols, mobile: 2 cols)
 * - Filters (sidebar on desktop, bottom sheet on mobile)
 * - Search
 * - Stats
 * 
 * UNICORN-GRADE features:
 * - Real-time sync
 * - Lazy loading
 * - Empty states
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { CollectionHeader } from '@/components/collection/CollectionHeader';
import { CollectionGrid } from '@/components/collection/CollectionGrid';
import { CollectionEmptyState } from '@/components/collection/CollectionEmptyState';

export default async function CollectionPage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch collection cards with card details
  const { data: collectionCards, error } = await supabase
    .from('collection_cards')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100); // Initial load, implement pagination later

  // Calculate stats
  // @ts-ignore - Supabase generated types issue
  const totalCards = collectionCards?.reduce((sum, card) => sum + card.quantity, 0) || 0;
  const uniqueCards = collectionCards?.length || 0;

  const hasCards = uniqueCards > 0;

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background">
        <CollectionHeader
          totalCards={totalCards}
          uniqueCards={uniqueCards}
        />

        <div className="container mx-auto px-4 py-6">
          {hasCards ? (
            <CollectionGrid cards={collectionCards || []} />
          ) : (
            <CollectionEmptyState />
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}

