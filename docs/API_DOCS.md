# API Documentation

## Overview

MANAFORGE integrates with external APIs to provide rich Magic: The Gathering card data and functionality.

---

## Scryfall API Integration

### Base URL
```
https://api.scryfall.com
```

### Authentication
No API key required. Rate limit: **10 requests per second**.

### Client Implementation

Location: `src/lib/scryfall/client.ts`

#### Search Cards

**Function**: `searchCards(query: string, options?: SearchOptions)`

Searches for Magic cards by name, text, or other criteria.

**Parameters:**
- `query` (string, required): Search query using Scryfall syntax
- `options` (object, optional):
  - `page` (number): Page number (default: 1)
  - `unique` (string): Uniqueness strategy ('cards', 'art', 'prints')
  - `order` (string): Sort order ('name', 'released', 'cmc', etc.)
  - `format` (string): Filter by format legality

**Example Usage:**
```typescript
import { searchCards } from '@/lib/scryfall/client';

// Basic search
const results = await searchCards('lightning bolt');

// Advanced search with options
const results = await searchCards('t:creature pow>=4', {
  page: 1,
  order: 'cmc',
  format: 'commander'
});
```

**Response:**
```typescript
interface SearchResponse {
  data: Card[];
  has_more: boolean;
  next_page?: string;
  total_cards?: number;
  warnings?: string[];
}
```

**Error Handling:**
```typescript
try {
  const results = await searchCards('lightning');
} catch (error) {
  if (error.status === 404) {
    // No cards found
  } else if (error.status === 429) {
    // Rate limit exceeded - retry after delay
  } else {
    // Other error
  }
}
```

#### Get Card by ID

**Function**: `getCard(id: string)`

Fetches a single card by its Scryfall ID.

**Parameters:**
- `id` (string, required): Scryfall UUID

**Example:**
```typescript
const card = await getCard('e3285e6b-3e79-4d7c-bf96-d920f973b122');
```

#### Autocomplete

**Function**: `autocompleteCard(query: string)`

Returns card name suggestions for autocomplete.

**Parameters:**
- `query` (string, required): Partial card name

**Example:**
```typescript
const suggestions = await autocompleteCard('light');
// Returns: ['Lightning Bolt', 'Lightning Strike', 'Lightmine Field', ...]
```

**Response:**
```typescript
interface AutocompleteResponse {
  data: string[]; // Array of card names
}
```

---

## Scryfall Search Syntax

### Basic Searches
- `lightning` - Search by name
- `t:instant` - Search by type
- `c:red` - Search by color
- `cmc=1` - Search by mana value
- `pow>=4` - Search by power

### Advanced Operators
- `t:creature t:dragon` - Multiple types (AND)
- `t:instant OR t:sorcery` - Either type (OR)
- `NOT c:black` - Exclude black cards
- `o:"draw a card"` - Oracle text contains phrase

### Format Filters
- `f:standard` - Standard legal
- `f:commander` - Commander legal
- `f:modern` - Modern legal
- `f:pioneer` - Pioneer legal

### Combined Example
```typescript
// Search for red creatures with power 4+ that are Commander legal
const results = await searchCards('t:creature c:red pow>=4 f:commander');
```

---

## React Hooks

### useCardSearch

Location: `src/hooks/useCardSearch.ts`

React hook for card searching with built-in debouncing and caching.

**Usage:**
```typescript
import { useCardSearch } from '@/hooks/useCardSearch';

function CardSearch() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useCardSearch(query);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <CardList cards={data.data} />}
    </div>
  );
}
```

**Features:**
- ✅ Automatic debouncing (300ms)
- ✅ React Query caching
- ✅ Loading and error states
- ✅ Automatic retry on failure

---

## Rate Limiting

Scryfall enforces a rate limit of **10 requests per second**.

### Best Practices

1. **Use Debouncing**: The `useCardSearch` hook debounces by 300ms
2. **Cache Results**: React Query caches responses for 5 minutes
3. **Batch Requests**: Use collection endpoint for multiple cards
4. **Respect 429 Responses**: Wait before retrying

### Example: Batch Card Fetch
```typescript
// Instead of multiple individual requests:
// ❌ BAD
for (const id of cardIds) {
  await getCard(id); // Too many requests!
}

// ✅ GOOD: Use collection endpoint
const response = await fetch('https://api.scryfall.com/cards/collection', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifiers: cardIds.map(id => ({ id }))
  })
});
```

---

## Type Definitions

Location: `src/lib/scryfall/types.ts`

### Card Interface
```typescript
interface Card {
  id: string;                    // Scryfall UUID
  oracle_id: string;             // Oracle ID (same across printings)
  name: string;                  // Card name
  mana_cost?: string;            // e.g., "{2}{U}{U}"
  cmc: number;                   // Converted mana cost
  type_line: string;             // Full type line
  oracle_text?: string;          // Card text
  colors?: Color[];              // Card colors
  color_identity: Color[];       // Commander color identity
  keywords: string[];            // Mechanic keywords
  legalities: Legalities;        // Format legality
  set: string;                   // Set code
  rarity: Rarity;                // Card rarity
  prices: Prices;                // Price data
  image_uris?: ImageUris;        // Image URLs
  card_faces?: CardFace[];       // For double-faced cards
}
```

### Color Type
```typescript
type Color = 'W' | 'U' | 'B' | 'R' | 'G';
```

### Rarity Type
```typescript
type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic' | 'special' | 'bonus';
```

### Image URIs
```typescript
interface ImageUris {
  small: string;      // 146 x 204
  normal: string;     // 488 x 680
  large: string;      // 672 x 936
  png: string;        // Full resolution
  art_crop: string;   // Art only
  border_crop: string;// Card with border
}
```

---

## Supabase API

### Database Operations

All database operations use Supabase client with Row Level Security (RLS) automatically enforced.

Location: `src/lib/supabase/`

#### Authentication

**Server Components:**
```typescript
import { createServerClient } from '@/lib/supabase/server';

const supabase = createServerClient();
const { data: { user } } = await supabase.auth.getUser();
```

**Client Components:**
```typescript
'use client';
import { createBrowserClient } from '@/lib/supabase/client';

const supabase = createBrowserClient();
const { data: { user } } = await supabase.auth.getUser();
```

#### Database Queries

**Example: Fetch User's Decks**
```typescript
const { data: decks, error } = await supabase
  .from('decks')
  .select('*, deck_cards(*)') // Include related cards
  .order('created_at', { ascending: false });
```

**Example: Create New Deck**
```typescript
const { data: deck, error } = await supabase
  .from('decks')
  .insert({
    name: 'My Deck',
    format: 'commander',
    description: 'Awesome deck'
  })
  .select()
  .single();
```

#### Real-Time Subscriptions

**Example: Subscribe to Deck Changes**
```typescript
const channel = supabase
  .channel('deck-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'deck_cards',
      filter: `deck_id=eq.${deckId}`
    },
    (payload) => {
      console.log('Deck updated:', payload);
      // Update local state
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

---

## React Hooks (Database)

### useDeck

Location: `src/hooks/useDeck.ts`

**Usage:**
```typescript
import { useDeck } from '@/hooks/useDeck';

function DeckPage({ deckId }: { deckId: string }) {
  const { deck, cards, isLoading, error, addCard, removeCard, updateCard } = useDeck(deckId);

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      <h1>{deck.name}</h1>
      <CardList cards={cards} />
      <button onClick={() => addCard(cardId, 1)}>Add Card</button>
    </div>
  );
}
```

**Features:**
- ✅ Real-time updates
- ✅ Optimistic updates
- ✅ Automatic cache invalidation
- ✅ CRUD operations

### useCollection

Location: `src/hooks/useCollection.ts`

**Usage:**
```typescript
import { useCollection } from '@/hooks/useCollection';

function CollectionPage({ collectionId }: { collectionId: string }) {
  const { 
    collection, 
    cards, 
    isLoading, 
    addCard, 
    removeCard, 
    updateQuantity 
  } = useCollection(collectionId);

  return (
    <div>
      <h1>{collection.name}</h1>
      <CardGrid cards={cards} />
    </div>
  );
}
```

### useStagingArea

Location: `src/hooks/useStagingArea.ts`

Git-style staging for deck changes.

**Usage:**
```typescript
import { useStagingArea } from '@/hooks/useStagingArea';

function DeckBuilder({ deckId }: { deckId: string }) {
  const { staged, stage, discard, clear, commit } = useStagingArea();

  const handleAddCard = (card: Card) => {
    stage({
      action: 'add',
      scryfall_id: card.id,
      quantity: 1,
      category: 'mainboard'
    });
  };

  const handleCommit = async () => {
    await commit(deckId, 'Added burn spells');
    // Staged changes cleared automatically
  };

  return (
    <div>
      <StagingArea changes={staged} onDiscard={discard} />
      <button onClick={handleCommit}>Commit Changes</button>
    </div>
  );
}
```

---

## Error Handling

### Standard Error Response
```typescript
interface APIError {
  status: number;
  message: string;
  details?: string;
  warnings?: string[];
}
```

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 404 | Not Found | Show "no results" message |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Show error, log to monitoring |

### Error Handling Pattern
```typescript
try {
  const results = await searchCards(query);
  return results;
} catch (error) {
  if (error.status === 404) {
    return { data: [], has_more: false };
  }
  
  if (error.status === 429) {
    // Wait 1 second then retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    return searchCards(query);
  }
  
  // Log and re-throw other errors
  console.error('Search failed:', error);
  throw error;
}
```

---

## Testing

### Mock Scryfall API
```typescript
vi.mock('@/lib/scryfall/client', () => ({
  searchCards: vi.fn().mockResolvedValue({
    data: [mockCard],
    has_more: false
  }),
  getCard: vi.fn().mockResolvedValue(mockCard)
}));
```

### Mock Supabase
```typescript
vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => ({
    from: (table: string) => ({
      select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      insert: vi.fn().mockResolvedValue({ data: mockData, error: null })
    })
  })
}));
```

---

## Performance Optimization

### Caching Strategy
- **Scryfall searches**: 5 minute cache
- **Card details**: 1 hour cache
- **Deck data**: Real-time (no cache)
- **Collection data**: 10 minute cache

### Image Loading
```typescript
import Image from 'next/image';

// ✅ GOOD: Use Next.js Image component
<Image
  src={card.image_uris.normal}
  alt={card.name}
  width={488}
  height={680}
  loading="lazy"
/>

// ❌ BAD: Regular img tag
<img src={card.image_uris.normal} alt={card.name} />
```

---

## Resources

- [Scryfall API Documentation](https://scryfall.com/docs/api)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Query Documentation](https://tanstack.com/query)

---

**Last Updated**: November 4, 2025  
**Version**: 0.2.0

