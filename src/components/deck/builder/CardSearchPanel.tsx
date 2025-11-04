/**
 * Card Search Panel
 * 
 * Search cards and add them to staging
 * 
 * TASK 2.3: Add button now stages cards!
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Check } from 'lucide-react';
import { useCardSearch } from '@/hooks/useCardSearch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useStagingContext } from '@/contexts/StagingContext';
import { useToast } from '@/hooks/use-toast';

interface CardSearchPanelProps {
  deckFormat: string;
}

export function CardSearchPanel({ deckFormat }: CardSearchPanelProps) {
  const [query, setQuery] = useState('');
  const { results: cards, isLoading, error } = useCardSearch(query);
  const { stage, staged } = useStagingContext();
  const { toast } = useToast();

  return (
    <div className="flex flex-col h-full">
      {/* Search Header */}
      <div className="p-4 border-b space-y-2">
        <h2 className="font-semibold">Card Search</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="outline">{deckFormat.toUpperCase()}</Badge>
      </div>

      {/* Search Results */}
      <ScrollArea className="flex-1 p-4">
        {!query && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Start typing to search for cards
          </p>
        )}

        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Searching...
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive text-center py-8">
            {error.message || 'An error occurred'}
          </p>
        )}

        {cards && cards.length > 0 && (
          <div className="space-y-2">
            {cards.map((card: any) => {
              // Check if card is already staged
              const isStaged = staged.some(
                s => s.scryfall_id === card.id && s.action === 'add'
              );

              const handleAddCard = () => {
                if (isStaged) return;

                // Stage the card (action, scryfall_id, quantity, metadata)
                stage('add', card.id, 1, {
                  category: 'mainboard',
                });

                // Show success toast
                toast({
                  title: 'Card Staged',
                  description: `${card.name} added to staging area`,
                });
              };

              return (
                <div
                  key={card.id}
                  className={`flex items-start gap-2 p-2 rounded-lg border transition-colors ${
                    isStaged ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{card.name}</p>
                    <p className="text-xs text-muted-foreground">{card.type_line}</p>
                    {card.mana_cost && (
                      <p className="text-xs font-mono mt-1">{card.mana_cost}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={isStaged ? 'default' : 'ghost'}
                    onClick={handleAddCard}
                    disabled={isStaged}
                    title={isStaged ? 'Already staged' : 'Add to deck'}
                  >
                    {isStaged ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Staged
                      </>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {cards && cards.length === 0 && query && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No cards found
          </p>
        )}
      </ScrollArea>
    </div>
  );
}

