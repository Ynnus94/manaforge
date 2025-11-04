/**
 * Collection Grid
 * 
 * Responsive grid of collection cards:
 * - Mobile: 2 columns
 * - Tablet: 3-4 columns  
 * - Desktop: 4-6 columns
 * 
 * TASK 2.1: Fetches card data from Scryfall
 */

'use client';

import { CollectionCardItem } from './CollectionCardItem';
import { useCards } from '@/hooks/useCards';
import { Skeleton } from '@/components/ui/skeleton';

interface CollectionGridProps {
  cards: Array<{
    id: string;
    scryfall_id: string;
    quantity: number;
    created_at: string;
  }>;
}

export function CollectionGrid({ cards }: CollectionGridProps) {
  // Extract scryfall IDs for batch fetching
  const scryfallIds = cards.map(c => c.scryfall_id);
  
  // Batch fetch card data from Scryfall
  const { cards: cardData, isLoading } = useCards(scryfallIds);

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {cards.map((card) => (
          <Skeleton key={card.id} className="aspect-[5/7] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map((collectionCard) => {
        const card = cardData?.[collectionCard.scryfall_id];
        
        return (
          <CollectionCardItem
            key={collectionCard.id}
            card={card}
            quantity={collectionCard.quantity}
            isLoading={!card}
          />
        );
      })}
    </div>
  );
}

