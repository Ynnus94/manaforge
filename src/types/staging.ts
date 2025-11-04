/**
 * Git-Style Staging Types
 * 
 * CRITICAL: This structure is from .cursorrules - DO NOT MODIFY
 * 
 * The staging area is client-side only (not persisted until commit)
 */

import type { DeckCardCategory } from './deck';

/**
 * Action types for staged changes
 */
export type StagedChangeAction = 'add' | 'remove' | 'update' | 'move';

/**
 * Staged Change Structure
 * 
 * EXACT structure from .cursorrules (lines 165-183)
 */
export interface StagedChange {
  id: string;                      // Temporary ID for UI (crypto.randomUUID())
  action: StagedChangeAction;
  scryfall_id: string;             // Card being changed
  quantity: number;                // New quantity
  old_quantity?: number;           // Previous quantity (for updates)
  category?: DeckCardCategory;     // Target category
  old_category?: DeckCardCategory; // Previous category (for moves)
  timestamp: number;               // When staged (Date.now())
}

/**
 * Commit Data (saved to deck_history table)
 */
export interface CommitData {
  deck_id: string;
  user_id: string;
  changes: StagedChange[];
  message: string;
  committed_at: string;
}

/**
 * History Entry (from database)
 */
export interface HistoryEntry {
  id: string;
  deck_id: string;
  user_id: string;
  changes: StagedChange[];
  message: string;
  committed_at: string;
}

/**
 * Staging Area State
 */
export interface StagingAreaState {
  changes: StagedChange[];
  isCommitting: boolean;
  error: Error | null;
}

/**
 * Helper functions
 */

/**
 * Create a new staged change
 */
export function createStagedChange(
  action: StagedChangeAction,
  scryfall_id: string,
  quantity: number,
  options?: {
    old_quantity?: number;
    category?: DeckCardCategory;
    old_category?: DeckCardCategory;
  }
): StagedChange {
  return {
    id: crypto.randomUUID(),
    action,
    scryfall_id,
    quantity,
    old_quantity: options?.old_quantity,
    category: options?.category,
    old_category: options?.old_category,
    timestamp: Date.now(),
  };
}

/**
 * Get display text for a staged change
 */
export function getStagedChangeDisplayText(change: StagedChange): string {
  switch (change.action) {
    case 'add':
      return `Add ${change.quantity}x to ${change.category || 'deck'}`;
    case 'remove':
      return `Remove ${change.quantity}x`;
    case 'update':
      return `Update quantity: ${change.old_quantity} → ${change.quantity}`;
    case 'move':
      return `Move from ${change.old_category} → ${change.category}`;
    default:
      return 'Unknown change';
  }
}

/**
 * Get color class for action type (for UI styling)
 */
export function getStagedChangeColorClass(action: StagedChangeAction): string {
  switch (action) {
    case 'add':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'remove':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'update':
    case 'move':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get icon for action type
 */
export function getStagedChangeIcon(action: StagedChangeAction): string {
  switch (action) {
    case 'add':
      return '+';
    case 'remove':
      return '-';
    case 'update':
    case 'move':
      return '~';
    default:
      return '?';
  }
}

