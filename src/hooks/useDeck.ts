/**
 * useDeck Hook
 * 
 * Deck CRUD operations with real-time subscriptions
 * Pattern from .cursorrules (lines 269-346)
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import type { DeckCardCategory } from '@/types/deck';

type Deck = Database['public']['Tables']['decks']['Row'];
type DeckCard = Database['public']['Tables']['deck_cards']['Row'];
type DeckUpdate = Database['public']['Tables']['decks']['Update'];
type DeckCardInsert = Database['public']['Tables']['deck_cards']['Insert'];
type DeckCardUpdate = Database['public']['Tables']['deck_cards']['Update'];
type DeckHistoryInsert = Database['public']['Tables']['deck_history']['Insert'];

interface DeckWithCards extends Deck {
  cards?: DeckCard[];
}

export function useDeck(deckId: string | null) {
  const supabase = createBrowserClient();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch deck data
  const fetchDeck = useCallback(async () => {
    if (!deckId) {
      setDeck(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('decks')
        .select(`
          *,
          deck_cards (*)
        `)
        .eq('id', deckId)
        .single();

      if (fetchError) throw fetchError;

      setDeck(data as DeckWithCards);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch deck'));
    } finally {
      setIsLoading(false);
    }
  }, [deckId, supabase]);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    const loadDeck = async () => {
      setIsLoading(true);
      await fetchDeck();
      if (cancelled) return;
    };

    loadDeck();

    return () => {
      cancelled = true;
    };
  }, [fetchDeck]);

  // Real-time subscription
  useEffect(() => {
    if (!deckId) return;

    const channel = supabase
      .channel(`deck-${deckId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deck_cards',
          filter: `deck_id=eq.${deckId}`,
        },
        () => {
          // Refetch deck on any changes
          fetchDeck();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deckId, supabase, fetchDeck]);

  // CRUD operations for deck metadata
  const updateDeck = useCallback(async (updates: DeckUpdate) => {
    if (!deckId) throw new Error('No deck ID');

    const { error: updateError } = await supabase
      .from('decks')
      // @ts-ignore - Supabase generated types return never
      .update(updates)
      .eq('id', deckId);

    if (updateError) throw updateError;

    await fetchDeck();
  }, [deckId, supabase, fetchDeck]);

  // CRUD operations for deck cards
  const addCard = useCallback(async (
    scryfall_id: string,
    quantity: number = 1,
    category: DeckCardCategory = 'mainboard',
    notes?: string
  ) => {
    if (!deckId) throw new Error('No deck ID');

    const insert: DeckCardInsert = {
      deck_id: deckId,
      scryfall_id,
      quantity,
      category,
      notes: notes || null,
    };

    const { error: insertError } = await supabase
      .from('deck_cards')
      // @ts-ignore - Supabase generated types return never
      .insert(insert);

    if (insertError) throw insertError;

    await fetchDeck();
  }, [deckId, supabase, fetchDeck]);

  const updateCard = useCallback(async (
    cardId: string,
    updates: DeckCardUpdate
  ) => {
    const { error: updateError } = await supabase
      .from('deck_cards')
      // @ts-ignore - Supabase generated types return never
      .update(updates)
      .eq('id', cardId);

    if (updateError) throw updateError;

    await fetchDeck();
  }, [supabase, fetchDeck]);

  const removeCard = useCallback(async (cardId: string) => {
    const { error: deleteError } = await supabase
      .from('deck_cards')
      .delete()
      .eq('id', cardId);

    if (deleteError) throw deleteError;

    await fetchDeck();
  }, [supabase, fetchDeck]);

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

  const moveCard = useCallback(async (
    cardId: string,
    newCategory: DeckCardCategory
  ) => {
    await updateCard(cardId, { category: newCategory });
  }, [updateCard]);

  // Batch operations (for git-style commits)
  const applyChanges = useCallback(async (
    changes: Array<{
      action: 'add' | 'remove' | 'update' | 'move';
      scryfall_id: string;
      quantity: number;
      category?: DeckCardCategory;
      old_category?: DeckCardCategory;
    }>
  ) => {
    if (!deckId) throw new Error('No deck ID');

    // Apply each change sequentially
    for (const change of changes) {
      switch (change.action) {
        case 'add':
          await addCard(change.scryfall_id, change.quantity, change.category);
          break;
          
        case 'remove':
          // Find and remove the card
          const cardToRemove = deck?.cards?.find(
            c => c.scryfall_id === change.scryfall_id && c.category === change.category
          );
          if (cardToRemove) {
            await removeCard(cardToRemove.id);
          }
          break;
          
        case 'update':
          // Find and update the card
          const cardToUpdate = deck?.cards?.find(
            c => c.scryfall_id === change.scryfall_id && c.category === change.category
          );
          if (cardToUpdate) {
            await updateQuantity(cardToUpdate.id, change.quantity);
          }
          break;
          
        case 'move':
          // Find and move the card
          const cardToMove = deck?.cards?.find(
            c => c.scryfall_id === change.scryfall_id && c.category === change.old_category
          );
          if (cardToMove && change.category) {
            await moveCard(cardToMove.id, change.category);
          }
          break;
      }
    }

    // Final refetch after all changes
    await fetchDeck();
  }, [deckId, deck, addCard, removeCard, updateQuantity, moveCard, fetchDeck]);

  // Save to history (git-style commit)
  const commitChanges = useCallback(async (
    changes: Array<any>,
    message: string
  ) => {
    if (!deckId) throw new Error('No deck ID');

    // 1. Apply changes to deck
    await applyChanges(changes);

    // 2. Save to history
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const historyInsert: DeckHistoryInsert = {
      deck_id: deckId,
      user_id: user.id,
      changes,
      message,
    };

    const { error: historyError } = await supabase
      .from('deck_history')
      // @ts-ignore - Supabase generated types return never
      .insert(historyInsert);

    if (historyError) throw historyError;
  }, [deckId, supabase, applyChanges]);

  return {
    deck,
    isLoading,
    error,
    refetch: fetchDeck,
    
    // Deck metadata operations
    updateDeck,
    
    // Card operations
    addCard,
    updateCard,
    removeCard,
    updateQuantity,
    moveCard,
    
    // Batch operations
    applyChanges,
    commitChanges,
  };
}

