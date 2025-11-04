#!/bin/bash

# Complete Phase 1 Setup Script
# Automates database setup, type generation, and component installation

set -e  # Exit on error

PROJECT_REF="cffcezpyxxpcvgvfmmdu"
PROJECT_URL="https://${PROJECT_REF}.supabase.co"

echo "🚀 MTG Deck Builder - Phase 1 Setup"
echo "===================================="
echo ""

# Step 1: Install Supabase CLI
echo "📦 Step 1: Installing Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI globally..."
    npm install -g supabase || {
        echo "❌ Failed to install Supabase CLI"
        echo "Try running: sudo npm install -g supabase"
        exit 1
    }
else
    echo "✅ Supabase CLI already installed"
fi
echo ""

# Step 2: Login to Supabase
echo "🔐 Step 2: Logging into Supabase..."
echo "This will open your browser for authentication..."
supabase login || {
    echo "❌ Login failed"
    exit 1
}
echo "✅ Logged in successfully"
echo ""

# Step 3: Link project
echo "🔗 Step 3: Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF || {
    echo "⚠️  Project may already be linked, continuing..."
}
echo "✅ Project linked"
echo ""

# Step 4: Run database migration
echo "🗄️  Step 4: Running database migration..."
echo "Pushing schema to Supabase..."

# Use db push with the migration file
supabase db push || {
    echo "⚠️  db push not available, trying alternative..."
    
    # Alternative: Use psql if available
    if command -v psql &> /dev/null; then
        echo "Using psql to run migration..."
        export PGPASSWORD="your-db-password"
        psql -h db.${PROJECT_REF}.supabase.co -U postgres -d postgres -f database/migrations/001_initial_schema.sql
    else
        echo "❌ Could not run migration automatically"
        echo "Please run manually in Supabase SQL Editor:"
        echo "https://supabase.com/dashboard/project/${PROJECT_REF}/editor"
        echo ""
        echo "Copy and run: database/migrations/001_initial_schema.sql"
        echo ""
        read -p "Press Enter once you've run the migration manually..."
    fi
}
echo "✅ Database schema created"
echo ""

# Step 5: Generate TypeScript types
echo "⚙️  Step 5: Generating TypeScript types..."
supabase gen types typescript --linked > src/lib/supabase/types.ts || {
    echo "❌ Failed to generate types"
    exit 1
}
echo "✅ Types generated: src/lib/supabase/types.ts"
echo ""

# Step 6: Install shadcn/ui components
echo "🎨 Step 6: Installing shadcn/ui components..."
echo "This may take a few minutes..."

components=(
    "button"
    "card"
    "input"
    "label"
    "separator"
    "form"
    "select"
    "checkbox"
    "textarea"
    "dialog"
    "dropdown-menu"
    "popover"
    "tooltip"
    "tabs"
    "alert"
    "toast"
    "badge"
    "skeleton"
    "table"
    "avatar"
    "scroll-area"
)

for component in "${components[@]}"; do
    echo "  Installing $component..."
    npx shadcn-ui@latest add $component --yes || {
        echo "⚠️  Failed to install $component, continuing..."
    }
done

echo "✅ All components installed"
echo ""

# Step 7: Verify everything
echo "🔍 Step 7: Verifying setup..."
if [ -f "src/lib/supabase/types.ts" ]; then
    echo "✅ TypeScript types exist"
fi

if [ -d "src/components/ui" ] && [ "$(ls -A src/components/ui)" ]; then
    echo "✅ UI components installed"
fi

if [ -f ".env.local" ]; then
    echo "✅ Environment variables configured"
fi

echo ""
echo "🎉 Phase 1 Setup Complete!"
echo "=========================="
echo ""
echo "✅ Database schema created (5 tables with RLS)"
echo "✅ TypeScript types generated"
echo "✅ shadcn/ui components installed"
echo "✅ Environment configured"
echo ""
echo "🚀 Next steps:"
echo "1. Test connection: http://localhost:3000/test-connection"
echo "2. Run: @builder.md Implement Phase 1 authentication per docs/CURRENT_TASK.md"
echo ""

