/**
 * StatsBar Component
 * 
 * Displays user statistics in cards
 * Server component - receives props from page
 */

import { StatCard } from '@/components/ui/stat-card';
import { Library, Layers, Sparkles } from 'lucide-react';

interface StatsBarProps {
  deckCount: number;
  cardsCount: number;
  formatsCount: number;
}

export function StatsBar({ deckCount, cardsCount, formatsCount }: StatsBarProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Decks"
        value={deckCount}
        icon={<Layers className="h-5 w-5" />}
        description={deckCount === 1 ? '1 deck created' : `${deckCount} decks created`}
      />
      
      <StatCard
        label="Cards"
        value={cardsCount}
        icon={<Library className="h-5 w-5" />}
        description={cardsCount === 1 ? '1 card in collection' : `${cardsCount} cards in collection`}
      />
      
      <StatCard
        label="Formats"
        value={formatsCount}
        icon={<Sparkles className="h-5 w-5" />}
        description={formatsCount === 1 ? '1 format played' : `${formatsCount} formats played`}
        className="sm:col-span-2 lg:col-span-1"
      />
    </div>
  );
}

