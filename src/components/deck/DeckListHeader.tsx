/**
 * Deck List Header
 * 
 * Header for deck list page with create button
 */

'use client';

import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeckListHeaderProps {
  deckCount: number;
}

export function DeckListHeader({ deckCount }: DeckListHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Decks</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {deckCount} {deckCount === 1 ? 'deck' : 'decks'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="lg">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Deck
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

