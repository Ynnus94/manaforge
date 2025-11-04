/**
 * Card Grid Component
 * 
 * Responsive grid of MTG cards
 */

'use client';

import type { Card } from '@/types/card';
import { MTGCard } from './MTGCard';

interface CardGridProps {
  cards: Card[];
  onCardClick?: (card: Card) => void;
}

export function CardGrid({ cards, onCardClick }: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No cards to display
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <MTGCard
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  );
}

