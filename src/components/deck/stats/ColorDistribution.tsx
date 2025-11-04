/**
 * Color Distribution Chart
 * 
 * Shows color distribution in deck
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette } from 'lucide-react';

interface ColorDistributionProps {
  distribution: Record<string, number>;
}

const colorStyles: Record<string, { bg: string; text: string; name: string }> = {
  W: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-900 dark:text-yellow-100', name: 'White' },
  U: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-900 dark:text-blue-100', name: 'Blue' },
  B: { bg: 'bg-gray-800 dark:bg-gray-200', text: 'text-gray-100 dark:text-gray-800', name: 'Black' },
  R: { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-900 dark:text-red-100', name: 'Red' },
  G: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-900 dark:text-green-100', name: 'Green' },
  C: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-900 dark:text-gray-100', name: 'Colorless' },
};

export function ColorDistribution({ distribution }: ColorDistributionProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  const colors = ['W', 'U', 'B', 'R', 'G', 'C'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Color Pie (simplified as horizontal bars) */}
        <div className="space-y-3">
          {colors.map((color) => {
            const count = distribution[color] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            const style = colorStyles[color];

            if (count === 0) return null;

            return (
              <div key={color} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{style.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count} pips</Badge>
                    <span className="text-xs text-muted-foreground">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-6 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${style.bg} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {total === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No cards with mana costs yet
          </p>
        )}

        {/* Color Identity */}
        {total > 0 && (
          <div className="mt-6 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Color Identity</p>
            <div className="flex gap-2">
              {colors.map((color) => {
                const count = distribution[color] || 0;
                if (count === 0) return null;
                const style = colorStyles[color];
                return (
                  <Badge
                    key={color}
                    className={`${style.bg} ${style.text}`}
                    variant="outline"
                  >
                    {color}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

