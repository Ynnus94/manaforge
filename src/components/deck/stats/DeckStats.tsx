/**
 * Deck Stats Component
 * 
 * Combined stats view with mana curve + color distribution
 */

'use client';

import { ManaCurveChart } from './ManaCurveChart';
import { ColorDistribution } from './ColorDistribution';

interface DeckStatsProps {
  deckId: string;
}

export function DeckStats({ deckId }: DeckStatsProps) {
  // TODO: Fetch actual deck stats
  const mockManaCurve = { 0: 10, 1: 15, 2: 20, 3: 18, 4: 12, 5: 8, 6: 5, 7: 2 };
  const mockColorDist = { W: 20, U: 25, B: 15, R: 18, G: 22, C: 10 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ManaCurveChart curve={mockManaCurve} />
      <ColorDistribution distribution={mockColorDist} />
    </div>
  );
}

