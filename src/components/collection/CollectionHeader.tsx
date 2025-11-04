/**
 * Collection Header
 * 
 * Shows stats and actions for collection
 */

'use client';

import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface CollectionHeaderProps {
  totalCards: number;
  uniqueCards: number;
}

export function CollectionHeader({ totalCards, uniqueCards }: CollectionHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 space-y-4">
        {/* Title and Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Collection</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCards.toLocaleString()} cards · {uniqueCards.toLocaleString()} unique
            </p>
          </div>

          {/* Add Cards Button */}
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Cards
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button variant="outline">
            Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

