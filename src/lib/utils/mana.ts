/**
 * Mana Symbol Parsing and Utilities
 * 
 * Handles MTG mana cost parsing and manipulation
 */

import type { ManaSymbol } from '@/types/card';

/**
 * Parse mana cost string into array of symbols
 * 
 * Example: "{2}{U}{U}" → ['2', 'U', 'U']
 * Example: "{X}{2/W}{G}" → ['X', '2/W', 'G']
 */
export function parseManaSymbols(manaCost: string): ManaSymbol[] {
  if (!manaCost) return [];
  
  const regex = /{([^}]+)}/g;
  const symbols: ManaSymbol[] = [];
  let match;
  
  while ((match = regex.exec(manaCost)) !== null) {
    symbols.push(match[1] as ManaSymbol);
  }
  
  return symbols;
}

/**
 * Calculate converted mana cost (CMC) from mana cost string
 * 
 * Example: "{2}{U}{U}" → 4
 * Example: "{X}{G}" → 1 (X counts as 0)
 */
export function calculateCMC(manaCost: string): number {
  const symbols = parseManaSymbols(manaCost);
  let cmc = 0;
  
  for (const symbol of symbols) {
    // Handle generic mana (numbers)
    const numValue = parseInt(symbol, 10);
    if (!isNaN(numValue)) {
      cmc += numValue;
      continue;
    }
    
    // Handle hybrid mana (e.g., "2/W" counts as 2)
    if (symbol.includes('/')) {
      const parts = symbol.split('/');
      const firstNum = parseInt(parts[0], 10);
      if (!isNaN(firstNum)) {
        cmc += firstNum;
      } else {
        cmc += 1; // Color hybrid (e.g., "W/U") counts as 1
      }
      continue;
    }
    
    // Handle variables (X, Y, Z count as 0)
    if (symbol === 'X' || symbol === 'Y' || symbol === 'Z') {
      continue;
    }
    
    // Single color or colorless symbols count as 1
    cmc += 1;
  }
  
  return cmc;
}

/**
 * Get color pips from mana cost
 * 
 * Example: "{2}{U}{U}" → { U: 2 }
 * Example: "{W}{U}{B}{R}{G}" → { W: 1, U: 1, B: 1, R: 1, G: 1 }
 */
export function getColorPips(manaCost: string): Record<string, number> {
  const symbols = parseManaSymbols(manaCost);
  const pips: Record<string, number> = {
    W: 0,
    U: 0,
    B: 0,
    R: 0,
    G: 0,
  };
  
  for (const symbol of symbols) {
    // Skip generic mana
    if (!isNaN(parseInt(symbol, 10))) continue;
    
    // Skip variables
    if (symbol === 'X' || symbol === 'Y' || symbol === 'Z') continue;
    
    // Handle hybrid mana
    if (symbol.includes('/')) {
      const colors = symbol.split('/').filter(c => /[WUBRG]/.test(c));
      colors.forEach(color => {
        if (color in pips) {
          pips[color] += 0.5; // Hybrid counts as 0.5 for each color
        }
      });
      continue;
    }
    
    // Single color pip
    if (symbol in pips) {
      pips[symbol] += 1;
    }
  }
  
  return pips;
}

/**
 * Get colors from mana cost
 * 
 * Example: "{2}{U}{U}" → ['U']
 * Example: "{W}{U}{B}{R}{G}" → ['W', 'U', 'B', 'R', 'G']
 */
export function getColorsFromManaCost(manaCost: string): string[] {
  const pips = getColorPips(manaCost);
  return Object.keys(pips).filter(color => pips[color] > 0);
}

/**
 * Get color identity from mana cost and rules text
 * 
 * For Commander color identity rules
 */
export function getColorIdentity(manaCost: string, oracleText: string = ''): string[] {
  const colors = new Set<string>();
  
  // Parse mana cost
  const symbols = parseManaSymbols(manaCost);
  for (const symbol of symbols) {
    if (/W/.test(symbol)) colors.add('W');
    if (/U/.test(symbol)) colors.add('U');
    if (/B/.test(symbol)) colors.add('B');
    if (/R/.test(symbol)) colors.add('R');
    if (/G/.test(symbol)) colors.add('G');
  }
  
  // Parse rules text for mana symbols
  const textSymbols = parseManaSymbols(oracleText);
  for (const symbol of textSymbols) {
    if (/W/.test(symbol)) colors.add('W');
    if (/U/.test(symbol)) colors.add('U');
    if (/B/.test(symbol)) colors.add('B');
    if (/R/.test(symbol)) colors.add('R');
    if (/G/.test(symbol)) colors.add('G');
  }
  
  return Array.from(colors).sort();
}

/**
 * Check if card is within color identity
 * 
 * Used for Commander deck building
 */
export function isWithinColorIdentity(
  cardIdentity: string[],
  commanderIdentity: string[]
): boolean {
  return cardIdentity.every(color => commanderIdentity.includes(color));
}

/**
 * Get mana symbol image URL
 * 
 * Uses Scryfall's symbol images
 */
export function getManaSymbolImageUrl(symbol: ManaSymbol): string {
  // Scryfall symbol images
  return `https://svgs.scryfall.io/card-symbols/${encodeURIComponent(symbol)}.svg`;
}

/**
 * Format mana cost for display
 * 
 * Example: ['2', 'U', 'U'] → "{2}{U}{U}"
 */
export function formatManaCost(symbols: ManaSymbol[]): string {
  return symbols.map(s => `{${s}}`).join('');
}

