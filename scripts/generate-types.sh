#!/bin/bash

# Generate TypeScript types from Supabase schema

set -e

echo "⚙️  Generating TypeScript types from Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📦 Supabase CLI not found. Installing..."
    sudo npm install -g supabase
fi

# Login if not already
echo "🔐 Checking Supabase authentication..."
supabase projects list > /dev/null 2>&1 || {
    echo "Please login to Supabase (opens browser)..."
    supabase login
}

# Link project
echo "🔗 Linking to project..."
supabase link --project-ref cffcezpyxxpcvgvfmmdu || {
    echo "⚠️  Already linked or failed to link"
}

# Generate types
echo "✨ Generating types..."
supabase gen types typescript --linked > src/lib/supabase/types.ts

echo ""
echo "✅ Types generated: src/lib/supabase/types.ts"
echo ""

