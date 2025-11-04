/**
 * Feature Card Component
 * 
 * Reusable card for showcasing features
 */

import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description,
  highlight 
}: FeatureCardProps) {
  return (
    <Card className={highlight ? 'border-primary shadow-lg' : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            highlight 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted'
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

