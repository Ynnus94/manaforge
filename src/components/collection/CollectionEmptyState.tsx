/**
 * Collection Empty State
 * 
 * Shown when user has no cards in collection
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CollectionEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-4xl">📚</span>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Start Your Collection</h2>
            <p className="text-muted-foreground">
              Add cards to your collection to track your inventory, build decks, and get AI-powered suggestions.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Cards Manually
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              Import from CSV
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Camera className="h-4 w-4 mr-2" />
              Scan Cards
            </Button>
          </div>

          {/* Tip */}
          <p className="text-sm text-muted-foreground pt-4">
            💡 <strong>Pro tip:</strong> Ask the AI "What decks can I build?" once you add cards!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

