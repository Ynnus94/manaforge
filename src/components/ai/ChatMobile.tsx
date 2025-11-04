/**
 * Chat Mobile - Full-Screen AI Chat
 * 
 * Mobile-optimized chat interface:
 * - Full-screen modal
 * - Swipe down to dismiss
 * - Touch-optimized controls
 */

'use client';

import { useChat } from '@/hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, ArrowLeft, Trash2 } from 'lucide-react';

interface ChatMobileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatMobile({ isOpen, onClose }: ChatMobileProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="font-semibold">AI Assistant</h1>
        </div>

        {messages.length > 0 && (
          <Button variant="ghost" size="icon" onClick={clearMessages}>
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="space-y-6 pt-8">
            {/* Welcome Message */}
            <div className="text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">
                👋 Hi! I'm your MTG AI
              </h2>
              <p className="text-muted-foreground">
                Ask me anything about Magic, your collection, or deck building!
              </p>
            </div>

            {/* Quick Actions */}
            <QuickActions onSelect={sendMessage} />
          </div>
        ) : (
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>AI is thinking...</span>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input (Fixed at bottom) */}
      <div className="p-4 border-t bg-background">
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

