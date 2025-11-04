# Database Schema

## Overview

This document describes the PostgreSQL database schema for the MTG Deck Builder application, hosted on Supabase.

**Important**: After creating tables, always enable Row Level Security (RLS) to ensure users can only access their own data.

## Core Tables

### 1. Collections

Stores user's card collections.

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own collections
CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own collections
CREATE POLICY "Users can create own collections"
  ON collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own collections
CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own collections
CREATE POLICY "Users can delete own collections"
  ON collections FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_updated_at ON collections(updated_at DESC);
```

### 2. Collection Cards

Links cards to collections with quantities.

```sql
CREATE TABLE collection_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  scryfall_id UUID NOT NULL, -- Scryfall card ID
  quantity INTEGER NOT NULL DEFAULT 1,
  foil_quantity INTEGER DEFAULT 0,
  condition TEXT DEFAULT 'near_mint', -- near_mint, lightly_played, moderately_played, heavily_played, damaged
  notes TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see cards in their collections
CREATE POLICY "Users can view own collection cards"
  ON collection_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Policy: Users can insert cards to their collections
CREATE POLICY "Users can add cards to own collections"
  ON collection_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Policy: Users can update cards in their collections
CREATE POLICY "Users can update own collection cards"
  ON collection_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Policy: Users can delete cards from their collections
CREATE POLICY "Users can delete own collection cards"
  ON collection_cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_cards.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_collection_cards_collection_id ON collection_cards(collection_id);
CREATE INDEX idx_collection_cards_scryfall_id ON collection_cards(scryfall_id);
CREATE UNIQUE INDEX idx_collection_cards_unique ON collection_cards(collection_id, scryfall_id);
```

### 3. Decks

Stores user's decks.

```sql
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  format TEXT NOT NULL DEFAULT 'commander', -- standard, modern, commander, pioneer, limited
  commander_id UUID, -- Scryfall ID of commander (for Commander format)
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own decks and public decks
CREATE POLICY "Users can view own and public decks"
  ON decks FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

-- Policy: Users can create their own decks
CREATE POLICY "Users can create own decks"
  ON decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own decks
CREATE POLICY "Users can update own decks"
  ON decks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own decks
CREATE POLICY "Users can delete own decks"
  ON decks FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_decks_user_id ON decks(user_id);
CREATE INDEX idx_decks_format ON decks(format);
CREATE INDEX idx_decks_is_public ON decks(is_public);
CREATE INDEX idx_decks_updated_at ON decks(updated_at DESC);
```

### 4. Deck Cards

Links cards to decks with categories.

```sql
CREATE TABLE deck_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  scryfall_id UUID NOT NULL, -- Scryfall card ID
  quantity INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'mainboard', -- commander, mainboard, sideboard, maybeboard
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view cards in their decks and public decks
CREATE POLICY "Users can view deck cards"
  ON deck_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND (decks.user_id = auth.uid() OR decks.is_public = TRUE)
    )
  );

-- Policy: Users can add cards to their decks
CREATE POLICY "Users can add cards to own decks"
  ON deck_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Policy: Users can update cards in their decks
CREATE POLICY "Users can update own deck cards"
  ON deck_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Policy: Users can delete cards from their decks
CREATE POLICY "Users can delete own deck cards"
  ON deck_cards FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_cards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_deck_cards_deck_id ON deck_cards(deck_id);
CREATE INDEX idx_deck_cards_scryfall_id ON deck_cards(scryfall_id);
CREATE INDEX idx_deck_cards_category ON deck_cards(category);
```

### 5. Deck History (Git-Style Commits)

Tracks changes to decks with commit messages.

```sql
CREATE TABLE deck_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL, -- Commit message
  changes JSONB NOT NULL, -- Array of StagedChange objects
  committed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE deck_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view history of their decks
CREATE POLICY "Users can view own deck history"
  ON deck_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM decks
      WHERE decks.id = deck_history.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Policy: Users can create history entries for their decks
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

-- Indexes
CREATE INDEX idx_deck_history_deck_id ON deck_history(deck_id);
CREATE INDEX idx_deck_history_committed_at ON deck_history(committed_at DESC);
```

## Database Functions

### Update Timestamps

Automatically update `updated_at` when records change.

```sql
-- Create function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collection_cards_updated_at
  BEFORE UPDATE ON collection_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decks_updated_at
  BEFORE UPDATE ON decks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deck_cards_updated_at
  BEFORE UPDATE ON deck_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Real-Time Subscriptions

Enable real-time for specific tables:

```sql
-- Enable real-time for decks
ALTER PUBLICATION supabase_realtime ADD TABLE decks;
ALTER PUBLICATION supabase_realtime ADD TABLE deck_cards;

-- Enable real-time for collections
ALTER PUBLICATION supabase_realtime ADD TABLE collections;
ALTER PUBLICATION supabase_realtime ADD TABLE collection_cards;
```

## Future Tables (Planned)

### User Preferences

```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system', -- light, dark, system
  default_format TEXT DEFAULT 'commander',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Deck Snapshots (for Superbrew Analysis)

```sql
CREATE TABLE deck_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  snapshot_data JSONB NOT NULL, -- Full deck state
  analysis_results JSONB, -- AI analysis results
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## TypeScript Type Generation

After creating/modifying tables, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

## Migration Steps

1. **Create Supabase project** at https://supabase.com
2. **Copy SQL from this file** into Supabase SQL Editor
3. **Run migrations** in order (tables first, then policies, then functions)
4. **Verify RLS is enabled** on all tables
5. **Enable real-time** for required tables
6. **Generate TypeScript types**
7. **Test connection** at `/test-connection`

## Notes

- All IDs use `UUID` for security and scalability
- `scryfall_id` is stored as UUID but comes from Scryfall API
- Card data is NOT stored locally (fetched from Scryfall as needed)
- RLS policies ensure data isolation between users
- Real-time subscriptions enable live collaboration
- History table uses JSONB for flexible change tracking

---

**Security First**: Always verify RLS policies are working before deploying to production!

