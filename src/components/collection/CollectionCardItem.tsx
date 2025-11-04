/**
 * Collection Card Item
 * 
 * Single card in collection with:
 * - Card name and image from Scryfall
 * - Quantity badge
 * - Quick actions (on hover/tap)
 * 
 * TASK 2.1: Now displays real card data!
 */

'use client';

import { useState } from 'react';
import type { Card as CardType } from '@/types/card';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CollectionCardItemProps {
  card?: CardType;
  quantity: number;
  isLoading?: boolean;
}

export function CollectionCardItem({ card, quantity, isLoading }: CollectionCardItemProps) {
  const [showActions, setShowActions] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoading || !card) {
    return <Skeleton className="aspect-[5/7] rounded-lg" />;
  }

  const cardImageUrl = card.image_uris?.normal || card.image_uris?.large || card.image_uris?.small;

  return (
    <Card 
      className="group relative overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      title={card.name}
    >
      {/* Card Image */}
      <div className="aspect-[5/7] relative bg-muted">
        {cardImageUrl && !imageError ? (
          <img
            src={cardImageUrl}
            alt={card.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 p-2">
            <p className="text-sm font-bold text-center line-clamp-3">{card.name}</p>
          </div>
        )}
        
        {/* Card Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-white text-xs font-semibold truncate">{card.name}</p>
        </div>
        
        {/* Quantity Badge */}
        <Badge 
          className="absolute top-2 right-2 font-bold shadow-lg"
          variant={quantity > 4 ? 'default' : 'secondary'}
        >
          ×{quantity}
        </Badge>

        {/* Quick Actions (hover/touch) */}
        {showActions && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center gap-2 p-4">
            <Button size="sm" variant="secondary" title="Add more copies">
              <Plus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" title="Remove one copy">
              <Minus className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" title="Remove all">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

