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

