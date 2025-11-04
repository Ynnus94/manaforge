/**
 * MTG Card Component
 * 
 * Beautiful card display with image, hover effects
 */

'use client';

import type { Card } from '@/types/card';
import { useState } from 'react';
import { Card as UICard } from '@/components/ui/card';

interface MTGCardProps {
  card: Card;
  onClick?: () => void;
  showImage?: boolean;
}

export function MTGCard({ card, onClick, showImage = true }: MTGCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = card.image_uris?.normal || card.image_uris?.small;

  return (
    <UICard 
      className="group cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden"
      onClick={onClick}
    >
      {showImage && imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={card.name}
          className="w-full h-auto"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="aspect-[5/7] bg-gradient-to-br from-primary/20 to-primary/5 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg">{card.name}</h3>
            {card.mana_cost && (
              <p className="text-sm font-mono mt-2">{card.mana_cost}</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{card.type_line}</p>
            {card.oracle_text && (
              <p className="text-xs mt-2 line-clamp-3">{card.oracle_text}</p>
            )}
          </div>
        </div>
      )}
    </UICard>
  );
}

