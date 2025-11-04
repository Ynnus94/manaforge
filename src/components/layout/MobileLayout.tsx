/**
 * Mobile Layout (<768px)
 * 
 * Stack layout with:
 * - Top bar: Logo, search, profile
 * - Main content: Scrollable
 * - Bottom navigation: Fixed nav bar
 * - Floating AI button: Bottom-right
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Library, 
  BookOpen, 
  MoreHorizontal,
  MessageSquare,
  Sparkles,
  Search,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMobile } from '@/components/ai/ChatMobile';
import { FloatingChatButton } from '@/components/ai/FloatingChatButton';

interface MobileLayoutProps {
  children: React.ReactNode;
}

const bottomNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Decks', href: '/deck', icon: Library },
  { name: 'Collection', href: '/collection', icon: BookOpen },
  { name: 'More', href: '/settings', icon: MoreHorizontal },
];

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🃏</span>
          <span className="font-bold">MANAFORGE</span>
        </Link>
        
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto pb-16">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors min-w-[64px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Floating AI Chat Button */}
      {!isChatOpen && (
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      )}

      {/* Full-Screen AI Chat Modal */}
      <ChatMobile isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

