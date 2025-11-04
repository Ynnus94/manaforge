/**
 * Deck Card
 * 
 * Single deck card showing:
 * - Deck name
 * - Format badge
 * - Commander (if applicable)
 * - Card count
 * - Last updated
 * - Quick actions
 */

'use client';

import Link from 'next/link';
import type { Database } from '@/lib/supabase/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Deck = Database['public']['Tables']['decks']['Row'];

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const formatColors: Record<string, string> = {
    commander: 'bg-purple-500',
    standard: 'bg-blue-500',
    modern: 'bg-green-500',
    pioneer: 'bg-orange-500',
    pauper: 'bg-gray-500',
  };

  const formatColor = formatColors[deck.format] || 'bg-slate-500';

  return (
    <Card className="group hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/deck/${deck.id}`}>
              <CardTitle className="hover:text-primary transition-colors truncate">
                {deck.name}
              </CardTitle>
            </Link>
            <CardDescription className="mt-1">
              {deck.commander_id ? 'Commander deck' : 'No commander set'}
            </CardDescription>
          </div>
          
          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Format Badge */}
          <Badge className={formatColor}>
            {deck.format.toUpperCase()}
          </Badge>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>0 cards</span> {/* TODO: Get actual count */}
            <span>Updated {new Date(deck.updated_at).toLocaleDateString()}</span>
          </div>

          {/* View Button */}
          <Link href={`/deck/${deck.id}`} className="block">
            <Button variant="outline" className="w-full">
              View Deck
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

