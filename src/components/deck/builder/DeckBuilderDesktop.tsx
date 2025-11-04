/**
 * Deck Builder Desktop
 * 
 * 3-panel layout:
 * - Left: Card search (25%)
 * - Middle: Deck list + staging (50%)
 * - Right: AI chat (25% - provided by ResponsiveLayout)
 * 
 * TASK 2.4: Now provides staging context to all children!
 */

'use client';

import type { Database } from '@/lib/supabase/types';
import { CardSearchPanel } from './CardSearchPanel';
import { DeckListPanel } from './DeckListPanel';
import { StagingProvider } from '@/contexts/StagingContext';
import { StagingArea } from '../staging/StagingArea';

type Deck = Database['public']['Tables']['decks']['Row'];
type DeckCard = Database['public']['Tables']['deck_cards']['Row'];

interface DeckBuilderDesktopProps {
  deck: Deck;
  initialCards: DeckCard[];
}

export function DeckBuilderDesktop({ deck, initialCards }: DeckBuilderDesktopProps) {
  return (
    <StagingProvider>
      <div className="flex flex-col h-screen">
        {/* Main 3-Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel: Card Search */}
          <div className="w-[30%] border-r bg-background overflow-y-auto">
            <CardSearchPanel deckFormat={deck.format} />
          </div>

          {/* Middle Panel: Deck List */}
          <div className="flex-1 overflow-y-auto bg-muted/30">
            <DeckListPanel deck={deck} initialCards={initialCards} />
          </div>

          {/* Right Panel: AI Chat - Rendered by ResponsiveLayout */}
        </div>

        {/* Bottom Panel: Staging Area */}
        <div className="border-t bg-background">
          <StagingArea deckId={deck.id} />
        </div>
      </div>
    </StagingProvider>
  );
}

