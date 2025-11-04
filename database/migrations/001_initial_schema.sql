-- MTG Deck Builder - Initial Database Schema
-- Phase 1: Foundation
--
-- Run this entire file in Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR-PROJECT/editor
--
-- This creates:
-- - All tables (collections, decks, cards, history)
-- - Row Level Security policies
-- - Indexes for performance
-- - Utility functions

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TABLES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Collections: User's card collections
-- ----------------------------------------------------------------------------
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT collections_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Index for user queries
CREATE INDEX collections_user_id_idx ON collections(user_id);

-- Trigger to update updated_at
CREATE TRIGGER collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- Collection Cards: Cards within a collection
-- ----------------------------------------------------------------------------
CREATE TABLE collection_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  scryfall_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT CHECK (condition IN ('near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged')),
  foil BOOLEAN NOT NULL DEFAULT false,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT collection_cards_quantity_positive CHECK (quantity > 0),
  CONSTRAINT collection_cards_unique_card UNIQUE (collection_id, scryfall_id, foil)
);

-- Indexes for queries
CREATE INDEX collection_cards_collection_id_idx ON collection_cards(collection_id);
CREATE INDEX collection_cards_scryfall_id_idx ON collection_cards(scryfall_id);

-- ----------------------------------------------------------------------------
-- Decks: User's deck lists
-- ----------------------------------------------------------------------------
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('commander', 'standard', 'modern', 'pioneer', 'legacy', 'vintage', 'pauper', 'limited')),
  description TEXT,
  commander_id UUID, -- Scryfall ID of commander (for Commander format)
  partner_commander_id UUID, -- For partner commanders
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT decks_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Indexes
CREATE INDEX decks_user_id_idx ON decks(user_id);
CREATE INDEX decks_format_idx ON decks(format);
CREATE INDEX decks_is_public_idx ON decks(is_public) WHERE is_public = true;

-- Trigger to update updated_at
CREATE TRIGGER decks_updated_at
  BEFORE UPDATE ON decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- Deck Cards: Cards within a deck
-- ----------------------------------------------------------------------------
CREATE TABLE deck_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  scryfall_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL CHECK (category IN ('commander', 'mainboard', 'sideboard', 'maybeboard')),
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT deck_cards_quantity_positive CHECK (quantity > 0),
  CONSTRAINT deck_cards_unique_card UNIQUE (deck_id, scryfall_id, category)
);

-- Indexes
CREATE INDEX deck_cards_deck_id_idx ON deck_cards(deck_id);
CREATE INDEX deck_cards_scryfall_id_idx ON deck_cards(scryfall_id);
CREATE INDEX deck_cards_category_idx ON deck_cards(category);

-- ----------------------------------------------------------------------------
-- Deck History: Git-style commit history for deck changes
-- ----------------------------------------------------------------------------
CREATE TABLE deck_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  changes JSONB NOT NULL, -- Array of StagedChange objects
  message TEXT NOT NULL,
  committed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  CONSTRAINT deck_history_message_length CHECK (char_length(message) >= 1 AND char_length(message) <= 500)
);

-- Indexes
CREATE INDEX deck_history_deck_id_idx ON deck_history(deck_id);
CREATE INDEX deck_history_committed_at_idx ON deck_history(committed_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_history ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Collections Policies
-- ----------------------------------------------------------------------------

-- Users can view their own collections
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own collections
CREATE POLICY "Users can create own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Collection Cards Policies
-- ----------------------------------------------------------------------------

-- Users can view cards in their collections
CREATE POLICY "Users can view own collection cards"
  ON collection_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can add cards to their collections
CREATE POLICY "Users can add cards to own collections"
  ON collection_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can update cards in their collections
CREATE POLICY "Users can update own collection cards"
  ON collection_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can delete cards from their collections
CREATE POLICY "Users can delete own collection cards"
  ON collection_cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Decks Policies
-- ----------------------------------------------------------------------------

-- Users can view their own decks and public decks
CREATE POLICY "Users can view own and public decks"
  ON decks FOR SELECT
  USING (
    auth.uid() = user_id OR is_public = true
  );

-- Users can create their own decks
CREATE POLICY "Users can create own decks"
  ON decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update own decks"
  ON decks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks"
  ON decks FOR DELETE
  USING (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Deck Cards Policies
-- ----------------------------------------------------------------------------

-- Users can view cards in their decks and public decks
CREATE POLICY "Users can view deck cards"
  ON deck_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND (decks.user_id = auth.uid() OR decks.is_public = true)
    )
  );

-- Users can add cards to their own decks
CREATE POLICY "Users can add cards to own decks"
  ON deck_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Users can update cards in their own decks
CREATE POLICY "Users can update own deck cards"
  ON deck_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Users can delete cards from their own decks
CREATE POLICY "Users can delete own deck cards"
  ON deck_cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- Deck History Policies
-- ----------------------------------------------------------------------------

-- Users can view history of their own decks
CREATE POLICY "Users can view own deck history"
  ON deck_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_history.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Users can create history entries for their own decks
CREATE POLICY "Users can create deck history"
  ON deck_history FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_history.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- No updates or deletes on history (immutable audit log)

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify everything was created successfully:

-- Check all tables exist
SELECT 
  schemaname, 
  tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('collections', 'collection_cards', 'decks', 'deck_cards', 'deck_history')
ORDER BY tablename;

-- Check RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('collections', 'collection_cards', 'decks', 'deck_cards', 'deck_history')
ORDER BY tablename;

-- Check policies exist
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- SUCCESS!
-- ============================================================================
-- If you see all 5 tables, all with rowsecurity=true, and multiple policies,
-- the schema is ready!
--
-- Next steps:
-- 1. Generate TypeScript types:
--    supabase gen types typescript --linked > src/lib/supabase/types.ts
-- 2. Test connection at http://localhost:3000/test-connection
-- 3. Start building features!

