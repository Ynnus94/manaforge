# 🎨 MVP Design Plan - MANAFORGE

**Date**: November 4, 2025  
**Complexity**: Large  
**Estimated Time**: 8-12 hours  
**Status**: 🎯 Ready for Implementation

---

## 🎯 Design Vision

Create a **modern, intuitive, unicorn-grade** MTG Deck Builder that feels:
- **Fast** - Snappy interactions, instant feedback
- **Beautiful** - Clean cards, smooth animations, thoughtful spacing
- **Trustworthy** - Git-style validation shows users are in control
- **Magical** - Delightful micro-interactions, smooth transitions

---

## 🏗️ MVP Page Structure

### Page Hierarchy
```
🏠 Landing Page (/)
   ├─ Not Logged In: Hero + Features + CTA
   └─ Logged In: Dashboard

📚 Dashboard (/dashboard)
   ├─ Quick Stats (Decks count, Cards count)
   ├─ Recent Decks (last 5)
   ├─ Quick Actions (New Deck, View Collection)
   └─ Getting Started (if empty state)

📦 Collections (/collection)
   ├─ Collection List (if user has multiple)
   ├─ Collection View (cards grid)
   ├─ Add Cards Interface
   └─ Empty State (first time user)

🃏 Decks List (/deck)
   ├─ Deck Cards (grid of decks)
   ├─ Filter by Format
   ├─ Create New Deck
   └─ Empty State

🎴 Deck Builder (/deck/[id])
   ├─ Deck Header (name, format, commander)
   ├─ Card Search Sidebar
   ├─ Main Deck Area (categorized)
   ├─ Mana Curve Chart
   ├─ Statistics Panel
   └─ Git-Style Staging Area (THE FEATURE!)

⚙️ Settings (/settings)
   ├─ Profile
   ├─ Preferences
   └─ Account
```

---

## 📐 Design System

### Color Palette (MTG-Themed)

```css
/* Primary - Magic Blue */
--primary: 220 70% 50%;        /* #2563eb - Sapphire */
--primary-foreground: 0 0% 100%;

/* Mana Colors (for card types) */
--mana-white: 45 100% 95%;     /* Plains */
--mana-blue: 210 100% 60%;     /* Island */
--mana-black: 280 10% 15%;     /* Swamp */
--mana-red: 0 85% 55%;         /* Mountain */
--mana-green: 120 60% 40%;     /* Forest */
--mana-colorless: 0 0% 50%;    /* Artifact */
--mana-multicolor: 50 100% 50%; /* Gold */

/* Status Colors (Git-style) */
--staged: 142 76% 36%;         /* Green - Added */
--modified: 48 96% 53%;        /* Yellow - Modified */
--removed: 0 84% 60%;          /* Red - Removed */

/* Backgrounds */
--background: 0 0% 100%;       /* White in light mode */
--card-bg: 0 0% 98%;           /* Subtle gray for cards */
--sidebar-bg: 220 20% 96%;     /* Light blue-gray */

/* Borders */
--border: 220 13% 91%;
--border-hover: 220 13% 80%;
```

### Typography

```css
/* Headings - Bold, Clear */
font-family: 'Inter', system-ui, sans-serif;

h1: 2.5rem (40px) - font-bold
h2: 2rem (32px) - font-bold
h3: 1.5rem (24px) - font-semibold
h4: 1.25rem (20px) - font-semibold
body: 1rem (16px) - font-normal
small: 0.875rem (14px) - font-normal

/* Card Names - Distinctive */
.card-name {
  font-family: 'Beleren', serif; /* MTG font fallback to serif */
  font-weight: 600;
}
```

### Spacing System (Tailwind)
- `p-2` (0.5rem / 8px) - Tight spacing
- `p-4` (1rem / 16px) - Default spacing
- `p-6` (1.5rem / 24px) - Comfortable spacing
- `p-8` (2rem / 32px) - Generous spacing
- `p-12` (3rem / 48px) - Section spacing

### Border Radius
- `rounded-sm` (2px) - Badges
- `rounded-md` (6px) - Buttons, inputs
- `rounded-lg` (8px) - Cards, panels
- `rounded-xl` (12px) - Feature cards

---

## 🎨 Page Designs

### 1. Landing Page (/) - Enhanced

**Layout**: Hero + Features Grid + CTA

```
┌─────────────────────────────────────────────────┐
│  [Navbar - Logo | Login | Sign Up]             │
├─────────────────────────────────────────────────┤
│                                                 │
│        🃏 MANAFORGE                            │
│        The MTG Deck Builder with Superpowers   │
│                                                 │
│        [Get Started Free →]                    │
│        [View Demo]                             │
│                                                 │
├─────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ 🎯 Git   │  │ 🧠 AI    │  │ 🚀 Fast  │    │
│  │ Style    │  │ Powered  │  │ & Real-  │    │
│  │ Commits  │  │ Brewing  │  │ time     │    │
│  └──────────┘  └──────────┘  └──────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │  Feature Showcase with Screenshots      │  │
│  │  1. Git-style validation                │  │
│  │  2. Superbrew analysis                  │  │
│  │  3. Collection management               │  │
│  └─────────────────────────────────────────┘  │
│                                                 │
│  [Ready to build better decks? Sign Up →]     │
│                                                 │
│  Footer: About | Docs | GitHub                │
└─────────────────────────────────────────────────┘
```

**Components Needed**:
- `Hero.tsx` - Large heading, subtitle, CTAs
- `FeatureCard.tsx` - Icon, title, description
- `FeatureShowcase.tsx` - Screenshots/mockups of key features
- `Footer.tsx` - Links, copyright

---

### 2. Dashboard (/dashboard) - NEW PAGE

**Layout**: Stats Bar + Recent Decks + Quick Actions

```
┌─────────────────────────────────────────────────┐
│  [Navbar with User Menu]                       │
├─────────────────────────────────────────────────┤
│  Welcome back, player@email.com! ⚡            │
├─────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │ 5 Decks │  │ 342 Cards│  │ 3 Format│        │
│  └─────────┘  └─────────┘  └─────────┘        │
├─────────────────────────────────────────────────┤
│  Recent Decks                    [View All →]  │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Atraxa Superfriends│ │ Krenko Goblins  │   │
│  │ Commander • 100    │  │ Commander • 100 │   │
│  │ Updated 2h ago    │  │ Updated 1d ago  │   │
│  └──────────────────┘  └──────────────────┘   │
├─────────────────────────────────────────────────┤
│  Quick Actions                                  │
│  [➕ New Deck]  [📚 View Collection]          │
│  [🔍 Search Cards]  [🎯 Browse Public Decks]  │
└─────────────────────────────────────────────────┘
```

**Empty State** (No decks yet):
```
┌─────────────────────────────────────────────────┐
│  🎉 Welcome to MANAFORGE!                      │
│                                                 │
│  Let's get you started:                        │
│  1. ✅ Create your account                     │
│  2. 📦 Add cards to your collection (optional) │
│  3. 🃏 Build your first deck                   │
│                                                 │
│  [🚀 Create Your First Deck]                   │
│  [📚 Import Collection from CSV]               │
└─────────────────────────────────────────────────┘
```

**Components Needed**:
- `StatCard.tsx` - Number + label
- `DeckCard.tsx` - Deck preview with stats
- `QuickActions.tsx` - Action button grid
- `EmptyState.tsx` - Reusable empty state

---

### 3. Collections Page (/collection)

**Layout**: Header + Cards Grid + Add Button

```
┌─────────────────────────────────────────────────┐
│  [Navbar]                                       │
├─────────────────────────────────────────────────┤
│  📚 My Collection                [➕ Add Cards] │
│  342 unique cards • 1,247 total                │
│                                                 │
│  [🔍 Search cards...] [Filter ▾] [Sort ▾]     │
├─────────────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │ Card│ │ Card│ │ Card│ │ Card│ │ Card│     │
│  │Image│ │Image│ │Image│ │Image│ │Image│     │
│  │ x4  │ │ x1  │ │ x2  │ │ x1  │ │ x3  │     │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐     │
│  │ Card│ │ Card│ │ Card│ │ Card│ │ Card│     │
│  │Image│ │Image│ │Image│ │Image│ │Image│     │
│  │ x1  │ │ x2  │ │ x1  │ │ x4  │ │ x1  │     │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘     │
│                                                 │
│  [Load More...]                                │
└─────────────────────────────────────────────────┘
```

**Card Hover State**:
```
┌─────────┐
│ [Image] │ ← Larger preview on hover
│         │
│ Card    │
│ Name    │
│ x4 qty  │ ← Badge
│         │
│ [Quick  │ ← Actions on hover
│  Remove]│
└─────────┘
```

**Components Needed**:
- `CollectionHeader.tsx` - Title, stats, actions
- `CardGrid.tsx` - Responsive grid of cards
- `CollectionCardItem.tsx` - Card with quantity badge
- `AddCardsDialog.tsx` - Modal for adding cards
- `CardSearchInput.tsx` - Autocomplete search

---

### 4. Decks List (/deck)

**Layout**: Grid of Deck Cards + Create Button

```
┌─────────────────────────────────────────────────┐
│  [Navbar]                                       │
├─────────────────────────────────────────────────┤
│  🃏 My Decks                    [➕ New Deck]   │
│  5 decks                                        │
│                                                 │
│  [All Formats ▾] [Sort: Recent ▾]             │
├─────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Atraxa Super... │  │ Krenko Goblins  │     │
│  │ ━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━   │     │
│  │ WUBG           │  │ R               │     │
│  │ Commander • 100│  │ Commander • 100 │     │
│  │ Updated 2h ago │  │ Updated 1d ago  │     │
│  │ [Edit] [Clone] │  │ [Edit] [Clone]  │     │
│  └─────────────────┘  └─────────────────┘     │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ Mono-Red Burn  │  │ Simic Ramp      │     │
│  │ ━━━━━━━━━━━━   │  │ ━━━━━━━━━━━━   │     │
│  │ R              │  │ UG              │     │
│  │ Modern • 60    │  │ Standard • 60   │     │
│  │ Updated 3d ago │  │ Updated 5d ago  │     │
│  │ [Edit] [Clone] │  │ [Edit] [Clone]  │     │
│  └─────────────────┘  └─────────────────┘     │
└─────────────────────────────────────────────────┘
```

**Components Needed**:
- `DeckListHeader.tsx` - Title, filters, create button
- `DeckCardGrid.tsx` - Grid layout
- `DeckCard.tsx` - Preview with mana colors, format, stats
- `CreateDeckDialog.tsx` - Modal for new deck

---

### 5. Deck Builder (/deck/[id]) - THE CORE FEATURE

**Layout**: 3-Column Layout (Search | Main | Stats)

```
┌───────────────────────────────────────────────────────────┐
│  [Navbar]                                                 │
├─────────────┬─────────────────────────┬──────────────────┤
│ 🔍 Search   │  Atraxa Superfriends    │  📊 Stats        │
│             │  Commander • WUBG       │                  │
│ [Search box]│  ━━━━━━━━━━━━━━━━━     │  ┌────────────┐ │
│             │                          │  │ Mana Curve │ │
│ Results:    │  Commander (1)          │  │  ▂▄█▅▃▂▁   │ │
│ ┌─────────┐│  ┌─────┐                 │  └────────────┘ │
│ │Lightning││  │Atraxa│                 │                  │
│ │Bolt     ││  │x1    │                 │  CMC Avg: 3.2   │
│ │[+]      ││  └─────┘                 │  Lands: 36      │
│ └─────────┘│                          │  Creatures: 28  │
│ ┌─────────┐│  Creatures (28)         │  Spells: 35     │
│ │Counterspel  │[+] [Filter] [Sort]   │                  │
│ │[+]      ││                          │  Colors:        │
│ └─────────┘│  ┌─────┐┌─────┐┌─────┐ │  ⚪ 12 ━━━━━   │
│             │  │Card ││Card ││Card │ │  🔵 23 ━━━━━━ │
│             │  │x1   ││x2   ││x1   │ │  ⚫ 18 ━━━━━   │
│ [View       │  └─────┘└─────┘└─────┘ │  🔴 8  ━━━    │
│  Collection]│                          │  🟢 15 ━━━━   │
│             │  Instants/Sorceries(35) │                  │
├─────────────┴─────────────────────────┴──────────────────┤
│  🎯 Staging Area                              [Commit]   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ + Lightning Bolt (x1) → Instants                   │ │
│  │ + Counterspell (x2) → Instants                     │ │
│  │ - Mana Drain (x1)                                  │ │
│  │ ~ Atraxa (moved from Mainboard → Commander)        │ │
│  └────────────────────────────────────────────────────┘ │
│  [💬 Commit message: "Added more removal"]            │ │
│  [Commit Changes] [Clear Staging]                      │ │
└───────────────────────────────────────────────────────────┘
```

**Components Needed**:
- `DeckBuilderLayout.tsx` - 3-column responsive layout
- `CardSearchSidebar.tsx` - Search + results
- `DeckMainArea.tsx` - Categorized card lists
- `DeckStatsSidebar.tsx` - Mana curve, stats
- `StagingArea.tsx` - Git-style staging (THE FEATURE!)
- `ManaCurveChart.tsx` - Recharts bar chart
- `CardInDeck.tsx` - Card item with quantity, remove
- `CommitDialog.tsx` - Commit message + review changes

---

### 6. Settings Page (/settings)

**Layout**: Tabs for Profile, Preferences, Account

```
┌─────────────────────────────────────────────────┐
│  [Navbar]                                       │
├─────────────────────────────────────────────────┤
│  ⚙️ Settings                                    │
│  [Profile] [Preferences] [Account]             │
├─────────────────────────────────────────────────┤
│  Profile                                        │
│                                                 │
│  Email: player@email.com                       │
│  Member since: Nov 4, 2025                     │
│                                                 │
│  Preferences                                    │
│  Default Format: [Commander ▾]                 │
│  Theme: [System ▾]                             │
│  □ Show card prices                            │
│  □ Enable notifications                        │
│                                                 │
│  [Save Changes]                                │
│                                                 │
│  Account                                        │
│  [Change Password]                             │
│  [Delete Account]                              │
└─────────────────────────────────────────────────┘
```

**Components Needed**:
- `SettingsLayout.tsx` - Tab navigation
- `ProfileSettings.tsx` - Email, joined date
- `PreferencesSettings.tsx` - Format, theme
- `AccountSettings.tsx` - Password, delete

---

## 🎭 Key Interactions & Animations

### 1. Card Hover Effects
```typescript
// Smooth scale + shadow
hover:scale-105 hover:shadow-xl transition-all duration-200

// Card flip for double-faced cards
transform-style: preserve-3d
rotateY(180deg)
```

### 2. Staging Area Updates
```typescript
// New item slides in from top with green flash
@keyframes slideInGreen {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

// Removed item fades out
@keyframes fadeOut {
  to { opacity: 0; transform: translateX(-20px); }
}
```

### 3. Commit Success
```typescript
// Toast notification + confetti (optional)
toast.success("Changes committed! 🎉")

// Clear staging with fade out
opacity-0 transition-opacity duration-300
```

### 4. Loading States
```typescript
// Skeleton cards while loading
<Skeleton className="h-80 w-56 rounded-lg" />

// Spinner for actions
<Loader2 className="animate-spin" />
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: 0-640px (1 column)
- Tablet: 641-1024px (2 columns)
- Desktop: 1025px+ (3-4 columns)

### Mobile Adaptations

**Deck Builder Mobile**:
```
┌─────────────┐
│ [☰] Atraxa │ ← Hamburger menu
├─────────────┤
│ [Tabs:]     │
│ Main | Stats│
│ | Search    │ ← Tabs instead of columns
├─────────────┤
│ (Active tab │
│  content)   │
└─────────────┘
```

**Collection Mobile**:
```
┌───────────────┐
│ My Collection │
│ [🔍 Search]   │
│ ┌───┐ ┌───┐  │ ← 2 columns
│ │Cd │ │Cd │  │
│ └───┘ └───┘  │
│ ┌───┐ ┌───┐  │
│ │Cd │ │Cd │  │
│ └───┘ └───┘  │
└───────────────┘
```

---

## 🎨 Component Library to Build

### Layout Components
- `DashboardLayout.tsx` - Dashboard grid
- `DeckBuilderLayout.tsx` - 3-column layout
- `PageHeader.tsx` - Page title + actions

### Card Components
- `MTGCard.tsx` - Card image with hover
- `CardInDeck.tsx` - Card in deck list
- `CardInCollection.tsx` - Card in collection
- `CardSearchResult.tsx` - Search result item

### Feature Components
- `StagingArea.tsx` - Git-style staging
- `ManaCurveChart.tsx` - Mana curve visualization
- `ColorPieChart.tsx` - Color distribution
- `DeckStats.tsx` - Statistics panel
- `CommitHistory.tsx` - Git-style history view

### UI Components (Custom)
- `StatCard.tsx` - Number + label card
- `DeckCard.tsx` - Deck preview card
- `FeatureCard.tsx` - Feature showcase card
- `EmptyState.tsx` - Empty state component
- `ManaSymbol.tsx` - Mana symbol renderer

---

## 📦 Assets Needed

### Icons (lucide-react)
- `Plus`, `Minus`, `Edit`, `Trash2`, `Copy`, `Download`
- `Search`, `Filter`, `SortAsc`, `SortDesc`
- `Library`, `Layers`, `GitCommit`, `History`
- `BarChart3`, `PieChart`, `TrendingUp`
- `Sparkles`, `Zap`, `Crown`

### Placeholder Images
For MVP, use:
- Card back placeholder: Gray rectangle with "MTG" text
- Avatar placeholder: Initials (already in Navbar)
- Empty state illustrations: Lucide icons scaled up

---

## 🚀 Implementation Priority

### Phase 1: Core Pages (High Priority)
1. **Dashboard** - First impression after login
2. **Deck List** - Core feature
3. **Deck Builder** - The main event
4. **Staging Area** - The killer feature!

### Phase 2: Supporting Features (Medium Priority)
5. **Collection List** - Enable card tracking
6. **Settings** - User preferences
7. **Enhanced Landing Page** - Marketing

### Phase 3: Polish (Lower Priority)
8. **Animations** - Smooth transitions
9. **Empty States** - Friendly onboarding
10. **Mobile Optimization** - Responsive tweaks

---

## ✅ Success Criteria

### Visual Design
- [ ] Consistent spacing (Tailwind scale)
- [ ] Clear visual hierarchy (typography)
- [ ] MTG-themed colors (mana colors)
- [ ] Smooth animations (200-300ms)
- [ ] Responsive on all devices

### User Experience
- [ ] Clear navigation (always know where you are)
- [ ] Fast feedback (loading states, toasts)
- [ ] Error states (friendly messages)
- [ ] Empty states (guide next action)
- [ ] Keyboard navigation (accessibility)

### Technical Quality
- [ ] TypeScript types for all props
- [ ] Reusable components
- [ ] No hardcoded values
- [ ] Performance optimized (memo, lazy load)
- [ ] Mobile responsive

---

## 📚 Design References

### Inspiration
- **Scryfall** (scryfall.com) - Card display, search
- **Moxfield** (moxfield.com) - Deck builder UI
- **Archidekt** (archidekt.com) - Visual deck builder
- **Vercel** (vercel.com) - Clean, modern landing page
- **Linear** (linear.app) - Smooth animations, staging

### Unique Differentiator
**Git-style staging area** - No other deck builder has this!

---

## 🎯 Next Steps for Builder

1. Read this entire design plan
2. Review the task list created
3. Start with Dashboard page (most impactful)
4. Build reusable components first
5. Test on mobile as you go
6. Commit after each major component

---

**Let's make this MVP beautiful! 🦄**

