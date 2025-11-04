/**
 * useCardSearch Hook
 * 
 * Scryfall API integration with:
 * - Debounced search (300ms minimum per .cursorrules)
 * - React Query caching (5min stale time)
 * - Rate limiting (10 req/sec via client)
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchCards } from '@/lib/scryfall/client';
import type { ScryfallCard } from '@/lib/scryfall/types';
import { useDebounce } from './useDebounce';

interface UseCardSearchOptions {
  minLength?: number;
  debounceMs?: number;
  enabled?: boolean;
}

export function useCardSearch(initialQuery: string = '', options: UseCardSearchOptions = {}) {
  const {
    minLength = 3,
    debounceMs = 300, // Minimum 300ms per .cursorrules
    enabled = true,
  } = options;

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, debounceMs);

  // Only search if query is long enough
  const shouldSearch = debouncedQuery.length >= minLength && enabled;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['cards', 'search', debouncedQuery],
    queryFn: async () => {
      const response = await searchCards({
        query: debouncedQuery,
      });
      return response.data;
    },
    enabled: shouldSearch,
    staleTime: 1000 * 60 * 5, // 5 minutes cache (per .cursorrules)
    gcTime: 1000 * 60 * 10, // 10 minutes in garbage collection
  });

  return {
    query,
    setQuery,
    results: data || [],
    isLoading,
    error: error as Error | null,
    refetch,
    isSearching: isLoading && shouldSearch,
  };
}

/**
 * Hook for autocomplete card names
 */
export function useCardAutocomplete(query: string) {
  const debouncedQuery = useDebounce(query, 300);

  const {
    data,
    isLoading,
  } = useQuery({
    queryKey: ['cards', 'autocomplete', debouncedQuery],
    queryFn: async () => {
      const { autocompleteCardName } = await import('@/lib/scryfall/client');
      return autocompleteCardName(debouncedQuery);
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 10, // 10 minutes cache for autocomplete
  });

  return {
    suggestions: data || [],
    isLoading,
  };
}

/**
 * Hook to get a single card by ID
 */
export function useCard(scryfallId: string | null) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cards', scryfallId],
    queryFn: async () => {
      if (!scryfallId) throw new Error('No card ID provided');
      const { getCard } = await import('@/lib/scryfall/client');
      return getCard(scryfallId);
    },
    enabled: !!scryfallId,
    staleTime: 1000 * 60 * 60, // 1 hour cache for individual cards
  });

  return {
    card: data || null,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Hook to get multiple cards by IDs
 */
export function useCards(scryfallIds: string[]) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cards', 'batch', scryfallIds.sort().join(',')],
    queryFn: async () => {
      const { getCardsByIds } = await import('@/lib/scryfall/client');
      const response = await getCardsByIds(scryfallIds);
      return response.data;
    },
    enabled: scryfallIds.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour cache for batch requests
  });

  return {
    cards: data || [],
    isLoading,
    error: error as Error | null,
  };
}

