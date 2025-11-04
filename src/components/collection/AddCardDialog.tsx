/**
 * Add Card Dialog
 * 
 * Allows users to add cards to their collection by:
 * - Searching by name
 * - Adding by Scryfall ID
 * 
 * TASK 2.7: Functional dialog for adding cards to collection
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCardSearch } from '@/hooks/useCardSearch';
import { createBrowserClient } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Search, Plus, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCardDialog({ open, onOpenChange }: AddCardDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { query, setQuery, results: cards, isLoading } = useCardSearch();
  const supabase = createBrowserClient();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddCard = async (scryfallId: string, cardName: string) => {
    setIsAdding(true);
    try {
      // Check if card already exists in collection
      const { data: existing } = await supabase
        .from('collection_cards')
        .select('*')
        .eq('scryfall_id', scryfallId)
        .single();

      if (existing) {
        // Update quantity
        // @ts-ignore - Supabase generated types
        const newQuantity = existing.quantity + quantity;
        
        const { error } = await supabase
          .from('collection_cards')
          // @ts-ignore
          .update({ quantity: newQuantity })
          // @ts-ignore
          .eq('id', existing.id);

        if (error) throw error;

        toast({
          title: '✓ Quantity Updated',
          description: `${cardName} quantity increased to ${newQuantity}`,
        });
      } else {
        // Insert new card
        const { error } = await supabase
          .from('collection_cards')
          // @ts-ignore - Supabase generated types
          .insert({
            scryfall_id: scryfallId,
            quantity: quantity,
          });

        if (error) throw error;

        toast({
          title: '✓ Card Added',
          description: `${cardName} (×${quantity}) added to collection`,
        });
      }

      // Reset quantity but keep dialog open and clear search
      setQuantity(1);
      
      // Refresh the page to show new card
      router.refresh();
    } catch (error) {
      console.error('Failed to add card:', error);
      toast({
        title: 'Error',
        description: 'Failed to add card to collection',
        variant: 'destructive',
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Cards to Collection</DialogTitle>
          <DialogDescription>
            Search for cards by name and add them to your collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search">Search for Card</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g., Lightning Bolt"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          {/* Search Results */}
          {query && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : cards && cards.length > 0 ? (
                <ScrollArea className="h-[400px] border rounded-md p-3">
                  <div className="space-y-3">
                    {cards.slice(0, 20).map((card: any) => {
                      const cardImageUrl = card.image_uris?.small || card.image_uris?.normal;
                      
                      return (
                        <div
                          key={card.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-all hover:shadow-md group"
                        >
                          {/* Card Image */}
                          {cardImageUrl && (
                            <div className="w-16 h-auto rounded overflow-hidden flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                              <img
                                src={cardImageUrl}
                                alt={card.name}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          
                          {/* Card Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{card.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {card.set_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {card.type_line}
                            </p>
                            {card.mana_cost && (
                              <p className="text-xs font-mono mt-1 text-primary">{card.mana_cost}</p>
                            )}
                          </div>
                          
                          {/* Add Button */}
                          <Button
                            size="sm"
                            onClick={() => handleAddCard(card.id, card.name)}
                            disabled={isAdding}
                            className="flex-shrink-0"
                          >
                            {isAdding ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No cards found. Try a different search.
                </p>
              )}
            </div>
          )}

          {!query && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Start typing to search for cards
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

