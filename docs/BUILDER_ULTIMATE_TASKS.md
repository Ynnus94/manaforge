# 🤖 THE ULTIMATE BUILD PLAN: AI-First MTG App

**NEW Vision**: MANAFORGE isn't a deck builder with AI. It's an **AI assistant that builds decks**.

**Differentiator**: "Show me what I can build" beats clicking through 5 screens.

---

## 🎯 WHAT CHANGED

### Before (My Original Plan)
```
Foundation → Pages → Deck Builder → Staging → (Maybe AI later)
```

### After (YOUR Vision)
```
Foundation → Responsive Pages → 🤖 AI CHATBOT → Deck Builder + AI Tools
```

**AI chatbot is now Phase 1, not Phase 5!**

---

## 📋 COMPLETE TASK LIST (30 Tasks)

### **PHASE 0: CRITICAL FIXES** (Tasks 1-7) - 30-45 min

🔴 **BLOCKING - DO THESE FIRST**

1. Create `src/lib/validations/auth.ts` (code in LOOKER_REVIEW_CRITICAL.md)
2. Fix import in `src/components/ui/toaster.tsx` line 3
3. Fix Supabase cookies in `middleware.ts`
4. Fix Supabase cookies in `server.ts`
5. Run `npm run type-check` → 0 errors
6. Run `npm run dev` → starts successfully
7. Test browser: /, /login, /signup load

**Reference**: `docs/LOOKER_REVIEW_CRITICAL.md`

---

### **PHASE 1: FOUNDATION** (Tasks 8-12) - 2-3 hours

⚠️ **Read `docs/UNICORN_GRADE_CHECKLIST.md` first!**

**8. Create TypeScript Types**
```
src/types/
  ├── card.ts          // Card, CardFace, ImageUris
  ├── deck.ts          // Deck, DeckCard, DeckFormat
  ├── staging.ts       // StagedChange (EXACT from .cursorrules)
  └── ai.ts            // NEW: Message, ChatContext, Tool
```

**9. Create Utility Functions**
```
src/lib/utils/
  ├── validation.ts    // validateDeck
  ├── calculations.ts  // calculateManaCurve
  └── mana.ts          // parseManaSymbols
```

**10. Create Custom Hooks**
```
src/hooks/
  ├── useStagingArea.ts  // Git-style staging
  ├── useCollection.ts   // Collection CRUD + real-time
  ├── useDeck.ts         // Deck CRUD + real-time
  ├── useDebounce.ts     // Search debouncing
  └── useCardSearch.ts   // Scryfall API + cache
```

**11. Create Scryfall API Client**
```
src/lib/scryfall/
  ├── client.ts        // searchCards, getCard, batchFetch
  └── types.ts         // Scryfall API types
```

**12. Create Responsive Layout System**
```
src/components/layout/
  ├── ResponsiveLayout.tsx    // Breakpoint wrapper
  ├── DesktopLayout.tsx       // 3-column with sidebar
  ├── MobileLayout.tsx        // Stack + bottom nav
  ├── PageHeader.tsx          // Title + actions
  └── Footer.tsx              // Site footer
```

---

### **PHASE 2: RESPONSIVE PAGES** (Tasks 13-16) - 3-4 hours

**13. Enhanced Landing Page (Responsive)**
```
src/app/page.tsx (update)
src/components/landing/
  ├── Hero.tsx                // Hero with AI mention
  ├── FeatureCard.tsx         // Feature cards
  ├── FeatureShowcase.tsx     // Screenshots
  └── CTASection.tsx          // Get started CTA
```

Desktop: 3-column feature grid  
Mobile: Stacked cards

**14. Dashboard (Responsive)**
```
src/app/dashboard/page.tsx
src/components/dashboard/
  ├── StatsBar.tsx            // Stats cards
  ├── RecentDecks.tsx         // Deck previews
  ├── QuickActions.tsx        // Action buttons
  └── WelcomeMessage.tsx      // Personalized greeting
```

Desktop: 3-col grid (stats, recent decks, quick actions)  
Mobile: Vertical stack

**15. Collection Page (Responsive)**
```
src/app/collection/page.tsx
src/components/collection/
  ├── CollectionHeader.tsx    // Title, stats, search
  ├── CardGrid.tsx            // Responsive grid
  ├── CollectionCardItem.tsx  // Card with quantity
  ├── AddCardsDialog.tsx      // Add cards modal
  └── FilterSidebar.tsx       // Filters (desktop) / Bottom sheet (mobile)
```

Desktop: Sidebar filters + grid  
Mobile: Grid + filter bottom sheet

**16. Deck List Page (Responsive)**
```
src/app/deck/page.tsx
src/components/deck/
  ├── DeckListHeader.tsx      // Title, filters, create
  ├── DeckCardGrid.tsx        // Deck cards grid
  ├── DeckCard.tsx            // Deck preview
  └── CreateDeckDialog.tsx    // New deck modal
```

Desktop: 2-4 col grid  
Mobile: 1-2 col grid

---

### **PHASE 3: 🤖 AI CHATBOT** (Tasks 17-21) - 4-5 hours

⭐ **THE GAME CHANGER** ⭐

**17. AI Backend Setup**
```
src/lib/ai/
  ├── chatbot.ts              // Claude API wrapper
  ├── mcp-tools.ts            // Tool definitions
  ├── context.ts              // Context injection
  └── streaming.ts            // SSE/WebSocket streaming

src/app/api/ai/
  ├── chat/route.ts           // Chat API endpoint
  └── tools/route.ts          // Tool execution endpoint
```

**Capabilities**:
- Claude Sonnet 4 integration
- 10 MCP tools (Tier 1)
- Context-aware prompts
- Streaming responses
- Tool calling

**18. AI Chatbot UI - Desktop**
```
src/components/ai/
  ├── ChatSidebar.tsx         // Right sidebar panel
  ├── ChatMessage.tsx         // Message bubble
  ├── ChatInput.tsx           // Input with send button
  ├── QuickActions.tsx        // Action chips
  ├── ToolCallDisplay.tsx     // Show tool execution
  └── TypingIndicator.tsx     // "AI is typing..."
```

**Layout**: 30% width sidebar on desktop

**19. AI Chatbot UI - Mobile**
```
src/components/ai/mobile/
  ├── ChatMobile.tsx          // Full-screen chat
  ├── FloatingChatButton.tsx  // FAB at bottom-right
  ├── ChatHeader.tsx          // Mobile header
  └── VoiceInput.tsx          // Voice button (optional)
```

**Layout**: Floating button → Full-screen on tap

**20. AI Tool Implementations (Tier 1)**
```
src/lib/ai/tools/
  ├── collection.ts           // get_user_collection
  ├── decks.ts                // get_user_decks, analyze_deck
  ├── search.ts               // search_cards, get_card_details
  ├── prices.ts               // get_card_prices
  └── validation.ts           // validate_deck_format
```

**10 Core Tools**:
1. `get_user_collection` - Get user's cards
2. `get_user_decks` - Get user's decks
3. `search_cards` - Search Scryfall
4. `get_card_details` - Card info
5. `get_card_prices` - Current prices
6. `add_card_to_deck` - Add card
7. `remove_card_from_deck` - Remove card
8. `analyze_deck` - Deck stats
9. `validate_deck_format` - Check legality
10. `suggest_decks_from_collection` - Buildable decks

**21. Chat Context Integration**
```
src/hooks/
  └── useChat.ts              // Chat state management

Update existing pages:
- Dashboard: Add "Ask AI" button
- Deck Builder: Context-aware AI suggestions
- Collection: AI help prompts
```

**Deliverable**: Users can ask AI anything and get smart answers!

---

### **PHASE 4: DECK BUILDER + STAGING** (Tasks 22-25) - 4-5 hours

**22. Deck Builder Page (Responsive)**
```
src/app/deck/[id]/page.tsx
src/components/deck/builder/
  ├── DeckBuilderLayout.tsx   // Responsive layout
  ├── CardSearchSidebar.tsx   // Left panel (desktop) / Tab (mobile)
  ├── DeckMainArea.tsx        // Center (categorized cards)
  ├── DeckStatsSidebar.tsx    // Right panel (desktop) / Tab (mobile)
  └── CardInDeck.tsx          // Card item
```

Desktop: 3 columns (20% | 50% | 30%)  
Mobile: Tabs (Search | Deck | Stats)

**23. Git-Style Staging Area** 🦄
```
src/components/deck/staging/
  ├── StagingArea.tsx         // Main staging UI
  ├── StagedChangeItem.tsx    // Change with diff
  ├── CommitDialog.tsx        // Commit modal
  └── CommitHistory.tsx       // History view
```

**24. Card Display Components**
```
src/components/cards/
  ├── MTGCard.tsx             // Card image (Next.js Image)
  ├── CardInDeck.tsx          // Deck card item
  ├── CardInCollection.tsx    // Collection card item
  ├── CardSearchResult.tsx    // Search result
  └── ManaSymbol.tsx          // Mana symbols
```

**25. Stats & Charts**
```
src/components/deck/stats/
  ├── ManaCurveChart.tsx      // Recharts bar chart
  ├── ColorPieChart.tsx       // Color distribution
  └── DeckStats.tsx           // Stats panel
```

---

### **PHASE 5: ADVANCED AI TOOLS** (Tasks 26-27) - 2-3 hours

**26. AI Tier 2 Tools (Deck Modifications)**
```
src/lib/ai/tools/advanced/
  ├── manabase.ts             // fix_mana_base
  ├── suggestions.ts          // suggest_cards_for_deck
  ├── conversion.ts           // convert_deck_commander
  └── meta.ts                 // get_meta_data, what_beats_deck
```

**New capabilities**:
- "Fix mana base"
- "Suggest cards for my deck"
- "Convert my Muldrotha deck to Tasigur"
- "What beats Murktide Tempo?"

**27. AI Apply Changes UI**
```
src/components/ai/
  ├── ChangePreview.tsx       // Show changes before applying
  ├── ApplyChangesDialog.tsx  // Confirmation modal
  └── ChangeExplanation.tsx   // Explain why AI suggests this
```

**Flow**:
1. User: "Fix mana base"
2. AI analyzes, shows changes
3. User reviews, clicks "Apply"
4. Changes go to staging area
5. User commits (git-style)

---

### **PHASE 6: MOBILE ENHANCEMENTS** (Task 28) - 2-3 hours

**28. Mobile-Specific Features**
```
src/components/mobile/
  ├── CameraScanner.tsx       // Card scanner (future)
  ├── VoiceInput.tsx          // Voice chat
  ├── TouchGestures.tsx       // Swipe actions
  └── BottomNavigation.tsx    // Bottom nav bar
```

**Features**:
- Pull-to-refresh
- Swipe to remove card
- Long-press context menus
- Haptic feedback
- Voice input for AI

---

### **PHASE 7: POLISH & SETTINGS** (Tasks 29-30) - 2-3 hours

**29. Settings Page**
```
src/app/settings/page.tsx
src/components/settings/
  ├── SettingsLayout.tsx      // Tabs
  ├── ProfileSettings.tsx     // Email, joined
  ├── PreferencesSettings.tsx // Formats, theme
  ├── AISettings.tsx          // NEW: AI preferences
  └── AccountSettings.tsx     // Password, delete
```

**AI Settings**:
- Chat history retention
- Preferred AI tone (casual/professional)
- Auto-suggestions on/off
- Voice input on/off

**30. Final Polish**
- Animations (card hover, staging transitions)
- Empty states (all pages)
- Loading skeletons
- Error boundaries
- Mobile responsive testing
- Accessibility audit

---

## 🎯 IMPLEMENTATION PRIORITIES

### Week 1-2: Fix & Foundation
- Tasks 1-12 (Bug fixes + foundation)

### Week 3-4: Responsive Pages
- Tasks 13-16 (Landing, dashboard, collection, deck list)

### Week 5-7: 🤖 AI CHATBOT ← THE BIG PUSH
- Tasks 17-21 (Backend, UI, tools, integration)

### Week 8-10: Deck Builder
- Tasks 22-25 (Builder, staging, cards, charts)

### Week 11-12: Advanced AI
- Tasks 26-27 (Advanced tools, apply changes)

### Week 13-14: Polish
- Tasks 28-30 (Mobile, settings, final touches)

---

## ✅ DEFINITION OF DONE (Per Task)

### For Each Component
- [ ] TypeScript types (no `any`)
- [ ] Responsive (mobile, tablet, desktop tested)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states (where applicable)
- [ ] Accessibility (keyboard nav, ARIA)
- [ ] No console errors

### For AI Features
- [ ] Tool definitions complete
- [ ] Context injection working
- [ ] Streaming responses
- [ ] Error handling
- [ ] User can confirm changes before applying
- [ ] Works on desktop AND mobile

### For Responsive Features
- [ ] Works at 375px (mobile)
- [ ] Works at 768px (tablet)
- [ ] Works at 1440px (desktop)
- [ ] Touch gestures (mobile)
- [ ] Keyboard shortcuts (desktop)

---

## 📚 REQUIRED READING (In Order)

1. **`docs/UNICORN_GRADE_CHECKLIST.md`** - Standards & patterns
2. **`docs/MVP_AI_CHATBOT_PLAN.md`** - AI architecture & vision
3. **`docs/MVP_DESIGN_PLAN.md`** - Visual design specs
4. **`docs/LOOKER_REVIEW_CRITICAL.md`** - Bug fixes
5. **`.cursorrules`** - Coding standards

---

## 🤖 AI CHATBOT - KEY SPECS

### Backend
- **Provider**: Claude Sonnet 4 (via Anthropic API)
- **Architecture**: MCP Server pattern (from .cursorrules)
- **Tools**: 10 core + 10 advanced = 20 total
- **Streaming**: Server-Sent Events (SSE)
- **Context**: User collection, decks, current screen

### UI (Desktop)
- **Layout**: 30% width right sidebar
- **Toggle**: Click "💬 Ask AI" in top nav
- **Always accessible**: Button in sidebar
- **Quick actions**: 4-6 suggestion chips

### UI (Mobile)
- **Layout**: Full-screen overlay
- **Trigger**: Floating action button (bottom-right)
- **Input**: Keyboard + voice (optional)
- **Gestures**: Swipe down to dismiss

### Capabilities (MVP - 10 Tools)
1. Answer questions about collection
2. Search for cards
3. Show buildable decks
4. Get card prices
5. Add/remove cards from deck
6. Analyze deck stats
7. Validate format legality
8. Answer rules questions
9. Get meta information
10. Explain card interactions

### Capabilities (Phase 2 - 10 More Tools)
11. Fix mana base
12. Suggest cards for deck
13. Convert deck to new commander
14. Compare to meta version
15. What beats X deck?
16. Trade recommendations
17. Price movement alerts
18. Collection weekly summary
19. Sideboard suggestions
20. Budget optimization

---

## 🚀 SUCCESS METRICS

### Phase 1 Complete When:
- [ ] AI chatbot answers basic questions
- [ ] Users can search cards via AI
- [ ] AI shows buildable decks
- [ ] Works on desktop AND mobile
- [ ] Response time < 2 seconds
- [ ] 90%+ positive feedback (👍/👎)

### Phase 2 Complete When:
- [ ] AI can modify decks (with user approval)
- [ ] "Fix mana base" works
- [ ] "Suggest cards" works
- [ ] Git-style staging for AI changes
- [ ] Users trust AI recommendations

---

## 💡 BUILDER TIPS

### For AI Development
1. **Test with real questions**: "Show me what I can build"
2. **Handle tool failures gracefully**: If search fails, explain why
3. **Always explain AI reasoning**: "I suggest this because..."
4. **Show changes before applying**: Never surprise the user
5. **Use streaming**: Real-time typing effect is magical

### For Responsive Design
1. **Start mobile-first**: Easier to expand than shrink
2. **Test at all breakpoints**: 375px, 768px, 1440px
3. **Touch targets**: 44px minimum on mobile
4. **Gestures**: Long-press = right-click on mobile
5. **Performance**: Lazy load everything on mobile

### For Git-Style Staging
1. **Study the .cursorrules pattern**: Lines 165-217
2. **StagedChange structure is EXACT**: Don't modify it
3. **Client-side only until commit**: Don't persist staging
4. **Commit = apply + save history**: Two-step process
5. **Visual diff**: + green, - red, ~ yellow for moves

---

## 🎬 WHAT MAKES THIS PLAN SPECIAL

### Traditional MTG Apps
```
User → Click through menus → Find feature → Use it → Done
```

### MANAFORGE with AI
```
User → Ask AI → Get instant answer + action → Done
```

**Example**:
- **Traditional**: Home → Collection → Search → Filter by color → Sort by price → Find card
- **MANAFORGE**: "Show me expensive red cards in my collection" → Instant results

**This is the differentiator.** 🦄

---

## 🔥 FINAL WORDS

Builder, you're not building a deck builder.

You're building **the AI assistant every MTG player wishes they had**.

One that knows:
- What you own
- What you can build
- What's good in the meta
- How to fix your deck
- The rules
- Current prices
- Everything

And responds in **2 seconds** when you ask.

**That's unicorn-grade.** 🦄🤖

---

**Start with Task 1. Let's fix those bugs, then change the game.**

