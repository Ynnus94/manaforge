# 🚀 Quick Start Guide - Phase 1

**Goal**: Get your database live and authentication working in under 30 minutes.

---

## Step 1: Create Supabase Project (5 min)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `mtg-deck-builder`
   - **Database Password**: Generate strong password (save it somewhere safe!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning ☕

---

## Step 2: Get Your API Keys (2 min)

1. In your Supabase project dashboard, click **"Settings"** (gear icon) in sidebar
2. Click **"API"**
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

---

## Step 3: Configure Environment Variables (1 min)

1. In your project root, copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

---

## Step 4: Test Connection (1 min)

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000/test-connection

3. You should see: **"Configured ✅"**

✅ If you see this, you're ready to proceed!
❌ If not, double-check your `.env.local` values match exactly from Supabase

---

## Step 5: Create Database Schema (5 min)

1. In Supabase dashboard, click **"SQL Editor"** in sidebar
2. Click **"New query"**
3. Open the file: `database/migrations/001_initial_schema.sql`
4. Copy the **entire contents**
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. Wait for success message

### Verify it worked:

In the same SQL Editor, run:
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('collections', 'collection_cards', 'decks', 'deck_cards', 'deck_history');
```

You should see all 5 tables listed. ✅

---

## Step 6: Generate TypeScript Types (3 min)

1. Install Supabase CLI (one-time):
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```
   
   This will open your browser for authentication.

3. Link your project:
   ```bash
   supabase link --project-ref YOUR-PROJECT-REF
   ```
   
   **Where to find project ref?**
   - Look at your Supabase project URL: `https://YOUR-PROJECT-REF.supabase.co`
   - Copy the part before `.supabase.co`

4. Generate types:
   ```bash
   supabase gen types typescript --linked > src/lib/supabase/types.ts
   ```

5. Verify: Open `src/lib/supabase/types.ts` - you should see real types instead of placeholders!

---

## Step 7: Install shadcn/ui Components (10 min)

Run these commands one by one (or all at once):

```bash
# Core components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add separator

# Forms
npx shadcn-ui@latest add form
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add textarea

# Overlays
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tooltip

# Navigation
npx shadcn-ui@latest add tabs

# Feedback
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add skeleton

# Data Display
npx shadcn-ui@latest add table
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add scroll-area
```

### Verify:
```bash
ls src/components/ui/
```
You should see many `.tsx` files!

---

## ✅ Phase 1 Setup Complete!

You now have:
- ✅ Supabase project created
- ✅ Database schema with 5 tables
- ✅ Row Level Security enabled
- ✅ TypeScript types generated
- ✅ shadcn/ui components installed

---

## 🚀 Next Steps: Build Authentication

Now you're ready for **Builder Agent** to implement:
1. Authentication pages (login/signup)
2. Middleware for protected routes
3. Navbar with user menu
4. Basic dashboard

**To proceed:**
```bash
@builder.md Implement Phase 1 authentication per docs/CURRENT_TASK.md
```

---

## 🆘 Troubleshooting

### "NEXT_PUBLIC_SUPABASE_URL is not set"
- Make sure `.env.local` exists (not just `.env.local.example`)
- Restart your dev server after creating `.env.local`

### "Failed to run SQL migration"
- Make sure you copied the **entire** file contents
- Check for any syntax errors (shouldn't be any)
- Try running it in smaller chunks if needed

### "supabase: command not found"
- Make sure you installed globally: `npm install -g supabase`
- Try closing and reopening your terminal

### "TypeScript errors after generating types"
- Restart your TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

### shadcn/ui components not installing
- Make sure you have `components.json` in your project root
- Check that you're in the project root directory when running commands

---

## 📞 Need Help?

Check these files for detailed info:
- `docs/PROJECT_OVERVIEW.md` - Overall vision
- `docs/CURRENT_TASK.md` - Detailed Phase 1 plan
- `docs/WORKFLOW_GUIDE.md` - How to work with agents

**Happy building! 🃏✨**

