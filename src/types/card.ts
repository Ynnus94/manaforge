/**
 * Magic: The Gathering Card Types
 * 
 * Based on Scryfall API structure
 * https://scryfall.com/docs/api/cards
 */

export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
}

export interface CardFace {
  name: string;
  mana_cost: string;
  type_line: string;
  oracle_text: string;
  colors?: string[];
  power?: string;
  toughness?: string;
  loyalty?: string;
  image_uris?: ImageUris;
}

export interface Card {
  // Unique identifiers
  id: string;              // Scryfall ID (unique per printing)
  oracle_id: string;       // Same across all printings
  
  // Basic info
  name: string;
  lang: string;
  released_at: string;
  
  // Card details
  mana_cost: string;
  cmc: number;             // Converted mana cost
  type_line: string;
  oracle_text: string;
  
  // Colors
  colors?: string[];       // Actual colors in mana cost
  color_identity: string[]; // Commander color identity
  
  // Card stats
  power?: string;
  toughness?: string;
  loyalty?: string;
  
  // Legality
  legalities: {
    standard: 'legal' | 'not_legal' | 'restricted' | 'banned';
    modern: 'legal' | 'not_legal' | 'restricted' | 'banned';
    commander: 'legal' | 'not_legal' | 'restricted' | 'banned';
    pioneer: 'legal' | 'not_legal' | 'restricted' | 'banned';
    legacy: 'legal' | 'not_legal' | 'restricted' | 'banned';
    vintage: 'legal' | 'not_legal' | 'restricted' | 'banned';
  };
  
  // Images
  image_uris?: ImageUris;
  card_faces?: CardFace[]; // For double-faced cards
  
  // Set info
  set: string;
  set_name: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic' | 'special' | 'bonus';
  
  // Prices
  prices?: {
    usd?: string;
    usd_foil?: string;
    eur?: string;
    tix?: string;
  };
  
  // Additional data
  keywords: string[];
  games: string[];
}

/**
 * Mana Symbols for rendering
 */
export type ManaSymbol = 
  | 'W' | 'U' | 'B' | 'R' | 'G'           // Basic colors
  | 'C'                                    // Colorless
  | 'X' | 'Y' | 'Z'                        // Variables
  | '0' | '1' | '2' | '3' | '4' | '5'      // Generic mana
  | '6' | '7' | '8' | '9' | '10'
  | '11' | '12' | '13' | '14' | '15'
  | '16' | '17' | '18' | '19' | '20'
  | '2/W' | '2/U' | '2/B' | '2/R' | '2/G'  // Hybrid with generic
  | 'W/U' | 'W/B' | 'U/B' | 'U/R' | 'B/R'  // Hybrid colors
  | 'B/G' | 'R/G' | 'R/W' | 'G/W' | 'G/U'
  | 'W/P' | 'U/P' | 'B/P' | 'R/P' | 'G/P'  // Phyrexian mana
  | 'S' | 'T' | 'Q' | 'E'                  // Special symbols
  | 'CHAOS';                                // Planechase

/**
 * Helper type guards
 */

export function isDoubleFaced(card: Card): boolean {
  return Boolean(card.card_faces && card.card_faces.length > 1);
}

export function isBasicLand(card: Card): boolean {
  return card.type_line.includes('Basic Land');
}

export function isLegal(card: Card, format: string): boolean {
  const legality = card.legalities[format as keyof typeof card.legalities];
  return legality === 'legal';
}

/**
 * Get display image URI (handles double-faced cards)
 */
export function getCardImageUri(card: Card): string {
  if (card.image_uris?.normal) {
    return card.image_uris.normal;
  }
  
  if (card.card_faces?.[0]?.image_uris?.normal) {
    return card.card_faces[0].image_uris.normal;
  }
  
  return ''; // Fallback to placeholder
}

