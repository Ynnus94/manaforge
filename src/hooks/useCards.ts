/**
 * useCards Hook
 * 
 * Batch fetches multiple cards from Scryfall API
 * Uses React Query for caching and deduplication
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getCardsByIds } from '@/lib/scryfall/client';
import type { Card } from '@/types/card';

interface UseCardsResult {
  cards: Record<string, Card> | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetch multiple cards by Scryfall IDs
 * Returns a map of scryfall_id -> Card for easy lookup
 */
export function useCards(scryfallIds: string[]): UseCardsResult {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cards', scryfallIds.sort().join(',')],
    queryFn: async () => {
      if (scryfallIds.length === 0) {
        return {};
      }

      const response = await getCardsByIds(scryfallIds);
      
      // Convert array to map for easy lookup
      const cardMap: Record<string, Card> = {};
      response.data.forEach((card) => {
        cardMap[card.id] = card as Card;
      });
      
      return cardMap;
    },
    enabled: scryfallIds.length > 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });

  return {
    cards: data,
    isLoading,
    error: error as Error | null,
    refetch: () => refetch(),
  };
}

/**
 * Test Scryfall connection
 * Use this to verify API is working
 */
export function useTestScryfall() {
  return useQuery({
    queryKey: ['scryfall-test'],
    queryFn: async () => {
      const response = await fetch('https://api.scryfall.com/cards/random');
      if (!response.ok) throw new Error('Scryfall API not accessible');
      return response.json();
    },
    retry: 1,
  });
}

