/**
 * Quick Actions Component
 * 
 * Preset questions the user can tap/click
 */

'use client';

import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onSelect: (query: string) => void;
}

const quickActions = [
  {
    icon: '🎴',
    label: 'Show me decks I can build',
    query: 'What decks can I build with my collection?',
  },
  {
    icon: '💰',
    label: 'Collection value',
    query: 'What is my collection worth?',
  },
  {
    icon: '🔍',
    label: 'Find budget deck',
    query: 'Find me a budget Commander deck under $100',
  },
  {
    icon: '📈',
    label: 'Price movers',
    query: 'Which of my cards changed price this week?',
  },
  {
    icon: '⚡',
    label: 'Fix mana base',
    query: 'Help me fix the mana base in my current deck',
  },
  {
    icon: '🎯',
    label: 'Deck suggestions',
    query: 'Suggest cards to improve my deck',
  },
];

export function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground px-1">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col items-start p-3 text-left"
            onClick={() => onSelect(action.query)}
          >
            <span className="text-xl mb-1">{action.icon}</span>
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

