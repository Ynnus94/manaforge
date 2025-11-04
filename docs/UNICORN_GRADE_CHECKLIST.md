# 🦄 Unicorn-Grade Requirements Checklist

**For Builder Agent**: Every component must meet these standards.

---

## ✅ CRITICAL REQUIREMENTS FROM .CURSORRULES

### 1. TypeScript Strictness
- [ ] **NO `any` types** (unless absolutely necessary with comment)
- [ ] **Prefer interfaces over type aliases** for objects
- [ ] **Use `import type`** for type-only imports
- [ ] **Use Supabase generated types** from `Database`

```typescript
// ✅ GOOD
import type { Database } from '@/lib/supabase/types';
import type { Card } from '@/types/card';

interface DeckCardProps {
  card: Database['public']['Tables']['deck_cards']['Row'];
  onRemove: (id: string) => void;
}

// ❌ BAD
import { Database } from '@/lib/supabase/types'; // Not type-only
function Component(props: any) { } // NO ANY!
```

---

### 2. Component Architecture

#### Max 200 Lines Per Component
- [ ] Break large components into smaller ones
- [ ] Extract logic to custom hooks
- [ ] Create sub-components for sections

```typescript
// ✅ GOOD: DeckBuilder broken down
src/components/deck/builder/
  ├── DeckBuilderLayout.tsx     (< 200 lines)
  ├── CardSearchSidebar.tsx     (< 200 lines)
  ├── DeckMainArea.tsx          (< 200 lines)
  └── DeckStatsSidebar.tsx      (< 200 lines)

// ❌ BAD: One massive file
src/components/DeckBuilder.tsx  (800 lines)
```

#### Server Components by Default
- [ ] Use server components for data fetching
- [ ] Only use `'use client'` when necessary:
  - useState, useEffect, hooks
  - Event handlers
  - Browser APIs
  - Real-time subscriptions

```typescript
// ✅ GOOD: Server component
export default async function DeckListPage() {
  const supabase = createServerClient();
  const { data } = await supabase.from('decks').select('*');
  return <DeckList decks={data} />;
}

// ✅ GOOD: Client component (needs hooks)
'use client';
export function DeckList({ decks }: Props) {
  const [filter, setFilter] = useState('all');
  // ...
}
```

#### Single Responsibility
- [ ] Each component has ONE clear purpose
- [ ] Props interface explicitly defined

```typescript
// ✅ GOOD
interface StagingAreaProps {
  changes: StagedChange[];
  onCommit: (message: string) => Promise<void>;
  onDiscard: (changeId: string) => void;
  isCommitting?: boolean;
}

export function StagingArea({ 
  changes, 
  onCommit, 
  onDiscard, 
  isCommitting = false 
}: StagingAreaProps) {
  // Only handles staging area UI
}
```

---

### 3. Git-Style Validation Pattern (CORE FEATURE!)

#### Staging State Structure
```typescript
// MUST use this exact structure
interface StagedChange {
  id: string;                    // Temporary ID for UI
  action: 'add' | 'remove' | 'update' | 'move';
  scryfall_id: string;
  quantity: number;
  old_quantity?: number;         // For updates
  category?: 'commander' | 'mainboard' | 'sideboard' | 'maybeboard';
  old_category?: string;         // For moves
  timestamp: number;             // When staged
}

// Client-side ONLY (don't persist until commit)
const [stagedChanges, setStagedChanges] = useState<StagedChange[]>([]);
```

#### Commit Flow
```typescript
const commitChanges = async (message: string) => {
  // 1. Apply changes to database
  await applyChangesToDatabase(stagedChanges);
  
  // 2. Save to history table
  await supabase.from('deck_history').insert({
    deck_id: deckId,
    user_id: userId,
    changes: stagedChanges,
    message,
  });
  
  // 3. Clear staging
  setStagedChanges([]);
};
```

---

### 4. Custom Hooks Pattern

#### useStagingArea Hook (MUST CREATE)
```typescript
// src/hooks/useStagingArea.ts
export function useStagingArea<T extends StagedChange>() {
  const [staged, setStaged] = useState<T[]>([]);

  const stage = useCallback((change: Omit<T, 'id' | 'timestamp'>) => {
    setStaged(prev => [...prev, {
      ...change,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    } as T]);
  }, []);

  const discard = useCallback((id: string) => {
    setStaged(prev => prev.filter(c => c.id !== id));
  }, []);

  const clear = useCallback(() => setStaged([]), []);

  return { staged, stage, discard, clear };
}
```

#### useCollection Hook (MUST CREATE)
```typescript
// src/hooks/useCollection.ts
export function useCollection(collectionId: string) {
  const supabase = createBrowserClient();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchCollection = async () => {
      // ... fetch logic
    };

    fetchCollection();

    // Real-time subscription
    const channel = supabase
      .channel(`collection-${collectionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'collection_cards',
        filter: `collection_id=eq.${collectionId}`
      }, () => {
        fetchCollection(); // Refetch on changes
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [collectionId]);

  return { collection, isLoading, error };
}
```

#### useDeck Hook (MUST CREATE)
```typescript
// src/hooks/useDeck.ts
export function useDeck(deckId: string) {
  // Similar pattern to useCollection
  // Include real-time subscriptions for deck_cards
}
```

---

### 5. Supabase Patterns

#### Client Initialization
```typescript
// ✅ Server Component
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();

// ✅ Client Component
'use client';
import { createBrowserClient } from '@/lib/supabase/client';
const supabase = createBrowserClient();
```

#### RLS Queries
```typescript
// ✅ GOOD: RLS handles security
const { data } = await supabase
  .from('collections')
  .select('*');
// No need to filter by user_id - RLS does it!

// ❌ BAD: Redundant filtering
const { data } = await supabase
  .from('collections')
  .select('*')
  .eq('user_id', userId); // RLS already filters this
```

---

### 6. Performance Requirements

#### Scryfall API
- [ ] **Debounce search** (300ms minimum)
- [ ] **Cache results** (5 minutes stale time)
- [ ] **Batch requests** (collection endpoint)
- [ ] **Rate limit**: Max 10 req/sec

```typescript
// ✅ GOOD
const debouncedSearch = useDebounce(query, 300);

const { data: cards } = useQuery({
  queryKey: ['cards', debouncedSearch],
  queryFn: () => searchCards(debouncedSearch),
  enabled: debouncedSearch.length >= 3,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

#### Images
- [ ] **Use Next.js Image component** (ALWAYS)
- [ ] **Lazy loading** for all card images
- [ ] **WebP format** preferred

```typescript
// ✅ GOOD
import Image from 'next/image';

<Image
  src={card.image_uris.normal}
  alt={card.name}
  width={300}
  height={420}
  loading="lazy"
  className="rounded-lg"
/>

// ❌ BAD
<img src={card.image_uris.normal} alt={card.name} />
```

#### Virtual Scrolling
- [ ] Use for lists > 100 items
- [ ] Collection card grids
- [ ] Search results

---

### 7. Styling Standards

#### Use shadcn Components
- [ ] DON'T reinvent existing components
- [ ] Use `Button`, `Card`, `Dialog`, etc.

```typescript
// ✅ GOOD
import { Button } from '@/components/ui/button';
<Button onClick={handleSave}>Save</Button>

// ❌ BAD
<button className="px-4 py-2 rounded...">Save</button>
```

#### CSS Variables (Theme)
- [ ] Use theme colors, not hardcoded
- [ ] Mobile-first responsive

```typescript
// ✅ GOOD
className="bg-primary text-primary-foreground hover:bg-primary/90"

// ❌ BAD
className="bg-blue-600 text-white hover:bg-blue-700"
```

#### Animations
- [ ] Smooth transitions (200-300ms)
- [ ] Use Framer Motion for complex animations

```typescript
// ✅ GOOD
<div className="transition-all duration-300 ease-in-out hover:scale-105">

// For complex animations
import { motion } from 'framer-motion';
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>
```

---

### 8. MTG-Specific Requirements

#### Card Data Handling
```typescript
interface Card {
  id: string;           // Scryfall ID (unique per printing)
  oracle_id: string;    // Same for all printings
  name: string;
  mana_cost: string;
  cmc: number;
  type_line: string;
  // Handle double-faced cards
  card_faces?: Array<{
    name: string;
    mana_cost: string;
    image_uris: ImageUris;
  }>;
}

// Check if double-faced
const isDoubleFaced = card.card_faces && card.card_faces.length > 1;
```

#### Format Validation
```typescript
// MUST validate deck rules
export function validateDeck(
  deck: Deck, 
  cards: DeckCard[],
  format: DeckFormat
): ValidationResult {
  const errors: string[] = [];
  
  // Deck size
  if (format === 'commander' && totalCards !== 100) {
    errors.push('Commander decks must have exactly 100 cards');
  }
  
  // Card limits
  const cardCounts = new Map<string, number>();
  cards.forEach(card => {
    const count = cardCounts.get(card.oracle_id) || 0;
    if (format === 'commander' && count > 1 && !isBasicLand(card)) {
      errors.push(`${card.name}: Commander allows only 1 copy`);
    }
  });
  
  // Color identity
  if (format === 'commander') {
    // Check color identity against commander
  }
  
  return { isValid: errors.length === 0, errors };
}
```

#### Mana Calculations
```typescript
export function parseManaSymbols(manaCost: string): ManaSymbol[] {
  // Handle {2}{U}{U}, {2/W}, {X}, etc.
  const regex = /{([^}]+)}/g;
  const symbols: ManaSymbol[] = [];
  let match;
  
  while ((match = regex.exec(manaCost)) !== null) {
    symbols.push(match[1] as ManaSymbol);
  }
  
  return symbols;
}
```

---

### 9. Real-Time Subscriptions

```typescript
// ✅ GOOD: Proper cleanup
useEffect(() => {
  const supabase = createBrowserClient();
  
  const channel = supabase
    .channel('deck-changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'deck_cards',
      filter: `deck_id=eq.${deckId}`
    }, (payload) => {
      handleRealtimeUpdate(payload);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [deckId]);
```

---

### 10. Security Requirements

#### Server Actions for Mutations
```typescript
// ✅ GOOD: Server action
'use server';

export async function addCardToDeck(deckId: string, cardId: string) {
  const supabase = createServerClient();
  
  // RLS ensures user owns this deck
  const { error } = await supabase
    .from('deck_cards')
    .insert({ deck_id: deckId, scryfall_id: cardId });
    
  if (error) throw error;
}

// ❌ BAD: Direct client mutation
const supabase = createBrowserClient();
await supabase.from('deck_cards').insert(...); // Risky!
```

#### Input Validation
```typescript
// ✅ GOOD: Zod validation
import { z } from 'zod';

const CardSchema = z.object({
  scryfall_id: z.string().uuid(),
  quantity: z.number().int().min(1).max(100)
});

const validated = CardSchema.parse(input);

// ❌ BAD: No validation
const cardId = request.body.cardId;
```

---

## 🚀 Required Hooks to Create

Before building components, create these hooks:

1. **`src/hooks/useStagingArea.ts`** - Git-style staging
2. **`src/hooks/useCollection.ts`** - Collection CRUD + real-time
3. **`src/hooks/useDeck.ts`** - Deck CRUD + real-time
4. **`src/hooks/useDebounce.ts`** - Debounce inputs
5. **`src/hooks/useCardSearch.ts`** - Scryfall search with cache

---

## 🚀 Required Utilities to Create

1. **`src/lib/utils/validation.ts`** - Deck format validation
2. **`src/lib/utils/calculations.ts`** - Mana curve, CMC avg
3. **`src/lib/utils/mana.ts`** - Mana symbol parsing
4. **`src/types/card.ts`** - Card types
5. **`src/types/deck.ts`** - Deck types
6. **`src/types/staging.ts`** - StagedChange types

---

## ✅ Pre-Component Checklist

Before starting any component:
- [ ] Required hooks created
- [ ] Required types defined
- [ ] Utility functions ready
- [ ] Understand component's single responsibility
- [ ] Know if it's server or client component

---

## ✅ Per-Component Checklist

For every component:
- [ ] < 200 lines (break down if larger)
- [ ] Explicit props interface (no `any`)
- [ ] Type imports use `import type`
- [ ] Uses shadcn/ui components (don't rebuild)
- [ ] Mobile responsive
- [ ] Loading state
- [ ] Error state
- [ ] Empty state (where applicable)
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Next.js Image for images
- [ ] Smooth animations (200-300ms)

---

## 🎯 Priority: Build These First

1. **Types & Interfaces** (`src/types/`)
2. **Utility Functions** (`src/lib/utils/`)
3. **Custom Hooks** (`src/hooks/`)
4. **Then start on components**

This ensures unicorn-grade quality from the start.

---

**These standards are NON-NEGOTIABLE for unicorn-grade software.** 🦄

