/**
 * Commit History Component
 * 
 * Shows deck's full change history with rollback capability
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { GitCommitHorizontal, RotateCcw, User, Calendar } from 'lucide-react';

interface HistoryEntry {
  id: string;
  message: string;
  timestamp: string;
  changes_count: number;
  committed_by: string;
}

interface CommitHistoryProps {
  deckId: string;
}

export function CommitHistory({ deckId }: CommitHistoryProps) {
  // TODO: Fetch actual history from database
  const history: HistoryEntry[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCommitHorizontal className="h-5 w-5" />
          Commit History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No commits yet
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Commit some changes to start building history
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="space-y-3">
              {history.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <GitCommitHorizontal className="h-4 w-4 text-primary" />
                    </div>
                    {index < history.length - 1 && (
                      <div className="flex-1 w-px bg-border" />
                    )}
                  </div>

                  {/* Commit Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{entry.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.committed_by}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {entry.changes_count} changes
                      </Badge>
                    </div>
                  </div>

                  {/* Rollback Button */}
                  <Button size="sm" variant="ghost">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

