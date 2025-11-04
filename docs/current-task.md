# Current Task - Week 1 MVP

**Sprint**: Week 1 - Foundation with Git-Style Validation  
**Goal**: Build core collection & deck management with AI-powered suggestions  
**Deadline**: End of Week 1  
**Status**: 🚧 Ready to Start (0% complete)

---

## 🎯 Week 1 Success Criteria

By end of week, users can:
- ✅ Create a collection and add cards manually
- ✅ Import bulk collection from CSV/plaintext
- ✅ Stage and commit collection changes (git-style)
- ✅ Build a deck with format validation
- ✅ Stage and commit deck changes (git-style)
- ✅ Ask AI for deck suggestions (with MCP server)
- ✅ See mana curve visualization
- ✅ Everything persists in Supabase

---

## 📋 Task Breakdown

### ✅ Phase 0: Project Setup (Day 1 - 2 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Must do first  
**Complexity**: Small

#### Tasks
- [ ] Initialize Next.js 14 project with TypeScript
- [ ] Install core dependencies (Supabase, shadcn/ui, Tailwind)
- [ ] Set up Supabase project
  - Create project on supabase.com
  - Copy environment variables
  - Initialize Supabase client
- [ ] Configure shadcn/ui components
- [ ] Set up folder structure per PROJECT_OVERVIEW.md
- [ ] Set up ESLint + Prettier
- [ ] Initialize Git repository
- [ ] Create .env.local with keys

#### Files to Create
```
/
├── .env.local
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── components.json (shadcn)
└── src/
    ├── app/
    ├── components/
    ├── lib/
    └── types/
```

#### Environment Variables Needed
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ANTHROPIC_API_KEY=your-claude-key
```

#### Acceptance Criteria
- [ ] `npm run dev` starts successfully
- [ ] Supabase client connects (test query)
- [ ] shadcn/ui components render
- [ ] TypeScript compiles with zero errors
- [ ] Git initialized with initial commit

---

### 📋 Phase 1: Supabase Schema & Auth (Day 1-2 - 3 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Critical  
**Complexity**: Medium

#### Tasks
- [ ] Design complete database schema
- [ ] Create Supabase migration
- [ ] Set up Row Level Security policies
- [ ] Implement auth UI (login/signup)
- [ ] Create auth context/hooks
- [ ] Test authentication flow

#### Database Tables Needed

```sql
-- Users (handled by Supabase Auth automatically)

-- Collections
CREATE TABLE collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text DEFAULT 'My Collection',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collection History (git-style tracking)
CREATE TABLE collection_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid REFERENCES collections ON DELETE CASCADE,
  changes jsonb NOT NULL, -- [{action, scryfall_id, quantity, old_quantity}]
  message text,
  committed_at timestamptz DEFAULT now(),
  committed_by uuid REFERENCES auth.users
);

-- Collection Cards
CREATE TABLE collection_cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id uuid REFERENCES collections ON DELETE CASCADE,
  scryfall_id text NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity >= 0),
  foil boolean DEFAULT false,
  condition text DEFAULT 'NM', -- NM, LP, MP, HP, DMG
  added_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(collection_id, scryfall_id, foil, condition)
);

-- Decks
CREATE TABLE decks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  format text NOT NULL, -- commander, standard, modern, pioneer, limited
  commander_id text, -- scryfall_id for commander (if applicable)
  is_public boolean DEFAULT false,
  description text,
  primer_notes text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deck History (git-style commits)
CREATE TABLE deck_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id uuid REFERENCES decks ON DELETE CASCADE,
  changes jsonb NOT NULL, -- [{action, scryfall_id, quantity, category}]
  message text,
  committed_at timestamptz DEFAULT now(),
  committed_by uuid REFERENCES auth.users
);

-- Deck Cards
CREATE TABLE deck_cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id uuid REFERENCES decks ON DELETE CASCADE,
  scryfall_id text NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity >= 1),
  category text DEFAULT 'mainboard', -- commander, mainboard, sideboard, maybeboard
  added_at timestamptz DEFAULT now(),
  UNIQUE(deck_id, scryfall_id, category)
);

-- Indexes for performance
CREATE INDEX idx_collection_cards_collection ON collection_cards(collection_id);
CREATE INDEX idx_deck_cards_deck ON deck_cards(deck_id);
CREATE INDEX idx_collection_history_collection ON collection_history(collection_id);
CREATE INDEX idx_deck_history_deck ON deck_history(deck_id);

-- Row Level Security Policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_history ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own collections" ON collections
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own collections" ON collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own collections" ON collections
  FOR UPDATE USING (auth.uid() = user_id);
  
-- Similar policies for other tables...
```

#### Auth Components to Build
```
src/
  components/
    auth/
      LoginForm.tsx
      SignupForm.tsx
      AuthButton.tsx
  app/
    (auth)/
      login/
        page.tsx
      signup/
        page.tsx
```

#### Acceptance Criteria
- [ ] All tables created in Supabase
- [ ] RLS policies prevent unauthorized access
- [ ] Users can sign up
- [ ] Users can log in
- [ ] Auth state persists on refresh
- [ ] Protected routes redirect to login

---

### 📋 Phase 2: Scryfall API Integration (Day 2 - 3 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Critical  
**Complexity**: Medium

#### Tasks
- [ ] Create Scryfall API client
- [ ] Define Card type interface (matches Scryfall)
- [ ] Implement card search with autocomplete
- [ ] Add card image loading (lazy)
- [ ] Handle Scryfall rate limits
- [ ] Add error handling & retries
- [ ] Write tests for API client

#### Files to Create
```
src/
  lib/
    scryfall/
      client.ts          # Main API client
      types.ts           # Scryfall API response types
      transform.ts       # Transform Scryfall → Our Card type
  types/
    card.ts              # Our internal Card type
  components/
    cards/
      CardSearch.tsx     # Search input with autocomplete
      CardResult.tsx     # Single card in search results
      CardImage.tsx      # Lazy-loaded card image
```

#### Card Type Definition
```typescript
// src/types/card.ts
export interface Card {
  // Scryfall data
  id: string;                    // Scryfall UUID
  name: string;
  mana_cost: string;             // "{2}{U}{U}"
  cmc: number;                   // Converted mana cost
  type_line: string;             // "Creature — Human Wizard"
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  
  // Colors & identity
  colors: ManaColor[];           // ["U", "B"]
  color_identity: ManaColor[];   // For Commander
  
  // Images
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    art_crop: string;
  };
  
  // Legality
  legalities: {
    standard: Legality;
    modern: Legality;
    commander: Legality;
    pioneer: Legality;
    // ... other formats
  };
  
  // Set info
  set: string;                   // Set code
  set_name: string;
  collector_number: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'mythic';
  
  // Prices (optional for MVP)
  prices?: {
    usd?: string;
    usd_foil?: string;
  };
}

export type ManaColor = 'W' | 'U' | 'B' | 'R' | 'G';
export type Legality = 'legal' | 'not_legal' | 'restricted' | 'banned';
```

#### API Functions to Implement
```typescript
// Search cards by name
export async function searchCards(
  query: string, 
  options?: SearchOptions
): Promise<Card[]>

// Get single card by Scryfall ID
export async function getCard(id: string): Promise<Card>

// Get card by exact name
export async function getCardByName(
  name: string, 
  set?: string
): Promise<Card>

// Autocomplete (returns just names + IDs)
export async function autocomplete(query: string): Promise<{
  name: string;
  id: string;
}[]>
```

#### Acceptance Criteria
- [ ] Can search for "Lightning Bolt" and get results
- [ ] Search handles partial matches
- [ ] Rate limiting respected (10 req/sec max)
- [ ] Errors show helpful messages
- [ ] Card images lazy load properly
- [ ] TypeScript types are complete
- [ ] Tests cover happy path + errors

---

### 📋 Phase 3: Collection Management (Day 3 - 4 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Critical  
**Complexity**: Large

#### User Stories
- As a user, I want to create a collection for my bulk cards
- As a user, I want to add cards to my collection manually
- As a user, I want to import my collection from CSV
- As a user, I want to stage changes before applying them (git-style)
- As a user, I want to review staged changes and commit them
- As a user, I want to see my collection history

#### Components to Build
```
src/
  components/
    collection/
      CollectionList.tsx        # List of user's collections
      CollectionView.tsx        # View single collection
      CollectionCard.tsx        # Single card in collection
      StagingArea.tsx          # Git-style staging UI
      CommitDialog.tsx         # Commit changes with message
      HistoryView.tsx          # View collection history
      ImportCSV.tsx            # CSV import dialog
  hooks/
    useCollection.ts           # Collection CRUD operations
    useStagingArea.ts         # Staging logic
  lib/
    collection/
      csvParser.ts            # Parse CSV files
      validator.ts            # Validate collections
```

#### Git-Style Staging Flow

```typescript
// Staging state (local)
interface StagedChange {
  action: 'add' | 'remove' | 'update';
  scryfall_id: string;
  quantity: number;
  old_quantity?: number; // For updates
}

// When user adds card
const stageAddCard = (card: Card, quantity: number) => {
  // Don't apply immediately!
  // Add to staging area
  setStagedChanges(prev => [...prev, {
    action: 'add',
    scryfall_id: card.id,
    quantity
  }]);
};

// Show staged changes in UI
<StagingArea>
  <Change type="add">+ Lightning Bolt (4x)</Change>
  <Change type="remove">- Shock (4x)</Change>
</StagingArea>

// When user commits
const commitChanges = async (message: string) => {
  // Apply changes to collection_cards
  await applyChanges(stagedChanges);
  
  // Save to history
  await saveToHistory({
    collection_id,
    changes: stagedChanges,
    message
  });
  
  // Clear staging
  setStagedChanges([]);
};
```

#### CSV Import Format
```csv
Card Name,Quantity,Foil,Condition,Set
Lightning Bolt,4,false,NM,M11
Counterspell,2,true,LP,7ED
Sol Ring,1,false,NM,C21
```

Or plaintext format:
```
4 Lightning Bolt
2 Counterspell (foil)
1 Sol Ring
```

#### Acceptance Criteria
- [ ] Can create a collection
- [ ] Can add cards manually with quantity
- [ ] Can import from CSV
- [ ] Staging area shows pending changes clearly
- [ ] Can review changes before committing
- [ ] Commit saves to collection_cards AND collection_history
- [ ] Can view collection history
- [ ] Can rollback to previous state
- [ ] Real-time updates when changes made

---

### 📋 Phase 4: Deck Builder Core (Day 4-5 - 6 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Critical  
**Complexity**: Large

#### User Stories
- As a user, I want to create a deck for a specific format
- As a user, I want to add cards to my deck
- As a user, I want to stage deck changes before applying (git-style)
- As a user, I want to categorize cards (commander, mainboard, sideboard)
- As a user, I want format validation (deck size, legality)
- As a user, I want to see my deck history

#### Components to Build
```
src/
  components/
    deck/
      DeckBuilder.tsx          # Main deck builder interface
      DeckList.tsx             # List of cards in deck
      DeckCard.tsx             # Single card in deck list
      DeckStagingArea.tsx      # Git-style staging for decks
      FormatSelector.tsx       # Choose format
      DeckStats.tsx            # Card count, colors, etc.
      ManaCurve.tsx            # Mana curve visualization
  hooks/
    useDeck.ts                 # Deck CRUD + staging
    useDeckValidation.ts       # Format-specific validation
  lib/
    deck/
      validation.ts            # Format rules
      statistics.ts            # Mana curve, colors, etc.
```

#### Format Validation Rules
```typescript
interface FormatRules {
  minDeckSize: number;
  maxDeckSize?: number;
  maxCopies: number; // 4 for most, 1 for Commander (except basics)
  requiresCommander: boolean;
  allowsSideboard: boolean;
  sideboardSize?: number;
}

const FORMAT_RULES: Record<DeckFormat, FormatRules> = {
  commander: {
    minDeckSize: 100,
    maxDeckSize: 100,
    maxCopies: 1, // Singleton (except basics)
    requiresCommander: true,
    allowsSideboard: false
  },
  standard: {
    minDeckSize: 60,
    maxCopies: 4,
    requiresCommander: false,
    allowsSideboard: true,
    sideboardSize: 15
  },
  // ... other formats
};
```

#### Deck Git-Style Flow
```typescript
// Similar to collection but for decks
interface DeckStagedChange {
  action: 'add' | 'remove' | 'update' | 'move';
  scryfall_id: string;
  quantity: number;
  category: 'commander' | 'mainboard' | 'sideboard' | 'maybeboard';
  old_category?: string; // For moves
}

// Staging UI shows:
<DeckStagingArea>
  <Change type="add">+ Commander: Xenagos, God of Revels</Change>
  <Change type="add">+ 36 Lands</Change>
  <Change type="add">+ 20 Creatures</Change>
  <Change type="remove">- Lightning Bolt</Change>
</DeckStagingArea>

// Validation before commit
const validateBeforeCommit = (deck: Deck, changes: DeckStagedChange[]) => {
  // Check deck size
  // Check card copies
  // Check format legality
  // Check commander color identity (if Commander format)
  // Return errors if any
};
```

#### Acceptance Criteria
- [ ] Can create deck with format selection
- [ ] Can add cards to deck with staging
- [ ] Staging area works for decks
- [ ] Format validation works (deck size, copies, legality)
- [ ] Commander color identity validation
- [ ] Can categorize cards (commander, mainboard, sideboard)
- [ ] Deck history tracked in deck_history table
- [ ] Can rollback deck to previous state
- [ ] Real-time deck updates

---

### 📋 Phase 5: Mana Curve Visualization (Day 5 - 2 hours)
**Status**: Not Started 📋  
**Priority**: P1 - High  
**Complexity**: Small

#### User Story
- As a user, I want to see my deck's mana curve as a bar chart

#### Implementation
```
src/
  components/
    deck/
      ManaCurve.tsx          # Chart component
  lib/
    deck/
      manaCalculations.ts    # Calculate curve data
```

#### Mana Curve Logic
```typescript
// Calculate mana curve distribution
export function calculateManaCurve(cards: DeckCard[]): ManaCurveData {
  const curve: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, '7+': 0
  };
  
  cards.forEach(card => {
    const cmc = card.cmc;
    const quantity = card.quantity;
    
    if (cmc >= 7) {
      curve['7+'] += quantity;
    } else {
      curve[cmc] += quantity;
    }
  });
  
  return curve;
}
```

#### Use Recharts for visualization
```tsx
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

<BarChart data={manaCurveData}>
  <XAxis dataKey="cmc" label="Mana Cost" />
  <YAxis label="Cards" />
  <Bar dataKey="count" fill="#3b82f6" />
</BarChart>
```

#### Acceptance Criteria
- [ ] Mana curve displays correctly
- [ ] Updates in real-time when deck changes
- [ ] Handles edge cases (no cards, all lands)
- [ ] Responsive on mobile
- [ ] Accessible (ARIA labels, keyboard nav)

---

### 📋 Phase 6: Basic AI with MCP Server (Day 6 - 5 hours)
**Status**: Not Started 📋  
**Priority**: P0 - Critical  
**Complexity**: Large

#### User Stories
- As a user, I want to ask AI "Build me a Gruul Commander deck"
- As a user, I want AI to know my collection
- As a user, I want AI suggestions to appear as staged changes
- As a user, I want AI to use accurate card data (no hallucinations)

#### MCP Server Setup
```
/mcp-server
  ├── package.json
  ├── src/
  │   ├── index.ts           # MCP server entry
  │   ├── tools/
  │   │   ├── searchCards.ts    # Search Scryfall
  │   │   ├── getCard.ts        # Get card details
  │   │   ├── checkLegality.ts  # Format legality
  │   │   └── getCollection.ts  # User's collection
  │   └── config.ts
```

#### MCP Tools to Implement
```typescript
// Tool 1: Search Cards
{
  name: "search_cards",
  description: "Search for Magic cards by name",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      format: { type: "string", enum: ["commander", "standard", "modern"] }
    }
  }
}

// Tool 2: Get User Collection
{
  name: "get_user_collection",
  description: "Get user's card collection",
  inputSchema: {
    type: "object",
    properties: {
      user_id: { type: "string" }
    }
  }
}

// Tool 3: Validate Deck
{
  name: "validate_deck",
  description: "Check if deck follows format rules",
  inputSchema: {
    type: "object",
    properties: {
      cards: { type: "array" },
      format: { type: "string" }
    }
  }
}
```

#### AI API Route
```
src/
  app/
    api/
      ai/
        chat/
          route.ts         # Claude API with MCP
        suggest-deck/
          route.ts         # Deck building suggestions
```

#### AI Prompt Template
```typescript
const DECK_BUILDER_PROMPT = `
You are an expert Magic: The Gathering deck builder assistant.

User's Collection: ${JSON.stringify(userCollection)}
Format: ${format}
Request: ${userMessage}

Use the MCP tools to:
1. search_cards to find cards
2. get_user_collection to see what they own
3. validate_deck to check legality

Respond with a deck list as JSON:
{
  "commander": "card_name",
  "mainboard": [
    {"name": "card_name", "quantity": 1, "scryfall_id": "xxx"}
  ],
  "reasoning": "Why I chose these cards..."
}

IMPORTANT: Never hallucinate card names. Always use search_cards tool first.
`;
```

#### Components to Build
```
src/
  components/
    ai/
      ChatInterface.tsx       # Chat with AI
      DeckSuggestion.tsx      # Show AI's suggested deck
      AIStagingView.tsx       # AI changes in staging area
```

#### AI → Staging Flow
```
1. User: "Build me a Gruul Commander deck with cards from my collection"
   ↓
2. API calls Claude with MCP server context
   ↓
3. Claude uses MCP tools:
   - get_user_collection(user_id)
   - search_cards("Xenagos")
   - validate_deck(deck, "commander")
   ↓
4. Claude returns deck JSON
   ↓
5. Frontend converts to staged changes
   {action: "add", scryfall_id: "...", quantity: 1, category: "commander"}
   {action: "add", scryfall_id: "...", quantity: 1, category: "mainboard"}
   ...
   ↓
6. User reviews staged AI suggestions
   ↓
7. User commits (or edits and then commits)
```

#### Acceptance Criteria
- [ ] MCP server running locally
- [ ] MCP tools work (search, get collection, validate)
- [ ] Can chat with Claude AI
- [ ] AI knows user's collection
- [ ] AI suggestions appear as staged changes
- [ ] AI doesn't hallucinate card names
- [ ] User can review and commit AI suggestions
- [ ] Streaming responses for better UX

---

### 📋 Phase 7: Polish & Testing (Day 7 - 3 hours)
**Status**: Not Started 📋  
**Priority**: P1 - High  
**Complexity**: Medium

#### Tasks
- [ ] Write tests for critical paths
- [ ] Fix any bugs found during testing
- [ ] Polish UI (animations, transitions)
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Mobile responsive check
- [ ] Write user documentation
- [ ] Deploy to Vercel

#### Testing Checklist
- [ ] Collection import from CSV works
- [ ] Staging and committing works
- [ ] Deck building flow complete
- [ ] Format validation works
- [ ] AI suggestions work
- [ ] Mana curve displays correctly
- [ ] Auth flow works
- [ ] Real-time updates work

#### Acceptance Criteria
- [ ] All critical user flows tested
- [ ] No major bugs
- [ ] UI is polished and smooth
- [ ] Mobile works well
- [ ] Deployed and accessible

---

## 🚫 Blockers & Risks

### Potential Issues
1. **Scryfall Rate Limits**: 10 req/sec limit
   - **Mitigation**: Implement request queuing and caching
   
2. **Claude API Costs**: Can add up with many queries
   - **Mitigation**: Cache responses, implement rate limiting for free tier

3. **MCP Server Complexity**: First time building one
   - **Mitigation**: Start simple, add tools incrementally

4. **Real-time Updates**: Supabase subscriptions can be tricky
   - **Mitigation**: Test early, use Supabase docs

---

## 📊 Progress Tracking

### Daily Breakdown
- **Day 1**: Setup + Auth + Supabase schema (6 hours)
- **Day 2**: Scryfall API + Collection start (6 hours)
- **Day 3**: Collection management complete (6 hours)
- **Day 4**: Deck builder start (6 hours)
- **Day 5**: Deck builder complete + Mana curve (6 hours)
- **Day 6**: AI + MCP server (6 hours)
- **Day 7**: Polish + testing + deploy (4 hours)

**Total**: ~40 hours (aggressive but doable!)

### Completion Checklist
- [ ] Phase 0: Project Setup (0%)
- [ ] Phase 1: Supabase & Auth (0%)
- [ ] Phase 2: Scryfall API (0%)
- [ ] Phase 3: Collection Management (0%)
- [ ] Phase 4: Deck Builder (0%)
- [ ] Phase 5: Mana Curve (0%)
- [ ] Phase 6: AI + MCP (0%)
- [ ] Phase 7: Polish & Deploy (0%)

**Overall**: 0% complete

---

## 🎨 Design Notes

### Git-Style UI Inspiration
- Like GitHub's PR review
- Show diffs clearly (+ green, - red)
- Big "Commit Changes" button
- Commit message input (required)
- History view like `git log`

### Mana Curve Colors
- Use actual MTG mana colors when possible
- 0 CMC: Gray
- 1-7+: Gradient or single color
- Hover shows card names at that CMC

### AI Chat Interface
- Left side: Chat with Claude
- Right side: Deck preview
- Bottom: Staging area with AI changes
- Button: "Apply to Staging" or "Reject"

---

## 📝 Notes & Decisions

### Week 1 Decisions

#### Decision: Use Supabase Real-time
**Reasoning**: Perfect for git-style validation UX (show changes immediately)
**Date**: Day 1

#### Decision: Build MCP Server First
**Reasoning**: Eliminates AI hallucinations from day 1
**Date**: Day 1

#### Decision: Staging State is Client-Side Only
**Reasoning**: Faster UX, don't need to persist until commit
**Date**: Day 1

---

**Last Updated**: Start of Week 1  
**Next Update**: End of Day 1 after setup complete