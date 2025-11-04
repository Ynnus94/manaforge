/**
 * Deck Card Grid
 * 
 * Responsive grid of deck cards:
 * - Mobile: 1 column
 * - Tablet: 2 columns
 * - Desktop: 3-4 columns
 */

'use client';

import type { Database } from '@/lib/supabase/types';
import { DeckCard } from './DeckCard';

type Deck = Database['public']['Tables']['decks']['Row'];

interface DeckCardGridProps {
  decks: Deck[];
}

export function DeckCardGrid({ decks }: DeckCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {decks.map((deck) => (
        <DeckCard key={deck.id} deck={deck} />
      ))}
    </div>
  );
}

