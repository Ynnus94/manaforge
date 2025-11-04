/**
 * Mana Curve Chart
 * 
 * Visual representation of mana curve
 */

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface ManaCurveChartProps {
  curve: Record<number, number>;
}

export function ManaCurveChart({ curve }: ManaCurveChartProps) {
  const maxCount = Math.max(...Object.values(curve));
  const cmcs = Array.from({ length: 8 }, (_, i) => i); // 0-7+

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Mana Curve
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {cmcs.map((cmc) => {
            const count = curve[cmc] || 0;
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={cmc} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cmc === 7 ? '7+' : cmc}</span>
                  <Badge variant="secondary">{count} cards</Badge>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Average CMC */}
        <div className="mt-6 p-3 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">Average CMC</p>
          <p className="text-2xl font-bold">
            {Object.entries(curve).reduce((sum, [cmc, count]) => sum + parseInt(cmc) * count, 0) /
              Object.values(curve).reduce((sum, count) => sum + count, 0) || 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

