/**
 * QuickActions Component
 * 
 * Quick action buttons for common tasks
 * Client component for navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Library, Search, Globe } from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: Plus,
      label: 'New Deck',
      description: 'Start building a new deck',
      onClick: () => router.push('/deck?create=true'),
    },
    {
      icon: Library,
      label: 'View Collection',
      description: 'Browse your card collection',
      onClick: () => router.push('/collection'),
    },
    {
      icon: Search,
      label: 'Search Cards',
      description: 'Find cards for your decks',
      onClick: () => router.push('/collection?search=true'),
    },
    {
      icon: Globe,
      label: 'Browse Public Decks',
      description: 'Explore community decks',
      onClick: () => router.push('/deck?public=true'),
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Quick Actions</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.label}
              className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
              onClick={action.onClick}
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 rounded-full bg-primary/10 p-3 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-semibold">{action.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

