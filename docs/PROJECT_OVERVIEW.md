# MANAFORGE - Project Overview

**Repository**: `git@github.com:Ynnus94/manaforge.git`

## Vision
Build a modern Magic: The Gathering deck building application with AI-powered suggestions and collection management.

## Key Features

### 1. Git-Style Validation
- Stage → Review → Commit workflow for deck changes
- Users maintain full control over AI suggestions
- Visual diff showing proposed changes

### 2. Superbrew Analysis
- AI analyzes user's card collection
- Suggests complete decks that can be built
- Provides strategy insights and synergies

### 3. Real-Time Updates
- Live collaboration powered by Supabase
- Real-time deck updates across devices
- Instant synchronization of collection changes

### 4. Collection Management
- Import cards from various sources
- Track card quantities and conditions
- Search and filter capabilities

### 5. Deck Building
- Intuitive drag-and-drop interface
- Mana curve visualization
- Card statistics and analysis
- Export to various formats

## Technical Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand for client state, React Query for server state

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **API**: Next.js API routes

### AI Integration
- **Provider**: Anthropic Claude API
- **Features**: Deck suggestions, card synergy analysis, meta insights

### External APIs
- **Scryfall**: Card data and images
- **EDHREC**: Commander deck statistics and recommendations

## Project Structure
```
/src
  /app              # Next.js pages and layouts
    /(auth)         # Auth pages (login, signup)
    /api            # API routes
    /collection     # Collection pages
    /deck           # Deck builder pages
  /components       # React components
    /ui             # shadcn/ui components
    /cards          # Card-related components
    /deck           # Deck-specific components
    /collection     # Collection components
    /ai             # AI chat/suggestions
  /hooks            # Custom hooks
  /lib              # Utilities and integrations
    /supabase       # Supabase client & types
    /scryfall       # Scryfall API integration
    /ai             # AI/MCP integration
    /utils          # Utility functions
  /types            # TypeScript definitions
/docs               # Documentation
  PROJECT_OVERVIEW.md
  CURRENT_TASK.md
  WORKFLOW_GUIDE.md
  DEV_GUIDE.md
  DATABASE_SCHEMA.md
  AGENT_SUMMARY.md
/cursor-prompts     # Agent prompt files
```

## Development Workflow
1. Plan features with `@planner.md`
2. Implement with `@builder.md`
3. Review with `@looker.md`
4. Update docs with `@pusher.md`

See [Development Guide](./DEV_GUIDE.md) for setup instructions and contribution guidelines.

## Goals
- 🎯 Unicorn-grade user experience
- 🔒 User always in control
- 🚀 Fast and responsive
- 🎨 Beautiful and modern design
- 🧠 Intelligent AI assistance

