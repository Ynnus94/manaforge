# 🚀 Super Simple Setup - 3 Steps

## ✅ Step 1: Run SQL Migration (2 minutes)

**You need to do this ONE time manually:**

1. Open this link: **https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor**

2. Click **"New query"** button

3. Open the file `database/migrations/001_initial_schema.sql` in this project

4. Copy **ALL** of it (Cmd+A, Cmd+C)

5. Paste into Supabase SQL Editor (Cmd+V)

6. Click **"Run"** button (or press Cmd+Enter)

7. Wait for "Success. No rows returned" ✅

**That's it for SQL!** You never have to do this again.

---

## ✅ Step 2: Generate TypeScript Types (30 seconds)

Run this command:

```bash
npm run setup:types
```

This will:
- Install Supabase CLI (if needed)
- Ask you to login (opens browser once)
- Generate types from your database

---

## ✅ Step 3: Install UI Components (3 minutes)

Run this command:

```bash
npm run setup:components
```

This installs all the shadcn/ui components we need.

---

## 🎉 Done!

After these 3 steps, run:

```bash
npm run dev
```

Then visit:
- http://localhost:3000 - Your app
- http://localhost:3000/test-connection - Verify Supabase ✅

---

## 🚀 Next: Build Authentication

Once setup is complete, tell Builder Agent:

```
@builder.md Implement Phase 1 authentication per docs/CURRENT_TASK.md
```

---

## 🆘 Troubleshooting

### "Success. No rows returned" - is that good?
**YES!** That means it worked. The SQL created tables but didn't return data.

### SQL migration gives an error?
- Make sure you copied the ENTIRE file
- Try running it in smaller chunks if needed
- Check you're in the right project

### npm run setup:types fails?
- Make sure Step 1 (SQL) was completed first
- Try: `supabase login` then retry

### npm run setup:components is slow?
- Normal! It installs ~20 components, takes 2-3 min

---

**Quick Links:**
- Supabase SQL Editor: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu/editor  
- Supabase Dashboard: https://supabase.com/dashboard/project/cffcezpyxxpcvgvfmmdu
- SQL File: `database/migrations/001_initial_schema.sql`

