# Phase 1 Setup - Next Steps

## ✅ Step 1: Connection Configured
Your `.env.local` is set up with:
- **Project URL**: https://cffcezpyxxpcvgvfmmdu.supabase.co
- **Anon Key**: Configured ✅

## 🔄 Step 2: Create Database Schema

**Option A: Via Supabase Dashboard (Recommended)**
1. Go to: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor
2. Click **"New query"** button
3. Open file: `database/migrations/001_initial_schema.sql`
4. Copy ALL contents (it's a big file!)
5. Paste into Supabase SQL Editor
6. Click **"Run"** or press Cmd/Ctrl + Enter
7. Wait for "Success. No rows returned" message

**Option B: Via Supabase CLI (Advanced)**
```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref cffcezpyxxpcvgvfmmdu

# Run migration
supabase db push
```

### ✅ Verify Schema
Run this in Supabase SQL Editor to check:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('collections', 'collection_cards', 'decks', 'deck_cards', 'deck_history');
```

Should return 5 tables!

---

## 🔧 Step 3: Generate TypeScript Types

After schema is created:

```bash
# Make sure you're in project directory
cd /Users/sunny/Desktop/MTGAPP

# Install Supabase CLI (if not done in Step 2)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref cffcezpyxxpcvgvfmmdu

# Generate types
supabase gen types typescript --linked > src/lib/supabase/types.ts
```

---

## 🎨 Step 4: Install shadcn/ui Components

Run this command to install ALL needed components at once:

```bash
cd /Users/sunny/Desktop/MTGAPP

npx shadcn-ui@latest add button card input label separator form select checkbox textarea radio-group dialog dropdown-menu popover tooltip sheet tabs navigation-menu breadcrumb alert toast badge skeleton progress table avatar scroll-area command context-menu
```

Or install them individually if you prefer (see `docs/CURRENT_TASK.md` for the full list).

---

## 🚀 After All Steps Complete

You'll be ready for Builder Agent:
```bash
@builder.md Implement Phase 1 authentication per docs/CURRENT_TASK.md
```

---

## 🆘 Troubleshooting

### Can't access Supabase SQL Editor
- Direct link: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor

### SQL Migration fails
- Make sure you copied the ENTIRE file
- Check there are no copy/paste errors
- Try running it in chunks if needed

### Type generation fails
- Make sure schema is created first (Step 2)
- Make sure you're linked to correct project: `supabase projects list`
- Try re-linking: `supabase unlink`, then `supabase link --project-ref cffcezpyxxpcvgvfmmdu`

---

**Current Status**: Step 1 Complete ✅ - Connection configured!
**Next**: Create database schema (Step 2)

