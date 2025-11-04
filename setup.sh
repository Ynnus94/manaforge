#!/bin/bash

# MTG Deck Builder - Complete Setup Script
# This script creates the entire project structure with all files

set -e

echo "🃏 Setting up MTG Deck Builder..."
echo ""

# Check if we're in an empty directory
if [ "$(ls -A)" ]; then
    echo "⚠️  Warning: Current directory is not empty."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create folder structure
echo "📁 Creating folder structure..."
mkdir -p cursor-prompts
mkdir -p docs
mkdir -p src/app/{api/ai/chat,deck/\[id\],collection,\(auth\)/{login,signup}}
mkdir -p src/components/{ui,cards,deck,collection,ai}
mkdir -p src/hooks
mkdir -p src/lib/{supabase,scryfall,ai,utils}
mkdir -p src/types
mkdir -p public

echo "✅ Folders created"
echo ""

# Create package.json
echo "📦 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "mtg-deck-builder",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.28.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "recharts": "^2.12.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.358.0",
    "date-fns": "^3.3.1"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.0",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
EOF

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c1.scryfall.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
EOF

# Create components.json
cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
EOF

# Create .env.local.example
cat > .env.local.example << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Anthropic (for AI features)
ANTHROPIC_API_KEY=your-claude-api-key

# App URL (for development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# MCP Server
/mcp-server/node_modules
/mcp-server/dist
EOF

# Create .eslintrc.json
cat > .eslintrc.json << 'EOF'
{
  "extends": "next/core-web-vitals",
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { 
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
EOF

# Create .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF

# Create README.md
cat > README.md << 'EOF'
# MTG Deck Builder 🃏

> The future of Magic: The Gathering deck building with AI superpowers

## ✨ Features

- 🎯 **Git-Style Validation**: Stage → Review → Commit workflow keeps you in control
- 🧠 **Superbrew Analysis**: AI finds decks you can build with your collection
- 🚀 **Real-Time Updates**: Live collaboration with Supabase
- 🎨 **Unicorn-Grade UI**: Beautiful, modern, responsive design
- 🔒 **Never Lose Control**: AI suggests, you approve

## 🚀 Quick Start

```bash
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

- [Project Overview](./docs/PROJECT_OVERVIEW.md)
- [Current Tasks](./docs/CURRENT_TASK.md)
- [Workflow Guide](./docs/WORKFLOW_GUIDE.md)
- [Agent Summary](./docs/AGENT_SUMMARY.md)

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
EOF

# Create src/app/layout.tsx
cat > src/app/layout.tsx << 'EOF'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MTG Deck Builder',
  description: 'The future of Magic: The Gathering deck building with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
EOF

# Create src/app/page.tsx
cat > src/app/page.tsx << 'EOF'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          🃏 MTG Deck Builder
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          The future of Magic: The Gathering deck building with AI superpowers
        </p>
        
        <div className="grid text-center lg:grid-cols-3 gap-4 mb-8">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🎯 Git-Style Validation
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Stage changes, review, commit. You're always in control.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🧠 Superbrew Analysis
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              AI finds decks you can build with your collection.
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
            <h2 className="mb-3 text-2xl font-semibold">
              🚀 Real-Time Updates
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Live collaboration powered by Supabase.
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Ready to start building? Check{' '}
            <code className="font-mono font-bold">docs/CURRENT_TASK.md</code>{' '}
            for Week 1 tasks.
          </p>
        </div>
      </div>
    </main>
  );
}
EOF

# Create src/app/globals.css
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Create src/lib/utils.ts
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

echo "✅ Configuration files created"
echo ""

# Note about documentation files
echo "📚 Documentation files need to be copied manually from artifacts:"
echo "  - cursor-prompts/planner.md"
echo "  - cursor-prompts/builder.md"
echo "  - cursor-prompts/looker.md"
echo "  - cursor-prompts/pusher.md"
echo "  - docs/PROJECT_OVERVIEW.md"
echo "  - docs/CURRENT_TASK.md"
echo "  - docs/WORKFLOW_GUIDE.md"
echo "  - docs/AGENT_SUMMARY.md"
echo "  - .cursorrules"
echo ""
echo "These are too large for the script. Copy them from the artifacts above!"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Copy the 9 documentation files from artifacts"
echo "  2. Run: npm install"
echo "  3. Run: cp .env.local.example .env.local"
echo "  4. Add your Supabase & Anthropic keys to .env.local"
echo "  5. Run: npx shadcn-ui@latest init"
echo "  6. Run: npm run dev"
echo ""
echo "🚀 Then open Cursor and start building!"

