/**
 * WelcomeEmptyState Component
 * 
 * Client component wrapper for empty state with navigation
 */

'use client';

import { useRouter } from 'next/navigation';
import { EmptyState } from '@/components/ui/empty-state';
import { Library } from 'lucide-react';

export function WelcomeEmptyState() {
  const router = useRouter();

  return (
    <EmptyState
      icon={<Library className="h-12 w-12" />}
      title="Welcome to MANAFORGE!"
      description="Get started by creating your first deck or importing your card collection."
      action={{
        label: 'Create Your First Deck',
        onClick: () => router.push('/deck?create=true'),
      }}
      secondaryAction={{
        label: 'Import Collection',
        onClick: () => router.push('/collection'),
      }}
    />
  );
}

