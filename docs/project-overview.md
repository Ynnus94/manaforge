# MTG Deck Builder - Project Overview

**The Future of Magic: The Gathering Deck Building**

**Version**: 0.1.0-alpha  
**Last Updated**: November 2025  
**Status**: Active Development - Week 1 MVP

---

## 🎯 Vision

Build THE definitive Magic: The Gathering deck builder that solves the pain of juggling multiple tools. No more switching between ChatGPT, Scryfall, EDHREC, and price sites. Everything you need, powered by AI that actually understands MTG and never hallucinates.

### The Problem We're Solving

Right now, brewing decks is painful:
- ❌ Constantly exporting CSVs to share your bulk with AI
- ❌ AI messing up decklists (adding duplicates in Commander, cutting cards you didn't ask for)
- ❌ Juggling ChatGPT + Scryfall + EDHREC + price sites across multiple tabs
- ❌ No Canadian price sources (Face to Face Games)
- ❌ Losing track of what cards you actually own
- ❌ No way to see what decks you could build with your collection

### Our Solution

**Trust Through Control** - Git-style validation keeps you in control
- Stage changes before they happen
- Review AI suggestions before applying
- Commit only what you approve
- Never lose cards to AI hallucinations

**Superbrew Intelligence** - AI that knows your collection
- "Here are the decks you can build with your bulk"
- "You're 85% there to build Najeela Warriors"
- Suggests missing pieces and budget alternatives
- Analyzes what your deck lacks

**All-In-One Experience** - Everything in one beautiful app
- Real-time collection tracking
- Card database with images
- Price tracking (including Canadian stores)
- Mana curve analysis
- Format validation
- Deck sharing

---

## 🚀 Core Features (The Superpowers)

### Phase 1: Foundation MVP (Weeks 1-2) 🏗️

#### 1. Collection Management
- **Manual card entry** with Scryfall autocomplete
- **CSV/plaintext import** for bulk collections
- **Real-time tracking** - your collection is always up-to-date
- **Git-style validation**:
  - Stage changes (added 3x Lightning Bolt, removed 2x Shock)
  - Review before committing
  - Full history of collection changes
  - Rollback if needed

#### 2. Deck Builder
- **Multi-format support**: Commander, Standard, Modern, Pioneer, Limited
- **Visual deck builder** with card images
- **Format validation** (deck size, singleton rules, legality)
- **Git-style deck management**:
  - Stage card additions/removals
  - Review changes before applying
  - Commit with messages ("Added more ramp")
  - Full deck history
- **Mana curve visualization**
- **Color pie breakdown**
- **Card categorization** (commander, mainboard, sideboard, maybeboard)

#### 3. Basic AI (Claude + MCP Server)
- **Chat interface**: Natural language deck building
- **MCP Server** provides AI with:
  - Scryfall card database (no hallucinations!)
  - Card legality data
  - Format rules
  - Basic price data
- **AI proposes changes as staged commits** that you review
- **Context-aware**: AI knows your collection
- **Simple queries**: "Build me a Gruul Commander deck with my bulk"

### Phase 2: Superbrew Intelligence (Weeks 3-4) ✨

#### 4. Superbrew Analysis (THE KILLER FEATURE)
- **"Decks you can build"**: Analyzes your bulk and shows buildable decks
- **"You're 85% there"**: Shows popular decks you're close to completing
- **Missing pieces**: Lists exactly what cards you need
- **Budget alternatives**: Cheaper options for expensive cards
- **Upgrade paths**: How to improve decks you already have

#### 5. Advanced AI Features
- **Deck analysis**:
  - Mana curve issues
  - Missing interaction/removal
  - Win condition analysis
  - Synergy suggestions
- **Budget optimization**: "Make this deck $50 cheaper"
- **Format conversion**: "Turn this into a Commander deck"
- **Meta awareness**: Knows what's popular/competitive

#### 6. Enhanced MCP Server
- **EDHREC integration**: Synergy recommendations, popular cards
- **Price data**: TCGPlayer, Face to Face Games (Canadian!)
- **Currency conversion**: USD ↔ CAD
- **Meta data**: Win rates, popularity, trends

#### 7. Public/Private Decks
- **Share decklists** with URL
- **Public deck database** for community
- **AI learns from public decks** (better superbrew suggestions)
- **Deck tags/categories**
- **Copy/remix** other people's decks

### Phase 3: Mobile & Advanced (Weeks 5-6) 🔥

#### 8. Mobile App (PWA or React Native)
- **Camera capture** like Manabox
  - Point camera at card → instant recognition
  - Detects card border + artwork
  - Matches to Scryfall database
  - Stores as JSON (no images!)
- **Mobile-optimized UI**
- **Offline mode** with service workers

#### 9. Power Features
- **Deck collections**: Organize multiple decks
- **Goldfish testing**: Simulate sample hands
- **Trade/want lists**: Track cards you need
- **Price tracking**: Alerts when cards drop in price
- **Export formats**: MTGO, Arena, text, image
- **Print-friendly view**: For paper deck lists

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) - SSR, great DX, Vercel deployment
- **Language**: TypeScript 5.3+ (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **State Management**: 
  - Zustand for client state (deck drafts, UI state)
  - React Query (TanStack Query) for server state
- **Forms**: React Hook Form + Zod validation

### Backend & Database
- **Platform**: Supabase
  - PostgreSQL database (relational, reliable)
  - Built-in authentication (email, Google, Discord)
  - Real-time subscriptions (live deck updates!)
  - Row Level Security (users only see their data)
  - Storage for file uploads (CSVs, exports)
  - Free tier → scales with growth

### APIs & Data
- **Card Data**: Scryfall REST API (free, comprehensive)
- **AI**: Claude API (Anthropic) - streaming responses
- **MCP Server**: Custom MTG MCP server for structured data access
  - Scryfall integration
  - EDHREC data
  - Price APIs (TCGPlayer, Face to Face)
  - Format rules & card legality
- **Prices**: 
  - TCGPlayer API (free, requires application)
  - Face to Face Games (scraping or partnership)
  - Currency conversion API

### Development
- **Package Manager**: pnpm (faster than npm)
- **Testing**: Vitest + React Testing Library + Playwright (E2E)
- **Linting**: ESLint + TypeScript ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Deployment**: Vercel (automatic deployments from GitHub)
- **Analytics**: Plausible (privacy-friendly)

---

## 📐 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────┐
│              Next.js 14 App (Frontend)              │
│  - Server Components (default)                      │
│  - Client Components (interactive UI)               │
│  - API Routes (/app/api/*)                          │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                  Supabase Backend                    │
│  - PostgreSQL (collections, decks, users)           │
│  - Auth (email, OAuth)                              │
│  - Real-time (live updates)                         │
│  - Storage (CSV uploads, exports)                   │
│  - Row Level Security                               │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│              External APIs & MCP Server             │
│  ┌─────────────────────────────────────────────┐   │
│  │  MTG MCP Server (Custom)                    │   │
│  │  - Scryfall card data                       │   │
│  │  - EDHREC synergies                         │   │
│  │  - Price aggregation                        │   │
│  │  - Format rules                             │   │
│  └─────────────────────────────────────────────┘   │
│                      ↓ ↑                            │
│  - Scryfall API (cards, images, legality)          │
│  - EDHREC API (synergies, popularity)              │
│  - TCGPlayer API (US prices)                       │
│  - Face to Face (CAD prices)                       │
└─────────────────────────────────────────────────────┘
                        ↓ ↑
┌─────────────────────────────────────────────────────┐
│                  Claude AI (Anthropic)              │
│  - Natural language queries                         │
│  - Deck building suggestions                        │
│  - Superbrew analysis                               │
│  - Uses MCP for structured data                     │
└─────────────────────────────────────────────────────┘
```

### Data Flow: Git-Style Deck Editing

```
1. User adds card → Creates staged change
   {action: "add", card: "Lightning Bolt", quantity: 1}

2. User reviews staged changes → UI shows diff
   + Lightning Bolt (1)
   - Shock (1)

3. User commits → Saves to Deck_History
   {
     deck_id, 
     changes: [...],
     message: "Swapped Shock for Lightning Bolt",
     committed_at: timestamp
   }

4. Deck updates → Triggers real-time update
   - Supabase broadcast to all clients
   - Mana curve recalculates
   - Validation re-runs
```

### Data Flow: AI Deck Building

```
1. User: "Build me a Gruul Commander deck"
   ↓
2. Backend fetches user's collection from Supabase
   ↓
3. Claude API call WITH MCP server context
   - MCP provides: card database, user collection, format rules
   - Claude generates deck list (no hallucinations!)
   ↓
4. AI returns staged changes (not applied yet!)
   {
     commander: "Xenagos, God of Revels",
     mainboard: [cards...],
     reasoning: "..."
   }
   ↓
5. User reviews staged deck → can edit/approve/reject
   ↓
6. User commits → Deck saved with history
```

### Database Schema

```sql
-- Users (handled by Supabase Auth)
users (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamp
)

-- Collections (user's card inventory)
collections (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  name text DEFAULT 'My Collection',
  created_at timestamp,
  updated_at timestamp
)

-- Collection History (git-style tracking)
collection_history (
  id uuid PRIMARY KEY,
  collection_id uuid REFERENCES collections,
  changes jsonb, -- {action, card_id, quantity}
  message text,
  committed_at timestamp,
  committed_by uuid REFERENCES users
)

-- Collection Cards (many-to-many)
collection_cards (
  id uuid PRIMARY KEY,
  collection_id uuid REFERENCES collections,
  scryfall_id text NOT NULL, -- from Scryfall
  quantity integer DEFAULT 1,
  foil boolean DEFAULT false,
  condition text, -- NM, LP, MP, HP, DMG
  added_at timestamp,
  updated_at timestamp,
  UNIQUE(collection_id, scryfall_id, foil)
)

-- Decks
decks (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  name text NOT NULL,
  format text NOT NULL, -- commander, standard, modern, etc.
  is_public boolean DEFAULT false,
  description text,
  primer_notes text,
  tags text[],
  created_at timestamp,
  updated_at timestamp
)

-- Deck History (git-style commits)
deck_history (
  id uuid PRIMARY KEY,
  deck_id uuid REFERENCES decks,
  changes jsonb, -- {action, card_id, quantity, category}
  message text,
  committed_at timestamp,
  committed_by uuid REFERENCES users
)

-- Deck Cards
deck_cards (
  id uuid PRIMARY KEY,
  deck_id uuid REFERENCES decks,
  scryfall_id text NOT NULL,
  quantity integer DEFAULT 1,
  category text, -- commander, mainboard, sideboard, maybeboard
  added_at timestamp,
  UNIQUE(deck_id, scryfall_id, category)
)

-- Superbrew Cache (AI analysis results)
superbrew_analysis (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  collection_id uuid REFERENCES collections,
  analysis jsonb, -- buildable decks, missing pieces
  generated_at timestamp,
  expires_at timestamp
)
```

---

## 🎨 Design Principles

### User Experience Philosophy

1. **Trust Through Transparency**
   - Always show what's about to change
   - Never apply changes without review
   - Full history of all actions
   - Easy rollback

2. **Speed & Responsiveness**
   - Every interaction feels instant (<300ms)
   - Optimistic UI updates
   - Real-time collaboration
   - Smooth 60fps animations

3. **Progressive Disclosure**
   - Simple by default
   - Complexity available when needed
   - Guided workflows for beginners
   - Power features for experts

4. **Delight in Details**
   - Buttery smooth transitions
   - Satisfying micro-interactions
   - Beautiful card displays
   - Thoughtful empty states

### Visual Design (Unicorn Grade!)

- **Better than Moxfield, Archidekt, Manabox**
- Modern, clean, purposeful
- Card-first design (cards are the hero)
- Data visualization that tells stories
- Mobile-first, responsive everywhere
- Dark mode by default (light mode optional)

### Code Quality Standards

- **TypeScript strict mode**: Zero `any` types
- **Test coverage**: >80% for critical paths
- **Performance**: Lighthouse score >90
- **Accessibility**: WCAG AA minimum
- **Component size**: Max 200 lines
- **Bundle size**: <250kb initial load

---

## 🔑 Key Technical Decisions

### Why Supabase?
- **Real-time subscriptions**: Perfect for live deck updates
- **Built-in auth**: No rolling our own security
- **PostgreSQL**: Powerful queries, relationships, JSON support
- **Row Level Security**: Users can only see their own data
- **Free tier**: Start free, pay as you grow
- **Great DX**: TypeScript client, excellent docs

### Why MCP Server for MTG?
- **Eliminates hallucinations**: AI gets facts from source of truth
- **Structured data**: Card names, prices, legality are always accurate
- **Cacheable**: Fast repeated queries
- **Extensible**: Easy to add EDHREC, prices, meta data
- **Better than raw prompts**: AI doesn't need to memorize 25,000 cards

### Why Git-Style Validation?
- **Trust**: Users control what changes
- **Transparency**: See exactly what will happen
- **Safety net**: Can always undo
- **Better AI**: AI can be aggressive knowing user reviews
- **History**: Understand how decks evolved

### Why shadcn/ui?
- **Copy-paste components**: Own the code, customize freely
- **Radix primitives**: Accessible by default
- **Tailwind-based**: Consistent design system
- **Trend-setting**: Modern, beautiful out of the box

---

## 💰 Monetization

### Free Tier
- 2 decks maximum
- 1 collection
- 10 AI queries per month
- Public deck viewing
- Basic superbrew (1 analysis per week)

### Pro Tier ($6.99/month)
- Unlimited decks
- Unlimited collections
- Unlimited AI queries
- Daily superbrew analysis
- Price tracking & alerts
- Priority support
- Early access to new features

**Pricing covers Claude API costs + hosting + sustainable development**

---

## 📊 Success Metrics

### Week 1 Goals (MVP)
- ✅ Can add cards to collection manually
- ✅ Can import collection from CSV
- ✅ Can build a 60-card deck
- ✅ Git-style validation works (stage → review → commit)
- ✅ Mana curve displays correctly
- ✅ Deck persists between sessions

### User Experience KPIs
- Card search results: <300ms
- Add card action: Feels instant
- Page transitions: <100ms
- Lighthouse score: >90
- No visual jank: 60fps animations

### Code Quality KPIs
- TypeScript strict: ✅ Zero errors
- Test coverage: >80%
- Bundle size: <250kb initial
- Accessibility: WCAG AA
- Zero ESLint errors

---

## 🚧 Known Limitations (MVP)

- No user accounts yet (localStorage for testing)
- No superbrew (Phase 2)
- No camera capture (Phase 3)
- MCP server has basic features only
- Limited to Scryfall for prices initially
- Single deck at a time
- No deck sharing yet

---

## 🗺️ Roadmap Beyond MVP

### Phase 4: Social Features
- Comments on decks
- Like/bookmark decks
- Follow deck creators
- Activity feed

### Phase 5: Competitive Tools
- Meta analysis
- Matchup tracker
- Tournament preparation
- Sideboard guide generator

### Phase 6: Marketplace
- Trade board
- Want list matching
- Buy/sell integration
- Price history charts

---

## 🤝 Competition Analysis

| Feature | Us | Moxfield | Archidekt | Manabox |
|---------|----|----|-----------|---------|
| AI Deck Building | ✅ | ❌ | ❌ | ❌ |
| Superbrew Analysis | ✅ | ❌ | ❌ | ❌ |
| Git-Style Validation | ✅ | ❌ | ❌ | ❌ |
| Real-time Updates | ✅ | ✅ | ✅ | ❌ |
| Collection Tracking | ✅ | ✅ | ✅ | ✅ |
| Canadian Prices | ✅ | ❌ | ❌ | ❌ |
| Camera Capture | 🔜 | ❌ | ❌ | ✅ |
| Visual Design | 🦄 | 😐 | 😐 | 😊 |

**Our moat**: AI + Superbrew + Git-validation + Canadian support

---

## 📚 Resources

### MTG Data & Rules
- [Scryfall API](https://scryfall.com/docs/api)
- [EDHREC API](https://edhrec.com/api/)
- [MTG Comprehensive Rules](https://magic.wizards.com/en/rules)
- [Format Legality](https://magic.wizards.com/en/formats)

### Development
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Claude API](https://docs.anthropic.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Model Context Protocol](https://modelcontextprotocol.io)

### Inspiration
- **Learn from**: Moxfield (features), Archidekt (social), Manabox (camera)
- **Surpass**: All of them in UX, AI, and visual design

---

**Last Updated**: Week 1, Day 1  
**Next Review**: End of Week 1 (after MVP features complete)  

**Remember**: We're not building another deck builder. We're building THE FUTURE of deck building. Unicorn grade or nothing. 🦄