/**
 * Staging Context
 * 
 * Provides git-style staging state to all deck builder components
 * TASK 2.4: Context infrastructure
 */

'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useStagingArea } from '@/hooks/useStagingArea';

// Use ReturnType to get exact type from hook
type StagingContextValue = ReturnType<typeof useStagingArea>;

const StagingContext = createContext<StagingContextValue | null>(null);

export function StagingProvider({ children }: { children: ReactNode }) {
  const staging = useStagingArea();

  return (
    <StagingContext.Provider value={staging}>
      {children}
    </StagingContext.Provider>
  );
}

export function useStagingContext() {
  const context = useContext(StagingContext);
  
  if (!context) {
    throw new Error('useStagingContext must be used within StagingProvider');
  }
  
  return context;
}

