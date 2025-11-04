/**
 * useStagingArea Hook
 * 
 * Git-style staging for deck changes
 * 
 * CRITICAL: Exact pattern from .cursorrules (lines 165-237)
 * This is MANAFORGE's killer feature!
 */

'use client';

import { useState, useCallback } from 'react';
import type { StagedChange, StagedChangeAction } from '@/types/staging';
import type { DeckCardCategory } from '@/types/deck';

interface StagingAreaOptions {
  onCommit?: (changes: StagedChange[], message: string) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useStagingArea(options: StagingAreaOptions = {}) {
  const [staged, setStaged] = useState<StagedChange[]>([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Stage a new change
   */
  const stage = useCallback((
    action: StagedChangeAction,
    scryfall_id: string,
    quantity: number,
    metadata?: {
      old_quantity?: number;
      category?: DeckCardCategory;
      old_category?: DeckCardCategory;
    }
  ) => {
    const newChange: StagedChange = {
      id: crypto.randomUUID(),
      action,
      scryfall_id,
      quantity,
      old_quantity: metadata?.old_quantity,
      category: metadata?.category,
      old_category: metadata?.old_category,
      timestamp: Date.now(),
    };

    setStaged(prev => [...prev, newChange]);
  }, []);

  /**
   * Discard a specific staged change
   */
  const discard = useCallback((id: string) => {
    setStaged(prev => prev.filter(change => change.id !== id));
  }, []);

  /**
   * Clear all staged changes
   */
  const clear = useCallback(() => {
    setStaged([]);
    setError(null);
  }, []);

  /**
   * Commit all staged changes
   */
  const commit = useCallback(async (message: string) => {
    if (staged.length === 0) {
      setError(new Error('No changes to commit'));
      return;
    }

    if (!message.trim()) {
      setError(new Error('Commit message is required'));
      return;
    }

    setIsCommitting(true);
    setError(null);

    try {
      // Call the onCommit callback if provided
      if (options.onCommit) {
        await options.onCommit(staged, message);
      }

      // Clear staging after successful commit
      clear();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to commit changes');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
    } finally {
      setIsCommitting(false);
    }
  }, [staged, options, clear]);

  /**
   * Get changes by action type
   */
  const getChangesByAction = useCallback((action: StagedChangeAction) => {
    return staged.filter(change => change.action === action);
  }, [staged]);

  /**
   * Check if a card has staged changes
   */
  const hasChangesForCard = useCallback((scryfall_id: string) => {
    return staged.some(change => change.scryfall_id === scryfall_id);
  }, [staged]);

  /**
   * Get all changes for a specific card
   */
  const getChangesForCard = useCallback((scryfall_id: string) => {
    return staged.filter(change => change.scryfall_id === scryfall_id);
  }, [staged]);

  return {
    // State
    staged,
    isCommitting,
    error,
    
    // Actions
    stage,
    discard,
    clear,
    commit,
    
    // Utilities
    getChangesByAction,
    hasChangesForCard,
    getChangesForCard,
    
    // Computed
    hasChanges: staged.length > 0,
    changeCount: staged.length,
  };
}

