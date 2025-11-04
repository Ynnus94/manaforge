/**
 * Chat Message Component
 * 
 * Single message bubble (user or assistant)
 */

'use client';

import type { Message } from '@/types/ai';
import { User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn(
      'flex gap-3',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      {/* Avatar (assistant only, on left) */}
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      )}

      {/* Message Bubble */}
      <div className={cn(
        'rounded-lg px-4 py-2 max-w-[80%]',
        isUser
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted'
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </p>
        
        {/* Timestamp */}
        <p className={cn(
          'text-xs mt-1',
          isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Avatar (user only, on right) */}
      {isUser && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

