/**
 * AI Tool Handlers
 * 
 * Implementations for the 10 core MCP tools
 */

import { createServerClient } from '@/lib/supabase/server';
import { searchCards as scryfallSearch, getCard } from '@/lib/scryfall/client';
import { validateDeck } from '@/lib/utils/validation';
import { calculateManaCurve, calculateColorDistribution } from '@/lib/utils/calculations';

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function executeToolCall(
  toolName: string,
  input: Record<string, any>,
  userId: string
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'get_user_collection':
        return await getUserCollection(userId);
      
      case 'get_user_decks':
        return await getUserDecks(userId, input.format);
      
      case 'search_cards':
        return await searchCards(input.query, input.format);
      
      case 'get_card_details':
        return await getCardDetails(input.scryfall_id);
      
      case 'get_card_prices':
        return await getCardPrices(input.scryfall_id);
      
      case 'add_card_to_deck':
        return await addCardToDeck(
          input.deck_id,
          input.scryfall_id,
          parseInt(input.quantity || '1'),
          input.category || 'mainboard'
        );
      
      case 'remove_card_from_deck':
        return await removeCardFromDeck(input.deck_id, input.scryfall_id);
      
      case 'analyze_deck':
        return await analyzeDeck(input.deck_id);
      
      case 'validate_deck_format':
        return await validateDeckFormat(input.deck_id);
      
      case 'suggest_decks_from_collection':
        return await suggestDecksFromCollection(
          userId,
          input.format,
          parseInt(input.max_missing_cards || '10')
        );
      
      default:
        return {
          success: false,
          error: `Unknown tool: ${toolName}`,
        };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Tool Implementations

async function getUserCollection(userId: string): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('collection_cards')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  // @ts-ignore - Supabase generated types
  const totalCards = data?.reduce((sum, card) => sum + card.quantity, 0) || 0;

  return {
    success: true,
    data: {
      total_cards: totalCards,
      unique_cards: data?.length || 0,
      cards: data,
    },
  };
}

async function getUserDecks(userId: string, format?: string): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  let query = supabase
    .from('decks')
    .select('*')
    .eq('user_id', userId);

  if (format) {
    query = query.eq('format', format);
  }

  const { data, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

async function searchCards(query: string, format?: string): Promise<ToolResult> {
  try {
    // @ts-ignore - Scryfall API types
    const results = await scryfallSearch(query);
    
    // @ts-ignore - Scryfall API response structure
    const cards = results.data || [];
    
    // Filter by format if specified
    let filtered = cards;
    if (format) {
      // @ts-ignore
      filtered = cards.filter((card: any) => 
        card.legalities?.[format] === 'legal'
      );
    }

    return {
      success: true,
      data: filtered.slice(0, 10), // Limit to 10 results
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
    };
  }
}

async function getCardDetails(scryfallId: string): Promise<ToolResult> {
  try {
    const card = await getCard(scryfallId);
    return { success: true, data: card };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get card',
    };
  }
}

async function getCardPrices(scryfallId: string): Promise<ToolResult> {
  try {
    const card = await getCard(scryfallId);
    return {
      success: true,
      data: {
        name: card.name,
        prices: card.prices,
        price_usd: card.prices?.usd || 'N/A',
        price_usd_foil: card.prices?.usd_foil || 'N/A',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get prices',
    };
  }
}

async function addCardToDeck(
  deckId: string,
  scryfallId: string,
  quantity: number,
  category: string
): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  // Check if card already exists in deck
  const { data: existing } = await supabase
    .from('deck_cards')
    .select('*')
    .eq('deck_id', deckId)
    .eq('scryfall_id', scryfallId)
    .single();

  if (existing) {
    // Update quantity
    // @ts-ignore - Supabase generated types
    const newQuantity = existing.quantity + quantity;
    
    // @ts-ignore - Supabase generated types
    const { error } = await supabase
      .from('deck_cards')
      // @ts-ignore
      .update({ quantity: newQuantity })
      // @ts-ignore
      .eq('id', existing.id);

    if (error) return { success: false, error: error.message };
    
    return { success: true, data: { message: 'Card quantity updated' } };
  } else {
    // Insert new card
    // @ts-ignore - Supabase generated types
    const { error } = await supabase
      .from('deck_cards')
      // @ts-ignore
      .insert({
        deck_id: deckId,
        scryfall_id: scryfallId,
        quantity,
        category,
      });

    if (error) return { success: false, error: error.message };
    
    return { success: true, data: { message: 'Card added to deck' } };
  }
}

async function removeCardFromDeck(deckId: string, scryfallId: string): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from('deck_cards')
    .delete()
    .eq('deck_id', deckId)
    .eq('scryfall_id', scryfallId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: { message: 'Card removed from deck' } };
}

async function analyzeDeck(deckId: string): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  const { data: deckCards, error } = await supabase
    .from('deck_cards')
    .select('*')
    .eq('deck_id', deckId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Fetch card details for analysis
  // @ts-ignore - Supabase generated types
  const cards = await Promise.all(
    (deckCards || []).map(async (dc: any) => {
      try {
        const card = await getCard(dc.scryfall_id);
        return { ...card, quantity: dc.quantity };
      } catch {
        return null;
      }
    })
  );

  const validCards = cards.filter(Boolean);

  // Calculate stats
  const manaCurve = calculateManaCurve(validCards as any);
  const colorDistribution = calculateColorDistribution(validCards as any);

  // @ts-ignore - Supabase generated types
  const totalCards = deckCards?.reduce((sum: number, card: any) => sum + card.quantity, 0) || 0;

  return {
    success: true,
    data: {
      total_cards: totalCards,
      unique_cards: deckCards?.length || 0,
      mana_curve: manaCurve,
      color_distribution: colorDistribution,
    },
  };
}

async function validateDeckFormat(deckId: string): Promise<ToolResult> {
  const supabase = await createServerClient();
  
  // Get deck info
  const { data: deck } = await supabase
    .from('decks')
    .select('*')
    .eq('id', deckId)
    .single();

  if (!deck) {
    return { success: false, error: 'Deck not found' };
  }

  // Get deck cards
  const { data: deckCards } = await supabase
    .from('deck_cards')
    .select('*')
    .eq('deck_id', deckId);

  // Fetch card details
  // @ts-ignore - Supabase generated types
  const cards = await Promise.all(
    (deckCards || []).map(async (dc: any) => {
      try {
        const card = await getCard(dc.scryfall_id);
        return { ...card, quantity: dc.quantity };
      } catch {
        return null;
      }
    })
  );

  const validCards = cards.filter(Boolean);

  // Validate
  // @ts-ignore - Type complexity
  const validation = validateDeck(
    // @ts-ignore
    deck,
    // @ts-ignore
    validCards,
    // @ts-ignore
    deck.format
  );

  return {
    success: true,
    data: validation,
  };
}

async function suggestDecksFromCollection(
  userId: string,
  format?: string,
  maxMissingCards: number = 10
): Promise<ToolResult> {
  // This is a placeholder for complex deck suggestion logic
  // In production, this would analyze the collection and suggest complete decks
  
  return {
    success: true,
    data: {
      message: 'Deck suggestion feature coming soon!',
      suggested_decks: [],
    },
  };
}

