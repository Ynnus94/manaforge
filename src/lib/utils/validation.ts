/**
 * Deck Format Validation
 * 
 * Validates decks against MTG format rules
 */

import type { Card } from '@/types/card';
import type { Deck, DeckCard, DeckFormat, DeckValidationResult, FormatRules } from '@/types/deck';
import { FORMAT_RULES } from '@/types/deck';
import { isBasicLand } from '@/types/card';
import { isWithinColorIdentity } from './mana';

/**
 * Validate deck against format rules
 */
export function validateDeck(
  deck: Deck,
  deckCards: DeckCard[],
  cardData: Map<string, Card>
): DeckValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rules = FORMAT_RULES[deck.format as DeckFormat];
  
  // 1. Validate deck size
  const mainboardCards = deckCards.filter(c => 
    c.category === 'mainboard' || c.category === 'commander'
  );
  const sideboardCards = deckCards.filter(c => c.category === 'sideboard');
  
  const mainboardCount = mainboardCards.reduce((sum, c) => sum + c.quantity, 0);
  const sideboardCount = sideboardCards.reduce((sum, c) => sum + c.quantity, 0);
  
  // Check mainboard size
  if (rules.exactDeckSize && mainboardCount !== rules.exactDeckSize) {
    errors.push(
      `${deck.format} decks must have exactly ${rules.exactDeckSize} cards (currently ${mainboardCount})`
    );
  } else if (mainboardCount < rules.minDeckSize) {
    errors.push(
      `Deck must have at least ${rules.minDeckSize} cards (currently ${mainboardCount})`
    );
  } else if (rules.maxDeckSize && mainboardCount > rules.maxDeckSize) {
    errors.push(
      `Deck cannot have more than ${rules.maxDeckSize} cards (currently ${mainboardCount})`
    );
  }
  
  // Check sideboard size
  if (rules.allowsSideboard && rules.maxSideboardSize && sideboardCount > rules.maxSideboardSize) {
    errors.push(
      `Sideboard cannot have more than ${rules.maxSideboardSize} cards (currently ${sideboardCount})`
    );
  }
  
  // 2. Validate card copies
  const cardCounts = new Map<string, { count: number; name: string; isBasicLand: boolean }>();
  
  for (const deckCard of mainboardCards) {
    const card = cardData.get(deckCard.scryfall_id);
    if (!card) continue;
    
    const oracleId = card.oracle_id;
    const existing = cardCounts.get(oracleId) || { 
      count: 0, 
      name: card.name,
      isBasicLand: isBasicLand(card)
    };
    
    existing.count += deckCard.quantity;
    cardCounts.set(oracleId, existing);
  }
  
  // Check copy limits
  for (const [_, cardInfo] of cardCounts) {
    if (cardInfo.isBasicLand) continue; // Basic lands exempt
    
    if (cardInfo.count > rules.maxCopies) {
      errors.push(
        `${cardInfo.name} exceeds copy limit (${cardInfo.count}/${rules.maxCopies})`
      );
    }
  }
  
  // 3. Commander-specific validation
  if (deck.format === 'commander') {
    const commanderCards = deckCards.filter(c => c.category === 'commander');
    
    // Must have a commander
    if (commanderCards.length === 0) {
      errors.push('Commander decks must have a commander');
    } else if (commanderCards.length > 2) {
      errors.push('Commander decks cannot have more than 2 commanders');
    } else if (commanderCards.length === 2) {
      // Check if both commanders have Partner
      const commanders = commanderCards.map(dc => cardData.get(dc.scryfall_id));
      const bothHavePartner = commanders.every(c => 
        c?.keywords.includes('Partner') || c?.keywords.includes('Partner with')
      );
      
      if (!bothHavePartner) {
        errors.push('Both commanders must have Partner ability');
      }
    }
    
    // Validate color identity
    if (commanderCards.length > 0 && deck.commander_id) {
      const commander = cardData.get(deck.commander_id);
      if (commander) {
        const commanderIdentity = commander.color_identity;
        
        for (const deckCard of mainboardCards) {
          const card = cardData.get(deckCard.scryfall_id);
          if (!card) continue;
          
          if (!isWithinColorIdentity(card.color_identity, commanderIdentity)) {
            errors.push(
              `${card.name} is outside commander's color identity`
            );
          }
        }
      }
    }
  }
  
  // 4. Format legality
  for (const deckCard of mainboardCards) {
    const card = cardData.get(deckCard.scryfall_id);
    if (!card) continue;
    
    const legality = card.legalities[deck.format as keyof typeof card.legalities];
    
    if (legality === 'banned') {
      errors.push(`${card.name} is banned in ${deck.format}`);
    } else if (legality === 'not_legal') {
      warnings.push(`${card.name} is not legal in ${deck.format}`);
    } else if (legality === 'restricted') {
      warnings.push(`${card.name} is restricted in ${deck.format}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Quick validation (just check deck size and commander)
 */
export function quickValidateDeck(
  format: DeckFormat,
  cardCount: number,
  hasCommander: boolean = false
): { isValid: boolean; message?: string } {
  const rules = FORMAT_RULES[format];
  
  // Check commander requirement
  if (rules.requiresCommander && !hasCommander) {
    return {
      isValid: false,
      message: 'Commander deck requires a commander',
    };
  }
  
  // Check deck size
  if (rules.exactDeckSize && cardCount !== rules.exactDeckSize) {
    return {
      isValid: false,
      message: `Must have exactly ${rules.exactDeckSize} cards (currently ${cardCount})`,
    };
  }
  
  if (cardCount < rules.minDeckSize) {
    return {
      isValid: false,
      message: `Must have at least ${rules.minDeckSize} cards (currently ${cardCount})`,
    };
  }
  
  if (rules.maxDeckSize && cardCount > rules.maxDeckSize) {
    return {
      isValid: false,
      message: `Cannot exceed ${rules.maxDeckSize} cards (currently ${cardCount})`,
    };
  }
  
  return { isValid: true };
}

/**
 * Validate card can be added to deck
 */
export function canAddCardToDeck(
  card: Card,
  deck: Deck,
  existingCards: DeckCard[],
  commanderCard?: Card
): { canAdd: boolean; reason?: string } {
  const rules = FORMAT_RULES[deck.format as DeckFormat];
  
  // Check format legality
  const legality = card.legalities[deck.format as keyof typeof card.legalities];
  if (legality === 'banned') {
    return { canAdd: false, reason: `${card.name} is banned in ${deck.format}` };
  }
  if (legality === 'not_legal') {
    return { canAdd: false, reason: `${card.name} is not legal in ${deck.format}` };
  }
  
  // Check color identity (Commander only)
  if (deck.format === 'commander' && commanderCard) {
    if (!isWithinColorIdentity(card.color_identity, commanderCard.color_identity)) {
      return { 
        canAdd: false, 
        reason: `${card.name} is outside commander's color identity` 
      };
    }
  }
  
  // Check copy limit
  if (!isBasicLand(card)) {
    const existingCount = existingCards
      .filter(dc => {
        // Count cards with same oracle_id
        // (this would need card data lookup in real implementation)
        return dc.scryfall_id === card.id;
      })
      .reduce((sum, dc) => sum + dc.quantity, 0);
    
    if (existingCount >= rules.maxCopies) {
      return { 
        canAdd: false, 
        reason: `Maximum ${rules.maxCopies} copies allowed` 
      };
    }
  }
  
  return { canAdd: true };
}

/**
 * Get validation badge text
 */
export function getValidationBadgeText(result: DeckValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'Valid';
  }
  if (result.isValid && result.warnings.length > 0) {
    return 'Valid (with warnings)';
  }
  return 'Invalid';
}

/**
 * Get validation badge color class
 */
export function getValidationBadgeClass(result: DeckValidationResult): string {
  if (result.isValid && result.warnings.length === 0) {
    return 'bg-green-100 text-green-800 border-green-200';
  }
  if (result.isValid && result.warnings.length > 0) {
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  }
  return 'bg-red-100 text-red-800 border-red-200';
}

