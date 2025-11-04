# 🚨 BUILDER SPRINT 1: Critical Blockers

**Assigned By**: Planner Agent  
**Date**: November 4, 2025  
**Priority**: 🔴 CRITICAL - Blocks all AI functionality  
**Estimated Time**: 12 hours (1.5 days)

---

## 🎯 SPRINT GOAL

**Wire the deck builder so users can:**
1. See card names/images in collection
2. See card data in deck lists
3. Add cards to decks via search
4. Stage changes (git-style)
5. Commit changes to database

**After this sprint**: The app actually works end-to-end!

---

## 📋 TASKS (2.1 - 2.5)

### ⚠️ Task 2.1: Fetch Card Data in Collection (2h)
**Status**: ⬜ Not Started  
**File**: `src/app/collection/page.tsx`

**What to do**:
1. Import `useCards()` hook from `src/hooks/useCards.ts`
2. Extract scryfall_ids from `collection_cards`
3. Call `useCards(scryfallIds)` to batch fetch from Scryfall
4. Pass card data to `<CollectionCardItem>`

**Before**:
```typescript
// Shows: "Card ID: abc-123-def"
<CollectionCardItem cardId={card.scryfall_id} />
```

**After**:
```typescript
// Shows: "Lightning Bolt" with image
const { data: cards } = useCards(scryfallIds);
<CollectionCardItem card={cards[id]} />
```

**Acceptance Criteria**:
- [ ] Collection shows card names (not IDs)
- [ ] Collection shows card images
- [ ] Loading skeleton while fetching
- [ ] No console errors

**Blocker Impact**: 🔴 Users can't see what cards they own

---

### ⚠️ Task 2.2: Fetch Card Data in Deck List (2h)
**Status**: ⬜ Not Started  
**File**: `src/components/deck/builder/DeckListPanel.tsx`

**What to do**:
1. Import `useCards()` hook
2. Get scryfall_ids from deck_cards
3. Fetch card data
4. Display names, images, mana costs in list

**Current State**:
```typescript
// Shows just IDs
{deckCards.map(dc => <div>{dc.scryfall_id}</div>)}
```

**Target State**:
```typescript
const { data: cards } = useCards(scryfallIds);
{deckCards.map(dc => (
  <DeckCardItem 
    card={cards[dc.scryfall_id]} 
    quantity={dc.quantity}
  />
))}
```

**Acceptance Criteria**:
- [ ] Deck list shows card names
- [ ] Shows mana costs
- [ ] Shows card images
- [ ] Categorized (Commander, Mainboard, Sideboard)
- [ ] Loading state

**Blocker Impact**: 🔴 Deck list is unusable (shows IDs only)

---

### ⚠️ Task 2.3: Wire Card Search Add Button (2h)
**Status**: ⬜ Not Started  
**File**: `src/components/deck/builder/CardSearchPanel.tsx`

**What to do**:
1. Import `useStagingArea` from context
2. Import `staged` array from context
3. Wire "+" button to call `stage({ action: 'add', scryfall_id, quantity: 1 })`
4. Show visual feedback when staged
5. Disable button if already staged

**Current State**:
```typescript
<Button onClick={() => console.log('Add card')}>+</Button>
```

**Target State**:
```typescript
const { stage, staged } = useStagingArea();
const isStaged = staged.some(s => s.scryfall_id === card.id);

<Button 
  onClick={() => stage({ 
    action: 'add', 
    scryfall_id: card.id, 
    quantity: 1,
    category: 'mainboard'
  })}
  disabled={isStaged}
>
  {isStaged ? '✓ Staged' : '+'}
</Button>
```

**Acceptance Criteria**:
- [ ] Clicking "+" stages the card
- [ ] Button shows "✓ Staged" after click
- [ ] Can't stage same card twice
- [ ] Toast notification: "Staged Lightning Bolt"

**Blocker Impact**: 🔴 Can't add cards to deck

---

### ⚠️ Task 2.4: Integrate useStagingArea Hook (3h)
**Status**: ⬜ Not Started  
**File**: `src/components/deck/builder/DeckBuilderDesktop.tsx`

**What to do**:
1. Import `useStagingArea()` hook
2. Create `StagingContext` provider
3. Wrap all child components in provider
4. Pass `staged`, `stage`, `discard`, `clear` via context
5. Wire to `<StagingArea>` component in bottom panel

**Implementation**:
```typescript
// Create context
const StagingContext = createContext<StagingAreaHook | null>(null);

export function DeckBuilderDesktop() {
  const staging = useStagingArea();
  
  return (
    <StagingContext.Provider value={staging}>
      <div className="grid grid-cols-[300px_1fr_300px]">
        <CardSearchPanel />
        <DeckListPanel />
        <StatsPanel />
      </div>
      
      {/* Bottom: Staging Area */}
      <StagingArea 
        changes={staging.staged}
        onDiscard={staging.discard}
        onClear={staging.clear}
        onCommit={handleCommit}
      />
    </StagingContext.Provider>
  );
}

// Export hook for children
export function useStagingContext() {
  const context = useContext(StagingContext);
  if (!context) throw new Error('Must be inside StagingProvider');
  return context;
}
```

**Acceptance Criteria**:
- [ ] All components can access staging state
- [ ] Staging area shows changes
- [ ] Can discard individual changes
- [ ] Can clear all changes
- [ ] Real-time update (add card → appears in staging)

**Blocker Impact**: 🔴 Staging system doesn't work

---

### ⚠️ Task 2.5: Connect Commit to Database (3h)
**Status**: ⬜ Not Started  
**File**: `src/components/deck/staging/StagingArea.tsx`

**What to do**:
1. Import `useDeck()` hook
2. Get `commitChanges(changes, message)` function
3. Wire "Commit" button to call it
4. Show loading state during commit
5. Clear staging after success
6. Handle errors gracefully

**Implementation**:
```typescript
// In StagingArea.tsx
const { commitChanges, isCommitting } = useDeck(deckId);

const handleCommit = async () => {
  if (!commitMessage) {
    toast.error('Please enter a commit message');
    return;
  }

  try {
    setIsCommitting(true);
    
    // This applies changes + saves to history
    await commitChanges(staged, commitMessage);
    
    // Success!
    toast.success(`✓ Committed ${staged.length} changes`);
    
    // Clear staging
    onClear();
    setCommitMessage('');
    
  } catch (error) {
    toast.error('Failed to commit changes');
    console.error(error);
  } finally {
    setIsCommitting(false);
  }
};
```

**Acceptance Criteria**:
- [ ] Clicking "Commit" saves to database
- [ ] Changes appear in deck immediately
- [ ] Commit saved to `deck_history` table
- [ ] Staging area clears after commit
- [ ] Loading spinner during commit
- [ ] Success toast notification
- [ ] Error handling with retry option

**Blocker Impact**: 🔴 Changes don't persist (nothing saves!)

---

## 📊 VELOCITY TRACKING

### Time Estimates
```
Task 2.1: 2 hours (Collection card data)
Task 2.2: 2 hours (Deck list card data)
Task 2.3: 2 hours (Search add button)
Task 2.4: 3 hours (Staging context)
Task 2.5: 3 hours (Commit to DB)
─────────────────────────────
TOTAL:    12 hours
```

### Actual Time Log (Builder: Fill this in!)
```
Task 2.1: Started ___:___ | Ended ___:___ | Actual: ___ hours
Task 2.2: Started ___:___ | Ended ___:___ | Actual: ___ hours
Task 2.3: Started ___:___ | Ended ___:___ | Actual: ___ hours
Task 2.4: Started ___:___ | Ended ___:___ | Actual: ___ hours
Task 2.5: Started ___:___ | Ended ___:___ | Actual: ___ hours
─────────────────────────────────────────────────────────────
TOTAL:                                        Actual: ___ hours

Variance: ___% (Actual vs Estimated)
```

### Blockers Encountered
```
Task | Blocker Description | Time Lost | Resolution
─────┼────────────────────┼───────────┼────────────
2.1  |                    |           |
2.2  |                    |           |
2.3  |                    |           |
2.4  |                    |           |
2.5  |                    |           |
```

---

## 🎯 SUCCESS CRITERIA (Sprint Complete When)

### Must Pass
- [ ] Collection shows real card names and images
- [ ] Deck list shows real cards (not IDs)
- [ ] Can search and click "+" to stage cards
- [ ] Staging area shows changes with +/- indicators
- [ ] Can commit changes with message
- [ ] Changes save to database
- [ ] Can see committed cards in deck immediately

### Should Pass
- [ ] Loading states on all data fetches
- [ ] Toast notifications for actions
- [ ] Error messages if something fails
- [ ] Can discard staged changes
- [ ] Commit message required (validation)

### Nice to Have
- [ ] Smooth animations
- [ ] Keyboard shortcuts (Enter to commit)
- [ ] Undo button after commit

---

## 🚀 GETTING STARTED

### Step 1: Read These Files First
1. `src/hooks/useCards.ts` - Understand batch fetching
2. `src/hooks/useStagingArea.ts` - Understand staging pattern
3. `src/hooks/useDeck.ts` - Understand commit logic
4. `docs/PHASE2_TASK_LIST.md` - Full context

### Step 2: Start with Task 2.1
- Easiest task to build confidence
- Shows immediate visible results
- Sets up pattern for Task 2.2

### Step 3: Work in Order
- Tasks are sequential
- Each builds on the previous
- Don't skip ahead

### Step 4: Test After Each Task
- Run `npm run dev`
- Test the specific feature
- Fix any bugs before moving on

---

## 📚 KEY FILES & PATTERNS

### Files You'll Edit
```
src/app/collection/page.tsx                    (Task 2.1)
src/components/deck/builder/DeckListPanel.tsx  (Task 2.2)
src/components/deck/builder/CardSearchPanel.tsx (Task 2.3)
src/components/deck/builder/DeckBuilderDesktop.tsx (Task 2.4)
src/components/deck/staging/StagingArea.tsx    (Task 2.5)
```

### Files You'll USE (Don't modify!)
```
src/hooks/useCards.ts          - Batch fetch from Scryfall
src/hooks/useStagingArea.ts    - Git-style staging
src/hooks/useDeck.ts           - Commit to DB
src/hooks/useCollection.ts     - Collection CRUD
src/lib/scryfall/client.ts     - API client
```

### Pattern: Fetch Card Data
```typescript
// 1. Get scryfall IDs
const scryfallIds = items.map(item => item.scryfall_id);

// 2. Batch fetch
const { data: cards, isLoading } = useCards(scryfallIds);

// 3. Map to components
{items.map(item => (
  <CardComponent 
    card={cards?.[item.scryfall_id]} 
    loading={isLoading}
  />
))}
```

### Pattern: Stage Changes
```typescript
// 1. Get staging functions from context
const { stage, staged } = useStagingArea();

// 2. Check if already staged
const isStaged = staged.some(s => 
  s.scryfall_id === card.id && s.action === 'add'
);

// 3. Stage on click
<Button onClick={() => stage({
  action: 'add',
  scryfall_id: card.id,
  quantity: 1,
  category: 'mainboard'
})}>
  {isStaged ? '✓' : '+'}
</Button>
```

### Pattern: Commit Changes
```typescript
// 1. Get commit function
const { commitChanges } = useDeck(deckId);

// 2. Call with staged changes
await commitChanges(staged, commitMessage);

// 3. Clear staging
onClear();
```

---

## ⚠️ COMMON PITFALLS

### 1. Forgetting to batch fetch
❌ **Bad**: `useCard(id)` for each card (slow!)  
✅ **Good**: `useCards([id1, id2, id3])` (fast!)

### 2. Mutating state directly
❌ **Bad**: `staged.push(newChange)`  
✅ **Good**: `setStaged([...staged, newChange])`

### 3. Not checking if already staged
❌ **Bad**: Can stage same card multiple times  
✅ **Good**: Check `staged.some()` before staging

### 4. Committing without message
❌ **Bad**: Allow empty commit messages  
✅ **Good**: Validate message exists before commit

### 5. Not handling errors
❌ **Bad**: Assume everything works  
✅ **Good**: Try-catch + show error to user

---

## 🧪 TESTING CHECKLIST

### After Task 2.1
- [ ] Go to `/collection`
- [ ] See card names (not IDs)
- [ ] See card images
- [ ] Loading skeleton appears first

### After Task 2.2
- [ ] Go to `/deck/[any-deck-id]`
- [ ] See card names in deck list
- [ ] See mana costs
- [ ] See card images

### After Task 2.3
- [ ] Search for "Lightning Bolt"
- [ ] Click "+" button
- [ ] See toast: "Staged Lightning Bolt"
- [ ] Button changes to "✓ Staged"

### After Task 2.4
- [ ] Staging area at bottom shows change
- [ ] Shows: "+ Lightning Bolt x1 → Mainboard"
- [ ] Click X to discard
- [ ] Change disappears from staging

### After Task 2.5
- [ ] Add 3 cards to staging
- [ ] Enter commit message: "Added burn spells"
- [ ] Click "Commit"
- [ ] See success toast
- [ ] Staging area clears
- [ ] Cards appear in deck list immediately
- [ ] Refresh page → cards still there

### End-to-End Test
- [ ] Start with empty deck
- [ ] Search and add 10 cards
- [ ] All appear in staging
- [ ] Commit with message
- [ ] All save to deck
- [ ] Deck list shows 10 cards
- [ ] No console errors

---

## 🎉 SPRINT COMPLETE WHEN

1. ✅ All 5 tasks marked complete
2. ✅ All acceptance criteria met
3. ✅ All tests pass
4. ✅ No console errors
5. ✅ Velocity tracked (actual vs estimated)
6. ✅ Any blockers documented

**Then**: Report to Planner for Sprint 2 assignment

---

## 🆘 NEED HELP?

### If Stuck on Task 2.1-2.2 (Data Fetching)
- Check `src/hooks/useCards.ts` implementation
- See how `CardSearchResult.tsx` uses it
- Ask: "How do I batch fetch cards?"

### If Stuck on Task 2.3 (Staging)
- Check `src/hooks/useStagingArea.ts` implementation
- See `StagedChange` type in `src/types/staging.ts`
- Ask: "How do I access staging from context?"

### If Stuck on Task 2.4 (Context)
- Review React Context API docs
- See similar pattern in auth context
- Ask: "How do I create and use context?"

### If Stuck on Task 2.5 (Commit)
- Check `src/hooks/useDeck.ts` → `commitChanges()` function
- See how it applies changes to Supabase
- Ask: "How does commitChanges work?"

---

**Status**: 🟢 READY TO START  
**Blockers**: ❌ NONE  
**Next Action**: Begin Task 2.1

**Go build! 🚀**

