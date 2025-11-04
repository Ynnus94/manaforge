/**
 * Deck Builder Mobile
 * 
 * Tabbed interface:
 * - Tab 1: Deck list
 * - Tab 2: Card search
 * - Tab 3: Stats
 * - AI: Floating button (provided by ResponsiveLayout)
 */

'use client';

import type { Database } from '@/lib/supabase/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardSearchPanel } from './CardSearchPanel';
import { DeckListPanel } from './DeckListPanel';
import { ListChecks, Search, BarChart3 } from 'lucide-react';

type Deck = Database['public']['Tables']['decks']['Row'];
type DeckCard = Database['public']['Tables']['deck_cards']['Row'];

interface DeckBuilderMobileProps {
  deck: Deck;
  initialCards: DeckCard[];
}

export function DeckBuilderMobile({ deck, initialCards }: DeckBuilderMobileProps) {
  return (
    <div className="h-screen flex flex-col">
      <Tabs defaultValue="deck" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="deck" className="flex-1">
            <ListChecks className="h-4 w-4 mr-2" />
            Deck
          </TabsTrigger>
          <TabsTrigger value="search" className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deck" className="flex-1 overflow-y-auto m-0">
          <DeckListPanel deck={deck} initialCards={initialCards} />
        </TabsContent>

        <TabsContent value="search" className="flex-1 overflow-y-auto m-0">
          <CardSearchPanel deckFormat={deck.format} />
        </TabsContent>

        <TabsContent value="stats" className="flex-1 overflow-y-auto p-4 m-0">
          <p className="text-muted-foreground text-center">
            Stats coming soon (Task 25)!
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}

