/**
 * RecentDecks Component
 * 
 * Shows the 5 most recently updated decks
 * Server component with client interactive elements
 */

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import type { Database } from '@/lib/supabase/types';

type Deck = Database['public']['Tables']['decks']['Row'];

interface RecentDecksProps {
  decks: Deck[];
}

export function RecentDecks({ decks }: RecentDecksProps) {
  if (decks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Recent Decks</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/deck">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((deck) => (
          <Link key={deck.id} href={`/deck/${deck.id}`}>
            <Card className="transition-all hover:shadow-md hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-1">{deck.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {deck.format}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {deck.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                    {deck.description}
                  </p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Updated {new Date(deck.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

