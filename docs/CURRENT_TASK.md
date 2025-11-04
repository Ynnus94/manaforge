# Phase 1: Database Schema & Foundation Setup

**Status**: 🎯 Ready for Implementation  
**Complexity**: Large  
**Estimated Time**: 4-6 hours  
**Dependencies**: Supabase project must be created first

---

## Overview

This phase establishes the foundation of the MTG Deck Builder: database schema, authentication, and UI component library. Once complete, we can build all features on this solid base.

## User Stories

- As a **user**, I want to **securely sign up and log in** so that **my decks and collection are private**
- As a **user**, I want my **card collection tracked persistently** so that **I never lose my data**
- As a **user**, I want to **create and manage multiple decks** so that **I can organize my strategies**
- As a **user**, I want a **history of all deck changes** so that **I can review and rollback if needed**

---

## Prerequisites (Manual Setup Required)

### 1. Create Supabase Project
```bash
# Go to https://supabase.com/dashboard
# 1. Click "New Project"
# 2. Choose organization
# 3. Name: "mtg-deck-builder" (or your preference)
# 4. Database Password: Generate strong password (save it!)
# 5. Region: Choose closest to you
# 6. Wait ~2 minutes for provisioning
```

### 2. Configure Environment Variables
Create `/Users/sunny/Desktop/MTGAPP/.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Claude API (for later phases)
ANTHROPIC_API_KEY=sk-ant-...

# Scryfall (no key needed, just documenting)
# Scryfall API is free and rate-limited to 10 req/sec
```

### 3. Test Connection
```bash
npm run dev
# Visit http://localhost:3000/test-connection
# Should show "Configured ✅"
```

---

## Database Schema Design

### 🎨 Entity Relationship Diagram

```
┌─────────────────┐
│  auth.users     │ (Supabase built-in)
│  - id (uuid)    │
│  - email        │
│  - created_at   │
└────────┬────────┘
         │
         │ 1:N
         │
    ┌────┴─────────────────┐
    │                      │
┌───▼────────────┐  ┌─────▼──────────┐
│  collections   │  │     decks      │
│  - id          │  │  - id          │
│  - user_id     │  │  - user_id     │
│  - name        │  │  - name        │
│  - created_at  │  │  - format      │
│  - updated_at  │  │  - description │
└───┬────────────┘  │  - commander   │
    │               │  - created_at  │
    │ 1:N           │  - updated_at  │
    │               └───┬────────────┘
┌───▼───────────────┐   │ 1:N
│ collection_cards  │   │
│ - id              │   │
│ - collection_id   │   │
│ - scryfall_id     │   │
│ - quantity        │   │
│ - condition       │   │
│ - foil            │   │
│ - added_at        │   │
└───────────────────┘   │
                        │
                   ┌────▼────────────┐
                   │   deck_cards    │
                   │ - id            │
                   │ - deck_id       │
                   │ - scryfall_id   │
                   │ - quantity      │
                   │ - category      │
                   │ - added_at      │
                   └────┬────────────┘
                        │
                        │ N:1 (history reference)
                        │
                   ┌────▼────────────┐
                   │  deck_history   │
                   │ - id            │
                   │ - deck_id       │
                   │ - user_id       │
                   │ - changes       │
                   │ - message       │
                   │ - committed_at  │
                   └─────────────────┘
```

### 📋 Table Definitions

#### 1. `collections`
User's card collections (their bulk cards, collection, binders).

```sql
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
```

#### 2. `collection_cards`
Cards within a collection (many-to-many relationship with quantities).

```sql
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
```

#### 3. `decks`
User's deck lists.

```sql
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
```

#### 4. `deck_cards`
Cards within a deck.

```sql
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
```

#### 5. `deck_history`
Git-style commit history for deck changes.

```sql
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

-- Example changes JSONB structure:
-- [
--   {
--     "action": "add",
--     "scryfall_id": "uuid",
--     "quantity": 1,
--     "category": "mainboard"
--   },
--   {
--     "action": "remove",
--     "scryfall_id": "uuid",
--     "quantity": 1,
--     "old_quantity": 2
--   }
-- ]
```

#### 6. Utility Function
Update `updated_at` timestamp automatically.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Row Level Security (RLS) Policies

### Enable RLS on All Tables

```sql
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_history ENABLE ROW LEVEL SECURITY;
```

### Policy Definitions

#### Collections Policies

```sql
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
```

#### Collection Cards Policies

```sql
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
```

#### Decks Policies

```sql
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
```

#### Deck Cards Policies

```sql
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
```

#### Deck History Policies

```sql
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
```

---

## shadcn/ui Components Installation

### Required Components

Install these shadcn/ui components in order:

```bash
# Core UI primitives (always needed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add separator

# Forms & Validation
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add radio-group

# Overlays & Dialogs
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tooltip
npx shadcn-ui@latest add sheet

# Navigation
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add navigation-menu
npx shadcn-ui@latest add breadcrumb

# Feedback
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton
npx shadcn-ui@latest add progress

# Data Display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add scroll-area

# Advanced
npx shadcn-ui@latest add command
npx shadcn-ui@latest add context-menu
```

### Component Usage Mapping

| Feature | Components Needed |
|---------|------------------|
| Authentication | `input`, `label`, `button`, `form`, `alert` |
| Deck Builder | `card`, `button`, `tabs`, `dialog`, `dropdown-menu` |
| Card Search | `command`, `input`, `popover`, `scroll-area` |
| Collection | `table`, `input`, `button`, `dialog`, `badge` |
| Staging Area | `card`, `separator`, `button`, `textarea`, `alert` |
| Settings | `tabs`, `form`, `select`, `switch`, `button` |

---

## Authentication Architecture

### Authentication Flow

```
┌─────────────┐
│   Signup    │
│   /signup   │
└──────┬──────┘
       │
       │ Supabase Auth
       │ signUp()
       ▼
┌──────────────┐      Success      ┌─────────────┐
│   Supabase   │ ─────────────────>│  Dashboard  │
│     Auth     │                    │     /       │
└──────┬───────┘                    └─────────────┘
       │
       │ Failure
       ▼
┌──────────────┐
│ Error Message│
│ (inline)     │
└──────────────┘

┌─────────────┐
│    Login    │
│   /login    │
└──────┬──────┘
       │
       │ Supabase Auth
       │ signInWithPassword()
       ▼
┌──────────────┐      Success      ┌─────────────┐
│   Supabase   │ ─────────────────>│  Dashboard  │
│     Auth     │                    │     /       │
└──────┬───────┘                    └─────────────┘
       │
       │ Failure
       ▼
┌──────────────┐
│ Error Message│
└──────────────┘
```

### Protected Routes Strategy

Use middleware to protect routes:

```typescript
// middleware.ts (already exists, needs implementation)

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check if user is authenticated
  // If not, redirect to /login
  // If yes, continue
}

export const config = {
  matcher: [
    '/deck/:path*',
    '/collection/:path*',
    '/api/:path*'
  ]
}
```

### Components to Create

#### 1. `/src/app/(auth)/login/page.tsx`
- Email + password form
- "Sign up" link
- Error handling
- Redirect after success

#### 2. `/src/app/(auth)/signup/page.tsx`
- Email + password + confirm password
- Terms acceptance
- Validation (zod)
- Auto-login after signup

#### 3. `/src/components/auth/AuthForm.tsx`
- Reusable form component
- Used by both login and signup
- Handles loading states

#### 4. `/src/components/auth/ProtectedRoute.tsx`
- Client-side route guard
- Shows loading while checking auth
- Redirects if not authenticated

---

## TypeScript Types to Generate

After creating the schema, generate types:

```bash
# Install Supabase CLI globally (one time)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Generate TypeScript types
supabase gen types typescript --linked > src/lib/supabase/types.ts
```

This will replace the placeholder types with real database types:

```typescript
// Example of what will be generated:
export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... all other tables
    };
  };
}
```

---

## Implementation Steps

### Step 1: Database Setup (30 min)
1. Create Supabase project (manual)
2. Copy `.env.local.example` to `.env.local` and fill credentials
3. Test connection at `/test-connection`
4. Copy SQL schema to Supabase SQL Editor
5. Run migration to create all tables
6. Verify tables exist in Supabase dashboard
7. Generate TypeScript types

**Acceptance Criteria:**
- ✅ All 5 tables created
- ✅ All RLS policies enabled and tested
- ✅ Types generated in `src/lib/supabase/types.ts`

### Step 2: Install shadcn/ui Components (15 min)
1. Run all component installation commands listed above
2. Verify components appear in `src/components/ui/`
3. Test one component (e.g., Button) in a page

**Acceptance Criteria:**
- ✅ All components installed
- ✅ No TypeScript errors
- ✅ Button renders correctly

### Step 3: Implement Authentication (2 hours)

#### 3.1: Update Middleware
- Implement auth check in `middleware.ts`
- Protect deck and collection routes
- Add session refresh logic

#### 3.2: Create Auth Components
- `AuthForm.tsx` - Reusable form with validation
- `ProtectedRoute.tsx` - Client-side guard

#### 3.3: Create Login Page
- `src/app/(auth)/login/page.tsx`
- Form with email + password
- Error handling
- Redirect to `/` after success

#### 3.4: Create Signup Page
- `src/app/(auth)/signup/page.tsx`
- Form with email + password + confirm
- Validation with zod
- Auto-login after signup

**Acceptance Criteria:**
- ✅ User can sign up with email/password
- ✅ User can log in
- ✅ User is redirected after login
- ✅ Protected routes redirect to login
- ✅ No console errors

### Step 4: Create Basic Dashboard (1 hour)

#### 4.1: Update Home Page
- Show different content for logged in vs logged out users
- Add "Get Started" button (goes to /collection if logged in)
- Add "Login" / "Signup" buttons if logged out

#### 4.2: Create Layout with Navigation
- `src/components/layout/Navbar.tsx`
  - Logo
  - Navigation links (Collection, Decks)
  - User menu (Profile, Logout)
- Update `src/app/layout.tsx` to use Navbar

**Acceptance Criteria:**
- ✅ Navbar shows for logged-in users
- ✅ User can log out from navbar
- ✅ Navigation links work

### Step 5: Verification (30 min)
1. Test full auth flow (signup → login → logout)
2. Verify RLS works (can't access other users' data)
3. Check TypeScript types are correct
4. Test protected routes redirect
5. Verify responsive design on mobile

---

## Testing Strategy

### Manual Tests

**Authentication:**
- [ ] Sign up with new email
- [ ] Receive confirmation email (if enabled)
- [ ] Log in with correct credentials
- [ ] Log in with wrong credentials (should fail)
- [ ] Access `/deck` without login (should redirect)
- [ ] Log out successfully

**Database:**
- [ ] Create a collection (via SQL or API)
- [ ] Verify RLS: Can't see other users' collections
- [ ] Create a deck
- [ ] Add cards to deck
- [ ] View deck history (empty for now)

### SQL Tests

Run these queries in Supabase SQL Editor to verify RLS:

```sql
-- Test as specific user
SET request.jwt.claims = '{"sub": "user-uuid-here"}';

-- Should return only this user's collections
SELECT * FROM collections;

-- Should fail (can't insert for another user)
INSERT INTO collections (user_id, name) 
VALUES ('different-user-uuid', 'Hacked Collection');
```

---

## Edge Cases & Validation

### Authentication
- ✅ Email already exists (show friendly error)
- ✅ Invalid email format (zod validation)
- ✅ Password too short (min 8 chars)
- ✅ Password mismatch on signup
- ✅ Session expires (refresh automatically)

### Database
- ✅ Cascade deletes work (deleting collection deletes cards)
- ✅ Unique constraints prevent duplicates
- ✅ Quantity must be positive
- ✅ Deck format must be valid enum
- ✅ Name length constraints (1-100 chars)

### Performance
- ✅ Indexes on foreign keys (collection_id, deck_id)
- ✅ Index on user_id for fast queries
- ✅ Index on is_public for public deck browsing

---

## Performance Considerations

- **Database Indexes**: All foreign keys indexed for fast joins
- **RLS Optimization**: Policies use EXISTS subqueries for efficiency
- **Cascade Deletes**: Automatic cleanup prevents orphaned records
- **JSONB for History**: Fast querying of commit history
- **Timestamps**: Enable audit trails and sorting

---

## Accessibility

- **Forms**: All inputs have associated labels
- **Keyboard Navigation**: Tab order is logical
- **Error Messages**: Screen reader friendly
- **Focus Management**: Focus on first error field
- **ARIA Labels**: All interactive elements labeled

---

## Success Metrics

### Phase 1 Complete When:
- ✅ User can sign up and log in
- ✅ Protected routes work correctly
- ✅ Database schema is live with RLS
- ✅ TypeScript types generated
- ✅ All shadcn/ui components installed
- ✅ Basic navbar with user menu
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Responsive on mobile and desktop

---

## Files to Create/Modify

### New Files (Builder Agent Tasks)
```
src/
  components/
    auth/
      AuthForm.tsx              # Reusable auth form
      ProtectedRoute.tsx        # Client-side guard
    layout/
      Navbar.tsx                # Top navigation
      UserMenu.tsx              # User dropdown
  app/
    (auth)/
      login/
        page.tsx                # Login page
      signup/
        page.tsx                # Signup page
  lib/
    supabase/
      types.ts                  # (REGENERATE after schema)
      queries.ts                # Common queries (new)
    validations/
      auth.ts                   # Zod schemas for auth
```

### Modified Files
```
middleware.ts                   # Implement auth middleware
src/app/layout.tsx              # Add Navbar
src/app/page.tsx                # Update for auth state
```

### SQL Migration File (Save This)
```
database/
  migrations/
    001_initial_schema.sql      # All table definitions + RLS
```

---

## Handoff to Builder Agent

**Builder Agent**: You can now implement this plan step by step. Start with:

1. **Wait for user to create Supabase project and add credentials**
2. **Create SQL migration file** (`database/migrations/001_initial_schema.sql`)
3. **Install shadcn/ui components** (run all commands)
4. **Implement middleware** (`middleware.ts`)
5. **Create auth pages** (login, signup)
6. **Create navbar** and update layout

Each step has clear acceptance criteria. Test as you go!

---

**Next Phase Preview**: Once Phase 1 is complete, we'll build:
- Collection management (add/remove cards)
- Scryfall API integration (search cards)
- Basic deck builder interface
- Card display components

---

**Status**: ✅ Plan Complete - Ready for Builder Agent
