/**
 * Desktop Layout (1024px+)
 * 
 * 3-Column Layout:
 * - Left sidebar: Navigation (20%)
 * - Main content: Current page (50%)
 * - Right sidebar: AI Chat (30%)
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
  Settings, 
  MessageSquare,
  Sparkles,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChatSidebar } from '@/components/ai/ChatSidebar';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Decks', href: '/deck', icon: Library },
  { name: 'Collection', href: '/collection', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const pathname = usePathname();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Navigation */}
      <aside className="w-64 border-r bg-muted/10">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🃏</span>
              <span className="font-bold text-xl">MANAFORGE</span>
            </Link>
          </div>

          {/* AI Quick Access */}
          <div className="p-4">
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-full justify-start gap-2"
              variant={isChatOpen ? 'default' : 'outline'}
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
          </div>

          <Separator />

          {/* Navigation Links */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <Separator />

          {/* User Section */}
          <div className="p-4">
            <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Right Sidebar - AI Chat */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

