/**
 * Deck Statistics Calculations
 * 
 * Calculate mana curve, averages, and other deck metrics
 */

import type { Card } from '@/types/card';
import type { DeckStats } from '@/types/deck';

/**
 * Calculate mana curve from list of cards
 * 
 * Returns: { cmc: count }
 * Example: { 1: 10, 2: 15, 3: 12, 4: 8, 5: 3, 6: 2 }
 */
export function calculateManaCurve(cards: Array<{ cmc: number; quantity: number }>): Record<number, number> {
  const curve: Record<number, number> = {};
  
  for (const card of cards) {
    const cmc = Math.floor(card.cmc); // Round down fractional CMC
    const clampedCMC = Math.min(cmc, 7); // Clamp at 7+ for display
    
    if (curve[clampedCMC]) {
      curve[clampedCMC] += card.quantity;
    } else {
      curve[clampedCMC] = card.quantity;
    }
  }
  
  return curve;
}

/**
 * Calculate average CMC (excluding lands)
 */
export function calculateAverageCMC(cards: Array<{ cmc: number; type_line: string; quantity: number }>): number {
  let totalCMC = 0;
  let totalCards = 0;
  
  for (const card of cards) {
    // Skip lands for average CMC
    if (card.type_line.includes('Land')) continue;
    
    totalCMC += card.cmc * card.quantity;
    totalCards += card.quantity;
  }
  
  if (totalCards === 0) return 0;
  
  return Math.round((totalCMC / totalCards) * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate color distribution
 */
export function calculateColorDistribution(
  cards: Array<{ color_identity: string[]; quantity: number }>
): { W: number; U: number; B: number; R: number; G: number; C: number } {
  const distribution = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
    C: 0, // Colorless
  };
  
  for (const card of cards) {
    if (card.color_identity.length === 0) {
      // Colorless
      distribution.C += card.quantity;
    } else {
      // Add to each color in identity
      for (const color of card.color_identity) {
        if (color in distribution) {
          distribution[color as keyof typeof distribution] += card.quantity;
        }
      }
    }
  }
  
  return distribution;
}

/**
 * Calculate card type distribution
 */
export function calculateTypeDistribution(
  cards: Array<{ type_line: string; quantity: number }>
): {
  creatures: number;
  instants: number;
  sorceries: number;
  artifacts: number;
  enchantments: number;
  planeswalkers: number;
  lands: number;
  other: number;
} {
  const types = {
    creatures: 0,
    instants: 0,
    sorceries: 0,
    artifacts: 0,
    enchantments: 0,
    planeswalkers: 0,
    lands: 0,
    other: 0,
  };
  
  for (const card of cards) {
    const typeLine = card.type_line.toLowerCase();
    
    // Check each type (cards can be multiple types)
    if (typeLine.includes('creature')) {
      types.creatures += card.quantity;
    } else if (typeLine.includes('instant')) {
      types.instants += card.quantity;
    } else if (typeLine.includes('sorcery')) {
      types.sorceries += card.quantity;
    } else if (typeLine.includes('planeswalker')) {
      types.planeswalkers += card.quantity;
    } else if (typeLine.includes('artifact')) {
      types.artifacts += card.quantity;
    } else if (typeLine.includes('enchantment')) {
      types.enchantments += card.quantity;
    } else if (typeLine.includes('land')) {
      types.lands += card.quantity;
    } else {
      types.other += card.quantity;
    }
  }
  
  return types;
}

/**
 * Calculate comprehensive deck statistics
 */
export function calculateDeckStats(
  cards: Array<{
    cmc: number;
    type_line: string;
    color_identity: string[];
    quantity: number;
    category?: string;
  }>,
  commanderName?: string,
  partnerCommanderName?: string
): DeckStats {
  // Filter by category
  const mainboard = cards.filter(c => !c.category || c.category === 'mainboard');
  const sideboard = cards.filter(c => c.category === 'sideboard');
  const maybeboard = cards.filter(c => c.category === 'maybeboard');
  
  // Calculate totals
  const totalCards = mainboard.reduce((sum, c) => sum + c.quantity, 0);
  const sideboardCount = sideboard.reduce((sum, c) => sum + c.quantity, 0);
  const maybeboardCount = maybeboard.reduce((sum, c) => sum + c.quantity, 0);
  
  // Calculate metrics
  const manaCurve = calculateManaCurve(mainboard);
  const avgCMC = calculateAverageCMC(mainboard);
  const colorDistribution = calculateColorDistribution(mainboard);
  const typeDistribution = calculateTypeDistribution(mainboard);
  
  // Get color identity from mainboard
  const colorIdentity = Array.from(
    new Set(
      mainboard.flatMap(card => card.color_identity)
    )
  ).sort();
  
  return {
    totalCards,
    mainboardCount: totalCards,
    sideboardCount,
    maybeboardCount,
    
    manaCurve,
    avgCMC,
    
    ...typeDistribution,
    
    colorDistribution,
    colorIdentity,
    commanderName,
    partnerCommanderName,
  };
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

/**
 * Get mana curve display data (for charts)
 */
export function getManaCurveChartData(manaCurve: Record<number, number>) {
  return Array.from({ length: 8 }, (_, i) => ({
    cmc: i === 7 ? '7+' : i.toString(),
    count: manaCurve[i] || 0,
  }));
}

/**
 * Get color distribution chart data
 */
export function getColorDistributionChartData(distribution: Record<string, number>) {
  const colorNames: Record<string, string> = {
    W: 'White',
    U: 'Blue',
    B: 'Black',
    R: 'Red',
    G: 'Green',
    C: 'Colorless',
  };
  
  return Object.entries(distribution)
    .filter(([_, count]) => count > 0)
    .map(([color, count]) => ({
      color,
      name: colorNames[color] || color,
      count,
    }));
}

