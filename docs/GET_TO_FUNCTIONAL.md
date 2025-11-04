# 🎯 GET TO FUNCTIONAL - Wire Everything That's Broken

**Date**: November 4, 2025  
**Status**: 35% Functional → Need 100%  
**Reality**: Beautiful UI, broken buttons  
**Goal**: MAKE IT WORK

---

## 🔴 THE PROBLEM (From Looker's Honest Audit)

**We have**:
- ✅ Beautiful UI components
- ✅ Perfect TypeScript
- ✅ Great architecture
- ✅ All hooks implemented

**We DON'T have**:
- ❌ onClick handlers on 80% of buttons
- ❌ Working CRUD operations
- ❌ Functional user flows
- ❌ Testable features

**Translation**: It's a mockup, not an app.

---

## 🎯 SINGLE GOAL: WIRE EVERY BUTTON

Stop planning. Start wiring.

---

## 📋 PHASE 2: WIRE EVERYTHING (88 hours / 11 days)

### WEEK 1: Collection CRUD (12 hours)

**Task 2.6: Wire Collection Buttons**
- File: `src/components/collection/CollectionCardItem.tsx`
- Wire: Plus → `useCollection.updateQuantity(+1)`
- Wire: Minus → `useCollection.updateQuantity(-1)`
- Wire: Trash → `useCollection.removeCard()` + confirmation
- **Test**: Click every button, verify it works

**Task 2.7: Wire Collection Header**
- File: `src/components/collection/CollectionHeader.tsx`
- Wire: "Add Cards" → Open dialog (create AddCardDialog.tsx)
- Wire: "Filters" → Open filter panel (create FilterPanel.tsx)
- Wire: Search → Actually filter the displayed cards
- **Test**: Add card, search, filter

**Task 2.8: Wire Empty State**
- File: `src/components/collection/CollectionEmptyState.tsx`
- Wire: "Add Cards Manually" → Same dialog as above
- Wire: "Import from CSV" → File upload (simple version)
- Wire: "Scan Cards" → Show "Coming soon" toast for now
- **Test**: Empty collection → click buttons → cards appear

**Acceptance**: Can add, edit quantity, delete, search, filter cards

---

### WEEK 2: Deck Management (12 hours)

**Task 2.9: Wire Deck List Header**
- File: `src/components/deck/DeckListHeader.tsx`
- Wire: "New Deck" → Create deck dialog (CreateDeckDialog.tsx)
- Wire: "Filter" → Filter by format dropdown
- **Test**: Create new deck

**Task 2.10: Wire Deck Card Menu**
- File: `src/components/deck/DeckCard.tsx`
- Wire: Edit → Navigate to `/deck/[id]`
- Wire: Duplicate → Copy deck with confirmation
- Wire: Delete → Delete with confirmation
- Fix: Calculate real card count (remove TODO)
- **Test**: Edit, duplicate, delete deck

**Task 2.11: Wire Deck Empty State**
- File: `src/components/deck/DeckEmptyState.tsx`
- Wire: "Create Deck" → Same dialog as 2.9
- **Test**: No decks → create → appears

**Acceptance**: Can create, view, edit, duplicate, delete decks

---

### WEEK 3: Complete Deck Builder (12 hours)

**Task 2.12: Add Edit Quantity in Deck**
- File: `src/components/deck/builder/DeckListPanel.tsx`
- Add: Plus/minus buttons next to each card
- Wire: To staging system (stage change)
- **Test**: Change quantity → commit → persists

**Task 2.13: Add Remove Card Button**
- Same file as above
- Add: Trash button next to each card
- Wire: Stage removal → commit → card gone
- **Test**: Remove card → commit → gone

**Task 2.14: Add Category Movement**
- Add: Dropdown or menu to move between categories
- Wire: Stage move → commit → card in new category
- **Test**: Move card mainboard→sideboard → works

**Task 2.15: Improve Staging Area**
- Add: Clear indicator of what changed
- Add: Undo button (discard single change)
- Add: Clear all button
- **Test**: Stage 5 changes → undo 2 → commit 3

**Acceptance**: Full deck editing capability

---

### WEEK 4: Settings & Polish (12 hours)

**Task 2.16: Build Settings Page**
- File: `src/components/settings/SettingsContent.tsx`
- Build: Profile section (display email, joined date)
- Build: Preferences (default format, theme)
- Wire: Save button → Update `user_preferences` table
- **Test**: Change theme → save → persists

**Task 2.17: Add Confirmation Dialogs**
- Create: `ConfirmDialog.tsx` component
- Use: Before delete card, delete deck, discard changes
- **Test**: Try to delete → confirm → deleted

**Task 2.18: Add Loading States**
- Add: Spinner while fetching cards
- Add: Skeleton while loading decks
- Add: "Saving..." on commit
- **Test**: Slow connection → see loading

**Task 2.19: Add Error Handling**
- Add: Try-catch on all async operations
- Add: Toast on error with retry button
- **Test**: Disconnect network → see error → retry

**Acceptance**: Settings work, user feedback everywhere

---

### WEEK 5-6: AI Tool Handlers (40 hours)

**Task 2.20-2.30: Implement MCP Tools**
- Already detailed in `PHASE2_TASK_LIST.md` (Tasks 2.13-2.22)
- All 10 tool handlers
- Wire to AI API

**Acceptance**: AI chatbot is functional

---

## 🧪 TESTING CHECKLIST (Do This Daily!)

### Collection:
- [ ] Click + on a card → quantity increases
- [ ] Click - on a card → quantity decreases
- [ ] Click trash → confirmation → card removed
- [ ] Click "Add Cards" → dialog opens → add card → appears
- [ ] Type in search → cards filter
- [ ] Click filters → panel opens → filter works

### Decks:
- [ ] Click "New Deck" → dialog → create → appears
- [ ] Click deck → opens deck builder
- [ ] Click edit menu → navigate to builder
- [ ] Click duplicate → confirmation → deck copied
- [ ] Click delete → confirmation → deck gone
- [ ] Card count shows real number

### Deck Builder:
- [ ] Search card → click + → stages
- [ ] Click + on staged card → quantity increases
- [ ] Click - on staged card → quantity decreases
- [ ] Click trash → removes from staging
- [ ] Enter message → commit → saves
- [ ] Refresh page → changes persisted

### Settings:
- [ ] Change theme → save → theme changes
- [ ] Change default format → save → persists
- [ ] Refresh page → settings still applied

---

## ✅ DEFINITION OF DONE

**Phase 2 Complete When**:

1. **Every button does something** ← The main criteria
2. **Every CRUD operation works**
3. **Every user flow is completable**
4. **No TODO comments in UI code**
5. **Can test all features manually**

**Then we can say**: "The app is functional" ✅

---

## 📊 SIMPLE PROGRESS TRACKER

```
Week 1: Collection  [ ] [ ] [ ]  0/3 tasks
Week 2: Decks       [ ] [ ] [ ]  0/3 tasks
Week 3: Builder     [ ] [ ] [ ] [ ]  0/4 tasks
Week 4: Polish      [ ] [ ] [ ] [ ]  0/4 tasks
Week 5-6: AI        [ ] [ ] ... [ ]  0/11 tasks
```

**Update this daily.**

---

## 🚀 START HERE

### Builder: Tomorrow Morning

1. **Open** `src/components/collection/CollectionCardItem.tsx`
2. **Find** the Plus button (line 77-79)
3. **Add** onClick handler
4. **Wire** to `useCollection` hook
5. **Test** by clicking it
6. **Repeat** for Minus and Trash

**That's it. Just wire buttons.**

---

## 💡 SIMPLE RULES

1. **One button at a time**
2. **Test immediately after wiring**
3. **Don't move on until it works**
4. **Track what you complete**
5. **Report blockers immediately**

---

## ❌ STOP DOING

- ❌ Writing more documentation
- ❌ Creating more types
- ❌ Refactoring code
- ❌ Adding new features
- ❌ Optimizing architecture

## ✅ START DOING

- ✅ Wiring onClick handlers
- ✅ Making buttons work
- ✅ Testing features manually
- ✅ Completing user flows
- ✅ Fixing broken interactions

---

## 🎯 SUCCESS = BUTTONS WORK

Not:
- "Code is clean" ❌
- "TypeScript compiles" ❌
- "Architecture is good" ❌

But:
- "I clicked every button and it worked" ✅

---

**Status**: Ready to wire  
**Goal**: 100% functional  
**Method**: Wire one button at a time  
**Test**: Click it and see if it works

**LET'S BUILD A FUNCTIONAL APP.**

