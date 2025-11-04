# 🔨 BUILDER AGENT - MVP Design Implementation Tasks

**Date**: November 4, 2025  
**Total Tasks**: 20  
**Estimated Time**: 12-16 hours total  
**Status**: Ready for Implementation

---

## 🚨 CRITICAL: Fix Bugs First (Tasks 1-7)

**These MUST be completed before any design work. App won't compile.**

### 🔴 Priority 0 - Blocking Issues (30-45 min)

1. Create `src/lib/validations/auth.ts` with Zod schemas
2. Fix import in `src/components/ui/toaster.tsx` (line 3)
3. Fix cookie API in `src/lib/supabase/middleware.ts`
4. Fix cookie API in `src/lib/supabase/server.ts`
5. Verify: `npm run type-check` → 0 errors
6. Verify: `npm run dev` → server starts
7. Verify: Browser loads without errors

**Reference**: `docs/LOOKER_REVIEW_CRITICAL.md` has exact code for all fixes.

---

## 🎨 MVP Design Implementation (Tasks 8-20)

**After bugs are fixed, build these in order:**

### Phase 1: Foundation - Types, Hooks & Utils (Tasks 8-12) - 2-3 hours

⚠️ **CRITICAL**: Read `docs/UNICORN_GRADE_CHECKLIST.md` before starting!

These MUST be built first before any components:

**8. Create TypeScript Types**
```
src/types/
  ├── card.ts          // Card, CardFace, ImageUris
  ├── deck.ts          // Deck, DeckCard, DeckFormat
  └── staging.ts       // StagedChange (EXACT structure from .cursorrules)
```

**9. Create Utility Functions**
```
src/lib/utils/
  ├── validation.ts    // validateDeck(deck, cards, format)
  ├── calculations.ts  // calculateManaCurve, avgCMC
  └── mana.ts          // parseManaSymbols
```

**10. Create Custom Hooks** 🦄 CRITICAL
```
src/hooks/
  ├── useStagingArea.ts  // Git-style staging (EXACT pattern from .cursorrules)
  ├── useCollection.ts   // Collection CRUD + real-time subscriptions
  ├── useDeck.ts         // Deck CRUD + real-time subscriptions
  ├── useDebounce.ts     // Debounce search (300ms)
  └── useCardSearch.ts   // Scryfall API with React Query cache
```

**11. Create Scryfall API Client**
```
src/lib/scryfall/
  ├── client.ts        // searchCards, getCard, batchFetch
  └── types.ts         // Scryfall API response types
```

**12. Build Reusable Layout Components**
```
src/components/layout/
  ├── PageHeader.tsx      // Title + actions bar
  ├── DashboardLayout.tsx // Dashboard grid
  └── Footer.tsx          // Site footer

src/components/ui/
  ├── StatCard.tsx        // Number + label card
  └── EmptyState.tsx      // Empty state with CTA
```

### Phase 2: Layout Components (Task 13) - 1 hour

**13. Enhance Landing Page**
```
src/app/page.tsx (enhance existing)
src/components/landing/
  ├── Hero.tsx            // Hero section
  ├── FeatureCard.tsx     // Feature showcase card
  └── FeatureShowcase.tsx // Feature grid
```

### Phase 3: Core Pages (Tasks 14-17) - 4-6 hours

**14. Create Dashboard Page** ⭐ Most Important
```
src/app/dashboard/
  └── page.tsx

src/components/dashboard/
  ├── StatsBar.tsx        // Stats cards row
  ├── RecentDecks.tsx     // Recent deck cards
  └── QuickActions.tsx    // Action buttons
```

**What it shows**:
- Welcome message with user email
- 3 stat cards (Decks, Cards, Formats)
- Recent decks (last 5)
- Quick action buttons
- Empty state for new users

---

**15. Create Deck List Page**
```
src/app/deck/page.tsx

src/components/deck/
  ├── DeckListHeader.tsx  // Title, filters, create
  ├── DeckCardGrid.tsx    // Grid of deck cards
  ├── DeckCard.tsx        // Deck preview card
  └── CreateDeckDialog.tsx // New deck modal
```

**What it shows**:
- Grid of user's decks
- Filter by format
- Create new deck button
- Empty state with CTA

---

**16. Create Collection Page**
```
src/app/collection/page.tsx

src/components/collection/
  ├── CollectionHeader.tsx
  ├── CardGrid.tsx
  ├── CollectionCardItem.tsx
  └── AddCardsDialog.tsx
```

**What it shows**:
- Grid of cards in collection
- Search and filter
- Add cards button
- Quantity badges
- Empty state

---

**17. Create Deck Builder Page** 🦄 The Main Event
```
src/app/deck/[id]/page.tsx

src/components/deck/builder/
  ├── DeckBuilderLayout.tsx    // 3-column layout
  ├── CardSearchSidebar.tsx    // Left: Search
  ├── DeckMainArea.tsx         // Center: Cards
  ├── DeckStatsSidebar.tsx     // Right: Stats
  └── CardInDeck.tsx           // Card item
```

**What it shows**:
- Left: Card search + results
- Center: Deck cards by category
- Right: Mana curve + stats
- Bottom: Staging area (next task)

### Phase 4: Killer Features (Tasks 18-20) - 3-4 hours

**18. Git-Style Staging Area** 🦄 THE FEATURE!
```
src/components/deck/staging/
  ├── StagingArea.tsx         // Main staging UI
  ├── StagedChangeItem.tsx    // Individual change
  ├── CommitDialog.tsx        // Commit modal
  └── CommitHistory.tsx       // History view
```

**What it does**:
- Shows staged changes (+ green, - red, ~ yellow)
- Commit message input
- Commit button → saves to history
- Clear staging button
- **This is what makes MANAFORGE unique!**

---

**19. Card Display Components**
```
src/components/cards/
  ├── MTGCard.tsx             // Card image display
  ├── CardInDeck.tsx          // Card in deck list
  ├── CardInCollection.tsx    // Card in collection
  ├── CardSearchResult.tsx    // Search result item
  └── ManaSymbol.tsx          // Mana symbol renderer
```

---

**20. Stats & Charts Components**
```
src/components/deck/stats/
  ├── ManaCurveChart.tsx      // Bar chart (Recharts)
  ├── ColorPieChart.tsx       // Color distribution
  └── DeckStats.tsx           // Stats panel
```

**Uses**: `recharts` library (already installed)

### Phase 5: Supporting Pages (Task 21) - 1-2 hours

**21. Settings Page**
```
src/app/settings/page.tsx

src/components/settings/
  ├── SettingsLayout.tsx      // Tabs navigation
  ├── ProfileSettings.tsx
  ├── PreferencesSettings.tsx
  └── AccountSettings.tsx
```

### Phase 6: Polish (Tasks 22-24) - 2-3 hours

**22. Mobile Responsive**
- Test all pages at 640px, 1024px, 1920px
- Deck builder → tabs on mobile (not 3 columns)
- Card grids → 1-2-4 columns responsive
- Navigation → hamburger menu if needed

**23. Animations**
```typescript
// Card hover
hover:scale-105 hover:shadow-xl transition-all duration-200

// Staging item appears
animate-slideIn

// Loading states
<Skeleton className="h-80 w-56" />
<Loader2 className="animate-spin" />

// Success toast
toast.success("Changes committed! 🎉")
```

**24. Empty States**
Every page needs friendly empty state:
- Dashboard: "Welcome! Create your first deck"
- Decks: "No decks yet. Let's create one!"
- Collection: "Add cards to start building"
- Deck Builder: "Search for cards to add"

---

## 📚 Design Reference

**Full design document**: `docs/MVP_DESIGN_PLAN.md`

This has:
- Complete page layouts (ASCII mockups)
- Color palette (MTG-themed)
- Typography system
- Component specifications
- Responsive breakpoints
- Animation details

---

## 🎯 Implementation Strategy

### Step 1: Read the Plan
Read `docs/MVP_DESIGN_PLAN.md` completely before coding.

### Step 2: Fix Bugs First
Complete tasks 1-7. Verify everything works.

### Step 3: Build Foundation
Tasks 8-9. Create reusable components first.

### Step 4: Core Pages
Tasks 10-13. These are the most impactful.

### Step 5: Killer Feature
Task 14. The Git-style staging area.

### Step 6: Support & Polish
Tasks 15-20. Make it beautiful.

---

## ✅ Definition of Done

### For Each Component
- [ ] TypeScript types for all props
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states (where applicable)
- [ ] Accessibility (keyboard nav, ARIA labels)
- [ ] No console errors or warnings

### For Each Page
- [ ] Matches design in MVP_DESIGN_PLAN.md
- [ ] Works on mobile (< 640px)
- [ ] Works on tablet (640-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] Has empty state for new users
- [ ] Shows loading state during data fetch
- [ ] Handles errors gracefully

---

## 🧪 Testing Checklist

After each task, test:

```bash
# 1. Type check
npm run type-check

# 2. Start server
npm run dev

# 3. Test in browser
# - Desktop: Full width
# - Tablet: Chrome DevTools 768px
# - Mobile: Chrome DevTools 375px

# 4. Check console
# - No errors
# - No warnings
```

---

## 🎨 Design Tokens to Use

### Colors (Already in Tailwind)
```typescript
// Backgrounds
bg-background      // White/dark base
bg-card            // Card background
bg-muted           // Subtle backgrounds

// Text
text-foreground    // Primary text
text-muted-foreground  // Secondary text

// Status
text-green-600     // Added (staging)
text-yellow-600    // Modified (staging)
text-red-600       // Removed (staging)

// Borders
border-border      // Default borders
```

### Spacing
- `p-4` or `p-6` for cards
- `gap-4` or `gap-6` for grids
- `mb-8` or `mb-12` for sections

### Typography
- `text-4xl font-bold` - H1
- `text-3xl font-bold` - H2
- `text-2xl font-semibold` - H3
- `text-lg font-semibold` - H4

---

## 📊 Progress Tracking

Update TODOs as you complete tasks:

```typescript
// Mark as in-progress when starting
status: "in_progress"

// Mark as complete when done
status: "completed"
```

---

## 🚀 Priority Order

If time is limited, focus on:

1. **Fix bugs** (tasks 1-7) - MANDATORY
2. **Dashboard** (task 10) - First impression
3. **Deck List** (task 11) - Core feature
4. **Deck Builder** (task 13) - Main feature
5. **Staging Area** (task 14) - Differentiator
6. Rest can wait for v2

---

## 💡 Tips

1. **Start Simple**: Build basic version, then add polish
2. **Test Early**: Check mobile after each component
3. **Reuse Components**: Don't duplicate code
4. **Use shadcn/ui**: Don't rebuild existing components
5. **Follow Cursor Rules**: Type safety, no `any`, explicit types
6. **Commit Often**: Small, focused commits

---

## 🆘 If You Get Stuck

1. Check `docs/MVP_DESIGN_PLAN.md` for design details
2. Check `docs/LOOKER_REVIEW_CRITICAL.md` for bug fixes
3. Check `.cursorrules` for coding standards
4. Use existing shadcn/ui components
5. Ask Planner for clarification

---

## 📈 Expected Outcome

After completing all tasks, users will:
- See a beautiful, modern landing page
- Have a functional dashboard after login
- Be able to view/create decks
- Be able to manage their collection
- Use the git-style staging system (unique feature!)
- Have a smooth, polished experience

---

**Let's build something amazing! 🦄**

**Start with Task 1. Fix the bugs. Then we design.**

