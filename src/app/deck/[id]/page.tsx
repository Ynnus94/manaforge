/**
 * Deck Builder Page
 * 
 * 3-panel responsive layout:
 * - Left: Card search + filters
 * - Middle: Current deck list + stats
 * - Right: AI chat (provided by ResponsiveLayout)
 * 
 * Mobile: Stacked with tab navigation
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { DeckBuilderDesktop } from '@/components/deck/builder/DeckBuilderDesktop';
import { DeckBuilderMobile } from '@/components/deck/builder/DeckBuilderMobile';

interface DeckBuilderPageProps {
  params: { id: string };
}

export default async function DeckBuilderPage({ params }: DeckBuilderPageProps) {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch deck
  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('*')
    .eq('id', params.id)
    .single();

  if (deckError || !deck) {
    notFound();
  }

  // Verify ownership
  // @ts-ignore - Supabase generated types
  if (deck.user_id !== user.id) {
    notFound();
  }

  // Fetch deck cards
  const { data: deckCards } = await supabase
    .from('deck_cards')
    .select('*')
    .eq('deck_id', params.id)
    .order('category');

  return (
    <ResponsiveLayout>
      {/* Show different layouts based on screen size */}
      <div className="hidden md:block">
        <DeckBuilderDesktop deck={deck} initialCards={deckCards || []} />
      </div>
      <div className="block md:hidden">
        <DeckBuilderMobile deck={deck} initialCards={deckCards || []} />
      </div>
    </ResponsiveLayout>
  );
}

