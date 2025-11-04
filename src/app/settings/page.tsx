/**
 * Settings Page
 * 
 * User settings with tabs:
 * - Profile
 * - AI Preferences
 * - Notifications
 * - Account
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { SettingsContent } from '@/components/settings/SettingsContent';

export default async function SettingsPage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SettingsContent user={user} />
      </div>
    </ResponsiveLayout>
  );
}

