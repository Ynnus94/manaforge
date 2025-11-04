/**
 * Deck Types for MANAFORGE
 * 
 * Based on Supabase database schema
 */

import type { Database } from '@/lib/supabase/types';

/**
 * MTG Deck Formats
 */
export type DeckFormat = 
  | 'commander' 
  | 'standard' 
  | 'modern' 
  | 'pioneer' 
  | 'legacy' 
  | 'vintage' 
  | 'pauper' 
  | 'limited';

/**
 * Card Categories in Deck
 */
export type DeckCardCategory = 
  | 'commander' 
  | 'mainboard' 
  | 'sideboard' 
  | 'maybeboard';

/**
 * Deck from database
 */
export type Deck = Database['public']['Tables']['decks']['Row'];

/**
 * Deck Card from database
 */
export type DeckCard = Database['public']['Tables']['deck_cards']['Row'];

/**
 * Deck with related cards (joined query)
 */
export interface DeckWithCards {
  deck: Deck;
  cards: DeckCard[];
}

/**
 * Deck Statistics
 */
export interface DeckStats {
  totalCards: number;
  mainboardCount: number;
  sideboardCount: number;
  maybeboardCount: number;
  
  // Mana curve
  manaCurve: Record<number, number>; // CMC -> count
  avgCMC: number;
  
  // Card types
  creatures: number;
  instants: number;
  sorceries: number;
  artifacts: number;
  enchantments: number;
  planeswalkers: number;
  lands: number;
  
  // Colors
  colorDistribution: {
    W: number; // White
    U: number; // Blue
    B: number; // Black
    R: number; // Red
    G: number; // Green
    C: number; // Colorless
  };
  
  // Commander specific
  colorIdentity?: string[];
  commanderName?: string;
  partnerCommanderName?: string;
}

/**
 * Deck Validation Result
 */
export interface DeckValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Format Rules
 */
export interface FormatRules {
  minDeckSize: number;
  maxDeckSize?: number;
  exactDeckSize?: number;
  maxCopies: number; // Max copies per card (excluding basic lands)
  allowsSideboard: boolean;
  maxSideboardSize?: number;
  requiresCommander?: boolean;
  allowsPartnerCommanders?: boolean;
}

/**
 * Format Rules Map
 */
export const FORMAT_RULES: Record<DeckFormat, FormatRules> = {
  commander: {
    minDeckSize: 100,
    exactDeckSize: 100,
    maxCopies: 1,
    allowsSideboard: false,
    requiresCommander: true,
    allowsPartnerCommanders: true,
  },
  standard: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  modern: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  pioneer: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  legacy: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  vintage: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  pauper: {
    minDeckSize: 60,
    maxCopies: 4,
    allowsSideboard: true,
    maxSideboardSize: 15,
  },
  limited: {
    minDeckSize: 40,
    maxCopies: Infinity, // No limit in limited
    allowsSideboard: true,
  },
};

/**
 * Helper functions
 */

export function getDeckFormatRules(format: DeckFormat): FormatRules {
  return FORMAT_RULES[format];
}

export function isValidDeckSize(count: number, format: DeckFormat): boolean {
  const rules = FORMAT_RULES[format];
  
  if (rules.exactDeckSize) {
    return count === rules.exactDeckSize;
  }
  
  if (rules.maxDeckSize) {
    return count >= rules.minDeckSize && count <= rules.maxDeckSize;
  }
  
  return count >= rules.minDeckSize;
}

