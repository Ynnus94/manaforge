# 📋 Phase 2 Task List - For Planner

**Total Estimate**: 72 hours (9 days @ 8h/day)  
**Priority**: HIGH - Blocks AI functionality

---

## 🔴 Week 1: Core Integration (32 hours)

### Day 1-2: Wire Deck Builder (12h)

- [ ] **Task 2.1**: Fetch card data in Collection (2h)
  - File: `src/app/collection/page.tsx`
  - Use `useCards()` hook to batch fetch from Scryfall
  - Pass to CollectionCardItem
  - **Blocker**: Users can't see cards

- [ ] **Task 2.2**: Fetch card data in Deck List (2h)
  - File: `src/components/deck/builder/DeckListPanel.tsx`
  - Use `useCards()` hook
  - Display card names, images, mana costs
  - **Blocker**: Deck list shows IDs only

- [ ] **Task 2.3**: Wire card search add button (2h)
  - File: `src/components/deck/builder/CardSearchPanel.tsx`
  - Import `useStagingArea`
  - Connect + button to `stage()` function
  - **Blocker**: Can't add cards to deck

- [ ] **Task 2.4**: Integrate useStagingArea hook (3h)
  - File: `src/components/deck/builder/DeckBuilderDesktop.tsx`
  - Create StagingContext
  - Pass to all child components
  - Wire StagingArea component
  - **Blocker**: Staging doesn't work

- [ ] **Task 2.5**: Connect commit to database (3h)
  - File: `src/components/deck/staging/StagingArea.tsx`
  - Import `useDeck` hook
  - Call `commitChanges(staged, message)`
  - Clear staging after commit
  - **Blocker**: Changes don't save

---

### Day 3-4: Stats & Collection (12h)

- [ ] **Task 2.6**: Calculate real deck stats (4h)
  - File: `src/components/deck/stats/DeckStats.tsx`
  - Fetch card data for deck
  - Use `src/lib/utils/calculations.ts` functions
  - Calculate mana curve, colors, types
  - **Impact**: Shows accurate deck analysis

- [ ] **Task 2.7**: Build commit history view (4h)
  - File: `src/components/deck/staging/CommitHistory.tsx`
  - Fetch from `deck_history` table
  - Display as timeline
  - Show commit messages + timestamps
  - **Impact**: Users see change history

- [ ] **Task 2.8**: Wire collection CRUD (4h)
  - File: `src/components/collection/CollectionCardItem.tsx`
  - Import `useCollection` hook
  - Wire +/- buttons to `updateQuantity()`
  - Wire delete to `removeCard()`
  - Add confirmation dialogs
  - **Impact**: Can manage collection

---

### Day 5: Polish & Test (8h)

- [ ] **Task 2.9**: Add loading skeletons (2h)
  - Add to collection grid
  - Add to deck list
  - Add to search results
  - **Impact**: Better UX during loading

- [ ] **Task 2.10**: Add confirmation dialogs (2h)
  - Delete card from collection
  - Delete deck
  - Discard all staged changes
  - **Impact**: Prevent accidental deletions

- [ ] **Task 2.11**: Error boundaries (2h)
  - Wrap major sections
  - Display friendly error messages
  - Add retry buttons
  - **Impact**: Graceful error handling

- [ ] **Task 2.12**: Manual testing (2h)
  - Test all user flows
  - Test on mobile
  - Fix any bugs found
  - **Impact**: Quality assurance

---

## 🟡 Week 2: MCP Tool Handlers (40 hours)

### Day 1-2: Data Fetching Handlers (16h)

- [ ] **Task 2.13**: `get_user_collection` handler (4h)
  - File: `src/lib/ai/tool-handlers.ts`
  - Fetch from Supabase
  - Return with quantities
  - **Impact**: AI knows user's cards

- [ ] **Task 2.14**: `get_user_decks` handler (4h)
  - Fetch from Supabase
  - Filter by format if specified
  - Return deck metadata
  - **Impact**: AI knows user's decks

- [ ] **Task 2.15**: `search_cards` handler (4h)
  - Call Scryfall client
  - Apply format filter
  - Return card details
  - **Impact**: AI can search cards

- [ ] **Task 2.16**: `get_card_details` handler (4h)
  - Call Scryfall by ID
  - Return full card data
  - Cache results
  - **Impact**: AI gets card info

---

### Day 3-4: Action Handlers (16h)

- [ ] **Task 2.17**: `add_card_to_deck` handler (4h)
  - **IMPORTANT**: Stage change, don't apply directly
  - Call `useDeck.stage()` function
  - Return staged change ID
  - **Impact**: AI can suggest cards

- [ ] **Task 2.18**: `remove_card_from_deck` handler (4h)
  - **IMPORTANT**: Stage change
  - Call `useDeck.stage()` function
  - Return staged change ID
  - **Impact**: AI can remove cards

- [ ] **Task 2.19**: `analyze_deck` handler (4h)
  - Fetch deck + cards
  - Call `src/lib/utils/calculations.ts`
  - Return stats (mana curve, colors, etc)
  - **Impact**: AI understands deck

- [ ] **Task 2.20**: `validate_deck_format` handler (4h)
  - Fetch deck + cards
  - Call `src/lib/utils/validation.ts`
  - Return errors + warnings
  - **Impact**: AI checks deck legality

---

### Day 5: Advanced Handlers (8h)

- [ ] **Task 2.21**: `get_card_prices` handler (4h)
  - Parse prices from Scryfall card
  - Return USD, EUR, TIX
  - **Impact**: AI knows card costs

- [ ] **Task 2.22**: `suggest_decks_from_collection` handler (4h)
  - **SIMPLE VERSION**: Match to popular commanders
  - Calculate % complete
  - Find missing cards
  - **Impact**: Basic superbrew feature

---

## ✅ Acceptance Criteria

### After Week 1 (Tasks 2.1-2.12):
- [ ] Collection shows card names & images
- [ ] Can search and add cards to deck
- [ ] Staging area commits to database
- [ ] Deck list shows real cards
- [ ] Stats show real data
- [ ] Commit history displays
- [ ] Collection CRUD works
- [ ] Loading states everywhere
- [ ] Confirmations on destructive actions

### After Week 2 (Tasks 2.13-2.22):
- [ ] All 10 MCP tool handlers work
- [ ] AI can search cards
- [ ] AI can view collection
- [ ] AI can suggest cards (staged)
- [ ] AI can analyze decks
- [ ] AI can validate formats
- [ ] AI can suggest decks from collection
- [ ] Prices displayed

---

## 🎯 Success Metrics

**Must Pass**:
1. User can build a deck end-to-end
2. Changes save via git-style commits
3. AI can respond with card suggestions
4. Collection is fully manageable

**Should Pass**:
1. Deck stats are accurate
2. Format validation works
3. History shows all commits
4. No console errors

**Nice to Have**:
1. Smooth animations
2. Loading skeletons
3. Error boundaries
4. Confirmation dialogs

---

## 🚨 Risks & Blockers

### Potential Blockers:
1. **Scryfall rate limits** - Already handled with rate limiter ✅
2. **Anthropic API key** - Need to add to `.env.local` ⚠️
3. **Supabase RLS** - Already configured ✅
4. **Type errors** - All fixed ✅

### Technical Debt:
1. Some `@ts-ignore` usage (Supabase types) - Low priority
2. ESLint warnings (apostrophes) - Very low priority
3. No unit tests - Phase 3

---

## 📊 Velocity Tracking

```
Estimated:  72 hours (9 days @ 8h)
Actual:     ___ hours (tracking in progress)
Variance:   ___% (update as we go)
```

**Week 1 Daily Updates**:
- Day 1: ___ / 6h
- Day 2: ___ / 6h
- Day 3: ___ / 6h
- Day 4: ___ / 6h
- Day 5: ___ / 8h

**Week 2 Daily Updates**:
- Day 6: ___ / 8h
- Day 7: ___ / 8h
- Day 8: ___ / 8h
- Day 9: ___ / 8h
- Day 10: ___ / 8h

---

## 📝 Notes for Builder

### Key Files to Edit:

**Week 1 (Integration)**:
- `src/app/collection/page.tsx`
- `src/components/collection/CollectionCardItem.tsx`
- `src/components/deck/builder/CardSearchPanel.tsx`
- `src/components/deck/builder/DeckListPanel.tsx`
- `src/components/deck/builder/DeckBuilderDesktop.tsx`
- `src/components/deck/staging/StagingArea.tsx`
- `src/components/deck/stats/DeckStats.tsx`
- `src/components/deck/staging/CommitHistory.tsx`

**Week 2 (MCP Handlers)**:
- `src/lib/ai/tool-handlers.ts` (main file!)
- `src/app/api/ai/chat/route.ts` (wire handlers)

### Existing Code to Use:
- ✅ `useCollection` - Real-time CRUD
- ✅ `useDeck` - Git-style commits  
- ✅ `useStagingArea` - Staging logic
- ✅ `useCardSearch` - Scryfall search
- ✅ `useCards` - Batch fetch cards
- ✅ Scryfall client - All API methods
- ✅ Validation functions - Format rules
- ✅ Calculation functions - Deck stats

### DON'T Need to Build:
- ❌ Auth system (done)
- ❌ Database schema (done)
- ❌ API client (done)
- ❌ Hooks (done)
- ❌ UI components (done)
- ❌ Responsive layouts (done)

### DO Need to Build:
- ✅ Wire existing pieces together
- ✅ Implement tool handlers
- ✅ Add loading states
- ✅ Add error handling

---

**Ready to Start**: ✅ YES  
**Blockers**: ❌ NONE  
**Next**: Begin Task 2.1

**Last Updated**: November 4, 2025 by Looker Agent

