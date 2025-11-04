/**
 * Deck List Panel
 * 
 * Shows current deck + staging area
 * 
 * TASK 2.2: Now fetches real card data from Scryfall!
 */

'use client';

import type { Database } from '@/lib/supabase/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { GitCommitHorizontal, Plus } from 'lucide-react';
import { useCards } from '@/hooks/useCards';
import { CardInDeck } from '@/components/cards/CardInDeck';

type Deck = Database['public']['Tables']['decks']['Row'];
type DeckCard = Database['public']['Tables']['deck_cards']['Row'];

interface DeckListPanelProps {
  deck: Deck;
  initialCards: DeckCard[];
}

export function DeckListPanel({ deck, initialCards }: DeckListPanelProps) {
  // Extract scryfall IDs and batch fetch card data
  const scryfallIds = initialCards.map((c: any) => c.scryfall_id);
  const { cards: cardData, isLoading } = useCards(scryfallIds);

  // @ts-ignore
  const totalCards = initialCards.reduce((sum: number, card: any) => sum + card.quantity, 0);

  // Group by category
  const categories = {
    commander: initialCards.filter((c: any) => c.category === 'commander'),
    mainboard: initialCards.filter((c: any) => c.category === 'mainboard'),
    sideboard: initialCards.filter((c: any) => c.category === 'sideboard'),
    maybeboard: initialCards.filter((c: any) => c.category === 'maybeboard'),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Deck Header */}
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{deck.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {deck.format.toUpperCase()} · {totalCards} cards
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Cards
          </Button>
        </div>
      </div>

      {/* Deck List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Deck List</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({initialCards.length} unique)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {initialCards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No cards in deck yet. Start searching to add cards!
            </p>
          ) : isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-6">
                {/* Commander */}
                {categories.commander.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-primary">Commander</h3>
                    {categories.commander.map((deckCard: any) => {
                      const card = cardData?.[deckCard.scryfall_id];
                      if (!card) return null;
                      
                      return (
                        <CardInDeck
                          key={deckCard.id}
                          card={card}
                          quantity={deckCard.quantity}
                          category="commander"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Mainboard */}
                {categories.mainboard.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">
                      Mainboard ({categories.mainboard.reduce((sum: number, c: any) => sum + c.quantity, 0)})
                    </h3>
                    {categories.mainboard.map((deckCard: any) => {
                      const card = cardData?.[deckCard.scryfall_id];
                      if (!card) return null;
                      
                      return (
                        <CardInDeck
                          key={deckCard.id}
                          card={card}
                          quantity={deckCard.quantity}
                          category="mainboard"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Sideboard */}
                {categories.sideboard.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Sideboard</h3>
                    {categories.sideboard.map((deckCard: any) => {
                      const card = cardData?.[deckCard.scryfall_id];
                      if (!card) return null;
                      
                      return (
                        <CardInDeck
                          key={deckCard.id}
                          card={card}
                          quantity={deckCard.quantity}
                          category="sideboard"
                        />
                      );
                    })}
                  </div>
                )}

                {/* Maybeboard */}
                {categories.maybeboard.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Maybeboard</h3>
                    {categories.maybeboard.map((deckCard: any) => {
                      const card = cardData?.[deckCard.scryfall_id];
                      if (!card) return null;
                      
                      return (
                        <CardInDeck
                          key={deckCard.id}
                          card={card}
                          quantity={deckCard.quantity}
                          category="maybeboard"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Staging Area Preview */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <GitCommitHorizontal className="h-5 w-5" />
            Staging Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Git-style staging coming in Task 23! 🦄
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

