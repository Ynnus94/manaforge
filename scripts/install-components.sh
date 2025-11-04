#!/bin/bash

# Install all required shadcn/ui components

set -e

echo "🎨 Installing shadcn/ui components..."
echo ""

components="button card input label separator form select checkbox textarea radio-group dialog dropdown-menu popover tooltip sheet tabs navigation-menu breadcrumb alert toast badge skeleton progress table avatar scroll-area command context-menu"

for component in $components; do
    echo "  📦 Installing $component..."
    npx shadcn-ui@latest add $component --yes
done

echo ""
echo "✅ All components installed!"
echo ""

