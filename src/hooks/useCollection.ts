/**
 * useCollection Hook
 * 
 * Collection CRUD operations with real-time subscriptions
 * Pattern from .cursorrules (lines 269-346)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Collection = Database['public']['Tables']['collections']['Row'];
type CollectionCard = Database['public']['Tables']['collection_cards']['Row'];
type CollectionCardInsert = Database['public']['Tables']['collection_cards']['Insert'];
type CollectionCardUpdate = Database['public']['Tables']['collection_cards']['Update'];

interface CollectionWithCards extends Collection {
  cards?: CollectionCard[];
}

export function useCollection(collectionId: string | null) {
  const supabase = createBrowserClient();
  const [collection, setCollection] = useState<CollectionWithCards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch collection data
  const fetchCollection = useCallback(async () => {
    if (!collectionId) {
      setCollection(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('collections')
        .select(`
          *,
          collection_cards (*)
        `)
        .eq('id', collectionId)
        .single();

      if (fetchError) throw fetchError;

      setCollection(data as CollectionWithCards);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch collection'));
    } finally {
      setIsLoading(false);
    }
  }, [collectionId, supabase]);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    const loadCollection = async () => {
      setIsLoading(true);
      await fetchCollection();
      if (cancelled) return;
    };

    loadCollection();

    return () => {
      cancelled = true;
    };
  }, [fetchCollection]);

  // Real-time subscription
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase
      .channel(`collection-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`,
        },
        () => {
          // Refetch collection on any changes
          fetchCollection();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId, supabase, fetchCollection]);

  // CRUD operations
  const addCard = useCallback(async (
    scryfall_id: string,
    quantity: number = 1,
    condition?: string,
    foil: boolean = false
  ) => {
    if (!collectionId) throw new Error('No collection ID');

    const insert: CollectionCardInsert = {
      collection_id: collectionId,
      scryfall_id,
      quantity,
      condition: condition || null,
      foil,
    };

    const { error: insertError } = await supabase
      .from('collection_cards')
      // @ts-ignore - Supabase generated types return never
      .insert(insert);

    if (insertError) throw insertError;

    // Refetch to update state
    await fetchCollection();
  }, [collectionId, supabase, fetchCollection]);

  const updateCard = useCallback(async (
    cardId: string,
    updates: CollectionCardUpdate
  ) => {
    const { error: updateError } = await supabase
      .from('collection_cards')
      // @ts-ignore - Supabase generated types return never
      .update(updates)
      .eq('id', cardId);

    if (updateError) throw updateError;

    await fetchCollection();
  }, [supabase, fetchCollection]);

  const removeCard = useCallback(async (cardId: string) => {
    const { error: deleteError } = await supabase
      .from('collection_cards')
      .delete()
      .eq('id', cardId);

    if (deleteError) throw deleteError;

    await fetchCollection();
  }, [supabase, fetchCollection]);

  const updateQuantity = useCallback(async (
    cardId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeCard(cardId);
    } else {
      await updateCard(cardId, { quantity });
    }
  }, [updateCard, removeCard]);

  return {
    collection,
    isLoading,
    error,
    refetch: fetchCollection,
    
    // CRUD operations
    addCard,
    updateCard,
    removeCard,
    updateQuantity,
  };
}

