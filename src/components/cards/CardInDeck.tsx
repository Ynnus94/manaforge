/**
 * Card In Deck Component
 * 
 * List item showing card in deck with quantity and actions
 */

'use client';

import type { Card } from '@/types/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, MoveRight } from 'lucide-react';

interface CardInDeckProps {
  card: Card;
  quantity: number;
  category: 'mainboard' | 'sideboard' | 'maybeboard' | 'commander';
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  onMove?: (category: string) => void;
}

export function CardInDeck({
  card,
  quantity,
  category,
  onIncrement,
  onDecrement,
  onRemove,
  onMove,
}: CardInDeckProps) {
  const categoryColors: Record<string, string> = {
    commander: 'bg-purple-500',
    mainboard: 'bg-blue-500',
    sideboard: 'bg-green-500',
    maybeboard: 'bg-yellow-500',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors group">
      {/* Quantity */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onDecrement}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-mono w-6 text-center">{quantity}×</span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onIncrement}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Card Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{card.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {card.mana_cost && (
            <span className="text-xs font-mono text-muted-foreground">
              {card.mana_cost}
            </span>
          )}
          <Badge
            className={`${categoryColors[category]} text-xs`}
            variant="secondary"
          >
            {category}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMove && (
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <MoveRight className="h-4 w-4" />
          </Button>
        )}
        {onRemove && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

