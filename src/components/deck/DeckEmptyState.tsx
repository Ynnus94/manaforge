/**
 * Deck Empty State
 * 
 * Shown when user has no decks
 */

import { Button } from '@/components/ui/button';
import { Plus, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function DeckEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl">🎴</span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Build Your First Deck</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Create a new deck or ask the AI to build one based on your collection.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New Deck
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Sparkles className="h-4 w-4 mr-2" />
              Ask AI to Build
            </Button>
          </div>

          {/* Tip */}
          <div className="bg-primary/5 rounded-lg p-4 mt-6">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Try this:</strong> "Show me decks I can build with my collection"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

