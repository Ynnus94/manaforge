/**
 * Scryfall API Client
 * 
 * Rate limit: 10 requests per second (enforced)
 * Caching: Use React Query or similar
 * 
 * https://scryfall.com/docs/api
 */

import type { ScryfallCard, ScryfallListResponse, ScryfallError, SearchOptions } from './types';

const SCRYFALL_API_BASE = 'https://api.scryfall.com';
const RATE_LIMIT_MS = 100; // 100ms between requests = 10 req/sec max

// Simple rate limiter
let lastRequestTime = 0;

async function rateLimit() {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Fetch wrapper with error handling
 */
async function scryfallFetch<T>(url: string): Promise<T> {
  await rateLimit();
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      const error = data as ScryfallError;
      throw new Error(`Scryfall API Error: ${error.details || error.code}`);
    }
    
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error fetching from Scryfall');
  }
}

/**
 * Search for cards by name or query
 * 
 * Example queries:
 * - "Lightning Bolt"
 * - "t:creature c:red"
 * - "f:commander"
 * 
 * https://scryfall.com/docs/api/cards/search
 */
export async function searchCards(options: SearchOptions): Promise<ScryfallListResponse<ScryfallCard>> {
  const params = new URLSearchParams({
    q: options.query,
    unique: options.unique || 'cards',
    order: options.order || 'name',
    dir: options.dir || 'auto',
  });
  
  if (options.include_extras !== undefined) {
    params.set('include_extras', options.include_extras.toString());
  }
  
  if (options.include_multilingual !== undefined) {
    params.set('include_multilingual', options.include_multilingual.toString());
  }
  
  if (options.page !== undefined) {
    params.set('page', options.page.toString());
  }
  
  const url = `${SCRYFALL_API_BASE}/cards/search?${params.toString()}`;
  return scryfallFetch<ScryfallListResponse<ScryfallCard>>(url);
}

/**
 * Get a single card by Scryfall ID
 * 
 * https://scryfall.com/docs/api/cards/id
 */
export async function getCard(scryfallId: string): Promise<ScryfallCard> {
  const url = `${SCRYFALL_API_BASE}/cards/${scryfallId}`;
  return scryfallFetch<ScryfallCard>(url);
}

/**
 * Get multiple cards by Scryfall IDs (batch request)
 * 
 * Maximum 75 identifiers per request
 * https://scryfall.com/docs/api/cards/collection
 */
export async function getCardsByIds(scryfallIds: string[]): Promise<ScryfallListResponse<ScryfallCard>> {
  // Split into chunks of 75
  const chunks: string[][] = [];
  for (let i = 0; i < scryfallIds.length; i += 75) {
    chunks.push(scryfallIds.slice(i, i + 75));
  }
  
  // Fetch all chunks
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      const identifiers = chunk.map(id => ({ id }));
      
      await rateLimit();
      
      const response = await fetch(`${SCRYFALL_API_BASE}/cards/collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifiers }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const error = data as ScryfallError;
        throw new Error(`Scryfall API Error: ${error.details || error.code}`);
      }
      
      return data as ScryfallListResponse<ScryfallCard>;
    })
  );
  
  // Combine results
  const combinedData: ScryfallCard[] = [];
  for (const result of results) {
    combinedData.push(...result.data);
  }
  
  return {
    object: 'list',
    total_cards: combinedData.length,
    has_more: false,
    data: combinedData,
  };
}

/**
 * Autocomplete card names
 * 
 * https://scryfall.com/docs/api/cards/autocomplete
 */
export async function autocompleteCardName(query: string): Promise<string[]> {
  const params = new URLSearchParams({ q: query });
  const url = `${SCRYFALL_API_BASE}/cards/autocomplete?${params.toString()}`;
  
  const response = await scryfallFetch<{
    object: 'catalog';
    total_values: number;
    data: string[];
  }>(url);
  
  return response.data;
}

/**
 * Get a random card
 * 
 * https://scryfall.com/docs/api/cards/random
 */
export async function getRandomCard(query?: string): Promise<ScryfallCard> {
  const params = query ? new URLSearchParams({ q: query }) : '';
  const url = `${SCRYFALL_API_BASE}/cards/random${params ? `?${params}` : ''}`;
  return scryfallFetch<ScryfallCard>(url);
}

