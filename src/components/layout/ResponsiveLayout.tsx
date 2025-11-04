/**
 * Responsive Layout Wrapper
 * 
 * Detects screen size and renders appropriate layout:
 * - Desktop (1024px+): DesktopLayout (3-column)
 * - Tablet (768-1024px): Hybrid layout
 * - Mobile (<768px): MobileLayout (stack + bottom nav)
 */

'use client';

import { useEffect, useState } from 'react';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Set initial breakpoint
    updateBreakpoint();

    // Listen for resize
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Mobile and tablet use MobileLayout
  if (breakpoint === 'mobile' || breakpoint === 'tablet') {
    return <MobileLayout>{children}</MobileLayout>;
  }

  // Desktop uses DesktopLayout
  return <DesktopLayout>{children}</DesktopLayout>;
}

