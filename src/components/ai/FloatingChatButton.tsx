/**
 * Floating Chat Button
 * 
 * FAB (Floating Action Button) for mobile chat
 */

'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
}

export function FloatingChatButton({ onClick }: FloatingChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all md:hidden"
      aria-label="Open AI chat"
    >
      <Sparkles className="h-6 w-6" />
    </Button>
  );
}

