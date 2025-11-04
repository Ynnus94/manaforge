/**
 * Homepage / Landing Page
 * 
 * UNICORN-GRADE responsive landing with:
 * - Animated hero
 * - Feature showcase
 * - Social proof
 * - Multiple CTAs
 * 
 * - Authenticated users → Redirect to /dashboard
 * - Non-authenticated users → Show landing page
 */

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { CTASection } from '@/components/landing/CTASection';

export default async function HomePage() {
  const supabase = await createServerClient();

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // UNICORN-GRADE Landing page for non-authenticated users
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTASection />
    </main>
  );
}
