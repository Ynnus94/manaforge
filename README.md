# MTG Deck Builder 🃏

> The future of Magic: The Gathering deck building with AI superpowers

**Repository**: `git@github.com:Ynnus94/brew.git`

## ✨ Features

- 🎯 **Git-Style Validation**: Stage → Review → Commit workflow keeps you in control
- 🧠 **Superbrew Analysis**: AI finds decks you can build with your collection
- 🚀 **Real-Time Updates**: Live collaboration with Supabase
- 🎨 **Unicorn-Grade UI**: Beautiful, modern, responsive design
- 🔒 **Never Lose Control**: AI suggests, you approve

## 🚀 Quick Start

```bash
# Clone the repository
git clone git@github.com:Ynnus94/brew.git
cd brew

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your Supabase and Anthropic API keys

# Initialize shadcn/ui
npx shadcn-ui@latest init

# Run development server
npm run dev
```

Visit http://localhost:3000

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5
- **Database**: Supabase (PostgreSQL + Real-time subscriptions)
- **UI**: shadcn/ui + Tailwind CSS
- **AI**: Claude API (Anthropic) with MCP Server
- **State**: Zustand (client) + React Query (server state)

## 📚 Documentation

- [Project Overview](./docs/PROJECT_OVERVIEW.md) - Vision and architecture
- [Development Guide](./docs/DEV_GUIDE.md) - Setup and contribution guidelines
- [Database Schema](./docs/DATABASE_SCHEMA.md) - PostgreSQL/Supabase schema
- [Current Tasks](./docs/CURRENT_TASK.md) - Active roadmap
- [Workflow Guide](./docs/WORKFLOW_GUIDE.md) - Working with AI agents
- [Agent Summary](./docs/AGENT_SUMMARY.md) - Quick reference

## 🤖 Working with Agents

```bash
@planner.md I need to add [feature]
@builder.md Implement [feature] per docs/CURRENT_TASK.md
@looker.md Review [files]
@pusher.md Feature done, update docs
```

See [WORKFLOW_GUIDE.md](./docs/WORKFLOW_GUIDE.md) for details.

---

**Built with 🦄 unicorn-grade standards**
