/**
 * Staging Area - THE UNICORN FEATURE! 🦄
 * 
 * Git-style staging for deck changes:
 * - Stage changes (add, remove, update, move)
 * - Review diff before committing
 * - Commit with message
 * - Full history tracking
 * 
 * TASK 2.5: Now commits to database!
 */

'use client';

import { useStagingContext } from '@/contexts/StagingContext';
import { useDeck } from '@/hooks/useDeck';
import type { StagedChange } from '@/types/staging';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  GitCommitHorizontal, 
  Plus, 
  Minus, 
  ArrowRight, 
  Trash2,
  GitBranch 
} from 'lucide-react';
import { useState } from 'react';

interface StagingAreaProps {
  deckId: string;
}

export function StagingArea({ deckId }: StagingAreaProps) {
  const { staged, discard, clear } = useStagingContext();
  const { commitChanges } = useDeck(deckId);
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const { toast } = useToast();

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast({
        title: 'Commit Message Required',
        description: 'Please enter a commit message before committing',
        variant: 'destructive',
      });
      return;
    }

    if (staged.length === 0) {
      toast({
        title: 'No Changes',
        description: 'Stage some changes before committing',
        variant: 'destructive',
      });
      return;
    }

    setIsCommitting(true);
    try {
      // Commit changes to database with history tracking
      await commitChanges(staged, commitMessage);
      
      // Success!
      toast({
        title: '✓ Committed',
        description: `${staged.length} change${staged.length === 1 ? '' : 's'} saved to deck`,
      });
      
      // Clear staging after commit
      clear();
      setCommitMessage('');
    } catch (error) {
      console.error('Commit failed:', error);
      toast({
        title: 'Commit Failed',
        description: error instanceof Error ? error.message : 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setIsCommitting(false);
    }
  };

  const getChangeIcon = (action: StagedChange['action']) => {
    switch (action) {
      case 'add':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'remove':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'update':
        return <GitBranch className="h-4 w-4 text-blue-500" />;
      case 'move':
        return <ArrowRight className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getChangeLabel = (change: StagedChange) => {
    switch (change.action) {
      case 'add':
        return `Add ${change.quantity}x to ${change.category}`;
      case 'remove':
        return `Remove ${change.quantity}x`;
      case 'update':
        return `Update quantity: ${change.old_quantity} → ${change.quantity}`;
      case 'move':
        return `Move from ${change.old_category} → ${change.category}`;
    }
  };

  return (
    <Card className="border-primary/50">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <GitCommitHorizontal className="h-5 w-5" />
          Staging Area
          {staged.length > 0 && (
            <Badge className="ml-2">{staged.length} changes</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {staged.length === 0 ? (
          <div className="text-center py-8">
            <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No changes staged
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Add, remove, or modify cards to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Staged Changes List */}
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-2">
                {staged.map((change) => (
                  <div
                    key={change.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    {getChangeIcon(change.action)}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        Card ID: {change.scryfall_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {getChangeLabel(change)}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Staged {new Date(change.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => discard(change.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Commit Section */}
            <div className="space-y-3 pt-3 border-t">
              <Input
                placeholder="Commit message (e.g., 'Added ramp package')"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommit();
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCommit}
                  disabled={!commitMessage.trim() || staged.length === 0 || isCommitting}
                  className="flex-1"
                >
                  <GitCommitHorizontal className="h-4 w-4 mr-2" />
                  {isCommitting ? 'Committing...' : 'Commit Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={clear}
                  disabled={staged.length === 0 || isCommitting}
                >
                  Discard All
                </Button>
              </div>
            </div>

            {/* Git-style tip */}
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
              💡 <strong>Pro tip:</strong> Write descriptive commit messages like git! 
              View full history in the deck's "History" tab.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

