# Changelog

All notable changes to the MTG Deck Builder project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Fixed
- Nothing yet

## [0.3.0] - 2025-11-04

### Added - Sprint 1 Complete! 🚀

#### 🎯 Full Deck Builder Workflow (End-to-End)
- **Complete Deck Builder Interface** (`/deck/[id]`)
  - Desktop and mobile responsive layouts
  - Three-panel layout: Card Search | Deck List | Stats Panel
  - Git-style staging area at bottom
  - Real-time card data from Scryfall
  - Category management (Commander, Mainboard, Sideboard, Maybeboard)

#### 🔍 Card Search & Display
- **Real Card Data Integration**
  - `useCards` hook for batch fetching from Scryfall
  - Card names, images, mana costs displayed everywhere
  - Loading skeletons and error handling
  - Image fallbacks for missing artwork
- **Card Search Panel**
  - Live search with debouncing
  - "+" button to stage cards
  - Visual feedback ("✓ Staged")
  - Toast notifications for actions
  - Prevents duplicate staging

#### 🎭 Git-Style Staging System (KILLER FEATURE!)
- **Staging Context** (`src/contexts/StagingContext.tsx`)
  - Global staging state across all components
  - Stage/discard individual changes
  - Clear all staged changes
- **Staging Area Component**
  - Shows all pending changes with +/- indicators
  - Commit with message (required validation)
  - Saves to `deck_history` table
  - Clears staging after successful commit
  - Database persistence verified

#### 🤖 AI Chat System
- **AI Chat Components**
  - `ChatSidebar` - Desktop sidebar chat
  - `ChatMobile` - Mobile drawer chat
  - `FloatingChatButton` - Quick access button
  - `ChatMessage` - Message bubbles with streaming
  - `ChatInput` - Input with suggestions
  - `QuickActions` - One-click AI suggestions
- **AI Integration**
  - Claude API integration (`src/lib/ai/`)
  - Streaming responses
  - MCP tool integration
  - Chat persistence with Supabase
  - `useChat` hook for chat management

#### 📚 Collection Management
- **Collection Pages**
  - Collection list page (`/collection`)
  - Collection detail view
  - Collection grid component
  - Collection card item with real images
  - Empty state for new users
- **Collection Operations**
  - Add/remove cards
  - Update quantities
  - Real-time updates
  - Scryfall image integration

#### 📊 Deck Statistics
- **Stats Components**
  - Mana curve visualization
  - Color distribution chart
  - Card type breakdown
  - Average CMC calculation
  - Real-time updates as deck changes

#### 🎨 Landing Page Enhancements
- **Landing Components**
  - Hero section with CTA
  - Feature cards showcase
  - Features grid
  - CTA section

#### ⚙️ Settings Page
- **User Settings** (`/settings`)
  - Settings content component
  - User preferences management

#### 🎨 Responsive Layouts
- **Layout System**
  - `DesktopLayout` - Desktop-optimized layout
  - `MobileLayout` - Mobile-optimized layout
  - `ResponsiveLayout` - Adaptive container
  - Smooth transitions between layouts

#### 🪝 New Hooks
- `useCards` - Batch fetch cards from Scryfall
- `useChat` - AI chat management
- `useStagingArea` - Git-style staging (enhanced)

#### 📝 Comprehensive Documentation
- `SPRINT_1_COMPLETE.md` - Sprint 1 summary
- `SPRINT_1_TRACKER.md` - Time tracking
- `docs/BUILDER_SPRINT_1.md` - Sprint 1 tasks
- `docs/BUILDER_ULTIMATE_TASKS.md` - Future roadmap
- `docs/LOOKER_SPRINT1_REVIEW.md` - Code review
- `docs/LOOKER_COMPREHENSIVE_REVIEW.md` - Full system review
- `docs/LOOKER_VISUAL_FUNCTIONAL_QA.md` - QA report
- `docs/MVP_AI_CHATBOT_PLAN.md` - AI chat planning
- `docs/PHASE2_TASK_LIST.md` - Next phase tasks
- `docs/PLANNER_SPRINT_ASSIGNMENT.md` - Sprint planning
- `docs/ULTIMATE_PLAN_SUMMARY.md` - Long-term vision
- `DEPLOYMENT_COMPLETE.md` - Deployment status

### Changed
- Updated dashboard page with improved stats and actions
- Enhanced global styles with better responsive design
- Improved app layout with AI chat integration
- Updated landing page with better CTAs and features

### Fixed
- All TypeScript compilation errors resolved (0 errors)
- All Sprint 1 blockers cleared
- Real-time data synchronization working
- Card staging and commit flow fully functional

### Testing Results
- ✅ End-to-end flow tested and working
- ✅ Collection shows real card images
- ✅ Deck builder stages and commits changes
- ✅ AI chat functional with streaming
- ✅ Responsive layouts on mobile and desktop
- ✅ No console errors
- ✅ Database persistence verified

## [0.2.1] - 2025-11-04

### Fixed
- **Documentation Corrections**
  - Fixed repository URL across all documentation (manaforge instead of brew)
  - Updated README.md with correct git repository
  - Updated PROJECT_OVERVIEW.md with correct repository
  - Updated DEV_GUIDE.md with correct repository and clone commands
  - Removed duplicate lowercase documentation files
  - Updated API documentation reference (no longer "coming soon")

### Added
- **API Documentation** (`docs/API_DOCS.md`)
  - Complete Scryfall API integration guide
  - React hooks documentation with examples
  - Supabase database operations reference
  - Real-time subscription patterns
  - Error handling and rate limiting best practices
  - Performance optimization strategies
  - Testing patterns with mocks

## [0.2.0] - 2025-11-04

### Added
- **Dashboard Page** (`/dashboard`)
  - Stats bar showing deck/collection counts
  - Quick action buttons for new deck/collection
  - Recent decks list with format badges
  - Welcome empty state for new users
- **Core Hooks**
  - `useDeck` - Complete deck CRUD operations with real-time updates
  - `useCollection` - Collection management with card operations
  - `useStagingArea` - Git-style staging pattern for deck changes
  - `useCardSearch` - Scryfall API search with debouncing
  - `useDebounce` - Utility hook for input debouncing
- **Scryfall Integration**
  - Client with card search endpoint
  - Complete type definitions for Scryfall API
  - Error handling and rate limit management
- **Type System**
  - `Card` interface with Scryfall schema
  - `Deck` and `DeckCard` types
  - `StagedChange` types for git-style workflow
  - Complete type safety across the application
- **Utility Functions**
  - Mana symbol parsing and color identity calculation
  - Deck statistics (mana curve, color distribution)
  - Format validation (Commander, Standard, Modern, etc.)
- **UI Components**
  - `PageHeader` - Consistent page titles with breadcrumbs
  - `EmptyState` - Reusable empty state component
  - `StatCard` - Dashboard statistics cards
  - Dashboard-specific components (QuickActions, RecentDecks, etc.)
- **Data Providers**
  - `QueryProvider` - React Query setup for data fetching
- **Documentation**
  - MVP Design Plan
  - Builder Progress tracking
  - Build Status documentation
  - Unicorn-grade quality checklist

### Changed
- Updated Supabase middleware for @supabase/ssr v0.1.0 API
- Updated Supabase server client for new cookie methods
- Enhanced landing page with better CTAs
- Improved app layout with Toaster integration

### Fixed
- Toaster import path (moved to @/hooks/use-toast)
- Supabase cookie methods (getAll/setAll → get/set/remove)
- TypeScript compilation errors (100% type-safe)
- Auth validation schemas added

## [0.1.0] - 2025-01-01

### Added
- Initial project structure
- Basic file organization
- Core dependencies installed
- Documentation framework

---

## Version History Notes

### Version Format
- **Major (X.0.0)**: Breaking changes, major features
- **Minor (0.X.0)**: New features, backwards compatible
- **Patch (0.0.X)**: Bug fixes, minor improvements

### Change Categories
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

