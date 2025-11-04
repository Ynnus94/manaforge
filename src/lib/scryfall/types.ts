/**
 * Scryfall API Types
 * 
 * Based on Scryfall API documentation
 * https://scryfall.com/docs/api
 */

import type { Card } from '@/types/card';

/**
 * Scryfall API Response for card search
 */
export interface ScryfallListResponse<T> {
  object: 'list';
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: T[];
}

/**
 * Scryfall card object (raw API response)
 * Extends our Card type
 */
export type ScryfallCard = Card;

/**
 * Scryfall error response
 */
export interface ScryfallError {
  object: 'error';
  code: string;
  status: number;
  details: string;
}

/**
 * Search options for Scryfall API
 */
export interface SearchOptions {
  query: string;
  unique?: 'cards' | 'art' | 'prints';
  order?: 'name' | 'set' | 'released' | 'rarity' | 'color' | 'usd' | 'tix' | 'eur' | 'cmc' | 'power' | 'toughness' | 'edhrec' | 'artist';
  dir?: 'auto' | 'asc' | 'desc';
  include_extras?: boolean;
  include_multilingual?: boolean;
  page?: number;
}

