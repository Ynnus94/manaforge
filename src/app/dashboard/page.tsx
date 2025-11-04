/**
 * Dashboard Page
 * 
 * Main landing page after login
 * Shows stats, recent decks, and quick actions
 * 
 * Responsive:
 * - Desktop: 3-column grid
 * - Mobile: Vertical stack
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatsBar } from '@/components/dashboard/StatsBar';
import { RecentDecks } from '@/components/dashboard/RecentDecks';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WelcomeEmptyState } from '@/components/dashboard/WelcomeEmptyState';

export default async function DashboardPage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch user's decks
  const { data: decks, error: decksError } = await supabase
    .from('decks')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(5);

  // Fetch deck count
  const { count: deckCount } = await supabase
    .from('decks')
    .select('*', { count: 'exact', head: true });

  // Fetch collection cards count
  const { count: cardsCount } = await supabase
    .from('collection_cards')
    .select('*', { count: 'exact', head: true });

  // Count unique formats
  const { data: formatData } = await supabase
    .from('decks')
    .select('format');

  const uniqueFormats = new Set(
    formatData?.map((d: { format: string }) => d.format) || []
  ).size;

  const hasDecks = (deckCount || 0) > 0;

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <PageHeader
          title={`Welcome back${user.email ? `, ${user.email.split('@')[0]}` : ''}!`}
          description="Here's what's happening with your decks"
        />

        <div className="container mx-auto space-y-6 mt-6">
          {/* Stats Bar */}
          <StatsBar
            deckCount={deckCount || 0}
            cardsCount={cardsCount || 0}
            formatsCount={uniqueFormats}
          />

          {hasDecks ? (
            <>
              {/* Recent Decks */}
              <RecentDecks decks={decks || []} />

              {/* Quick Actions */}
              <QuickActions />
            </>
          ) : (
            /* Empty State for New Users */
            <WelcomeEmptyState />
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}

